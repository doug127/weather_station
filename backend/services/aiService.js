import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateDescription = async (name, variable, unit) => {
    const prompt = `
    Genera una descripción detallada de al menos 500 palabras sobre un sensor llamado "${name}".
    Incluye:
    - Qué es el sensor
    - Para qué sirve
    - Qué función cumple
    - Qué datos mide
    - Explicación de la variable "${variable}"
    - Explicación de la unidad de medida "${unit}"
    Escribe en un lenguaje técnico pero entendible, como si fuera documentación oficial, 
    utiliza un formato de texto plano tipo descriptivo, sin cabeceras, ni viñetas
    `;

    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

    const response = await model.generateContent(prompt);

    return response.response.text();
}