var express = require('express');
var router = express.Router();
const userController = require('../controllers/users.Controller');
const uploadFile = require('../middlewares/upload.file');
const {requireAuth, requireRole} = require('../middlewares/auth.middleware');

// AUTH routes (toujours en premier avant /:id)
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/forgot-password/send-code', userController.forgotPasswordSendCode);
router.post('/forgot-password/verify-code', userController.forgotPasswordVerifyCode);
router.post('/forgot-password/reset', userController.forgotPasswordReset);

// CREATE
router.post('/', uploadFile.single('profilePicture'), userController.createUser);

// READ - List all users (public)
router.get('/', userController.getAllUsers);

// Client actions (protégé par token)
router.post('/:id/faireReservation', requireAuth, userController.faireReservation);
router.post('/:id/annulerReservation/:reservationId', requireAuth, userController.annulerReservation);
router.post('/:id/laisserAvis', requireAuth, userController.laisserAvis);
router.get('/:id/historique', requireAuth, userController.voirHistorique);
router.post('/:id/chatbot', requireAuth, userController.utiliserChatbot);

// READ / UPDATE / DELETE par ID (toujours en dernier, protégé)
router.get('/:id', requireAuth, userController.getUserById);
router.put('/:id', requireAuth, uploadFile.single('profilePicture'), userController.updateUser);
router.delete('/:id', requireAuth, userController.deleteUser);

module.exports = router;