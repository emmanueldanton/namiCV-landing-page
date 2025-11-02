import * as brevo from '@getbrevo/brevo';

// Configuration Brevo
const contactsApi = new brevo.ContactsApi();
contactsApi.setApiKey(
  brevo.ContactsApiApiKeys.apiKey, 
  // eslint-disable-next-line no-undef
  process.env.BREVO_API_KEY
);

const transactionalEmailsApi = new brevo.TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  // eslint-disable-next-line no-undef
  process.env.BREVO_API_KEY
);

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, data: { error: 'Method not allowed' } });
  }

  const { email } = req.body;
  
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ 
      ok: false, 
      data: { error: 'Email invalide.' } 
    });
  }
  
  try {
    // Ajouter le contact
    const createContact = new brevo.CreateContact();
    createContact.email = email;
    createContact.listIds = [5];
    createContact.updateEnabled = true;
    
    await contactsApi.createContact(createContact);
    
    // Envoyer l'email
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.templateId = 1;
    sendSmtpEmail.params = { EMAIL: email };
    
    await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    
    res.json({ 
      ok: true, 
      data: { message: 'Abonnement réussi. Vérifiez votre boîte mail !' } 
    });
    
  } catch (error) {
    if (error.response?.body?.code === 'duplicate_parameter') {
      try {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.templateId = 1;
        sendSmtpEmail.params = { EMAIL: email };
        
        await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        
        return res.json({ 
          ok: true, 
          data: { message: 'Vous êtes déjà inscrit ! Email renvoyé.' } 
        });
      } catch (emailError) {
        console.error(emailError);
      }
    }
    
    res.status(500).json({ 
      ok: false, 
      data: { error: 'Erreur lors de l\'inscription.' }
    });
  }
}
