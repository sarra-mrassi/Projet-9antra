const avisService = require('../services/avis.service');

module.exports.createAvis = async (req, res) => {
  try {
    const { note, commentaire, client, prestataire } = req.body;
    if (!note || !client || !prestataire) {
      return res.status(400).json({ error: 'note, client et prestataire sont requis' });
    }

    const avis = await avisService.createAvis({ note, commentaire, client, prestataire });
    res.status(201).json({ message: 'Avis créé', avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const avis = await avisService.getAvisById(id);
    if (!avis) return res.status(404).json({ error: 'Avis non trouvé' });
    res.json({ avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAllAvis = async (req, res) => {
  try {
    const avis = await avisService.getAllAvis();
    res.json({ avis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.ajouterReponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { reponse } = req.body;
    if (typeof reponse !== 'string') return res.status(400).json({ error: 'reponse obligatoire' });

    const updated = await avisService.addResponse(id, reponse);
    if (!updated) return res.status(404).json({ error: 'Avis non trouvé' });
    res.json({ message: 'Réponse ajoutée', avis: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await avisService.deleteAvis(id);
    if (!removed) return res.status(404).json({ error: 'Avis non trouvé' });
    res.json({ message: 'Avis supprimé', avis: removed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
