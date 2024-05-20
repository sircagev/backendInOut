import {pool} from '../database/conexion.js';

export const RegistrarMedida = async (req, res) => {
    try {
        let {Nombre_Medida} = req.body;
        let sql = `insert into unidad_medida (Nombre_Medida) values (?)`;
        let values = [Nombre_Medida];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Unidad de medida registrado con éxito"});
        } else {
            return res.status(400).json({"message": "Unidad de medida no registrado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarMedida = async (req, res) => {
    try {
        let [result] = await pool.query(`SELECT *,  DATE_FORMAT(fecha_creacion, '%d/%m/%Y') AS fecha_creacion FROM unidad_medida`);


        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};


export const Buscarmedida = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from unidad_medida where  Nombre_Medida like ?`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Medida encontrada con éxito", "medida": rows});
        } else {
            return res.status(400).json({"message": "Unidad de medida no encontrada"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarMedida = async (req, res) => {
    try {
        let id = req.params.id;
        let {Nombre_Medida} = req.body;
        let sql = `UPDATE unidad_medida SET Nombre_Medida = ? WHERE codigo_medida = ?`;

        let [result] = await pool.query(sql, [Nombre_Medida, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Unidad de medida actualizada con éxito."});
        } else {
            return res.status(400).json({"Message": "Unidad de medida no actualizada."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const EliminarMedida = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from unidad_medida where codigo_medida = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Unidad de medida eliminada con éxito."});
        } else {
            return res.status(400).json({"Message": "Unidad de medida no eliminada."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const DesactivarMedida = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la unidad de medida
        const sqlGetEstado = `SELECT estado FROM unidad_medida WHERE codigo_medida = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la unidad de medida
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Unidad de medida no encontrada." });
        }

        const estadoActual = estadoResult[0].estado;
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual === 'Activo') {
            nuevoEstado = 'Inactivo';
        } else if (estadoActual === 'Inactivo') {
            nuevoEstado = 'Activo';
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE unidad_medida SET estado = ? WHERE codigo_medida = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Unidad de medida actualizada a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Unidad de medida no actualizada." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

