import { GoogleGenAI, Part, Type } from "@google/genai";
import { WeatherData } from "../data/weatherData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper function to handle API calls and errors
async function makeApiCall(prompt: (string | { inlineData: { data: string; mimeType: string; } } | { text: string; })[]): Promise<string> {
    try {
        // FIX: The `Part` type must be an object. Convert any strings in the prompt array
        // to the `{text: string}` format to conform to the API's requirements.
        const parts: Part[] = prompt.map(p => (typeof p === 'string' ? { text: p } : p));
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        if (error instanceof Error) {
            // Re-throw a more user-friendly error to be caught by the component
            throw new Error(`An error occurred while communicating with the AI service: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI service.");
    }
}


export const analyzeCropImage = async (base64: string, mimeType: string): Promise<string> => {
    const prompt = [
        { text: "You are an expert agronomist. Analyze the following image of a crop plant. Identify any visible pests, diseases, or nutrient deficiencies. Provide a detailed report including:\n\n1.  **Identification:** Clearly state the identified issue (e.g., 'Aphid infestation', 'Powdery Mildew', 'Nitrogen deficiency').\n2.  **Description:** Briefly describe the symptoms seen in the image.\n3.  **Recommendations:** Suggest specific organic and chemical treatment options, including application methods.\n4.  **Preventive Measures:** List steps the farmer can take to prevent this issue in the future.\n\nFormat your response in clear, easy-to-read Markdown." },
        {
            inlineData: {
                data: base64,
                mimeType: mimeType,
            },
        },
    ];
    return makeApiCall(prompt);
};

export const analyzeSoilData = async (formData: { [key: string]: string }): Promise<string> => {
    const dataString = Object.entries(formData)
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join(', ');

    const prompt = [
        { text: `You are a soil science expert. Based on the following soil test data (${dataString}), provide a detailed analysis and recommendation plan for a farmer. The report should include:\n\n1.  **Overall Soil Health Summary:** A brief overview of the soil's condition.\n2.  **Parameter Analysis:** For each parameter (pH, EC, OC, N, P, K, etc.), explain what the value means and if it's within the optimal range for general agriculture.\n3.  **Crop Suitability:** Suggest 3-5 crops that would be suitable for this soil type.\n4.  **Fertilizer Recommendations:** Provide specific recommendations for fertilizers (both organic and chemical) to correct any deficiencies or imbalances. Include application rates (e.g., kg/hectare).\n5.  **Soil Amendment Suggestions:** Recommend any soil amendments like lime, gypsum, or organic matter to improve soil structure and health.\n\nFormat your response in clear, easy-to-read Markdown.` }
    ];
    return makeApiCall(prompt);
};

export const analyzeSoilReportImage = async (base64: string, mimeType: string): Promise<string> => {
    const prompt = [
        { text: "You are a soil science expert. Analyze the following image of a soil test report. Extract the key parameters (like pH, EC, OC, N, P, K, etc.) and their values. Then, provide a detailed analysis and recommendation plan for a farmer, just as you would for manually entered data. The report should include:\n\n1.  **Overall Soil Health Summary:** A brief overview of the soil's condition based on the report.\n2.  **Parameter Analysis:** For each parameter, explain what the value means and if it's within the optimal range.\n3.  **Crop Suitability:** Suggest 3-5 crops that would be suitable for this soil.\n4.  **Fertilizer Recommendations:** Provide specific recommendations for fertilizers (organic and chemical) and application rates.\n5.  **Soil Amendment Suggestions:** Recommend amendments to improve soil health.\n\nIf you cannot read a value, state that it's unclear. Format your response in clear, easy-to-read Markdown." },
        {
            inlineData: {
                data: base64,
                mimeType: mimeType,
            },
        },
    ];
    return makeApiCall(prompt);
};

export const getFertilizerRecommendation = async (soilReport: string, crop: string, area: number, yieldTarget: number): Promise<string> => {
    const prompt = [
        `You are an expert agronomist. A farmer has provided their soil analysis report and requires a detailed fertilizer plan.

**Soil Analysis Report Summary:**
---
${soilReport}
---

**Farmer's Input:**
- **Crop:** ${crop}
- **Farm Area:** ${area} acres
- **Target Yield:** ${yieldTarget} quintals per acre

Based on all this information, generate a comprehensive and practical fertilizer recommendation plan. The plan must include:

1.  **Nutrient Requirement Analysis:** Based on the soil report and the target yield for the specified crop, calculate the required N, P, and K (in kg/acre).
2.  **Fertilizer Plan:** Provide a clear, actionable plan using common fertilizers.
    -   Recommend specific fertilizers (e.g., Urea, DAP, MOP, etc.).
    -   Specify the **exact quantity of each fertilizer needed for the total ${area} acre area**.
    -   Break down the application into stages (e.g., Basal Dose at sowing, Top Dressing at 30 days, etc.).
3.  **Organic Alternatives:** Suggest organic options like FYM (Farm Yard Manure), vermicompost, or other bio-fertilizers, including recommended quantities.
4.  **Application Notes:** Provide brief, important instructions on how to apply the fertilizers for best results.

Format the response in clear, easy-to-read Markdown.`
    ];
    return makeApiCall(prompt);
};

export const generateCropReport = async (cropName: string, stageName: string, tasks: string[]): Promise<string> => {
    const taskList = tasks.join(', ');
    const prompt = [
        { text: `You are an agricultural expert providing a detailed report for a farmer. The crop is **${cropName}** and it is currently in the **${stageName}** stage.\n\nThe key tasks for this stage are: ${taskList}.\n\nBased on this information, generate a comprehensive report that includes:\n\n1.  **Task Elaboration:** Briefly expand on each of the key tasks, providing best practices.\n2.  **Potential Risks & Mitigation:** Identify common pests, diseases, and environmental risks during this specific stage and suggest mitigation strategies.\n3.  **Water & Nutrient Management:** Provide specific advice on irrigation and fertilization tailored to this stage.\n4.  **Pro-Tip:** Offer one valuable, actionable tip for maximizing yield or quality during this stage.\n\nFormat the response in clear, well-structured Markdown.` }
    ];
    return makeApiCall(prompt);
};

export const getChatbotResponse = async (history: {sender: 'user' | 'bot', text: string}[], newMessage: string): Promise<string> => {
    const roleMapping = {
        user: 'user',
        bot: 'model'
    } as const;

    const apiHistory = history.map(msg => ({
        role: roleMapping[msg.sender],
        parts: [{ text: msg.text }]
    }));

     try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: apiHistory,
            config: {
                systemInstruction: "You are Agri-AI, a friendly and knowledgeable agricultural assistant. Your goal is to provide concise, helpful, and accurate information to farmers. Keep your answers easy to understand and well-formatted using Markdown. If a question is outside the scope of agriculture, politely decline to answer. You must not answer questions about sensitive topics. "
            }
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Gemini Chat Error:", error);
         if (error instanceof Error) {
            throw new Error(`An error occurred while communicating with the AI service: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI service.");
    }
};


export const getVetAnalysis = async (base64: string, mimeType: string, query: string): Promise<string> => {
    const prompt = [
        { text: "You are an AI veterinary assistant. Analyze the provided image and the user's query about their animal's health. Provide a preliminary analysis, but **always strongly advise the user to consult a qualified veterinarian for a proper diagnosis and treatment**. Your response should include:\n\n1.  **Observation:** Describe what you see in the image that is relevant to the user's query.\n2.  **Potential Issues:** List possible conditions or problems based on the visual evidence and query. Do not give a definitive diagnosis.\n3.  **Immediate Care Suggestions:** Suggest any safe, first-aid or comfort measures the owner can take while waiting for a vet.\n4.  **Disclaimer:** End with a clear and prominent disclaimer that you are an AI assistant and a professional veterinarian must be consulted.\n\nFormat your response in clear, easy-to-read Markdown." },
        {
            inlineData: {
                data: base64,
                mimeType: mimeType,
            },
        },
        { text: `User query: "${query}"` },
    ];
    return makeApiCall(prompt);
};

export const getWeatherForecast = async (latitude: number, longitude: number): Promise<WeatherData> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert meteorologist. Provide a detailed weather forecast for the location with latitude ${latitude} and longitude ${longitude}. Provide the data in the exact JSON format requested.`,
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
        
        const jsonText = response.text.trim();
        const weatherData = JSON.parse(jsonText) as WeatherData;
        
        if (weatherData.hourly.length > 0 && weatherData.hourly[0].time.toLowerCase() !== 'now') {
            weatherData.hourly.unshift({
                time: 'Now',
                temp: weatherData.currentTemp,
                condition: weatherData.condition,
                icon: weatherData.condition.toLowerCase().replace(' ', '-')
            });
        }
        
        return weatherData;

    } catch (error) {
        console.error("Gemini Weather API Error:", error);
        throw new Error("Failed to fetch weather forecast from AI service.");
    }
};