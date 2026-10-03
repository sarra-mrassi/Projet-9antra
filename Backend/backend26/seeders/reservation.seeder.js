const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Reservation = require('../models/reservation.model');

dotenv.config();

const seedReservations = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);

    const reservations = [
      {
        id: 'RES-001',
        date: new Date('2026-06-30T14:00:00Z'),
        statut: 'confirmée',
        prixTotal: 120.5,
      },
      {
        id: 'RES-002',
        date: new Date('2026-07-02T09:30:00Z'),
        statut: 'en attente',
        prixTotal: 95.0,
      },
      {
        id: 'RES-003',
        date: new Date('2026-07-05T18:45:00Z'),
        statut: 'annulée',
        prixTotal: 0.0,
      },
    ];

    await Reservation.deleteMany({});
    await Reservation.insertMany(reservations);

    console.log('Données de réservation insérées avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l’insertion des données de réservation :', error);
    process.exit(1);
  }
};

seedReservations();
