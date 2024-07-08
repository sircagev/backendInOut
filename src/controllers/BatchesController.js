import { pool } from "../database/conexion.js";

export const getBatches = async (req, res) => {
    try {
        const sql = `SELECT 
                        b.*,
                    FROM batches AS b
                    WHERE quantity > 0;`;
        const [result] = await pool.query(sql);

        //Revisar que llego información y ejecutar manejo de errores
        if (result.length == 0) {
            return res.status(200).json({
                error: false,
                message: "No se encontraron lotes",
                data: []
            });
        }

        return res.status(200).json({
            error: false,
            message: "Lotes listados",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error
        })
    }
}