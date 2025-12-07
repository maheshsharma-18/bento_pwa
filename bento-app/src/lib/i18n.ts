import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations based on PDF requirements
const resources = {
  en: {
    translation: {
      welcome: {
        slide1_title: "Safe Curation",
        slide1_desc: "Only good content for your little ones.",
        slide2_title: "Routine Management",
        slide2_desc: "Peace of mind for parents with scheduled viewing.",
        slide3_title: "100% Transparent",
        slide3_desc: "No ads. We use clean YouTube embeds.",
        btn_start: "Get Started"
      },
      auth: {
        welcome_back: "Welcome to Bento",
        login_google: "Continue with Google",
        login_email: "Continue with Email",
        visitor: "Visitor Mode",
        terms: "I agree to the Terms of Service & Privacy Policy",
        terms_error: "You must accept the terms to continue."
      }
    }
  },
  pt: {
    translation: {
      welcome: {
        slide1_title: "Curadoria Segura",
        slide1_desc: "Apenas conteúdo de qualidade para os pequenos.",
        slide2_title: "Gestão de Rotina",
        slide2_desc: "Tranquilidade para os pais com horários programados.",
        slide3_title: "100% Transparente",
        slide3_desc: "Sem anúncios. Usamos vídeos limpos do YouTube.",
        btn_start: "Entrar no Bento"
      },
      auth: {
        welcome_back: "Bem-vindo ao Bento",
        login_google: "Continuar com Google",
        login_email: "Entrar com Email",
        visitor: "Modo Visitante",
        terms: "Concordo com os Termos de Uso e Política de Privacidade",
        terms_error: "Você precisa aceitar os termos para continuar."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt", // Default language per PDF
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
