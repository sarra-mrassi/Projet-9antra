const dotenv = require('dotenv');
dotenv.config();

let client = null;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (accountSid && accountSid.startsWith('AC') && authToken && authToken !== 'votre_token_ici') {
  try {
    const twilio = require('twilio');
    client = twilio(accountSid, authToken);
    console.log('Twilio SMS Client initialized.');
  } catch (err) {
    console.error('Failed to import twilio package:', err.message);
  }
} else {
  console.log('Twilio SMS Configuration not set or using placeholders. Falling back to secure SMS Simulation mode.');
}

module.exports.sendSMS = async (to, body) => {
  if (!client) {
    console.log(`\n--- [SMS SIMULATION] ---`);
    console.log(`Destinataire : ${to}`);
    console.log(`Message : ${body}`);
    console.log(`-------------------------\n`);
    return { simulated: true, success: true };
  }

  try {
    let formattedTo = to;
    if (!to.startsWith('+')) {
      if (to.startsWith('216')) {
        formattedTo = '+' + to;
      } else {
        formattedTo = '+216' + to;
      }
    }

    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: formattedTo
    });

    console.log(`[Twilio SMS Sent] SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.warn(`[Twilio Error] Envoi réel échoué (${error.message}). Bascule en mode simulation.`);
    console.log(`\n--- [SMS SIMULATION (FALLBACK)] ---`);
    console.log(`Destinataire : ${to}`);
    console.log(`Message : ${body}`);
    console.log(`------------------------------------\n`);
    return { simulated: true, success: true };
  }
};
