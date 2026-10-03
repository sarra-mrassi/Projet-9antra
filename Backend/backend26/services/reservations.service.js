const Reservation = require('../models/reservation.model');

// CREATE - Créer une nouvelle réservation
module.exports.createReservation = async (reservationData) => {
  const reservation = new Reservation(reservationData);
  return await reservation.save();
};

// READ - Récupérer toutes les réservations
module.exports.getAllReservations = async () => {
  return await Reservation.find();
};

// READ - Récupérer une réservation par son identifiant métier
module.exports.getReservationById = async (reservationId) => {
  return await Reservation.findOne({ id: reservationId });
};

// UPDATE - Mettre à jour une réservation
module.exports.updateReservation = async (reservationId, updateData) => {
  return await Reservation.findOneAndUpdate({ id: reservationId }, updateData, {
    new: true,
    runValidators: true,
  });
};

// DELETE - Supprimer une réservation
module.exports.deleteReservation = async (reservationId) => {
  return await Reservation.findOneAndDelete({ id: reservationId });
};
