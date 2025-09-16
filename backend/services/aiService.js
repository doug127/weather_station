import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

<<<<<<< HEAD

=======
>>>>>>> ms
export const generateDescription = async (name, variable, unit) => {
    const variableList = [
        "Temperatura",
        "Precipitación",
        "Insolación",
        "Dirección del viento",
        "Velocidad del viento",
        "Humedad relativa",
        "Radiación solar",
        "Presión atmosférica",
        "Evaporación",
    ];

    const prompt = `
    Genera una descripción detallada de al menos 100 palabras sobre un sensor llamado "${name}".
    Incluye:
    - Qué es el sensor
    - Para qué sirve
    - Qué función cumple
    - Qué datos mide
    - Explicación de la variable "${variable}"
    - Explicación de la unidad de medida "${unit}"
    
    Condiciones estrictas:
    1. Si el sensor no existe o está mal escrito, devuelve exactamente en un maximo de 20 palabras:
    "No se puede generar una descripción, ya que el sensor ${name} no existe o está mal escrito."
    2. Si el nombre del sensor no coincide con la variable de medición, no importa que tengan alguna relacion, solo debe coincidir exactamente con la variable de medicion de dicho sensor, NO generes la descripción completa. Devuelve únicamente en un maximo de 25 palabras:
    "El ${name} se encarga de medir <variable real que mide el sensor>, por su parte la variable ${variable} se encarga de medir ${unit}, corrija su respuesta por favor."
    3. Si el nombre del sensor está mal escrito pero existe uno similar, devuelve en un maximo de 20 palabras:
    "Veo que te has equivocado al escribir el nombre del sensor, quizás quisiste decir <nombre correcto del sensor>."
    4. Solo genera la descripción completa si todas las condiciones anteriores se cumplen, caso contrario la descripcion generada debe ser de maximo 25 palabras.
    5. Escribe en un lenguaje técnico, claro y descriptivo, tipo documentación oficial. Sin listas, viñetas o encabezados. Texto plano.

    Responde **exactamente** según estas reglas.
    `;

    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const response = await model.generateContent(prompt);

    return response.response.text();
}