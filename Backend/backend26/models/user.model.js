const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      trim: true,
      default: () => `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    telephone: {
      type: String,
      trim: true,
    },
    mdp: {
      type: String,
      required: true,
      minlength: 6,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
      ],
    },
    role: {
      type: String,
      enum: ['prestataire', 'client', 'admin'],
      default: 'client',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    categorie: {
      type: String,
      trim: true,
    },
    adresse: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    note: {
      type: Number,
      min: 0,
      max: 5,
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    avis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Avis' }],
    chatbotHistory: [
      {
        message: { type: String, trim: true },
        response: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    isBlocked: { type: Boolean, default: false },
    isValidatedPrestataire: { type: Boolean, default: false },
    statutPrestataire: { type: String, enum: ['en_attente', 'valide', 'rejete'], default: 'en_attente' },
    signalements: [{ type: String, trim: true }],
    profilePicture: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('mdp') || !this.mdp) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.mdp = await bcrypt.hash(this.mdp, salt);
  } catch (error) {
    throw error;
  }
});
userSchema.statics.login = async function (email,password){
  const user = await this.findOne({email});
  if(user){ 
    const auth = await bcrypt.compare(password,user.password );
  if(auth){
    return user ; 
  }
  throw new Error('Invalid password');
}
throw Error("incorrect email ");
}


const User = mongoose.model('User', userSchema);

module.exports = User;


