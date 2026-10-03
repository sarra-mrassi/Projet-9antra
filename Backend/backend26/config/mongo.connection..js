const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const connectToBd = async (attempt = 1) => {
  try {
    const uri = process.env.MONGOURI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error('Aucune URI MongoDB trouvée dans les variables d’environnement.');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
    });

    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur MongoDB (tentative ${attempt}/${MAX_RETRIES}) : ${error.message}`);
    if (attempt < MAX_RETRIES) {
      console.log(`⏳ Nouvelle tentative dans ${RETRY_DELAY / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return connectToBd(attempt + 1);
    }

    console.error('💀 Impossible de se connecter à MongoDB. Arrêt du serveur.');
    process.exit(1);
  }
};

module.exports = { connectToBd };
;