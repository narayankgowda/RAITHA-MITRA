
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "header": { "language": "Language" },
      "login": {
        "usernameLabel": "Username", "passwordLabel": "Password", "loginButton": "Login",
        "farmer": { "title": "Farmer Portal", "subtitle": "Access your farm dashboard" }
      },
      "dashboard": {
        "farmer": {
          "title": "Farmer Dashboard",
          "nav": {
            "dashboard": "Dashboard", "pestDetector": "Pest Detector", "soilAnalysis": "Soil Analysis", "yieldPredictor": "Yield Predictor", "marketplace": "Marketplace", "animalHusbandry": "Animal Husbandry", "aiVet": "AI Vet Assistant", "vetConnect": "Vet Connect", "expertHelpline": "Expert Helpline", "cropMonitoring": "Crop Monitoring", "weather": "Weather", "schemes": "Govt. Schemes", "chatbot": "Chatbot", "profile": "My Profile", "about": "About", "livePrices": "Live Market Prices", "expenseTracker": "Expense Tracker", "cropRotation": "Crop Rotation", "resourceSharing": "Resource Sharing"
          },
          "home": {
            "greeting_morning": "Good Morning",
            "greeting_afternoon": "Good Afternoon",
            "greeting_evening": "Good Evening"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "Fertilizer Calculator", "cropTypeLabel": "Crop Type", "farmAreaLabel": "Farm Area (in acres)", "targetYieldLabel": "Target Yield (quintals/acre)", "calculateButton": "Calculate Recommendations"
          },
          "cropMonitoring": {
            "addTaskPlaceholder": "Add a new task..."
          },
          "keyMetrics": {
            "herd": "Active Herd", "crops": "Monitored Crops", "tasks": "Pending Tasks", "market": "Market Trend"
          },
          "taskOverview": {
            "title": "Task Overview"
          }
        }
      },
      "voiceAssistant": {
        "title": "Raitha Mitra Voice Assistant", "intro": "Hello! I'm Raitha Mitra. How can I help you? Tap the button below to speak.", "listening": "Listening...", "connecting": "Connecting...", "speaking": "Raitha Mitra is speaking..."
      },
      "about": {
        "title": "About Raitha Mitra",
        "missionTitle": "Our Mission",
        "missionText": "To empower farmers with cutting-edge AI technology, making sustainable and profitable agriculture accessible to everyone. We aim to bridge the gap between traditional farming wisdom and modern data-driven insights.",
        "offerTitle": "What We Offer",
        "offerPest": "AI Pest & Disease Detection",
        "offerPestDesc": "Instantly identify crop issues from a single photo.",
        "offerSoil": "Smart Soil Analysis",
        "offerSoilDesc": "Get detailed soil reports and fertilizer plans.",
        "offerMarket": "Integrated Marketplace",
        "offerMarketDesc": "Buy inputs and sell produce directly.",
        "offerHerd": "Herd Management",
        "offerHerdDesc": "Track health, milk, and breeding records.",
        "visionTitle": "Our Vision",
        "visionText": "We envision a future where every farmer, regardless of the size of their land, has the tools to make informed decisions, increase their yield, and contribute to a healthier planet."
      }
    }
  },
  hi: {
    translation: {
      "header": { "language": "भाषा" },
      "login": {
        "usernameLabel": "उपयोगकर्ता नाम", "passwordLabel": "पासवर्ड", "loginButton": "लॉग इन करें",
        "farmer": { "title": "किसान पोर्टल", "subtitle": "अपने फार्म डैशबोर्ड तक पहुंचें" }
      },
      "dashboard": {
        "farmer": {
          "title": "किसान डैशबोर्ड",
          "nav": {
            "dashboard": "डैशबोर्ड", "pestDetector": "कीट डिटेक्टर", "soilAnalysis": "मृदा विश्लेषण", "yieldPredictor": "उपज भविष्यवक्ता", "marketplace": "बाज़ार", "animalHusbandry": "पशुपालन", "aiVet": "एआई पशु चिकित्सक", "vetConnect": "पशु चिकित्सक से जुड़ें", "expertHelpline": "विशेषज्ञ हेल्पलाइन", "cropMonitoring": "फसल की निगरानी", "weather": "मौसम", "schemes": "सरकारी योजनाएं", "chatbot": "चैटबॉट", "profile": "मेरी प्रोफाइल", "about": "हमारे बारे में", "livePrices": "लाइव मंडी भाव", "expenseTracker": "व्यय ट्रैकर", "cropRotation": "फसल चक्र", "resourceSharing": "संसाधन साझा करना"
          },
           "home": {
            "greeting_morning": "सुप्रभात",
            "greeting_afternoon": "शुभ दोपहर",
            "greeting_evening": "शुभ संध्या"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "उर्वरक कैलकुलेटर", "cropTypeLabel": "फ़सल का प्रकार", "farmAreaLabel": "खेत का क्षेत्रफल (एकड़ में)", "targetYieldLabel": "लक्षित उपज (क्विंडल/एकड़)", "calculateButton": "सिफारिशों की गणना करें"
          },
          "cropMonitoring": {
            "addTaskPlaceholder": "एक नया कार्य जोड़ें..."
          },
          "keyMetrics": {
            "herd": "सक्रिय झुंड", "crops": "निगरानी वाली फसलें", "tasks": "लंबित कार्य", "market": "बाजार की प्रवृत्ति"
          },
          "taskOverview": {
            "title": "कार्य अवलोकन"
          }
        }
      },
      "voiceAssistant": {
        "title": "रैथा मित्र वॉयस असिस्टेंट", "intro": "नमस्ते! मैं रैथा मित्र हूं। मैं आपकी कैसे मदद कर सकता हूं? बोलने के लिए नीचे दिए गए बटन पर टैಪ करें।", "listening": "सुन रहा है...", "connecting": "कनेक्ट हो रहा है...", "speaking": "रैथा मित्र बोल रहा है..."
      },
      "about": {
        "title": "रैथा मित्र के बारे में",
        "missionTitle": "हमारा लक्ष्य",
        "missionText": "किसानों को अत्याधुनिक एआई तकनीक से सशक्त बनाना, ताकि टिकाऊ और लाभदायक कृषि सभी के लिए सुलभ हो सके। हमारा लक्ष्य पारंपरिक कृषि ज्ञान और आधुनिक डेटा-संचालित अंतर्दृष्टि के बीच की खाई को पाटना है।",
        "offerTitle": "हम क्या प्रदान करते हैं",
        "offerPest": "एआई कीट और रोग का पता लगाना",
        "offerPestDesc": "एक ही तस्वीर से फसल की समस्याओं को तुरंत पहचानें।",
        "offerSoil": "स्मार्ट मृदा विश्लेषण",
        "offerSoilDesc": "विस्तृत मिट्टी रिपोर्ट और उर्वरक योजनाएं प्राप्त करें।",
        "offerMarket": "एकीकृत बाज़ार",
        "offerMarketDesc": "इनपुट खरीदें और उपज सीधे बेचें।",
        "offerHerd": "झुंड प्रबंधन",
        "offerHerdDesc": "स्वास्थ्य, दूध और प्रजनन रिकॉर्ड ट्रैक करें।",
        "visionTitle": "हमारी दृष्टि",
        "visionText": "हम एक ऐसे भविष्य की कल्पना करते हैं जहां हर किसान, चाहे उसकी जमीन का आकार कुछ भी हो, के पास सूचित निर्णय लेने, अपनी उपज बढ़ाने और एक स्वस्थ ग्रह में योगदान करने के लिए उपकरण हों।"
      }
    }
  },
  mr: {
    translation: {
      "header": { "language": "भाषा" },
      "login": {
        "usernameLabel": "वापरकर्तानाव", "passwordLabel": "पासवर्ड", "loginButton": "लॉगिन करा",
        "farmer": { "title": "शेतकरी पोर्टल", "subtitle": "आपल्या फार्म डॅशबोर्डमध्ये प्रवेश करा" }
      },
      "dashboard": {
        "farmer": {
          "title": "शेतकरी डॅशबोर्ड",
          "nav": {
            "dashboard": "डॅशबोर्ड", "pestDetector": "कीटक शोधक", "soilAnalysis": "मृदा विश्लेषण", "yieldPredictor": "उत्पन्न अंदाज", "marketplace": "बाजारपेठ", "animalHusbandry": "पशुपालन", "aiVet": "एआय पशुवैद्य", "vetConnect": "डॉक्टरांशी संपर्क साधा", "expertHelpline": "तज्ञांची मदत", "cropMonitoring": "पीक देखरेख", "weather": "हवामान", "schemes": "सरकारी योजना", "chatbot": "चॅटबॉट", "profile": "माझी प्रोफाइल", "about": "आमच्याबद्दल", "livePrices": "बाजार भाव", "expenseTracker": "खर्च ट्रॅकर", "cropRotation": "पीक फिरकी", "resourceSharing": "संसाधन सामायिकरण"
          },
          "home": {
            "greeting_morning": "शुभ प्रभात",
            "greeting_afternoon": "शुभ दुपार",
            "greeting_evening": "शुभ संध्याकाळ"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "खत कॅल्क्युलेटर", "cropTypeLabel": "पिकाचा प्रकार", "farmAreaLabel": "शेती क्षेत्र (एकर)", "targetYieldLabel": "लक्ष्य उत्पन्न (क्विंटल/एकर)", "calculateButton": "शिफारसी मोजा"
          },
          "cropMonitoring": {
            "addTaskPlaceholder": "नवीन कार्य जोडा..."
          },
          "keyMetrics": {
            "herd": "सक्रिय कळप", "crops": "निगराणीखालील पिके", "tasks": "प्रलंबित कार्ये", "market": "बाजार कल"
          },
          "taskOverview": {
            "title": "कार्य आढावा"
          }
        }
      },
      "voiceAssistant": {
        "title": "रैथा मित्र व्हॉइस असिस्टंट", "intro": "नमस्कार! मी रैथा मित्र आहे. मी तुम्हाला कशी मदत करू शकतो? बोलण्यासाठी खालील बटण दाबा.", "listening": "ऐकत आहे...", "connecting": "जोडत आहे...", "speaking": "रैथा मित्र बोलत आहे..."
      },
      "about": {
        "title": "रैथा मित्र बद्दल",
        "missionTitle": "आमचे ध्येय",
        "missionText": "शेतकऱ्यांना अत्याधुनिक एआय तंत्रज्ञानाद्वारे सक्षम करणे, ज्यामुळे शाश्वत आणि फायदेशीर शेती सर्वांसाठी उपलब्ध होईल. पारंपारिक शेती ज्ञान आणि आधुनिक डेटा-आधारित माहिती यातील अंतर कमी करणे हे आमचे उद्दिष्ट आहे.",
        "offerTitle": "आम्ही काय ऑफर करतो",
        "offerPest": "एआई कीटक आणि रोग निदान",
        "offerPestDesc": "एका फोटोवरून पिकांच्या समस्या त्वरित ओळखा.",
        "offerSoil": "स्मार्ट मृदा विश्लेषण",
        "offerSoilDesc": "तपशीलवार माती अहवाल आणि खत योजना मिळवा.",
        "offerMarket": "एकात्मिक बाजारपेठ",
        "offerMarketDesc": "शेती निविष्ठा खरेदी करा आणि थेट उत्पादन विका.",
        "offerHerd": "पशुधन व्यवस्थापन",
        "offerHerdDesc": "आरोग्य, दूध आणि प्रजनन नोंदीचा मागोवा घ्या.",
        "visionTitle": "आमची दृष्टी",
        "visionText": "आम्ही अशा भविष्याची कल्पना करतो जिथे प्रत्येक शेतकऱ्याकडे, त्यांच्या जमिनीचा आकार काहीही असो, माहितीपूर्ण निर्णय घेण्याची, त्यांचे उत्पन्न वाढवण्याची आणि निरोगी ग्रहासाठी योगदान देण्याची साधने असतील."
      }
    }
  },
  kn: {
    translation: {
      "header": { "language": "ಭಾಷೆ" },
      "login": {
        "usernameLabel": "ಬಳಕೆದಾರಹೆಸರು", "passwordLabel": "ಪಾಸ್ವರ್ಡ್", "loginButton": "ಲಾಗಿನ್ ಮಾಡಿ",
        "farmer": { "title": "ರೈತ ಪೋರ್ಟಲ್", "subtitle": "ನಿಮ್ಮ ಫಾರ್ಮ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅನ್ನು ಪ್ರವೇಶಿಸಿ" }
      },
      "dashboard": {
        "farmer": {
          "title": "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
          "nav": {
            "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "pestDetector": "ಕೀಟ ಪತ್ತೆಕಾರಕ", "soilAnalysis": "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ", "yieldPredictor": "ಇಳುವರಿ ಮುನ್ಸೂಚಕ", "marketplace": "ಮಾರುಕಟ್ಟೆ", "animalHusbandry": "ಪಶುಸಂಗೋಪನೆ", "aiVet": "AI ಪಶುವೈದ್ಯ ಸಹಾಯಕ", "vetConnect": "ಪಶುವೈದ್ಯರೊಂದಿಗೆ ಸಂಪರ್ಕ", "expertHelpline": "ತಜ್ಞರ ಸಹಾಯವಾಣಿ", "cropMonitoring": "ಬೆಳೆ ಮೇಲ್ವಿಚಾರಣೆ", "weather": "ಹವಾಮಾನ", "schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", "chatbot": "ಚಾಟ್‌ಬಾಟ್", "profile": "ನನ್ನ ಪ್ರೊಫೈಲ್", "about": "ನಮ್ಮ ಬಗ್ಗೆ", "livePrices": "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು", "expenseTracker": "ವೆಚ್ಚ ಟ್ರ್ಯಾಕರ್", "cropRotation": "ಬೆಳೆ ಪರಿಭ್ರಮಣೆ", "resourceSharing": "ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ"
          },
          "home": {
            "greeting_morning": "ಶುಭೋದಯ",
            "greeting_afternoon": "ಶುಭ ಮಧ್ಯಾಹ್ನ",
            "greeting_evening": "ಶುಭ ಸಂಜೆ"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "ಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್", "cropTypeLabel": "ಬೆಳೆ ಪ್ರಕಾರ", "farmAreaLabel": "ಕೃಷಿ ಪ್ರದೇಶ (ಎಕರೆಗಳಲ್ಲಿ)", "targetYieldLabel": "ಉದ್ದೇಶಿತ ಇಳುವರಿ (ಕ್ವಿಂಟಲ್/ಎಕರೆ)", "calculateButton": "ಶಿಫಾರಸುಗಳನ್ನು ಲೆಕ್ಕಹಾಕಿ"
          },
          "cropMonitoring": { "addTaskPlaceholder": "ಹೊಸ ಕಾರ್ಯವನ್ನು ಸೇರಿಸಿ..." },
          "keyMetrics": { "herd": "ಸಕ್ರಿಯ ಹಿಂಡು", "crops": "ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿದ ಬೆಳೆಗಳು", "tasks": "ಬಾಕಿ ಇರುವ ಕಾರ್ಯಗಳು", "market": "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ" },
          "taskOverview": { "title": "ಕಾರ್ಯ ಅವಲೋಕನ" }
        }
      },
      "voiceAssistant": {
        "title": "ರೈತ ಮಿತ್ರ ಧ್ವನಿ ಸಹಾಯಕ", "intro": "ನಮಸ್ಕಾರ! ನಾನು ರೈತ ಮಿತ್ರ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ? ಮಾತನಾಡಲು ಕೆಳಗಿನ ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ.", "listening": "ಕೇಳುತ್ತಿದೆ...", "connecting": "ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...", "speaking": "ರೈತ ಮಿತ್ರ ಮಾತನಾಡುತ್ತಿದೆ..."
      },
      "about": {
        "title": "ರೈತ ಮಿತ್ರ ಬಗ್ಗೆ",
        "missionTitle": "ನಮ್ಮ ಧ್ಯೇಯ",
        "missionText": "ರೈತರಿಗೆ ಅತ್ಯಾಧುನಿಕ AI ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ಅಧಿಕಾರ ನೀಡುವುದು, ಸುಸ್ಥಿರ ಮತ್ತು ಲಾಭದಾಯಕ ಕೃಷಿಯನ್ನು ಎಲ್ಲರಿಗೂ ಪ್ರವೇಶಿಸುವಂತೆ ಮಾಡುವುದು. ಸಾಂಪ್ರದಾಯಿಕ ಕೃಷಿ ಜ್ಞಾನ ಮತ್ತು ಆಧುನಿಕ ಡೇಟಾ-ಚಾಲಿತ ಒಳನೋಟಗಳ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡುವ ಗುರಿಯನ್ನು ನಾವು ಹೊಂದಿದ್ದೇವೆ.",
        "offerTitle": "ನಾವು ಏನು ನೀಡುತ್ತೇವೆ",
        "offerPest": "AI ಕೀಟ ಮತ್ತು ರೋಗ ಪತ್ತೆ",
        "offerPestDesc": "ಒಂದೇ ಫೋಟೋದಿಂದ ಬೆಳೆ ಸಮಸ್ಯೆಗಳನ್ನು ತಕ್ಷಣವೇ ಗುರುತಿಸಿ.",
        "offerSoil": "ಸ್ಮಾರ್ಟ್ ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ",
        "offerSoilDesc": "ವಿವರವಾದ ಮಣ್ಣಿನ ವರದಿಗಳು ಮತ್ತು ರಸಗೊಬ್ಬರ ಯೋಜನೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
        "offerMarket": "ಸಮಗ್ರ ಮಾರುಕಟ್ಟೆ",
        "offerMarketDesc": "ಕೃಷಿ ಪರಿಕರಗಳನ್ನು ಖರೀದಿಸಿ ಮತ್ತು ಉತ್ಪನ್ನಗಳನ್ನು ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಿ.",
        "offerHerd": "ಹಿಂಡು ನಿರ್ವಹಣೆ",
        "offerHerdDesc": "ಆರೋಗ್ಯ, ಹಾಲು ಮತ್ತು ತಳಿ ದಾಖಲೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
        "visionTitle": "ನಮ್ಮ ದೃಷ್ಟಿ",
        "visionText": "ಪ್ರತಿಯೊಬ್ಬ ರೈತ, ಅವರ ಭೂಮಿಯ ಗಾತ್ರವನ್ನು ಲೆಕ್ಕಿಸದೆ, ತಿಳುವಳಿಕೆಯುಳ್ಳ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು, ತಮ್ಮ ಇಳುವರಿಯನ್ನು ಹೆಚ್ಚಿಸಲು ಮತ್ತು ಆರೋಗ್ಯಕರ ಗ್ರಹಕ್ಕೆ ಕೊಡುಗೆ ನೀಡುವ ಸಾಧನಗಳನ್ನು ಹೊಂದಿರುವ ಭವಿಷ್ಯವನ್ನು ನಾವು ಕಲ್ಪಿಸುತ್ತೇವೆ."
      }
    }
  },
  ta: {
    translation: {
      "header": { "language": "மொழி" },
      "login": {
        "usernameLabel": "பயனர்பெயர்", "passwordLabel": "கடவுச்சொல்", "loginButton": "உள்நுழை",
        "farmer": { "title": "விவசாயி போர்டல்", "subtitle": "உங்கள் பண்ணை டாஷ்போர்டை அணுகவும்" }
      },
      "dashboard": {
        "farmer": {
          "title": "விவசாயி டாஷ்போர்டு",
          "nav": {
            "dashboard": "டாஷ்போர்டு", "pestDetector": "பூச்சி கண்டறிதல்", "soilAnalysis": "மண் பகுப்பாய்வு", "yieldPredictor": "மகசூல் முன்கணிப்பு", "marketplace": "சந்தை", "animalHusbandry": "கால்நடை வளர்ப்பு", "aiVet": "AI கால்நடை உதவியாளர்", "vetConnect": "கால்நடை மருத்துவருடன் இணையுங்கள்", "expertHelpline": "நிபுணர் உதவி எண்", "cropMonitoring": "பயிர் கண்காணிப்பு", "weather": "வானிலை", "schemes": "அரசு திட்டங்கள்", "chatbot": "சாட்பாட்", "profile": "எனது சுயவிவரம்", "about": "பற்றி", "livePrices": "நேரடி சந்தை விலைகள்", "expenseTracker": "செலவு கண்காணிப்பு", "cropRotation": "பயிர் சுழற்சி", "resourceSharing": "வளப் பகிர்வு"
          },
           "home": {
            "greeting_morning": "காலை வணக்கம்",
            "greeting_afternoon": "மதிய வணக்கம்",
            "greeting_evening": "மாலை வணக்கம்"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "உர கால்குலேட்டர்", "cropTypeLabel": "பயிர் வகை", "farmAreaLabel": "பண்ணை பகுதி (ஏக்கரில்)", "targetYieldLabel": "இலக்கு மகசூல் (குவிண்டால்/ஏக்கர்)", "calculateButton": "பரிந்துரைகளைக் கணக்கிடுங்கள்"
          },
          "cropMonitoring": { "addTaskPlaceholder": "புதிய பணியைச் சேர்க்கவும்..." },
          "keyMetrics": { "herd": "செயலில் உள்ள மந்தை", "crops": "கண்காணிக்கப்படும் பயிர்கள்", "tasks": "நிலுவையில் உள்ள பணிகள்", "market": "சந்தை போக்கு" },
          "taskOverview": { "title": "பணி கண்ணோட்டம்" }
        }
      },
      "voiceAssistant": {
        "title": "ரைதா மித்ரா குரல் உதவியாளர்", "intro": "வணக்கம்! நான் ரைதா மித்ரா. நான் உங்களுக்கு எப்படி உதவ முடியும்? பேச கீழே உள்ள பொத்தானைத் தட்டவும்.", "listening": "கேட்டுக்கொண்டிருக்கிறது...", "connecting": "இணைக்கிறது...", "speaking": "ரைதா மித்ரா பேசுகிறது..."
      },
      "about": {
        "title": "ரைதா மித்ரா பற்றி",
        "missionTitle": "எங்கள் நோக்கம்",
        "missionText": "விவசாயிகளுக்கு அதிநவீன AI தொழில்நுட்பத்துடன் அதிகாரம் அளித்தல், நிலையான மற்றும் லாபகரமான விவசாயத்தை அனைவருக்கும் அணுகும்படி செய்தல். பாரம்பரிய விவசாய ஞானத்திற்கும் நவீன தரவு சார்ந்த நுண்ணறிவுகளுக்கும் இடையிலான இடைவெளியைக் குறைப்பதை நாங்கள் நோக்கமாகக் கொண்டுள்ளோம்.",
        "offerTitle": "நாங்கள் என்ன வழங்குகிறோம்",
        "offerPest": "AI பூச்சி மற்றும் நோய் கண்டறிதல்",
        "offerPestDesc": "ஒரே புகைப்படத்திலிருந்து பயிர் சிக்கல்களை உடனடியாக அடையாளம் காணவும்.",
        "offerSoil": "ஸ்மார்ட் மண் பகுப்பாய்வு",
        "offerSoilDesc": "விரிவான மண் அறிக்கைகள் மற்றும் உரத் திட்டங்களைப் பெறுங்கள்.",
        "offerMarket": "ஒருங்கிணைந்த சந்தை",
        "offerMarketDesc": "உள்ளீடுகளை வாங்கவும், விளைபொருட்களை நேரடியாக விற்கவும்.",
        "offerHerd": "மந்தை மேலாண்மை",
        "offerHerdDesc": "உடல்நலம், பால் மற்றும் இனப்பெருக்க பதிவுகளைக் கண்காணிப்பவும்.",
        "visionTitle": "எங்கள் பார்வை",
        "visionText": "ஒவ்வொரு விவசாயியும், அவர்களின் நிலத்தின் அளவைப் பொருட்படுத்தாமல், தகவலறிந்த முடிவுகளை எடுக்கவும், தங்கள் விளைச்சலை அதிகரிக்கவும், ஆரோக்கியமான கிரகத்திற்கு பங்களிக்கவும் கருவிகளைக் கொண்ட ஒரு எதிர்காலத்தை நாங்கள் கற்பனை செய்கிறோம்."
      }
    }
  },
  te: {
    translation: {
      "header": { "language": "భాష" },
      "login": {
        "usernameLabel": "వినియోగదారు పేరు", "passwordLabel": "పాస్వర్డ్", "loginButton": "లాగిన్ చేయండి",
        "farmer": { "title": "రైతు పోర్టల్", "subtitle": "మీ వ్యవసాయ డ్యాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి" }
      },
      "dashboard": {
        "farmer": {
          "title": "రైతు డ్యాష్‌బోర్డ్",
          "nav": {
            "dashboard": "డాష్‌బోర్డ్", "pestDetector": "పురుగుల గుర్తింపు", "soilAnalysis": "నేల విశ్లేషణ", "yieldPredictor": "దిగుబడి సూచన", "marketplace": "మార్కెట్‌ప్లేస్", "animalHusbandry": "పశుసంరక్షణ", "aiVet": "AI పశువైద్య సహాయకుడు", "vetConnect": "పశువైద్యునితో కనెక్ట్ అవ్వండి", "expertHelpline": "నిపుణుల హెల్ప్‌లైన్", "cropMonitoring": "పంట పర్యవేక్షణ", "weather": "వాతావರಣం", "schemes": "ప్రభుత్వ పథకాలు", "chatbot": "చాట్‌బాట్", "profile": "నా ప్రొఫైల్", "about": "గురించి", "livePrices": "ప్రత్యక్ష మార్కెట్ ధరలు", "expenseTracker": "ఖర్చుల ట్రాకర్", "cropRotation": "పంట మార్పిడి", "resourceSharing": "వనరుల భాగస్వామ్యం"
          },
          "home": {
            "greeting_morning": "శుభోదయం",
            "greeting_afternoon": "శుభ మధ్యాహ్னம்",
            "greeting_evening": "శుభ సాయంత్రం"
          },
          "soilAnalysisPage": {
            "calculatorTitle": "ఎరువుల కాలిక్యులేటర్", "cropTypeLabel": "పంట రకం", "farmAreaLabel": "పొలం ప్రాంతం (ఎకరాలలో)", "targetYieldLabel": "లక్ష్య దిగుబడి (క్వింటాళ్లు/ఎకరా)", "calculateButton": "సిఫార్సులను లెక్కించండి"
          },
          "cropMonitoring": { "addTaskPlaceholder": "క్రొತ್ತ పనిని జోడించండి..." },
          "keyMetrics": { "herd": "క్రియాశీల మంద", "crops": "పర్యవేక్షించబడిన పంటలు", "tasks": "పెండింగ్ పనులు", "market": "మార్కెట్ ధోరణి" },
          "taskOverview": { "title": "పని επισκόπηση" }
        }
      },
      "voiceAssistant": {
        "title": "రైత మిత్ర వాయిస్ అసిస్టెంట్", "intro": "నమస్కారం! నేను రైత మిత్ర. నేను మీకు ఎలా సహాయపడగలను? మాట్లాడటానికి క్రింది బటన్‌ను నొక్కండి.", "listening": "వింటున్నది...", "connecting": "కనెక్ట్ అవుతోంది...", "speaking": "రైత మిత్ర మాట్లాడుతోంది..."
      },
      "about": {
        "title": "రైత మిత్ర గురించి",
        "missionTitle": "మా లక్ష్యం",
        "missionText": "రైతులకు అత్యాధునిక AI సాంకేతికతతో సాధికారత కల్పించడం, స్థిరమైన మరియు లాభదాయకమైన వ్యవసాయాన్ని అందరికీ అందుబాటులోకి తీసుకురావడం. సాంప్రదాయ వ్యవసాయ జ్ఞానంและ ఆధునిక డేటా-ఆధారిత అంతర్దృష్టుల మధ్య అంతరాన్ని తగ్గించాలని మేము లక్ష్యంగా పెట్టుకున్నాము.",
        "offerTitle": "మేము ఏమి అందిస్తాము",
        "offerPest": "AI పురుగు & వ్యాధి గుర్తింపు",
        "offerPestDesc": "ఒకే ఫోటో నుండి పంట సమస్యలను తక్షణమే గుర్తించండి.",
        "offerSoil": "స్మార్ట్ నేల విశ్లేషణ",
        "offerSoilDesc": "వివరణాత్మక నేల నివేదికలు మరియు ఎరువుల ప్రణాళికలను పొందండి.",
        "offerMarket": "ఇంటిగ్రేటెడ్ మార్కెట్‌ప్లేస్",
        "offerMarketDesc": "ఇన్‌పుట్‌లను కొనండి మరియు ఉత్పత్తులను నేరుగా అమ్మండి.",
        "offerHerd": "మందల నిర్వహణ",
        "offerHerdDesc": "ఆరోగ్యం, పాలు మరియు సంతానోత్పత్తి రికార్డులను ట్రాక్ చేయండి.",
        "visionTitle": "మా దృష్టి",
        "visionText": "ప్రతి రైతు, వారి భూమి పరిమాణంతో సంబంధం లేకుండా, సమాచారంతో కూడిన నిర్ణయాలు తీసుకోవడానికి, వారి దిగుబడిని పెంచడానికి మరియు ఆరోగ్యకరమైన గ్రహానికి దోహదపడటానికి సాధనాలను కలిగి ఉన్న భవిష్యత్తును మేము ఊహించాము."
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
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
  });

export default i18n;
