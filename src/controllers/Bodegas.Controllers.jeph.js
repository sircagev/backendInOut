import { pool } from '../database/conexion.js';

export const RegistrarBodega = async (req, res) => {
    try {
        const { codigo_bodega, ubicacionBodega, nombreBodega } = req.body;

        // Agregamos un registro para ver los datos recibidos
        console.log("Datos recibidos para registrar bodega:", req.body);

 
        if (!ubicacionBodega) {
            return res.status(400).json({ "message": "El campo de ubicación no puede estar vacío." });
        }

        const sql = `INSERT INTO bodega (codigo_Bodega, ubicacion, Nombre_bodega)
                     VALUES (?, ?, ?)`;
        const values = [codigo_bodega, ubicacionBodega, nombreBodega];

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

export const listarBodegas = async(req,res)=> {

    try{
        const [result] = await pool.query('select * from bodega');
        
        if(result.length>0){
            return res.status(200).json(result); 
        } else {
            return res.status(404).json({'message': 'No se econtró categorias'});
        }
        
    }catch(e){
        return res.status(500).json({'message': 'error' + e});
    }

};

export const BuscarBodega = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `select * from bodega where codigo_bodega = ?`;
        let [rows] = await pool.query(sql, [id]);

        if (rows.length > 0) {
            return res.status(200).json(rows);
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
        let { codigo_bodega, ubicacion_bodega, nombre_bodega } = req.body;
        let sql = `
            UPDATE bodegas
                SET codigo_bodega = ?,
                ubicacion_bodega = ?,
                nombre_bodega = ?
            WHERE codigo_bodega = ?
        `;
        let [rows] = await pool.query(sql, [ codigo_bodega, ubicacion_bodega, nombre_bodega, id]);

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