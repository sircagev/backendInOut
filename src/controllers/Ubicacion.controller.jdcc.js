import {pool} from '../database/conexion.js';

export const RegistrarUbicacion = async (req, res) => {
    try {
        let {Nombre_ubicacion, fk_bodega} = req.body;
        let sql = `insert into detalle_ubicacion (Nombre_ubicacion, fk_bodega) values (?,?)`;
        let values = [Nombre_ubicacion, fk_bodega];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Detalle_ubicacion registrada con éxito"});
        } else {
            return res.status(400).json({"message": "Detalle_ubicacion no registrada."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarUbicacion = async (req, res) => {
    try {
        let [result] = await pool.query(`
        SELECT e.*, 
       DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y') AS fecha_creacion, 
       c.Nombre_bodega 
FROM detalle_ubicacion AS e
LEFT JOIN bodega AS c 
ON e.fk_bodega = c.codigo_Bodega 
ORDER BY e.codigo_Detalle ASC
        `);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};


export const BuscarUbicacion = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select e.*, c.Nombre_bodega from detalle_ubicacion 
                   AS e 
                   JOIN bodega AS c ON e.fk_bodega = c.codigo_Bodega
                   AND Nombre_ubicacion like ?
                   ORDER BY e.codigo_Detalle ASC`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Encontrado", "Ubicacion": rows});
        } else {
            return res.status(400).json({"message": "Detalle de ubicacion no encontrada"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarUbicacion = async (req, res) => {
    try {
        let id = req.params.id;
        let {Nombre_ubicacion, fk_bodega} = req.body;
        let sql = `UPDATE detalle_ubicacion SET Nombre_ubicacion = ?, fk_bodega = ?  WHERE codigo_Detalle = ?`;

        let [result] = await pool.query(sql, [Nombre_ubicacion, fk_bodega, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Detalle de ubicación actualizado con éxito."});
        } else {
            return res.status(400).json({"Message": "Detalle de ubicación no actualizado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const EliminarUbicacion = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from detalle_ubicacion where codigo_Detalle = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Detalle de ubicación eliminado con éxito."});
        } else {
            return res.status(400).json({"Message": "Detalle de ubicación no eliminado."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const Desactivarubicacion = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la ubicación
        const sqlGetEstado = `SELECT estado FROM detalle_ubicacion WHERE codigo_Detalle = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la ubicación
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Detalle de ubicación no encontrado." });
        }

        const estadoActual = estadoResult[0].estado;
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual === 'Activo') {
            nuevoEstado = 'Inactivo';
        } else if (estadoActual === 'Inactivo') {
            nuevoEstado = 'Activo';
        } else {
            // En caso de un estado no esperado, mantener el estado actual
            nuevoEstado = estadoActual;
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE detalle_ubicacion SET estado = ? WHERE codigo_Detalle = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Detalle de ubicación actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Detalle de ubicación no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
