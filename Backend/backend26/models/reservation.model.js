const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    statut: {
      type: String,
      required: true,
      trim: true,
    },
    prixTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    telephoneClient: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
