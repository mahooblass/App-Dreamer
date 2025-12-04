import { GoogleGenAI } from "@google/genai";
import { Goal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (goals: Goal[]): Promise<string> => {
  if (goals.length === 0) {
    return "Aún no tienes metas registradas. Agrega algunas para que pueda darte consejos personalizados.";
  }

  const goalsSummary = goals.map(g => 
    `- ${g.name}: Ahorrado $${g.currentAmount} de $${g.targetAmount} (${((g.currentAmount/g.targetAmount)*100).toFixed(1)}%). Categoría: ${g.category}.`
  ).join("\n");

  const prompt = `
    Actúa como un asesor financiero personal amigable y motivador. 
    Analiza la siguiente lista de deseos y metas de ahorro de un usuario:
    
    ${goalsSummary}
    
    Por favor, proporciona:
    1. Un breve análisis del progreso general.
    2. Una recomendación específica para priorizar o acelerar la meta más cercana a cumplirse.
    3. Una frase motivadora corta.
    
    Mantén el tono positivo, conciso y en español. Usa formato Markdown para resaltar puntos clave.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No se pudo generar un consejo en este momento.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Hubo un error al conectar con tu asesor inteligente. Por favor intenta más tarde.";
  }
};