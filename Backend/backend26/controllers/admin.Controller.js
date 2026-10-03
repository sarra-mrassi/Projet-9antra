const adminService = require('../services/admin.service');

module.exports.validerPrestataire = async (req, res) => {
  try {
    const user = await adminService.validerPrestataire(req.params.id);
    res.json({ message: 'Prestataire validé', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.bloquerUtilisateur = async (req, res) => {
  try {
    const user = await adminService.bloquerUtilisateur(req.params.id);
    res.json({ message: 'Utilisateur bloqué', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.debloquerUtilisateur = async (req, res) => {
  try {
    const user = await adminService.debloquerUtilisateur(req.params.id);
    res.json({ message: 'Utilisateur débloqué', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.voirStats = async (req, res) => {
  try {
    const stats = await adminService.voirStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.gererSignalement = async (req, res) => {
  try {
    const user = await adminService.gererSignalement(req.params.id, req.body.signalement);
    res.json({ message: 'Signalement enregistré', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.genererRapport = async (req, res) => {
  try {
    const report = await adminService.genererRapport();
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.dashboardStats = async (req, res) => {
  try {
    const stats = await adminService.dashboardStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
