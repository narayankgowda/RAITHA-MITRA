
import { GoogleGenAI, Part, Type, Modality } from "@google/genai";
import { WeatherData } from "../data/weatherData";

// Use a singleton pattern to lazy-initialize the AI client.
let aiInstance: GoogleGenAI | null = null;
const getAi = (): GoogleGenAI => {
    if (!aiInstance) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API Key is missing. Please ensure API_KEY is set in your .env file and restart your dev server.");
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

const ANALYSIS_ERROR_MESSAGE = "Analysis failed. Please try again.";

// Helper to clean JSON strings from the model
function cleanJson(text: string): string {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

// Centralized error handler
const handleApiError = (error: unknown, context: string): Error => {
    console.error(`Gemini API Error (${context}):`, error);
    let message = 'An unknown error occurred. Please try again later.';

    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            message = 'Invalid API key.';
        } else if (error.message.match(/quota|rate limit/i)) {
            message = 'System busy. Try again in a moment.';
        } else if (error.message.includes('timed out')) {
            message = 'Request timed out. Check connection.';
        } else if (error.message === ANALYSIS_ERROR_MESSAGE) {
            message = error.message;
        } else if (error.message.includes('JSON')) {
            message = 'Failed to process AI response. Please try again.';
        } else {
            message = `Service error: ${error.message}`;
        }
    }
    return new Error(message);
};

// Generic API call wrapper
async function makeApiCall(
    prompt: (string | Part)[], 
    context: string, 
    modelName = 'gemini-3-flash-preview'
): Promise<string> {
    try {
        const ai = getAi();
        const parts: Part[] = prompt.map(p => (typeof p === 'string' ? { text: p } : p));
        
        const response = await ai.models.generateContent({
            model: modelName,
            contents: { parts: parts },
        });
        return response.text || "No response.";
    } catch (error) {
        throw handleApiError(error, context);
    }
}

