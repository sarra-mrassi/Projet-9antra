const Avis = require('../models/avis.model');
const User = require('../models/user.model');

module.exports.createAvis = async (avisData) => {
  const avis = new Avis(avisData);
  const saved = await avis.save();

  // Link avis to client and prestataire users (if present)
  if (saved.client) {
    await User.findByIdAndUpdate(saved.client, { $push: { avis: saved._id } });
  }
  if (saved.prestataire) {
    await User.findByIdAndUpdate(saved.prestataire, { $push: { avis: saved._id } });
  }

  return saved;
};

module.exports.getAvisById = async (id) => {
  return await Avis.findById(id).populate('client prestataire', 'nom email');
};

module.exports.getAllAvis = async () => {
  return await Avis.find().populate('client prestataire', 'nom email');
};

module.exports.addResponse = async (avisId, reponse) => {
  return await Avis.findByIdAndUpdate(avisId, { reponse }, { new: true });
};

module.exports.deleteAvis = async (id) => {
  const removed = await Avis.findByIdAndDelete(id);
  if (removed) {
    // remove references from users
    await User.updateMany({ avis: removed._id }, { $pull: { avis: removed._id } });
  }
  return removed;
};
