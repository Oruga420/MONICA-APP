import { GoogleGenAI } from "@google/genai";
import { DistributionRange } from "../types";

export const generateTeacherReport = async (
  distribution: DistributionRange[],
  totalStudents: number,
  averageScore: number
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare the data summary for the prompt
  const dataSummary = distribution
    .map((d) => `- ${d.name} (${d.min}-${d.max} aciertos): ${d.count} alumnos (${d.percentage.toFixed(1)}%)`)
    .join('\n');

  const prompt = `
    Actúa como un consultor educativo experto y asistente administrativo escolar.
    
    Contexto:
    Soy un profesor de 5º grado de primaria. Acabo de aplicar un examen diagnóstico de 50 reactivos.
    Necesito generar un reporte ejecutivo para la dirección de la escuela sobre los resultados.

    Datos del grupo:
    - Total de alumnos evaluados: ${totalStudents}
    - Promedio de aciertos (sobre 50): ${averageScore.toFixed(1)}
    
    Distribución de resultados por niveles de desempeño:
    ${dataSummary}

    Tarea:
    Genera un reporte breve y profesional (máximo 300 palabras) en español.
    El reporte debe incluir:
    1. Un párrafo de análisis general de la situación del grupo.
    2. Identificación de áreas de alerta (donde hay más alumnos con bajo rendimiento).
    3. Tres recomendaciones pedagógicas concretas para mejorar los niveles "No Alcanzado" y "Desarrollo Inicial".

    Formato: Usa Markdown, sé directo y profesional. Evita lenguaje excesivamente florido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No se pudo generar el reporte.";
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Error al conectar con Gemini para generar el reporte.");
  }
};