export const analyzeCropImage = async (
    images: { base64: string; mimeType: string }[], 
    location?: string
): Promise<{ text: string; confidence: string }> => {
    try {
        const ai = getAi();
        
        const imageParts: Part[] = images.map(img => ({
            inlineData: { data: img.base64, mimeType: img.mimeType }
        }));

        const initialPromptText = `As an expert agronomist, analyze the crop image. Location: ${location || 'Unknown'}.
        
        Safety:
        1. If blurry/not a plant, say "Unclear image".
        2. Be conservative with diagnosis.
        3. Include chemical safety warnings.

        Output JSON:
        {
          "confidence": "High/Medium/Low",
          "diagnosis": "Name of issue or 'Healthy'",
          "reportMarkdown": "Brief report:\n- **Diagnosis**: Name\n- **Symptoms**: Key signs\n- **Treatment**: Organic & Chemical steps.\n- **Disclaimer**: Consult expert."
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { text: initialPromptText },
                    ...imageParts
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        confidence: { type: Type.STRING },
                        diagnosis: { type: Type.STRING },
                        reportMarkdown: { type: Type.STRING }
                    }
                }
            },
        });

        const jsonText = cleanJson(response.text || "{}");
        const result = JSON.parse(jsonText);

        return { 
            text: result.reportMarkdown || "Could not identify issue.", 
            confidence: result.confidence || "Low"
        };

    } catch (error) {
        throw handleApiError(error, 'analyze crop images');
    }
};

export interface SoilAnalysisResult {
    markdownReport: string;
    suggestedCrops: string[];
    extractedValues?: {
        ph?: string;
        ec?: string;
        oc?: string;
        n?: string;
        p?: string;
        k?: string;
        zn?: string;
        fe?: string;
    };
}

export const analyzeSoilData = async (
    soilData: { [key: string]: string },
    contextData?: { soilType: string; currentCrop: string; prevCrop: string; irrigation: string }
): Promise<SoilAnalysisResult> => {
    const dataString = Object.entries(soilData).map(([k, v]) => `${k}:${v}`).join(', ');
    const contextString = contextData ? `Type:${contextData.soilType}, Irrig:${contextData.irrigation}` : '';

    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze soil data: ${dataString}. Context: ${contextString}.
            Return JSON:
            {
                "markdownReport": "Concise analysis & fertilizer plan. NOTE: Add disclaimer that this is AI-generated advice.",
                "suggestedCrops": ["Crop1", "Crop2", "Crop3"]
            }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        markdownReport: { type: Type.STRING },
                        suggestedCrops: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        
        const jsonText = cleanJson(response.text || "{}");
        return JSON.parse(jsonText) as SoilAnalysisResult;
    } catch (error) {
        throw handleApiError(error, "analyze soil data");
    }
};

export const analyzeSoilReportImage = async (base64: string, mimeType: string): Promise<SoilAnalysisResult> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { text: "Extract soil values (pH, N, P, K, etc). Provide brief analysis & top 3 crops. JSON Output. If text is unreadable, set values to empty strings." },
                    { inlineData: { data: base64, mimeType: mimeType } },
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        markdownReport: { type: Type.STRING },
                        suggestedCrops: { type: Type.ARRAY, items: { type: Type.STRING } },
                        extractedValues: {
                            type: Type.OBJECT,
                            properties: {
                                ph: { type: Type.STRING },
                                ec: { type: Type.STRING },
                                oc: { type: Type.STRING },
                                n: { type: Type.STRING },
                                p: { type: Type.STRING },
                                k: { type: Type.STRING },
                                zn: { type: Type.STRING },
                                fe: { type: Type.STRING },
                            }
                        }
                    }
                }
            }
        });

        const jsonText = cleanJson(response.text || "{}");
        return JSON.parse(jsonText) as SoilAnalysisResult;
    } catch (error) {
        throw handleApiError(error, "analyze soil report image");
    }
};

export const getFertilizerRecommendation = async (soilReport: string, crop: string, area: number, yieldTarget: number): Promise<string> => {
    const prompt = [
        `Act as agronomist. Plan fertilizer for ${area} acres of ${crop} (Target: ${yieldTarget} q/acre).
        Based on soil info: "${soilReport.substring(0, 200)}...".
        Output: Concise Markdown plan. 1. NPK Calculation. 2. Schedule (Basal/Top). 3. Organic options. 
        Safety Warning: Use gloves/masks when handling chemicals.`
    ];
    return makeApiCall(prompt, 'get fertilizer recommendation', 'gemini-3-flash-preview');
};

export const generateCropReport = async (cropName: string, stageName: string, tasks: {text: string, priority: string}[], variety?: string): Promise<string> => {
    const prompt = [
        `Report for ${cropName} (${stageName}). Tasks: ${tasks.map(t => t.text).join(', ')}.
        Provide concise Markdown: 1. Task tips. 2. Risks. 3. Quick expert tip.`
    ];
    return makeApiCall(prompt, 'generate crop report', 'gemini-3-flash-preview');
};

export const getChatbotResponse = async (history: {sender: 'user' | 'bot', text: string}[], newMessage: string, context?: { weather?: WeatherData | null }): Promise<string> => {
    const roleMapping = { user: 'user', bot: 'model' } as const;
    const recentHistory = history.slice(-10);
    const apiHistory = recentHistory.map(msg => ({
        role: roleMapping[msg.sender],
        parts: [{ text: msg.text }]
    }));

    let contextString = '';
    if (context?.weather) {
        const w = context.weather;
        contextString += `Loc: ${w.city}, ${w.currentTemp}C, ${w.condition}.`;
    }

     try {
        const ai = getAi();
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            history: apiHistory,
            config: {
                systemInstruction: `You are Raitha Mitra, an agricultural assistant. Be concise, helpful, and direct. 
                If you are unsure about a pest diagnosis or chemical recommendation, tell the user to consult a local expert.
                ${contextString}`,
            }
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text || "Sorry, try again.";
    } catch (error) {
        throw handleApiError(error, 'get chatbot response');
    }
};

export const getCommunitySummary = async (postTitle: string, postContent: string, comments: string[]): Promise<string> => {
    const prompt = [
        `As Raitha Mitra Community Moderator, summarize the key takeaways from this discussion:
        Title: ${postTitle}
        Post: ${postContent}
        Top Comments: ${comments.join(' | ')}
        
        Output Markdown:
        **Problem identified:** (1 sentence)
        **Peer consensus:** (The most recommended solution)
        **Action item:** (One clear next step)
        Keep it under 100 words.`
    ];
    return makeApiCall(prompt, 'get community summary', 'gemini-3-flash-preview');
};

export const getAcademyTutorResponse = async (videoTitle: string, question: string): Promise<string> => {
    const prompt = [
        `You are the Agri-Academy AI Tutor. A farmer just watched a video about "${videoTitle}". 
        They asked: "${question}". 
        Provide a helpful, practical answer that relates the video concepts to a real-world farm scenario. 
        Be encouraging and keep it concise.`
    ];
    return makeApiCall(prompt, 'academy tutor response', 'gemini-3-flash-preview');
};

export const getVetAnalysis = async (
    base64: string, 
    mimeType: string, 
    query: string,
    vitals?: { species?: string; age?: string; weight?: string; temperature?: string }
): Promise<string> => {
    const prompt = [
        { text: `Vet Assistant. Analyze image & symptoms: "${query}". Vitals: ${JSON.stringify(vitals)}.
        Output Markdown:
        **[URGENCY LEVEL]**
        **Diagnosis:** Top 2 possibilities (State 'Uncertain' if image is unclear).
        **Treatment:** Immediate steps (Generic names).
        **Disclaimer:** This is AI advice. Consult a vet for confirmation.` },
        {
            inlineData: {
                data: base64,
                mimeType: mimeType,
            },
        },
    ];
    
    return makeApiCall(prompt, 'get vet analysis', 'gemini-3-flash-preview');
};

export const getWeatherForecast = async (latitude: number, longitude: number): Promise<WeatherData> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `7-day weather forecast for Lat:${latitude}, Lon:${longitude}. JSON format. Icons: clear-day, cloudy, rain, etc.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        city: { type: Type.STRING },
                        currentTemp: { type: Type.NUMBER },
                        condition: { type: Type.STRING },
                        feelsLike: { type: Type.NUMBER },
                        humidity: { type: Type.NUMBER },
                        windSpeed: { type: Type.NUMBER },
                        uvIndex: { type: Type.NUMBER },
                        hourly: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    time: { type: Type.STRING },
                                    temp: { type: Type.NUMBER },
                                    condition: { type: Type.STRING },
                                    icon: { type: Type.STRING }
                                }
                            }
                        },
                        daily: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING },
                                    high: { type: Type.NUMBER },
                                    low: { type: Type.NUMBER },
                                    condition: { type: Type.STRING },
                                    icon: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const jsonText = cleanJson(response.text || "{}");
        const weatherData = JSON.parse(jsonText) as WeatherData;
        
        if (weatherData.hourly && weatherData.hourly.length > 0 && weatherData.hourly[0].time.toLowerCase() !== 'now') {
            weatherData.hourly.unshift({
                time: 'Now',
                temp: weatherData.currentTemp,
                condition: weatherData.condition,
                icon: weatherData.daily?.[0]?.icon || 'clear-day'
            });
        }
        return weatherData;

    } catch (error) {
        throw handleApiError(error, "fetch weather forecast");
    }
};

