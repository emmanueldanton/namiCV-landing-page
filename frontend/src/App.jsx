//eslint-disable no-undef
import React, { useState, useEffect, useRef } from 'react';

// Traductions
const translations = {
  fr: {
    headerCTA: "Je veux être le premier à tester",
    badge: "🚀 Lancement Prochain !",
    titleLine1: "Gagne du ",
    titleAccent: "temps",
    titleLine2: "à chaque candidature",
    subtitle1: "Laisse namiCV générer, adapter et suivre tes candidatures,",
    subtitle2: "avec juste ",
    subtitleItalic: "un copier-coller",
    feature1: "Génération de CV & Lettre",
    feature2: "Personnalisation par l'IA",
    feature3: "Gain de temps maximal",
    emailPlaceholder: "Votre email",
    submitButton: "S'inscrire",
    submitting: "Inscription...",
    successMessage: "🎉 Bravo ! Vous êtes inscrit(e) sur la liste d'attente.",
    errorPrefix: "Erreur: ",
    errorDefault: "Veuillez vérifier votre adresse e-mail.",
    errorConnection: "Un problème est survenu. Veuillez réessayer.",
    footerText1: "Hey les curieux 👋 je suis ",
    footerName: "Emmanuel",
    footerText2: ", le product manager de namiCV. Suivez-moi sur ",
    footerLinkedin: "LinkedIn"
  },
  en: {
    headerCTA: "I want to be the first to test",
    badge: "🚀 Coming Soon!",
    titleLine1: "Save ",
    titleAccent: "time",
    titleLine2: "on every application",
    subtitle1: "Let namiCV generate, adapt and track your applications,",
    subtitle2: "with just ",
    subtitleItalic: "a copy-paste",
    feature1: "CV & Cover Letter Generation",
    feature2: "AI-Powered Personalization",
    feature3: "Maximum Time Savings",
    emailPlaceholder: "Your email",
    submitButton: "Sign up",
    submitting: "Signing up...",
    successMessage: "🎉 Great! You're on the waitlist.",
    errorPrefix: "Error: ",
    errorDefault: "Please check your email address.",
    errorConnection: "Something went wrong. Please try again.",
    footerText1: "Hey curious folks 👋 I'm ",
    footerName: "Emmanuel",
    footerText2: ", the product manager of namiCV. Follow me on ",
    footerLinkedin: "LinkedIn"
  },
  es: {
    headerCTA: "Quiero ser el primero en probar",
    badge: "🚀 ¡Próximamente!",
    titleLine1: "Ahorra ",
    titleAccent: "tiempo",
    titleLine2: "en cada solicitud",
    subtitle1: "Deja que namiCV genere, adapte y rastree tus solicitudes,",
    subtitle2: "con solo ",
    subtitleItalic: "un copiar-pegar",
    feature1: "Generación de CV y Carta",
    feature2: "Personalización con IA",
    feature3: "Máximo ahorro de tiempo",
    emailPlaceholder: "Tu email",
    submitButton: "Inscribirse",
    submitting: "Inscribiendo...",
    successMessage: "🎉 ¡Genial! Estás en la lista de espera.",
    errorPrefix: "Error: ",
    errorDefault: "Por favor verifica tu dirección de email.",
    errorConnection: "Algo salió mal. Por favor intenta de nuevo.",
    footerText1: "Hey curiosos 👋 soy ",
    footerName: "Emmanuel",
    footerText2: ", el product manager de namiCV. Sígueme en ",
    footerLinkedin: "LinkedIn"
  }
};

// Fonction d'envoi à Brevo via le backend
const subscribeToBrevo = async (email) => {
  console.log('🔵 Envoi de:', email);
  
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('🔵 Response status:', response.status);
    const data = await response.json();
    console.log('🔵 Response data:', data);
    
    return data;
  } catch (error) {
    console.error('🔴 Erreur fetch:', error);
    return { 
      ok: false, 
      data: { error: 'Impossible de se connecter au serveur.' } 
    };
  }
};

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState('fr');
  const emailFormRef = useRef(null);
  const emailInputRef = useRef(null);

  const t = translations[language];

  useEffect(() => {
    // Animation d'entrée au chargement
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleHeaderCTAClick = () => {
    // Scroll vers le formulaire avec animation
    emailFormRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Animation de pulse sur tout le formulaire
    emailFormRef.current?.classList.add('pulse-animation');
    setTimeout(() => {
      emailFormRef.current?.classList.remove('pulse-animation');
      emailInputRef.current?.focus();
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await subscribeToBrevo(email);

      if (response.ok) {
        setMessage(t.successMessage);
        setEmail('');
      } else {
        setMessage(`${t.errorPrefix}${response.data.error || t.errorDefault}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(t.errorConnection);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`app-container ${isVisible ? 'fade-in' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/nami_CV.png" alt="namiCV" style={{ height: '48px' }} />
        </div>
        
        <div className="header-right">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
            <option value="es">🇪🇸 ES</option>
          </select>
          
          <button className="header-cta" onClick={handleHeaderCTAClick}>
            {t.headerCTA}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <div className="badge">
          {t.badge}
        </div>

        <h1 className="title">
          <span className="title-line">{t.titleLine1}<span className="title-accent">{t.titleAccent}</span></span>
          <span className="title-line">{t.titleLine2}</span>
        </h1>

        <p className="subtitle">
          {t.subtitle1}<br />
          {t.subtitle2}<span className="italic">{t.subtitleItalic}</span>.
        </p>

        <div className="features">
          <div className="feature-item">
            <span className="checkmark">✓</span>
            <span>{t.feature1}</span>
          </div>
          <div className="feature-item">
            <span className="checkmark">✓</span>
            <span>{t.feature2}</span>
          </div>
          <div className="feature-item">
            <span className="checkmark">✓</span>
            <span>{t.feature3}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="email-form" ref={emailFormRef}>
          <input
            ref={emailInputRef}
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? t.submitting : t.submitButton}
          </button>
        </form>

        {message && (
          <p className={`message ${message.startsWith(t.errorPrefix) ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </main>

      {/* Footer Message */}
      <footer className="footer">
        <div className="footer-message">
          <span className="avatar">
            <img src="/pp.png" alt="Emmanuel" style={{ height: '32px', borderRadius: '50%' }} />
          </span>
          <span>
            {t.footerText1}<strong>{t.footerName}</strong>{t.footerText2}
            <a 
              href="https://www.linkedin.com/in/emmanueldanton/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              {t.footerLinkedin}
            </a>.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;