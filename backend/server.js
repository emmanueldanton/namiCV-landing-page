import express from 'express';
import cors from 'cors';
import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de l'API Brevo Contacts
const contactsApi = new brevo.ContactsApi();
contactsApi.setApiKey(
  brevo.ContactsApiApiKeys.apiKey, 
  process.env.BREVO_API_KEY
);

// Configuration de l'API Brevo Transactional Emails
const transactionalEmailsApi = new brevo.TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Fonction de validation
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Route de test
app.get('/', (_req, res) => {
  res.json({ message: 'API Backend namiCV fonctionne !' });
});

// Route pour ajouter un contact et envoyer un email
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  
  console.log(`📨 Nouvelle soumission: ${email}`);
  console.log(`🕐 Date: ${new Date().toLocaleString('fr-FR')}`);
  
  // Validation de l'email
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ 
      ok: false, 
      data: { error: 'Email invalide.' } 
    });
  }
  
  try {
    // 1. Ajouter le contact à la liste
    const createContact = new brevo.CreateContact();
    createContact.email = email;
    createContact.listIds = [5]; // Ton ID de liste
    createContact.updateEnabled = true;
    
    await contactsApi.createContact(createContact);
    console.log('✅ Contact ajouté à Brevo:', email);
    
    // 2. Envoyer l'email de bienvenue
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.templateId = 1; // ⚠️ REMPLACE par l'ID de ton template
    sendSmtpEmail.params = {
      EMAIL: email
    };
    
    await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    console.log('📧 Email de bienvenue envoyé à:', email);
    
    res.json({ 
      ok: true, 
      data: { message: 'Abonnement réussi. Vérifiez votre boîte mail !' } 
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.body || error.message);
    
    // Si le contact existe déjà
    if (error.response?.body?.code === 'duplicate_parameter') {
      // Envoyer quand même l'email
      try {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.templateId = 1; // ⚠️ REMPLACE par l'ID de ton template
        sendSmtpEmail.params = {
          EMAIL: email
        };
        
        await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        console.log('📧 Email renvoyé à:', email);
        
        return res.json({ 
          ok: true, 
          data: { message: 'Vous êtes déjà inscrit ! Email de confirmation renvoyé.' } 
        });
      } catch (emailError) {
        console.error('❌ Erreur envoi email:', emailError);
      }
    }
    
    res.status(500).json({ 
      ok: false, 
      data: { error: 'Erreur lors de l\'inscription.' } 
    });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
  console.log(`📧 Emails transactionnels activés`);
});