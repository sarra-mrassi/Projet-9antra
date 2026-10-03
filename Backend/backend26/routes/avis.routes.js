const express = require('express');
const router = express.Router();
const avisCtrl = require('../controllers/avis.Controller');

router.post('/', avisCtrl.createAvis);
router.get('/', avisCtrl.getAllAvis);
router.get('/:id', avisCtrl.getAvis);
router.post('/:id/reponse', avisCtrl.ajouterReponse);
router.delete('/:id', avisCtrl.deleteAvis);

module.exports = router;
