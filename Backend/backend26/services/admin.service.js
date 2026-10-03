const User = require('../models/user.model');
const Reservation = require('../models/reservation.model');
const Service = require('../models/service.model');
const Avis = require('../models/avis.model');

module.exports.validerPrestataire = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Prestataire non trouvé');
  user.isValidatedPrestataire = true;
  user.statutPrestataire = 'valide';
  await user.save();
  return user;
};

module.exports.bloquerUtilisateur = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  user.isBlocked = true;
  await user.save();
  return user;
};

module.exports.debloquerUtilisateur = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  user.isBlocked = false;
  await user.save();
  return user;
};

module.exports.voirStats = async () => {
  const users = await User.countDocuments();
  const reservations = await Reservation.countDocuments();
  const services = await Service.countDocuments();
  const avis = await Avis.countDocuments();
  return { users, reservations, services, avis };
};

module.exports.gererSignalement = async (userId, signalement) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  user.signalements.push(signalement);
  await user.save();
  return user;
};

module.exports.genererRapport = async () => {
  const stats = await module.exports.voirStats();
  return {
    ...stats,
    generatedAt: new Date(),
  };
};

module.exports.dashboardStats = async () => {
  const stats = await module.exports.voirStats();
  const pendingPrestataires = await User.countDocuments({ role: 'prestataire', statutPrestataire: 'en_attente' });
  
  let reservationsParCategorie = {
    sante: 0,
    beaute: 0,
    restaurant: 0,
    hotel: 0,
    autre: 0
  };
  
  try {
    const reservations = await Reservation.find().populate('prestataire');
    reservations.forEach(r => {
      if (r.prestataire && r.prestataire.categorie) {
        let cat = r.prestataire.categorie.toLowerCase();
        if (cat === 'medecin' || cat === 'sante' || cat === 'clinique' || cat === 'infirmiere') cat = 'sante';
        else if (cat === 'beauty' || cat === 'centre de beaute' || cat === 'beaute') cat = 'beaute';
        
        if (reservationsParCategorie[cat] !== undefined) {
          reservationsParCategorie[cat]++;
        } else {
          reservationsParCategorie['autre']++;
        }
      } else {
        reservationsParCategorie['autre']++;
      }
    });
  } catch (err) {
    console.error('Error calculating reservation stats by category:', err);
  }

  return { ...stats, pendingPrestataires, reservationsParCategorie };
};
