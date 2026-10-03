const nodemailer = require('nodemailer');

// For Gmail App Passwords, using service: 'gmail' is much more robust
// and prevents TLS/SSL handshake or connection errors.
const isGmail = process.env.EMAIL_HOST?.includes('gmail') || process.env.EMAIL_USER?.includes('gmail.com');

const transporterConfig = isGmail
  ? {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }
  : {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

console.log(`Initialisation de l'email avec la configuration : ${isGmail ? 'Gmail Service' : 'SMTP Classique'}`);
const transporter = nodemailer.createTransport(transporterConfig);

transporter.verify().then(() => {
  console.log('✅ Service Email prêt à envoyer des messages');
}).catch((error) => {
  console.error('❌ Erreur de configuration de l\'email :', error);
});

module.exports.sendMail = async (mailOptions) => {
  if (!mailOptions.from) {
    mailOptions.from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  }

  if (!mailOptions.from) {
    throw new Error('Le champ EMAIL_FROM est requis dans le fichier .env');
  }

  console.log(`Envoi d'un email de ${mailOptions.from} à ${mailOptions.to} (Sujet : ${mailOptions.subject})...`);
  return transporter.sendMail(mailOptions);
};
