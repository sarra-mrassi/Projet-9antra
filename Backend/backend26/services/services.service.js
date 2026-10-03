const Service = require('../models/service.model');

module.exports.createService = async (data) => {
  const service = new Service(data);
  return await service.save();
};

module.exports.getAllServices = async () => {
  return await Service.find().populate('prestataire');
};

module.exports.getAvailableServices = async () => {
  return await Service.find({ disponible: true }).populate('prestataire');
};

module.exports.getServiceById = async (id) => {
  return await Service.findById(id).populate('prestataire');
};

module.exports.updateService = async (id, updateData) => {
  return await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('prestataire');
};

module.exports.deleteService = async (id) => {
  return await Service.findByIdAndDelete(id);
};
