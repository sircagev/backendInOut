import { pool } from '../database/conexion.js';

export const RegistrarBodega = async (req, res) => {
    try {
        const {ubicacion, Nombre_bodega } = req.body;

        // Agregamos un registro para ver los datos recibidos
        console.log("Datos recibidos para registrar bodega:", req.body);

        const sql = `INSERT INTO bodega (ubicacion, Nombre_bodega )
                     VALUES ( ?, ?)`;
        const values = [ubicacion, Nombre_bodega];

        const [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ "message": "Se registró con éxito la Bodega" });
        } else {
            return res.status(403).json({ "message": "Bodega no registrada" });
        }
    } catch (e) {
        // Agregamos un registro para ver el error
        console.log("Error al registrar bodega:", e);

        return res.status(500).json({ "message": `Error en el servidor: ${e.message}` });
    }
};

export const listarBodegas = async(req, res) => {
    try {
        const [result] = await pool.query("SELECT *, DATE_FORMAT(fecha_creacion, '%d/%m/%Y') AS fecha_creacion FROM bodega");
        
        if(result.length > 0) {
            return res.status(200).json(result); 
        } else {
            return res.status(404).json({ 'message': 'No se encontró categorías' });
        }
        
    } catch (e) {
        return res.status(500).json({ 'message': 'error' + e });
    }
};


export const BuscarBodega = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from bodegas where Nombre_bodega like ?`;
        let [rows] = await pool.query(sql, id2);

        if (rows.length > 0) {
            return res.status(200).json({ "message": "Bodega encontrado con éxito", "Elemento": rows });

        } else {
            return res.status(404).json({ "message": "Bodega no encontrado" });
        }
    } catch (e) {
        return res.status(500).json({ "message": e.message });
    }
};

export const ActualizarBodega = async (req, res) => {
    try {
        let id = req.params.id;
        let { ubicacion, Nombre_bodega } = req.body;
        let sql = `
            UPDATE bodega
                SET ubicacion = ?,
                Nombre_bodega = ?
            WHERE codigo_Bodega = ?
        `;
        let [rows] = await pool.query(sql, [ ubicacion, Nombre_bodega, id]);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ "message": "Bodega actualizada con éxito" });
        } else {
            return res.status(404).json({ "message": "Bodega no encontrada" });
        }
    } catch (e) {
        return res.status(500).json({ "message": e.message });
    }
}

export const DesactivarBodega = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la bodega
        const sqlGetEstado = `SELECT Estado FROM bodega WHERE codigo_Bodega = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la bodega
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Bodega no encontrado." });
        }

        const estadoActual = estadoResult[0].Estado;
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual === 'Activo') {
            nuevoEstado = 'Inactivo';
        } else if (estadoActual === 'Inactivo') {
            nuevoEstado = 'Activo';
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE bodega SET Estado = ? WHERE codigo_Bodega = ?`;
        await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        // Consulta SQL para obtener las bodegas activas restantes
        const sqlSelectActivos = `SELECT * FROM bodega WHERE Estado = 'Activo'`;
        const [result] = await pool.query(sqlSelectActivos);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};