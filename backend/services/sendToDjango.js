import axios from "axios";
import { getFilteredValuesData } from "../controllers/value.controller.js";

export const trainModel = async (req, res) => {
    try {
        const filteredData = await getFilteredValuesData(req.query);

        const payload = {
            model_name: 'rain_predictor_from_node',
            json_data: filteredData
        }

        const djangoRes = await axios.post('http://localhost:8000/api/train-model/', payload)

        return res.json({
            message: 'Modelo entrenado y datos enviados a Django exitosamente',
            django_response: djangoRes.data
        })
    } catch (error) {
        console.error('Error enviando datos a Django:', error.message);
        res.status(500).json({
            message: 'Error al entrenar el modelo desde Node',
            error: error.message
        });
    }
}
