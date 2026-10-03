const userService = require('../services/users.service');
const emailService = require('../services/email.service');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const resetCodes = new Map();

const maxAge = 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: maxAge,
  });
};

const buildUserPayload = (req) => {
  const body = req.body;
  const nom = body.nom || `${body.firstname || ''} ${body.lastname || ''}`.trim();
  const mdp = body.mdp || body.password;

  let assignedRole = body.role || 'client';
  const adminEmail = process.env.ADMIN_EMAIL || 'nadaatouil00@gmail.com';
  
  if (body.email && body.email.toLowerCase().trim() === adminEmail.toLowerCase().trim()) {
    assignedRole = 'admin';
  } else if (assignedRole === 'admin') {
    assignedRole = 'client';
  }

  const payload = {
    id: body.id,
    nom: nom || body.nom || 'Utilisateur',
    email: body.email,
    telephone: body.telephone || body.phone,
    mdp,
    role: assignedRole,
    date: body.date,
    categorie: body.categorie,
    adresse: body.adresse || body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    note: body.note,
    services: body.services,
    reservations: body.reservations,
    avis: body.avis,
  };

  if (req.file) {
    payload.profilePicture = `/images/${req.file.filename}`;
  }

  return payload;
};

const sendWelcomeEmail = async (user) => {
  if (!user?.email) return;
  try {
    console.log(`[Email] Tentative d'envoi de l'email de bienvenue à : ${user.email}`);
    await emailService.sendMail({
      to: user.email,
      subject: 'Bienvenue sur Wakti! 🎉',
      text: `Bonjour ${user.nom || 'utilisateur'},\n\nBienvenue sur Wakti ! Nous sommes ravis de vous compter parmi nous.\n\nVos informations:\n- Email: ${user.email}\n- Nom: ${user.nom}\n- Rôle: ${user.role}\n\nSi vous avez des questions, n'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe Wakti`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b; line-height: 1.5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Wakti</h1>
              <p style="color: #c084fc; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Votre temps est précieux</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Bienvenue sur Wakti, ${user.nom || 'utilisateur'} ! 🎉</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Nous sommes ravis de vous compter parmi nous. Wakti est votre nouvel allié pour planifier vos réservations intelligemment et sans perte de temps en Tunisie.
              </p>
              
              <!-- Credentials Card -->
              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 30px 0; border-left: 4px solid #7c3aed;">
                <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 12px; font-size: 16px; font-weight: 700;">Récapitulatif de votre compte</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; width: 120px;">Nom complet :</td>
                    <td style="padding: 6px 0;">${user.nom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Adresse email :</td>
                    <td style="padding: 6px 0;">${user.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600;">Rôle :</td>
                    <td style="padding: 6px 0; text-transform: capitalize; font-weight: 700; color: #4f46e5;">${user.role}</td>
                  </tr>
                </table>
              </div>

              ${user.role === 'prestataire' ? `
              <!-- Provider Status Alert -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #b45309; font-weight: 700;">
                  💡 Profil en attente d'activation :
                </p>
                <p style="margin: 6px 0 0 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                  Votre compte de prestataire est actuellement en cours d'examen par notre équipe d'administration. Vous recevrez un e-mail de confirmation dès que vos services seront visibles en ligne par nos clients.
                </p>
              </div>
              ` : ''}

              <!-- Call to Action -->
              <div style="text-align: center; margin: 35px 0 15px 0;">
                <a href="https://wakti.netlify.app/login" style="background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.25);">
                  Accéder à mon espace
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                Cet e-mail a été envoyé automatiquement. Pour toute question, contactez-nous à l'adresse support@wakti.tn.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #94a3b8; font-weight: 600;">
                © 2026 Wakti Tunisie. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      `
    });
    console.log(`[Email] Email de bienvenue envoyé avec succès à : ${user.email}`);
  } catch (mailError) {
    console.error(`[Email] Échec de l'envoi de l'email de bienvenue à : ${user.email}. Erreur :`, mailError);
  }
};

const sendAdminNotification = async (user) => {
  try {
    console.log(`[Email] Tentative d'envoi de l'email admin à : ${process.env.ADMIN_EMAIL}`);
    await emailService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Nouveau utilisateur inscrit ✅',
      text: `Un nouvel utilisateur vient de s'inscrire !\n\nDétails:\n- Email: ${user.email}\n- Nom: ${user.nom}\n- Rôle: ${user.role}\n- Téléphone: ${user.telephone || 'Non fourni'}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b; line-height: 1.5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
            <!-- Header -->
            <div style="background: #0f172a; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Wakti Admin</h1>
              <p style="color: #38bdf8; margin: 5px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Alerte d'inscription</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Nouveau compte enregistré ! 👤</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Un nouvel utilisateur s'est inscrit sur la plateforme **Wakti**. Voici les coordonnées détaillées :
              </p>
              
              <!-- Table of details -->
              <table style="width: 100%; border-collapse: collapse; margin: 25px 0; border: 1px solid #e2e8f0; font-size: 14px;">
                <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                  <th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #1e293b; width: 150px;">Champs</th>
                  <th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #1e293b;">Valeur</th>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Nom complet :</td>
                  <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">${user.nom}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Adresse email :</td>
                  <td style="padding: 12px 16px; color: #0f172a;"><a href="mailto:${user.email}" style="color: #4f46e5; text-decoration: none; font-weight: 600;">${user.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Téléphone :</td>
                  <td style="padding: 12px 16px; color: #0f172a;">${user.telephone || 'Non fourni'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Rôle :</td>
                  <td style="padding: 12px 16px;">
                    <span style="background-color: ${user.role === 'prestataire' ? '#fffbeb' : '#f0fdf4'}; color: ${user.role === 'prestataire' ? '#b45309' : '#15803d'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">
                      ${user.role}
                    </span>
                  </td>
                </tr>
                ${user.role === 'prestataire' ? `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Catégorie :</td>
                  <td style="padding: 12px 16px; color: #0f172a; text-transform: uppercase; font-weight: 700;">${user.categorie || 'Non spécifiée'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Adresse :</td>
                  <td style="padding: 12px 16px; color: #0f172a;">${user.adresse || 'Non spécifiée'}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; color: #475569;">Date d'inscription :</td>
                  <td style="padding: 12px 16px; color: #475569;">${new Date().toLocaleString('fr-FR')}</td>
                </tr>
              </table>

              ${user.role === 'prestataire' ? `
              <!-- Verification alert for admin -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin-top: 30px; text-align: center;">
                <p style="margin: 0 0 15px 0; font-size: 14px; color: #b45309; font-weight: 700;">
                  ⚠️ Validation administrative requise !
                </p>
                <a href="https://wakti.netlify.app/admin-dashboard" style="background-color: #b45309; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">
                  Accéder au panneau de validation
                </a>
              </div>
              ` : `
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://wakti.netlify.app/admin-dashboard" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; font-size: 13px; display: inline-block;">
                  Consulter la liste de contrôle
                </a>
              </div>
              `}
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                Notification automatisée du système Wakti. Merci de ne pas répondre directement.
              </p>
            </div>
          </div>
        </div>
      `
    });
    console.log(`[Email] Email admin envoyé avec succès à : ${process.env.ADMIN_EMAIL}`);
  } catch (adminMailError) {
    console.error(`[Email] Échec de l'envoi de l'email admin à : ${process.env.ADMIN_EMAIL}. Erreur :`, adminMailError);
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const userData = buildUserPayload(req);

    if (!userData.email || !userData.mdp) {
      return res.status(400).json({ error: 'Les champs email et mdp sont requis' });
    }

    const user = await userService.createUser(userData);
    await sendWelcomeEmail(user);
    await sendAdminNotification(user);

    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.createPrestataire = async (req, res) => {
  req.body.role = 'prestataire';
  return module.exports.createUser(req, res);
};

module.exports.createClient = async (req, res) => {
  req.body.role = 'client';
  return module.exports.createUser(req, res);
};

module.exports.createAdmin = async (req, res) => {
  req.body.role = 'admin';
  return module.exports.createUser(req, res);
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ message: 'Tous les utilisateurs', users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.faireReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await userService.faireReservation(id, req.body);
    res.status(201).json({ message: 'Réservation créée', reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports.logoutUser = (req, res) => {
  res.cookie('jwt_token', '', { maxAge: 1 });
  res.status(200).json({ message: 'Utilisateur déconnecté' });
};
module.exports.annulerReservation = async (req, res) => {
  try {
    const { id, reservationId } = req.params;
    const reservation = await userService.annulerReservation(id, reservationId);
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });
    res.json({ message: 'Réservation annulée', reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.laisserAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const avis = await userService.laisserAvis(id, req.body);
    res.status(201).json({ message: 'Avis laissé', avis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.voirHistorique = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.voirHistorique(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Historique utilisateur', reservations: user.reservations, avis: user.avis, chatbotHistory: user.chatbotHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.utiliserChatbot = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Le message est requis' });
    const result = await userService.utiliserChatbot(id, message);
    res.json({ message: 'Chatbot utilisé', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur trouvé', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;

    if (req.file) {
      updateData.profilePicture = `/images/${req.file.filename}`;
    }

    const user = await userService.updateUser(id, updateData);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur mis à jour', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès', user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.forgotPasswordSendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'L\'adresse email est requise.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cette adresse email.' });
    }

    // Generate a 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Store code in map with 10 minutes expiry
    resetCodes.set(email.toLowerCase().trim(), {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // Send the email with OTP code
    await emailService.sendMail({
      to: user.email,
      subject: 'Code de réinitialisation de mot de passe - Wakti 🔑',
      text: `Bonjour ${user.nom || 'Utilisateur'},\n\nVous avez demandé la réinitialisation de votre mot de passe pour votre compte Wakti.\n\nVoici votre code de réinitialisation : ${code}\n\nCe code est valable pendant 10 minutes.\n\nCordialement,\nL'équipe Wakti`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b; line-height: 1.5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Wakti</h1>
              <p style="color: #c084fc; margin: 5px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Mot de passe oublié</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Code de vérification 🔑</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Bonjour <strong>${user.nom}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Wakti. Veuillez saisir le code ci-dessous dans l'application pour confirmer votre identité :
              </p>
              
              <!-- Code Card -->
              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center; border: 1px dashed #7c3aed;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Votre code de réinitialisation</p>
                <div style="font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #7c3aed; font-family: monospace; user-select: all;">${code}</div>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                ⚠️ Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.<br>
              &copy; 2026 Wakti. Tous droits réservés.
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({ message: 'Un code de réinitialisation a été envoyé à votre adresse email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.forgotPasswordVerifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'L\'email et le code sont requis.' });
    }

    const key = email.toLowerCase().trim();
    const entry = resetCodes.get(key);

    if (!entry) {
      return res.status(400).json({ error: 'Aucun code généré pour cet email.' });
    }

    if (Date.now() > entry.expiresAt) {
      resetCodes.delete(key);
      return res.status(400).json({ error: 'Ce code a expiré.' });
    }

    if (entry.code !== code.trim()) {
      return res.status(400).json({ error: 'Code incorrect.' });
    }

    res.status(200).json({ message: 'Code vérifié avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.forgotPasswordReset = async (req, res) => {
  try {
    const { email, code, newMdp } = req.body;
    if (!email || !code || !newMdp) {
      return res.status(400).json({ error: 'L\'email, le code et le nouveau mot de passe sont requis.' });
    }

    const key = email.toLowerCase().trim();
    const entry = resetCodes.get(key);

    if (!entry) {
      return res.status(400).json({ error: 'Session de réinitialisation expirée ou invalide.' });
    }

    if (Date.now() > entry.expiresAt) {
      resetCodes.delete(key);
      return res.status(400).json({ error: 'Le code de validation a expiré.' });
    }

    if (entry.code !== code.trim()) {
      return res.status(400).json({ error: 'Le code de validation est incorrect.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    // Set and hash the new password via mongoose save hook
    user.mdp = newMdp;
    await user.save();

    // Clean up reset code
    resetCodes.delete(key);

    res.status(200).json({ message: 'Votre mot de passe a été modifié avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, mdp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const match = await bcrypt.compare(mdp, user.mdp);
    if (!match) {
      return res.status(401).json({ error: 'Mot de passe invalide' });
    }

    const token = createToken(user._id);
    res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 60 });

    res.status(200).json({ message: 'Utilisateur connecté', data: user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.logoutUser = (req, res) => {
  res.cookie('jwt_token', '', { maxAge: 1 });
  res.status(200).json({ message: 'Utilisateur déconnecté' });
};