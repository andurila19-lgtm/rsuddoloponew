import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Dr. Dolopo AI", a virtual assistant for RSUD Dolopo (Dolopo Regional General Hospital). 
Your tone should be professional, empathetic, warm, and polite (using Indonesian language).

Key Responsibilities:
1. Provide general information about hospital services (Emergency, Polyclinics, Inpatient, Laboratory, Pharmacy).
2. Assist with general health queries (disclaim you are an AI, not a doctor).
3. Guide users to make appointments (simulate the process).

Hospital Details:
- Name: RSUD Dolopo
- Location: Madiun, East Java, Indonesia.
- Focus: Patient-centered care, modern facilities.

Important Rules:
- If a user asks for a medical diagnosis, state clearly: "Saya adalah asisten AI. Mohon konsultasikan segera dengan dokter kami untuk diagnosis medis yang akurat."
- Keep answers concise and easy to read.
- Use Indonesian (Bahasa Indonesia).
`;

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  try {
    // Access API key safely. In Vite, process.env.API_KEY is replaced by string value.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API Key is missing");
      return "Maaf, fitur chat sedang tidak tersedia (API Key missing).";
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, terjadi kesalahan pada koneksi. Silakan coba lagi nanti.";
  }
};