export interface AgriAdvisory {
    title: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
}

export const generateWeatherAlerts = async (weatherData: WeatherData): Promise<AgriAdvisory[]> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: `Agri-weather alerts for ${weatherData.currentTemp}C, ${weatherData.condition}. 
            Output JSON array of 2 advisories: {title, severity: 'critical'|'warning'|'info', description}.`,
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            severity: { type: Type.STRING, enum: ['critical', 'warning', 'info'] },
                            description: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const jsonText = cleanJson(response.text || "[]");
        return JSON.parse(jsonText);
    } catch (error) {
        return [{ title: "General Advice", severity: "info", description: "Monitor local conditions." }];
    }
};

export interface RotationCrop {
    cropName: string;
    season: string; // Kharif, Rabi, Zaid
    reason: string; // Why this crop was chosen (e.g., Nitrogen fixation)
    duration: string; // e.g., "120 days"
    benefit: string; // Soil benefit
}

export interface RotationPlan {
    planName: string;
    crops: RotationCrop[];
    soilImprovementSummary: string;
}

export const generateCropRotationPlan = async (details: { currentCrop: string; farmSize: string; soilType: string; season: string }): Promise<RotationPlan> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a 3-year crop rotation sequence (approx 5-6 crops total) starting AFTER ${details.currentCrop} in ${details.season} season for ${details.soilType} soil.
            Focus on soil health, nitrogen fixation, and pest cycle breaking. 
            Keep descriptions extremely brief to avoid long output.
            Return strictly JSON.`,
            config: {
                responseMimeType: 'application/json',
                maxOutputTokens: 2000,
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planName: { type: Type.STRING },
                        crops: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    cropName: { type: Type.STRING },
                                    season: { type: Type.STRING },
                                    reason: { type: Type.STRING },
                                    duration: { type: Type.STRING },
                                    benefit: { type: Type.STRING }
                                }
                            }
                        },
                        soilImprovementSummary: { type: Type.STRING }
                    }
                }
            }
        });
        const jsonText = cleanJson(response.text || "{}");
        return JSON.parse(jsonText) as RotationPlan;
    } catch (error) {
        throw handleApiError(error, "generate crop rotation");
    }
};

export interface YieldPrediction {
    predictedYield: string; // Range e.g. "22-25"
    unit: string; // e.g. "Quintals/Acre"
    confidence: string;
    scenarios: {
        pessimistic: number;
        likely: number;
        optimistic: number;
    };
    positiveFactors: string[];
    negativeFactors: string[];
    recommendations: string[];
    estimatedRevenue: string; // e.g. "45000 - 50000"
}

export const predictCropYield = async (formData: { crop: string; area: string; soil: string; irrigation: string; variety?: string; fertilizer?: string }): Promise<YieldPrediction> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Predict yield for ${formData.crop} (${formData.variety || 'Standard'}), ${formData.area} acres, ${formData.soil}, ${formData.irrigation}, Fertilizer: ${formData.fertilizer || 'Standard NPK'}.
            Provide 3 scenarios (numbers only for scenarios). Revenue in INR based on current Indian market rates. JSON Output. 
            Keep recommendations very short.`,
            config: {
                responseMimeType: 'application/json',
                maxOutputTokens: 1500,
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        predictedYield: { type: Type.STRING },
                        unit: { type: Type.STRING },
                        confidence: { type: Type.STRING },
                        scenarios: {
                            type: Type.OBJECT,
                            properties: {
                                pessimistic: { type: Type.NUMBER },
                                likely: { type: Type.NUMBER },
                                optimistic: { type: Type.NUMBER }
                            }
                        },
                        positiveFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                        negativeFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        estimatedRevenue: { type: Type.STRING }
                    },
                }
            },
        });
        const jsonText = cleanJson(response.text || "{}");
        return JSON.parse(jsonText) as YieldPrediction;
    } catch (error) {
        throw handleApiError(error, "predict crop yield");
    }
};

