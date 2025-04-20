import { GoogleGenerativeAI } from "@google/generative-ai";

// Validate API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('Gemini API key is not configured. Please check your .env file.');
}

// Initialize the Gemini API with the key
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure the model
const modelConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.8,
  maxOutputTokens: 1000,
};

// Safety settings
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_NONE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE",
  },
];

export const getGeminiModel = async () => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  return model;
};

export const generateGeminiResponse = async (prompt, contextInfo) => {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: modelConfig,
      safetySettings,
    });

    // Format the prompt with context
    const formattedPrompt = `
    You are TRIPZY, an AI travel assistant. Your role is to help users plan their trips and provide travel advice.
    
    Current context:
    ${contextInfo}
    
    User message: ${prompt}
    
    Please provide a helpful response about travel planning, keeping responses friendly and informative.`;

    // Generate content with proper error handling
    const result = await model.generateContent(formattedPrompt);
    
    if (!result || !result.response) {
      throw new Error('No response generated');
    }

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
    throw error; // Let the component handle the error
  }
}; 