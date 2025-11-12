import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languageDetector';

// FIX: The translation JSON is now embedded directly in this file.
// This avoids potential issues with browsers or build tools
// not correctly handling JSON module imports, which was causing the app to crash.

const resources = {
  en: {
    translation: {
      "header": {
        "language": "Language"
      },
      "login": {
        "usernameLabel": "Username",
        "passwordLabel": "Password",
        "loginButton": "Login",
        "farmer": {
          "title": "Farmer Portal",
          "subtitle": "Access your farm dashboard"
        }
      },
      "dashboard": {
        "farmer": {
          "title": "Farmer Dashboard",
          "nav": {
            "dashboard": "Dashboard",
            "pestDetector": "Pest Detector",
            "soilAnalysis": "Soil Analysis",
            "marketplace": "Marketplace",
            "mandiLocator": "Mandi Locator",
            "animalHusbandry": "Animal Husbandry",
            "aiVet": "AI Vet Assistant",
            "vetConnect": "Vet Connect",
            "expertHelpline": "Expert Helpline",
            "cropMonitoring": "Crop Monitoring",
            "weather": "Weather",
            "schemes": "Govt. Schemes",
            "chatbot": "Chatbot",
            "profile": "My Profile",
            "portfolio": "My Portfolio"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "Fertilizer Calculator",
            "cropTypeLabel": "Crop Type",
            "farmAreaLabel": "Farm Area (in acres)",
            "targetYieldLabel": "Target Yield (quintals/acre)",
            "calculateButton": "Calculate Recommendations"
          }
        }
      }
    }
  },
  hi: {
    translation: {
      "header": {
        "language": "भाषा"
      },
      "login": {
        "usernameLabel": "उपयोगकर्ता नाम",
        "passwordLabel": "पासवर्ड",
        "loginButton": "लॉग इन करें",
        "farmer": {
          "title": "किसान पोर्टल",
          "subtitle": "अपने फार्म डैशबोर्ड तक पहुंचें"
        }
      },
      "dashboard": {
        "farmer": {
          "title": "किसान डैशबोर्ड",
          "nav": {
            "dashboard": "डैशबोर्ड",
            "pestDetector": "कीट डिटेक्टर",
            "soilAnalysis": "मृदा विश्लेषण",
            "marketplace": "बाज़ार",
            "mandiLocator": "मंडी लोकेटर",
            "animalHusbandry": "पशुपालन",
            "aiVet": "एआई पशु चिकित्सक सहायक",
            "vetConnect": "पशु चिकित्सक से जुड़ें",
            "expertHelpline": "विशेषज्ञ हेल्पलाइन",
            "cropMonitoring": "फसल की निगरानी",
            "weather": "मौसम",
            "schemes": "सरकारी योजनाएं",
            "chatbot": "चैटबॉट",
            "profile": "मेरी प्रोफाइल",
            "portfolio": "मेरा पोर्टफोलियो"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "उर्वरक कैलकुलेटर",
            "cropTypeLabel": "फसल का प्रकार",
            "farmAreaLabel": "खेत का क्षेत्रफल (एकड़ में)",
            "targetYieldLabel": "लक्षित उपज (क्विंटल/एकड़)",
            "calculateButton": "सिफारिशों की गणना करें"
          }
        }
      }
    }
  },
  es: {
    translation: {
      "header": {
        "language": "Idioma"
      },
      "login": {
        "usernameLabel": "Nombre de usuario",
        "passwordLabel": "Contraseña",
        "loginButton": "Iniciar sesión",
        "farmer": {
          "title": "Portal del Agricultor",
          "subtitle": "Acceda al panel de su granja"
        }
      },
      "dashboard": {
        "farmer": {
          "title": "Panel del Agricultor",
          "nav": {
            "dashboard": "Tablero",
            "pestDetector": "Detector de Plagas",
            "soilAnalysis": "Análisis de Suelo",
            "marketplace": "Mercado",
            "mandiLocator": "Localizador de Mandi",
            "animalHusbandry": "Ganadería",
            "aiVet": "Asistente Veterinario IA",
            "vetConnect": "Conectar con Veterinario",
            "expertHelpline": "Línea de Ayuda de Expertos",
            "cropMonitoring": "Monitoreo de Cultivos",
            "weather": "Clima",
            "schemes": "Esquemas Gubernamentales",
            "chatbot": "Chatbot",
            "profile": "Mi Perfil",
            "portfolio": "Mi Portafolio"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "Calculadora de Fertilizantes",
            "cropTypeLabel": "Tipo de Cultivo",
            "farmAreaLabel": "Área de la Granja (en acres)",
            "targetYieldLabel": "Rendimiento Objetivo (quintales/acre)",
            "calculateButton": "Calcular Recomendaciones"
          }
        }
      }
    }
  },
  kn: {
    translation: {
      "header": { "language": "ಭಾಷೆ" },
      "login": {
        "usernameLabel": "ಬಳಕೆದಾರಹೆಸರು", "passwordLabel": "ಪಾಸ್ವರ್ಡ್", "loginButton": "ಲಾಗಿನ್",
        "farmer": { "title": "ರೈತ ಪೋರ್ಟಲ್", "subtitle": "ನಿಮ್ಮ ಫಾರ್ಮ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅನ್ನು ಪ್ರವೇಶಿಸಿ" }
      },
      "dashboard": {
        "farmer": {
          "title": "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
          "nav": {
            "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "pestDetector": "ಕೀಟ ಪತ್ತೆಕಾರಕ", 
            "soilAnalysis": "ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ", 
            "marketplace": "ಮಾರುಕಟ್ಟೆ", "mandiLocator": "ಮಂಡಿ ಲೊಕೇಟರ್", "animalHusbandry": "ಪಶುಸಂಗೋಪನೆ", "aiVet": "AI ಪಶುವೈದ್ಯ ಸಹಾಯಕ", "vetConnect": "ಪಶುವೈದ್ಯರೊಂದಿಗೆ ಸಂಪರ್ಕ", "expertHelpline": "ತಜ್ಞರ ಸಹಾಯವಾಣಿ", "cropMonitoring": "ಬೆಳೆ ಮೇಲ್ವಿಚಾರಣೆ", "weather": "ಹವಾಮಾನ", "schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", "chatbot": "ಚಾಟ್‌ಬಾಟ್", "profile": "ನನ್ನ ಪ್ರೊಫೈಲ್", "portfolio": "ನನ್ನ ಪೋರ್ಟ್ಫೋಲಿಯೊ"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
            "cropTypeLabel": "ಬೆಳೆ ಪ್ರಕಾರ",
            "farmAreaLabel": "ಫಾರ್ಮ್ ಪ್ರದೇಶ (ಎಕರೆಯಲ್ಲಿ)",
            "targetYieldLabel": "ಗುರಿ ಇಳುವರಿ (ಕ್ವಿಂಟಾಲ್/ಎಕರೆ)",
            "calculateButton": "ಶಿಫಾರಸುಗಳನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ"
          }
        }
      }
    }
  },
  ta: {
    translation: {
      "header": { "language": "மொழி" },
      "login": {
        "usernameLabel": "பயனர் பெயர்", "passwordLabel": "கடவுச்சொல்", "loginButton": "உள்நுழை",
        "farmer": { "title": "விவசாயி போர்டல்", "subtitle": "உங்கள் பண்ணை டாஷ்போர்டை அணுகவும்" }
      },
      "dashboard": {
        "farmer": {
          "title": "விவசாயி டாஷ்போர்டு",
          "nav": {
            "dashboard": "டாஷ்போர்டு", "pestDetector": "பூச்சி கண்டறிதல்", 
            "soilAnalysis": "மண் பகுப்பாய்வு", 
            "marketplace": "சந்தை", "mandiLocator": "மண்டி லொக்கேட்டர்", "animalHusbandry": "கால்நடை வளர்ப்பு", "aiVet": "AI கால்நடை உதவியாளர்", "vetConnect": "கால்நடை மருத்துவருடன் இணையுங்கள்", "expertHelpline": "நிபுணர் உதவி எண்", "cropMonitoring": "பயிர் கண்காணிப்பு", "weather": "வானிலை", "schemes": "அரசாங்க திட்டங்கள்", "chatbot": "அரட்டைப்பெட்டி", "profile": "என் சுயவிவரம்", "portfolio": "என் போர்ட்ஃபோலியோ"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "உர கால்குலேட்டர்",
            "cropTypeLabel": "பயிர் வகை",
            "farmAreaLabel": "பண்ணை பகுதி (ஏக்கரில்)",
            "targetYieldLabel": "இலக்கு மகசூல் ( குவிண்டால்/ஏக்கர்)",
            "calculateButton": "பரிந்துரைகளைக் கணக்கிடுங்கள்"
          }
        }
      }
    }
  },
  te: {
    translation: {
      "header": { "language": "భాష" },
      "login": {
        "usernameLabel": "వినియోగదారు పేరు", "passwordLabel": "పాస్వర్డ్", "loginButton": "లాగిన్",
        "farmer": { "title": "రైతు పోర్టల్", "subtitle": "మీ వ్యవసాయ డాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి" }
      },
      "dashboard": {
        "farmer": {
          "title": "రైతు డాష్‌బోర్డ్",
          "nav": {
            "dashboard": "డాష్‌బోర్డ్", "pestDetector": "తెగులు గుర్తింపు", 
            "soilAnalysis": "నేల విశ్లేషణ", 
            "marketplace": "మార్కెట్", "mandiLocator": "మండి లొకేటర్", "animalHusbandry": "పశుసంరక్షణ", "aiVet": "ఏఐ వెట్ అసిస్టెంట్", "vetConnect": "వెట్‌తో కనెక్ట్ అవ్వండి", "expertHelpline": "నిపుణుల హెల్ప్‌లైన్", "cropMonitoring": "పంట పర్యవేక్షణ", "weather": "వాతావరణం", "schemes": "ప్రభుత్వ పథకాలు", "chatbot": "చాట్‌బాట్", "profile": "నా ప్రొఫైల్", "portfolio": "నా పోర్ట్‌ఫోలియో"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "ఎరువుల కాలిక్యులేటర్",
            "cropTypeLabel": "పంట రకం",
            "farmAreaLabel": "పొలం ప్రాంతం (ఎకరాలలో)",
            "targetYieldLabel": "లక్ష్య దిగుబడి (క్వింటాళ్లు/ఎకరా)",
            "calculateButton": "సిఫార్సులను లెక్కించండి"
          }
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;