const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.Controller');

router.post('/prestataires/:id/valider', adminController.validerPrestataire);
router.post('/utilisateurs/:id/bloquer', adminController.bloquerUtilisateur);
router.post('/utilisateurs/:id/debloquer', adminController.debloquerUtilisateur);
router.get('/stats', adminController.voirStats);
router.post('/utilisateurs/:id/signalement', adminController.gererSignalement);
router.get('/rapport', adminController.genererRapport);
router.get('/dashboard', adminController.dashboardStats);

module.exports = router;
