const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prix: {
      type: Number,
      min: 0,
    },
    categorie: {
      type: String,
      trim: true,
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    prestataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
