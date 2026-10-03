const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      trim: true,
      default: () => `avis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    },
    note: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    commentaire: {
      type: String,
      trim: true,
    },
    reponse: {
      type: String,
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
  },
  {
    timestamps: true,
  }
);

const Avis = mongoose.model('Avis', avisSchema);

module.exports = Avis;