export const getFinanceAdvice = async (transactions: any[], totalIncome: number, totalExpense: number): Promise<string> => {
    const dataString = transactions.map(t => `${t.date}: ${t.type} - ${t.category} (₹${t.amount})`).join(', ');
    const prompt = [
        `Act as an agricultural financial advisor. Analyze these farm transactions: ${dataString}.
        Total Income: ₹${totalIncome}, Total Expense: ₹${totalExpense}.
        Provide strictly Markdown advice:
        1. **Burn Rate Analysis**: High-level spending efficiency.
        2. **Saving Opportunities**: Specific areas where costs can be reduced based on the list.
        3. **Cashflow Strategy**: Advice for the upcoming season.
        Keep it concise (max 150 words).`
    ];
    return makeApiCall(prompt, 'get financial advice', 'gemini-3-flash-preview');
};

export const generateProductStory = async (details: { crop: string; date: string; organic: string; location: string; method: string }): Promise<string> => {
    const prompt = [
        `Write a 50-word marketing story for ${details.crop} from ${details.location}. Method: ${details.method}.`
    ];
    return makeApiCall(prompt, 'generate product story', 'gemini-3-flash-preview');
};

export const getMarketInsight = async (commodity: string, market: string, currentPrice: number, history: number[]): Promise<string> => {
    const prompt = [
        `Market advice for ${commodity} at ${market} (Price: ${currentPrice}). Trend: ${history.join(',')}.
        Action: SELL or HOLD? Why? (Max 2 sentences)`
    ];
    return makeApiCall(prompt, 'generate market insight', 'gemini-3-flash-preview');
};
