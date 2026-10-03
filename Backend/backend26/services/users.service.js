const User = require('../models/user.model');
const Service = require('../models/service.model');
const reservationService = require('./reservations.service');
const avisService = require('./avis.service');

module.exports.createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

module.exports.faireReservation = async (userId, reservationData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  if (user.role !== 'client') throw new Error('Seul un client peut faire une réservation');

  const data = {
    ...reservationData,
    id: reservationData.id || `res-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  // ensure reservation stores client reference
  const dataWithClient = { ...data, client: user._id };

  const reservation = await reservationService.createReservation(dataWithClient);
  user.reservations.push(reservation._id);
  await user.save();
  return reservation;
};

module.exports.annulerReservation = async (userId, reservationId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  if (user.role !== 'client') throw new Error('Seul un client peut annuler une réservation');

  const reservation = await reservationService.deleteReservation(reservationId);
  if (!reservation) return null;

  user.reservations.pull(reservation._id);
  await user.save();
  return reservation;
};

module.exports.laisserAvis = async (userId, avisData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  if (user.role !== 'client') throw new Error('Seul un client peut laisser un avis');

  const created = await avisService.createAvis({ ...avisData, client: userId });
  return created;
};

module.exports.voirHistorique = async (userId) => {
  return await User.findById(userId)
    .populate('reservations')
    .populate('avis');
};

module.exports.utiliserChatbot = async (userId, message) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');

  const msg = message.toLowerCase();
  let response = '';

  try {
    // 1. Identify category from keywords
    let category = '';
    if (msg.includes('medecin') || msg.includes('docteur') || msg.includes('yeux') || msg.includes('ophtalmo') || msg.includes('cardio') || msg.includes('sante') || msg.includes('coeur') || msg.includes('malade')) {
      category = 'medecin';
    } else if (msg.includes('resto') || msg.includes('restaurant') || msg.includes('table') || msg.includes('manger') || msg.includes('diner') || msg.includes('faim')) {
      category = 'restaurant';
    } else if (msg.includes('hotel') || msg.includes('chambre') || msg.includes('nuit') || msg.includes('sejour') || msg.includes('voyage')) {
      category = 'hotel';
    } else if (msg.includes('spa') || msg.includes('massage') || msg.includes('beaute') || msg.includes('coiffure') || msg.includes('esthetique') || msg.includes('soin')) {
      category = 'centre de beaute';
    }

    // 2. Identify location from keywords
    let location = '';
    if (msg.includes('tunis') || msg.includes('lac') || msg.includes('medina') || msg.includes('ennasr')) {
      location = 'tunis';
    } else if (msg.includes('sousse') || msg.includes('kantaoui')) {
      location = 'sousse';
    } else if (msg.includes('monastir')) {
      location = 'monastir';
    }

    if (category) {
      // Find matching providers
      let query = { role: 'prestataire', categorie: category };
      let providers = await User.find(query).populate('services');

      if (location) {
        providers = providers.filter(p => p.adresse?.toLowerCase().includes(location) || p.nom?.toLowerCase().includes(location));
      }

      if (providers.length > 0) {
        // Sort by note (highest first)
        providers.sort((a, b) => (b.note || 0) - (a.note || 0));
        
        const best = providers[0];
        const specName = best.nom;
        const specAddr = best.adresse;
        const specNote = best.note || 4.5;
        
        let servicesText = '';
        if (best.services && best.services.length > 0) {
          if (category === 'restaurant') {
            servicesText = `Vous pouvez y réserver des tables comme la **${best.services[0].nom}**`;
          } else if (category === 'hotel') {
            servicesText = `Il propose des chambres comme la **${best.services[0].nom}** à partir de **${best.services[0].prix} DT**`;
          } else {
            servicesText = `Les prestations proposées incluent **${best.services[0].nom}** pour un tarif de **${best.services[0].prix} DT**`;
          }
        }

        response = `Basé sur votre recherche, je vous recommande vivement **${specName}** (${category === 'medecin' ? 'Médecin' : category === 'hotel' ? 'Hôtel' : category === 'restaurant' ? 'Restaurant' : 'Centre de Beauté'}) situé à **${specAddr}** (note : **${specNote}/5**). ${servicesText}.`;
      } else {
        response = `Je vois que vous recherchez un(e) ${category === 'medecin' ? 'médecin' : category === 'hotel' ? 'hôtel' : category === 'restaurant' ? 'restaurant' : 'soin de beauté'}${location ? ' à ' + location : ''}, mais aucun prestataire dans cette région n'est inscrit pour le moment.`;
      }
    } else if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello')) {
      response = `Bonjour ${user.nom} ! Je suis Wakti AI, votre assistant de réservation. Vous pouvez me demander de trouver un médecin des yeux, le meilleur restaurant à Sousse, ou des hôtels à Tunis !`;
    } else {
      // General fallbacks or keyword search in services
      const allServices = await Service.find({}).populate('prestataire');
      const matches = allServices.filter(s => s.nom.toLowerCase().includes(msg) || s.description?.toLowerCase().includes(msg));
      
      if (matches.length > 0) {
        const bestMatch = matches[0];
        const providerName = bestMatch.prestataire?.nom || 'un professionnel';
        const providerAddr = bestMatch.prestataire?.adresse || 'Tunisie';
        response = `J'ai trouvé la prestation **${bestMatch.nom}** proposée par **${providerName}** à **${providerAddr}** pour un tarif de **${bestMatch.prix} DT**. Souhaitez-vous que je vous aide à réserver ?`;
      } else {
        response = `Je suis désolé, je n'ai pas bien compris votre demande. Pourriez-vous me préciser si vous recherchez un médecin, un salon de beauté, un hôtel ou un restaurant ? (Par exemple, vous pouvez écrire : "Je cherche un médecin des yeux à Tunis" ou "Trouver un hôtel à Sousse").`;
      }
    }
  } catch (err) {
    console.error('Chatbot engine error:', err);
    response = "Désolé, j'ai rencontré un problème technique lors de la recherche dans la base de données. Réessayez dans un instant.";
  }

  user.chatbotHistory.push({ message, response });
  await user.save();
  return { message, response };
};

module.exports.getAllUsers = async () => {
  return await User.find();
};

module.exports.getUserById = async (id) => {
  return await User.findById(id);
};

module.exports.updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};  