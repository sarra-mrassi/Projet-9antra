var express = require('express');
var router = express.Router();
const serviceController = require('../controllers/services.Controller');

router.post('/', serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/voirDispo', serviceController.voirDispo);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
