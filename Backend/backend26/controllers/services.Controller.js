const serviceService = require('../services/services.service');

module.exports.createService = async (req, res) => {
  try {
    const { id, nom, description, prix, categorie, disponible } = req.body;

    if (!id || !nom) {
      return res.status(400).json({ error: 'Les champs id et nom sont requis' });
    }

    const service = await serviceService.createService({
      id,
      nom,
      description,
      prix,
      categorie,
      disponible,
    });

    res.status(201).json({ message: 'Service créé avec succès', service });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServices();
    res.status(200).json({ message: 'Liste des services', services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);

    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }

    res.status(200).json({ message: 'Service trouvé', service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.voirDispo = async (req, res) => {
  try {
    const services = await serviceService.getAvailableServices();
    res.status(200).json({ message: 'Services disponibles', services });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData._id;

    if (updateData.disponible !== undefined) {
      updateData.disponible = Boolean(updateData.disponible);
    }

    const service = await serviceService.updateService(id, updateData);

    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }

    res.status(200).json({ message: 'Service mis à jour', service });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceService.deleteService(id);

    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }

    res.status(200).json({ message: 'Service supprimé avec succès', service });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};
