const reservationService = require('../services/reservations.service');
const smsService = require('../services/sms.service');
const emailService = require('../services/email.service');
const verificationCodes = new Map();

// CREATE - Créer une nouvelle réservation
module.exports.createReservation = async (req, res) => {
  try {
    const { id, date, statut, prixTotal } = req.body;

    // Vérifier que les champs requis sont présents
    if (!id || !date || !statut || prixTotal === undefined) {
      return res.status(400).json({ error: 'Les champs id, date, statut et prixTotal sont requis' });
    }

    const reservation = await reservationService.createReservation({
      id,
      date,
      statut,
      prixTotal,
    });

    res.status(201).json({ message: 'Réservation créée avec succès', reservation });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.id) {
      return res.status(409).json({ error: 'Cet ID de réservation est déjà utilisé.' });
    }
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

// READ - Récupérer toutes les réservations
module.exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json({ message: 'Toutes les réservations', reservations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Récupérer une réservation par ID
module.exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation trouvée', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Mettre à jour une réservation
module.exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Empêcher la modification de l'ID MongoDB
    delete updateData._id;

    const reservation = await reservationService.updateReservation(id, updateData);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation mise à jour', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Supprimer une réservation
module.exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.deleteReservation(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation supprimée avec succès', reservation });
  } catch (error) {
    console.log('ERREUR COMPLETE:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.sendSmsCode = async (req, res) => {
  try {
    const { telephone, email } = req.body;
    if (!telephone || telephone.length < 8) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 mins
    verificationCodes.set(telephone, { code, expires });

    // 1. Try sending SMS (non-blocking)
    const messageBody = `Votre code de validation Wakti est : ${code}`;
    try {
      await smsService.sendSMS(telephone, messageBody);
    } catch (smsErr) {
      console.warn('Twilio SMS delivery failed:', smsErr.message);
    }

    // 2. Send via Email if provided (so they can verify securely without SMS block)
    if (email) {
      try {
        await emailService.sendMail({
          to: email,
          subject: 'Wakti - Code de vérification de votre réservation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              <div style="background-color: #0f172a; padding: 24px; text-align: center; color: white;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 2px;">WAKTI</h2>
              </div>
              <div style="padding: 32px; color: #1e293b;">
                <p style="font-size: 16px; margin-top: 0; font-weight: 600;">Bonjour,</p>
                <p style="font-size: 15px; line-height: 1.6;">Pour valider votre numéro de téléphone <strong>+216 ${telephone}</strong> et confirmer votre réservation, veuillez saisir le code de vérification suivant :</p>
                <div style="text-align: center; margin: 32px 0;">
                  <span style="font-size: 32px; font-weight: 800; color: #6366f1; letter-spacing: 6px; padding: 12px 24px; background-color: #f1f5f9; border-radius: 6px; border: 1px solid #e2e8f0; display: inline-block;">
                    ${code}
                  </span>
                </div>
                <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 0;">Ce code est valable pendant 5 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
              </div>
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                Ce message a été envoyé automatiquement par la plateforme Wakti.
              </div>
            </div>
          `
        });
        console.log(`Verification code email sent successfully to ${email}`);
      } catch (mailErr) {
        console.error('Failed to send verification email:', mailErr.message);
      }
    }

    res.status(200).json({ success: true, method: email ? 'email' : 'sms' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur lors de l’envoi du code.' });
  }
};

module.exports.verifySmsCode = async (req, res) => {
  try {
    const { telephone, code } = req.body;
    if (!telephone || !code) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }

    const record = verificationCodes.get(telephone);
    if (!record) {
      return res.status(400).json({ error: 'Aucun code envoyé à ce numéro.' });
    }

    if (Date.now() > record.expires) {
      verificationCodes.delete(telephone);
      return res.status(400).json({ error: 'Code expiré. Veuillez en demander un nouveau.' });
    }

    if (record.code !== code) {
      return res.status(400).json({ error: 'Code incorrect.' });
    }

    verificationCodes.delete(telephone);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
