const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const Service = require('./models/service.model');

dotenv.config();

const seed = async () => {
  try {
    const uri = process.env.MONGOURI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error('Aucune URI MongoDB trouvée dans les variables d’environnement.');
    }

    console.log('Connexion à la base de données...');
    await mongoose.connect(uri);
    console.log('Connexion réussie.');

    // 1. Nettoyer les collections
    console.log('Nettoyage des collections...');
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('Collections nettoyées.');

    // 2. Définir les prestataires
    console.log('Création des prestataires...');
    
    // Générer des ObjectIds à l'avance pour lier proprement les prestataires et leurs services
    const providerIds = {
      // Médecins
      salma: new mongoose.Types.ObjectId(),
      elyes: new mongoose.Types.ObjectId(),
      hedi: new mongoose.Types.ObjectId(),
      leila_kamoun: new mongoose.Types.ObjectId(),
      mehdi_zaoui: new mongoose.Types.ObjectId(),
      sonia_rekik: new mongoose.Types.ObjectId(),
      // Restaurants
      amel: new mongoose.Types.ObjectId(),
      pirate: new mongoose.Types.ObjectId(),
      dar_slah: new mongoose.Types.ObjectId(),
      grand_bleu: new mongoose.Types.ObjectId(),
      // Hôtels
      jeld: new mongoose.Types.ObjectId(),
      residence: new mongoose.Types.ObjectId(),
      mouradi: new mongoose.Types.ObjectId(),
      hasdrubal: new mongoose.Types.ObjectId(),
      // Cliniques
      carthagene: new mongoose.Types.ObjectId(),
      pasteur: new mongoose.Types.ObjectId(),
      amen: new mongoose.Types.ObjectId(),
      oliviers: new mongoose.Types.ObjectId(),
      // Infirmières
      leila_nurse: new mongoose.Types.ObjectId(),
      anis_nurse: new mongoose.Types.ObjectId(),
      emna_nurse: new mongoose.Types.ObjectId(),
      // Beauté
      nirvana: new mongoose.Types.ObjectId(),
      lilas: new mongoose.Types.ObjectId(),
      royal_thalasso: new mongoose.Types.ObjectId(),
    };

    const prestataires = [
      // === MÉDECINS ===
      {
        _id: providerIds.salma,
        id: 'prest-salma',
        nom: 'Dr. Salma Touil (Ophtalmologue)',
        email: 'salma@wakti.tn',
        telephone: '71900100',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Avenue Habib Bourguiba, Tunis',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.elyes,
        id: 'prest-elyes',
        nom: 'Dr. Elyes Gharbi (Cardiologue)',
        email: 'elyes@wakti.tn',
        telephone: '71800200',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Centre Médical Les Berges du Lac 2, Tunis',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.hedi,
        id: 'prest-hedi',
        nom: 'Dr. Hedi Ben Salem (Pédiatre)',
        email: 'hedi@wakti.tn',
        telephone: '73200300',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Boulevard 14 Janvier, Sousse',
        note: 4.7,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.leila_kamoun,
        id: 'prest-leila-kamoun',
        nom: 'Dr. Leila Kamoun (Dermatologue)',
        email: 'leila.kamoun@wakti.tn',
        telephone: '74400400',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Route de Téniour, Km 1, Sfax',
        note: 4.6,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.mehdi_zaoui,
        id: 'prest-mehdi-zaoui',
        nom: 'Dr. Mehdi Zaoui (Dentiste)',
        email: 'mehdi.zaoui@wakti.tn',
        telephone: '72200500',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Avenue Habib Bourguiba, Nabeul',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.sonia_rekik,
        id: 'prest-sonia-rekik',
        nom: 'Dr. Sonia Rekik (Gynécologue)',
        email: 'sonia.rekik@wakti.tn',
        telephone: '72400600',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Avenue Hassan Nouri, Bizerte',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },

      // === RESTAURANTS ===
      {
        _id: providerIds.amel,
        id: 'prest-amel',
        nom: 'Restaurant El Amel',
        email: 'amel@wakti.tn',
        telephone: '73222333',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'restaurant',
        adresse: 'Port El Kantaoui, Sousse',
        note: 4.6,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.pirate,
        id: 'prest-pirate',
        nom: 'Le Pirate Restaurant',
        email: 'pirate@wakti.tn',
        telephone: '73444555',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'restaurant',
        adresse: 'La Falaise, Monastir',
        note: 4.7,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.dar_slah,
        id: 'prest-darslah',
        nom: 'Dar Slah (Médina)',
        email: 'darslah@wakti.tn',
        telephone: '71260110',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'restaurant',
        adresse: 'Rue de la Glacière, La Médina, Tunis',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.grand_bleu,
        id: 'prest-grandbleu',
        nom: 'Le Grand Bleu (La Marsa)',
        email: 'grandbleu@wakti.tn',
        telephone: '71740200',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'restaurant',
        adresse: 'Promenade de la Marsa, Tunis',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },

      // === HÔTELS ===
      {
        _id: providerIds.jeld,
        id: 'prest-jeld',
        nom: 'Dar El Jeld Hotel & Spa',
        email: 'jeld@wakti.tn',
        telephone: '71560916',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'hotel',
        adresse: 'Rue Dar El Jeld, La Médina, Tunis',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.residence,
        id: 'prest-residence',
        nom: 'The Residence Tunis',
        email: 'residence@wakti.tn',
        telephone: '71910101',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'hotel',
        adresse: 'Les Côtes de Carthage, Gammarth, Tunis',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.mouradi,
        id: 'prest-mouradi',
        nom: 'El Mouradi Palm Marina',
        email: 'mouradi@wakti.tn',
        telephone: '73348600',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'hotel',
        adresse: 'Zone Touristique El Kantaoui, Sousse',
        note: 4.5,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.hasdrubal,
        id: 'prest-hasdrubal',
        nom: 'Hasdrubal Prestige Thalassa & Spa',
        email: 'hasdrubal@wakti.tn',
        telephone: '75750800',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'hotel',
        adresse: 'Zone Touristique Sidi Mehrez, Djerba',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },

      // === CLINIQUES ===
      {
        _id: providerIds.carthagene,
        id: 'prest-carthagene',
        nom: 'Clinique Carthagene (Tunis)',
        email: 'carthagene@wakti.tn',
        telephone: '71111222',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'clinique',
        adresse: 'Centre Urbain Nord, Tunis',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.pasteur,
        id: 'prest-pasteur',
        nom: 'Clinique Pasteur (Tunis)',
        email: 'pasteur@wakti.tn',
        telephone: '71510310',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'clinique',
        adresse: 'Rue d’Italie, Centre Urbain Nord, Tunis',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.amen,
        id: 'prest-amen',
        nom: 'Clinique El Amen (Nabeul)',
        email: 'amen@wakti.tn',
        telephone: '72220300',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'clinique',
        adresse: 'Avenue Habib Bourguiba, Nabeul',
        note: 4.7,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.oliviers,
        id: 'prest-oliviers',
        nom: 'Clinique Les Oliviers (Sousse)',
        email: 'oliviers@wakti.tn',
        telephone: '73300800',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'clinique',
        adresse: 'Zone Touristique Boulevard 14 Janvier, Sousse',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },

      // === INFIRMIÈRES ===
      {
        _id: providerIds.leila_nurse,
        id: 'prest-leila-nurse',
        nom: 'Cabinet de Soins Leila Ben Youssef',
        email: 'leila@wakti.tn',
        telephone: '98444555',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'infirmiere',
        adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.anis_nurse,
        id: 'prest-anis-nurse',
        nom: 'Cabinet de Soins Anis Gharbi',
        email: 'anis@wakti.tn',
        telephone: '98555666',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'infirmiere',
        adresse: 'Rue des Orangers, Sousse',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.emna_nurse,
        id: 'prest-emna-nurse',
        nom: 'Cabinet de Soins Emna Trabelsi',
        email: 'emna@wakti.tn',
        telephone: '98666777',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'infirmiere',
        adresse: 'Route de Téniour, Km 2, Sfax',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },

      // === BEAUTÉ ===
      {
        _id: providerIds.nirvana,
        id: 'prest-nirvana',
        nom: 'Nirvana Spa & Beauté',
        email: 'nirvana@wakti.tn',
        telephone: '70800900',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'centre de beaute',
        adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis',
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.lilas,
        id: 'prest-lilas',
        nom: 'Maison de Beauté Lilas',
        email: 'lilas@wakti.tn',
        telephone: '74230400',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'centre de beaute',
        adresse: 'Avenue de la Liberté, Sfax',
        note: 4.7,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.royal_thalasso,
        id: 'prest-royal-thalasso',
        nom: 'Royal Thalasso Monastir Spa',
        email: 'royal@wakti.tn',
        telephone: '73520520',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'centre de beaute',
        adresse: 'Zone Touristique Skanes, Monastir',
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      }
    ];

    // 3. Définir les services polymorphiques
    console.log('Création des services...');
    const servicesData = [
      // Dr. Salma (Médecin - Tunis)
      {
        id: 'ser-salma-1',
        nom: 'Consultation Ophtalmologie & Examen de Vue',
        description: 'Examen complet de la vue, mesure de la tension oculaire et fond d’œil.',
        prix: 75,
        categorie: 'medecin',
        prestataire: providerIds.salma
      },
      {
        id: 'ser-salma-2',
        nom: 'Consultation Fond d’œil & Tension Oculaire',
        description: 'Mesure de pression oculaire et dépistage rapide du glaucome en cabinet.',
        prix: 50,
        categorie: 'medecin',
        prestataire: providerIds.salma
      },

      // Dr. Elyes (Médecin - Tunis)
      {
        id: 'ser-elyes-1',
        nom: 'Consultation Cardiologie & Électrocardiogramme (ECG)',
        description: 'Examen clinique cardiaque complet et enregistrement ECG.',
        prix: 100,
        categorie: 'medecin',
        prestataire: providerIds.elyes
      },
      {
        id: 'ser-elyes-2',
        nom: 'Échographie Cardiaque Doppler',
        description: 'Échographie doppler couleur pour visualiser la structure et le flux sanguin du cœur.',
        prix: 120,
        categorie: 'medecin',
        prestataire: providerIds.elyes
      },

      // Dr. Hedi (Médecin - Sousse)
      {
        id: 'ser-hedi-1',
        nom: 'Consultation Pédiatrique & Suivi Bébé',
        description: 'Suivi de croissance infantile, conseils en vaccination et alimentation pédiatrique.',
        prix: 70,
        categorie: 'medecin',
        prestataire: providerIds.hedi
      },
      {
        id: 'ser-hedi-2',
        nom: 'Consultation Urgence Pédiatrique',
        description: 'Consultation rapide en cabinet ou prise en charge d’urgence pédiatrique courante.',
        prix: 85,
        categorie: 'medecin',
        prestataire: providerIds.hedi
      },

      // Dr. Leila Kamoun (Médecin - Sfax)
      {
        id: 'ser-leila-kamoun-1',
        nom: 'Consultation Dermatologie & Traitement Acné',
        description: 'Diagnostic de maladies de peau, examen de grains de beauté et soins dermatologiques.',
        prix: 80,
        categorie: 'medecin',
        prestataire: providerIds.leila_kamoun
      },
      {
        id: 'ser-leila-kamoun-2',
        nom: 'Séance d’Azote Liquide (Verrue/Lésion)',
        description: 'Cryothérapie dermatologique pour le traitement ciblé des verrues et lésions cutanées.',
        prix: 45,
        categorie: 'medecin',
        prestataire: providerIds.leila_kamoun
      },

      // Dr. Mehdi Zaoui (Dentiste - Nabeul)
      {
        id: 'ser-mehdi-zaoui-1',
        nom: 'Détartrage & Consultation Dentaire',
        description: 'Examen bucco-dentaire complet suivi d’un détartrage ultrasonique et polissage.',
        prix: 60,
        categorie: 'medecin',
        prestataire: providerIds.mehdi_zaoui
      },
      {
        id: 'ser-mehdi-zaoui-2',
        nom: 'Blanchiment Dentaire Professionnel',
        description: 'Séance de blanchiment des dents au fauteuil au gel d’hydrogène activé par lampe LED.',
        prix: 350,
        categorie: 'medecin',
        prestataire: providerIds.mehdi_zaoui
      },

      // Dr. Sonia Rekik (Gynécologue - Bizerte)
      {
        id: 'ser-sonia-rekik-1',
        nom: 'Consultation Gynécologie & Échographie',
        description: 'Contrôle annuel de gynécologie préventive et échographie de suivi.',
        prix: 90,
        categorie: 'medecin',
        prestataire: providerIds.sonia_rekik
      },
      {
        id: 'ser-sonia-rekik-2',
        nom: 'Pose d’Implant Contraceptif / Stérilet',
        description: 'Pose ou changement de dispositif intra-utérin ou implant de contraception.',
        prix: 100,
        categorie: 'medecin',
        prestataire: providerIds.sonia_rekik
      },

      // Restaurant El Amel (Sousse)
      {
        id: 'ser-amel-t1',
        nom: 'Table 1 (2 personnes - Près de la fenêtre)',
        description: 'Table intimiste idéale pour couples avec vue panoramique directe sur le port.',
        prix: 10,
        categorie: 'restaurant',
        prestataire: providerIds.amel
      },
      {
        id: 'ser-amel-t2',
        nom: 'Table 2 (4 personnes - En terrasse)',
        description: 'Table sous pergola en extérieur idéale pour repas de famille ou d’amis.',
        prix: 15,
        categorie: 'restaurant',
        prestataire: providerIds.amel
      },
      {
        id: 'ser-amel-t3',
        nom: 'Table 3 (6 personnes - Salle Climatisée)',
        description: 'Grande table en intérieur climatisé pour les déjeuners de groupe.',
        prix: 20,
        categorie: 'restaurant',
        prestataire: providerIds.amel
      },

      // Restaurant Le Pirate (Monastir)
      {
        id: 'ser-pirate-t1',
        nom: 'Table 1 (2 personnes - Bord de Falaise)',
        description: 'Table romantique suspendue face à la mer, coucher de soleil inclus.',
        prix: 15,
        categorie: 'restaurant',
        prestataire: providerIds.pirate
      },
      {
        id: 'ser-pirate-t2',
        nom: 'Table 2 (4 personnes - Zone Jardin ombragée)',
        description: 'Table sous les oliviers dans le jardin du restaurant pour un repas paisible.',
        prix: 20,
        categorie: 'restaurant',
        prestataire: providerIds.pirate
      },

      // Dar Slah (Tunis)
      {
        id: 'ser-darslah-t1',
        nom: 'Table Traditionnelle Tunisienne (4 personnes)',
        description: 'Réservez une table décorée de carreaux de faïence traditionnels au cœur de la Médina.',
        prix: 15,
        categorie: 'restaurant',
        prestataire: providerIds.dar_slah
      },
      {
        id: 'ser-darslah-t2',
        nom: 'Table Dégustation Gastronomique (2 personnes)',
        description: 'Table d’exception réservée pour la formule dégustation de spécialités tunisiennes revisitées.',
        prix: 25,
        categorie: 'restaurant',
        prestataire: providerIds.dar_slah
      },

      // Le Grand Bleu (La Marsa)
      {
        id: 'ser-grandbleu-t1',
        nom: 'Table VIP Front de Mer (2-4 personnes)',
        description: 'Table sur pilotis au-dessus de l’eau, vue imprenable sur le golfe de Tunis.',
        prix: 20,
        categorie: 'restaurant',
        prestataire: providerIds.grand_bleu
      },
      {
        id: 'ser-grandbleu-t2',
        nom: 'Table Spéciale Anniversaire (Décoration incluse)',
        description: 'Table d’exception préparée et fleurie avec bougies et ballons décoratifs.',
        prix: 50,
        categorie: 'restaurant',
        prestataire: providerIds.grand_bleu
      },

      // Dar El Jeld (Hôtel - Tunis)
      {
        id: 'ser-jeld-c1',
        nom: 'Suite Junior (Vue sur le Patio Tunisien)',
        description: 'Suite traditionnelle de 35m² décorée d’arabesques, lit king size et salle de bain en marbre.',
        prix: 280,
        categorie: 'hotel',
        prestataire: providerIds.jeld
      },
      {
        id: 'ser-jeld-c2',
        nom: 'Suite Royale (Vue panoramique Médina)',
        description: 'Suite de 65m² avec jacuzzi et terrasse privée sur les toits de la Médina de Tunis.',
        prix: 450,
        categorie: 'hotel',
        prestataire: providerIds.jeld
      },
      {
        id: 'ser-jeld-c3',
        nom: 'Chambre Executive Double Deluxe',
        description: 'Chambre double spacieuse et confortable mariant boiseries anciennes et design moderne.',
        prix: 210,
        categorie: 'hotel',
        prestataire: providerIds.jeld
      },

      // The Residence (Hôtel - Gammarth)
      {
        id: 'ser-residence-c1',
        nom: 'Chambre Deluxe Vue Mer & Piscine',
        description: 'Chambre spacieuse de 40m² décorée de tons clairs avec balcon privé donnant sur la mer.',
        prix: 400,
        categorie: 'hotel',
        prestataire: providerIds.residence
      },
      {
        id: 'ser-residence-c2',
        nom: 'Suite Présidentielle de Luxe',
        description: 'Prestigieuse suite de 120m² avec majordome privé, piscine chauffée privée et salon impérial.',
        prix: 950,
        categorie: 'hotel',
        prestataire: providerIds.residence
      },

      // El Mouradi Palm Marina (Hôtel - Sousse)
      {
        id: 'ser-mouradi-c1',
        nom: 'Chambre Standard (Vue Jardin)',
        description: 'Chambre de 25m² avec balcon donnant sur les jardins et piscines.',
        prix: 130,
        categorie: 'hotel',
        prestataire: providerIds.mouradi
      },
      {
        id: 'ser-mouradi-c2',
        nom: 'Chambre Supérieure (Vue Mer Directe)',
        description: 'Chambre de 28m² située en front de mer avec accès spa offert.',
        prix: 190,
        categorie: 'hotel',
        prestataire: providerIds.mouradi
      },
      {
        id: 'ser-mouradi-c3',
        nom: 'Suite Familiale Vue Piscine',
        description: 'Suite communicante spacieuse idéale pour 2 adultes et 2 enfants avec terrasse.',
        prix: 240,
        categorie: 'hotel',
        prestataire: providerIds.mouradi
      },

      // Hasdrubal (Hôtel - Djerba)
      {
        id: 'ser-hasdrubal-c1',
        nom: 'Suite Junior Thalasso & Spa',
        description: 'Suite calme de 45m² avec programme cure thalassothérapie d’initiation offert pour un séjour de 2 nuits.',
        prix: 320,
        categorie: 'hotel',
        prestataire: providerIds.hasdrubal
      },
      {
        id: 'ser-hasdrubal-c2',
        nom: 'Suite Executive Vue Lagune',
        description: 'Suite raffinée de 60m² offrant une vue panoramique sur la lagune de Djerba.',
        prix: 410,
        categorie: 'hotel',
        prestataire: providerIds.hasdrubal
      },

      // Clinique Carthagene (Clinique - Tunis)
      {
        id: 'ser-carthagene-1',
        nom: 'Bilan Cardiologique Complet & Consultation',
        description: 'Bilan de santé cardiovasculaire comprenant ECG, échocardiographie de stress et consultation.',
        prix: 180,
        categorie: 'clinique',
        prestataire: providerIds.carthagene
      },
      {
        id: 'ser-carthagene-2',
        nom: 'Forfait Accouchement Classique Tunisien',
        description: 'Forfait tout compris avec séjour de 2 nuits en chambre individuelle et soins du nouveau-né.',
        prix: 1200,
        categorie: 'clinique',
        prestataire: providerIds.carthagene
      },
      {
        id: 'ser-carthagene-3',
        nom: 'IRM Ostéo-Articulaire Haute Définition',
        description: 'Examen IRM d’une articulation (genou, épaule, cheville) avec interprétation médicale par radiologue.',
        prix: 260,
        categorie: 'clinique',
        prestataire: providerIds.carthagene
      },

      // Clinique Pasteur (Clinique - Tunis)
      {
        id: 'ser-pasteur-1',
        nom: 'IRM Cérébrale de Haute Résolution',
        description: 'Examen d’imagerie par résonance magnétique cérébrale avec interprétation immédiate.',
        prix: 270,
        categorie: 'clinique',
        prestataire: providerIds.pasteur
      },
      {
        id: 'ser-pasteur-2',
        nom: 'Scanner Abdomino-Pelvien',
        description: 'Examen tomodensitométrique complet avec injection de produit de contraste.',
        prix: 180,
        categorie: 'clinique',
        prestataire: providerIds.pasteur
      },
      {
        id: 'ser-pasteur-3',
        nom: 'Consultation Anesthésie pré-opératoire',
        description: 'Bilan et consultation obligatoire avec un médecin anesthésiste avant toute intervention.',
        prix: 60,
        categorie: 'clinique',
        prestataire: providerIds.pasteur
      },

      // Clinique El Amen (Clinique - Nabeul)
      {
        id: 'ser-amen-1',
        nom: 'Bilan Biologique & de Santé Général',
        description: 'Analyses de sang complètes, bilan glycémique, bilan lipidique et consultation de synthèse.',
        prix: 220,
        categorie: 'clinique',
        prestataire: providerIds.amen
      },
      {
        id: 'ser-amen-2',
        nom: 'Forfait Check-up Diabète Complet',
        description: 'Bilan complet de suivi du diabète (HbA1c, fond d’œil, bilan rénal et consultation endocrinologue).',
        prix: 150,
        categorie: 'clinique',
        prestataire: providerIds.amen
      },

      // Clinique Les Oliviers (Clinique - Sousse)
      {
        id: 'ser-oliviers-1',
        nom: 'Frais de Consultation d’Urgence & Garde H24',
        description: 'Consultation médecin d’urgence en clinique privée avec premier diagnostic clinique.',
        prix: 45,
        categorie: 'clinique',
        prestataire: providerIds.oliviers
      },
      {
        id: 'ser-oliviers-2',
        nom: 'Séance de Kinésithérapie Rééducation',
        description: 'Séance individuelle de rééducation fonctionnelle de 45 minutes effectuée par un kinésithérapeute diplômé.',
        prix: 35,
        categorie: 'clinique',
        prestataire: providerIds.oliviers
      },

      // Cabinet Leila (Infirmière - Tunis)
      {
        id: 'ser-leila-nurse-1',
        nom: 'Injection Intramusculaire / Intraveineuse à domicile',
        description: 'Injection à domicile par une infirmière diplômée d’État (médicament et matériel fournis par le client).',
        prix: 15,
        categorie: 'infirmiere',
        prestataire: providerIds.leila_nurse
      },
      {
        id: 'ser-leila-nurse-2',
        nom: 'Pansement Complexe / Post-opératoire à domicile',
        description: 'Nettoyage antiseptique et réfection de pansement complexe à domicile.',
        prix: 30,
        categorie: 'infirmiere',
        prestataire: providerIds.leila_nurse
      },
      {
        id: 'ser-leila-nurse-3',
        nom: 'Prélèvement Sanguin & Dépôt Laboratoire',
        description: 'Prise de sang à votre domicile et acheminement rapide de vos tubes au laboratoire d’analyses.',
        prix: 25,
        categorie: 'infirmiere',
        prestataire: providerIds.leila_nurse
      },

      // Cabinet Anis Gharbi (Infirmier - Sousse)
      {
        id: 'ser-anis-nurse-1',
        nom: 'Perfusion & Hydratation à domicile',
        description: 'Pose et surveillance de perfusion d’hydratation ou traitement à votre domicile.',
        prix: 40,
        categorie: 'infirmiere',
        prestataire: providerIds.anis_nurse
      },
      {
        id: 'ser-anis-nurse-2',
        nom: 'Soin infirmier général & Prise de Constantes',
        description: 'Prise de tension, pouls, glycémie capillaire et administration de traitement oral.',
        prix: 25,
        categorie: 'infirmiere',
        prestataire: providerIds.anis_nurse
      },
      {
        id: 'ser-anis-nurse-3',
        nom: 'Soins d’Hygiène & Aide à la Toilette',
        description: 'Aide complète ou partielle à la toilette au lit ou au lavabo pour personnes âgées ou dépendantes.',
        prix: 30,
        categorie: 'infirmiere',
        prestataire: providerIds.anis_nurse
      },

      // Cabinet Emna Trabelsi (Infirmière - Sfax)
      {
        id: 'ser-emna-nurse-1',
        nom: 'Soin Post-opératoire & Retrait de fils/agrafes',
        description: 'Surveillance de cicatrice, désinfection et ablation de fils ou agrafes sous prescription.',
        prix: 35,
        categorie: 'infirmiere',
        prestataire: providerIds.emna_nurse
      },
      {
        id: 'ser-emna-nurse-2',
        nom: 'Pose et Surveillance de Sonde Urinaire',
        description: 'Sondage urinaire évacuateur ou à demeure à domicile dans le respect strict des règles d’asepsie.',
        prix: 45,
        categorie: 'infirmiere',
        prestataire: providerIds.emna_nurse
      },

      // Nirvana Spa (Beauté - Tunis)
      {
        id: 'ser-nirvana-1',
        nom: 'Massage Californien Relaxant (60 min)',
        description: 'Massage corporel complet aux huiles chaudes de jasmin de Tunisie.',
        prix: 60,
        categorie: 'centre de beaute',
        prestataire: providerIds.nirvana
      },
      {
        id: 'ser-nirvana-2',
        nom: 'Soin Facial Hydratant Éclat d’Orient',
        description: 'Nettoyage à la vapeur d’eau de rose et masque à l’argile blanche.',
        prix: 45,
        categorie: 'centre de beaute',
        prestataire: providerIds.nirvana
      },
      {
        id: 'ser-nirvana-3',
        nom: 'Beauté des Mains & Manucure complète',
        description: 'Soin complet des ongles, polissage, gommage et massage hydratant des mains.',
        prix: 40,
        categorie: 'centre de beaute',
        prestataire: providerIds.nirvana
      },

      // Maison de Beauté Lilas (Beauté - Sfax)
      {
        id: 'ser-lilas-1',
        nom: 'Soin Hydratant Visage aux Huiles Naturelles',
        description: 'Soin réhydratant intense à base d’huile de figue de barbarie bio de Tunisie.',
        prix: 50,
        categorie: 'centre de beaute',
        prestataire: providerIds.lilas
      },
      {
        id: 'ser-lilas-2',
        nom: 'Forfait Coiffure Brushing Premium',
        description: 'Lavage, soin capillaire lissant et brushing professionnel pour occasions.',
        prix: 35,
        categorie: 'centre de beaute',
        prestataire: providerIds.lilas
      },
      {
        id: 'ser-lilas-3',
        nom: 'Soin Lissage Kératine Premium Tunisienne',
        description: 'Lissage profond et durable aux protéines de soie et huile de jojoba pour fortifier les cheveux.',
        prix: 180,
        categorie: 'centre de beaute',
        prestataire: providerIds.lilas
      },

      // Royal Thalasso Spa (Beauté - Monastir)
      {
        id: 'ser-royal-1',
        nom: 'Cure Thalasso 1 jour Découverte',
        description: 'Cure comprenant 3 soins thalasso (hammam, gommage traditionnel et hydrothérapie).',
        prix: 150,
        categorie: 'centre de beaute',
        prestataire: providerIds.royal_thalasso
      },
      {
        id: 'ser-royal-2',
        nom: 'Enveloppement d’Algues Marines & Hammam',
        description: 'Séance de hammam suivie d’un enveloppement d’algues chaudes reminéralisantes.',
        prix: 90,
        categorie: 'centre de beaute',
        prestataire: providerIds.royal_thalasso
      },
      {
        id: 'ser-royal-3',
        nom: 'Massage Drainant Minceur (45 min)',
        description: 'Massage manuel thalasso ciblé pour relancer la circulation et lisser les capitons.',
        prix: 80,
        categorie: 'centre de beaute',
        prestataire: providerIds.royal_thalasso
      }
    ];

    const seededServices = await Service.insertMany(servicesData);
    console.log(`${seededServices.length} services créés avec succès.`);

    // 4. Mettre à jour les prestataires avec les IDs des services créés
    for (const service of seededServices) {
      const provider = prestataires.find(p => p._id.toString() === service.prestataire.toString());
      if (provider) {
        provider.services.push(service._id);
      }
    }

    // 5. Créer l'admin
    console.log('Création de l\'admin...');
    const admin = {
      id: 'admin-wakti',
      nom: 'Administrateur Wakti',
      email: 'nadaatouil00@gmail.com',
      telephone: '71500500',
      mdp: 'Nadawakti.0',
      role: 'admin'
    };

    console.log('Enregistrement des utilisateurs (avec hachage des mots de passe)...');
    for (const p of prestataires) {
      const userObj = new User(p);
      await userObj.save();
    }
    const adminObj = new User(admin);
    await adminObj.save();

    console.log('Utilisateurs créés et sécurisés avec succès.');

    console.log('🎉 Seed terminé avec succès ! Base de données Wakti opérationnelle.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err);
    process.exit(1);
  }
};

seed();
