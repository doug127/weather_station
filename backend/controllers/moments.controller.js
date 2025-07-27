import { Moment } from "../models/index.js";

export const getAll = async (req, res) => {
    try  {
        const get = await Moment.findAll()
        res.json({
            message: "Moments succesffully obtained",
            get
        })
    } catch (error) {
        console.error("Error in moments", error);
        res.status(500).json({message: 'Error al obtener las horas'});
    }
}
