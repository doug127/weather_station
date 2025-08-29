import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateDescription = async (name, variable, unit) => {
    const prompt = `
    Genera una descripción detallada de al menos 100 palabras sobre un sensor llamado "${name}".
    Incluye:
    - Qué es el sensor
    - Para qué sirve
    - Qué función cumple
    - Qué datos mide
    - Explicación de la variable "${variable}"
    - Explicación de la unidad de medida "${unit}"
    Escribe en un lenguaje técnico pero entendible, como si fuera documentación oficial, 
    utiliza un formato de texto plano tipo descriptivo, sin cabeceras, ni viñetas.
    Toma en consideración las siguientes restricciones,
    todo ello guiandote por documentaciones oficiales del area de meteorologia o climatologia:
    Si solo es falta de acentos o plurales pero la palabra está bien escrita coloca la descripción corregida con el 
    acento faltante o en singular. 
    Caso contrario no puedes generar una descripcion del sensor
    si este no coincide con ningun sensor existente por falta de alguna letra o alguna palabra ajena a un sensor existen,
    devuelves lo siguiente:
    "No se puede generar una descripción, ya que el sensor ${name} no existe o está mal escrito",
    si el sensor existe pero está mal escrita por alguna u otra letra faltante o sobrante devuelves lo siguiente:
    "Veo que te has equivocado al escribir el nombre del sensor, quizás quisiste decir <Colocar nombre correcto del sensor>"
    `;

    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

    const response = await model.generateContent(prompt);

    return response.response.text();
}