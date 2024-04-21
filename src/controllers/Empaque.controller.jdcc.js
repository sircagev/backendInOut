import {pool} from '../database/conexion.js';

export const RegistrarEmpaque = async (req, res) => {
    try {
        let {Nombre_Empaque} = req.body;
        let sql = `insert into tipo_empaque (Nombre_Empaque) values (?)`;
        let values = [Nombre_Empaque];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Empaque registrado con éxito"});
        } else {
            return res.status(400).json({"message": "Empaque no registrado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarEmpaque = async (req, res) => {
    try {
        let [result] = await pool.query(`SELECT * FROM tipo_empaque ORDER BY estado = 'activo' DESC`);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};


export const BuscarEmpaque = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from tipo_empaque where Nombre_Empaque like ?`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Empaque econtrado", "Empaque": rows});
        } else {
            return res.status(400).json({"message": "Tipo Empaque no encontrado"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarEmpaque = async (req, res) => {
    try {
        let id = req.params.id;
        let {Nombre_Empaque} = req.body;
        let sql = `UPDATE tipo_empaque SET Nombre_Empaque = ? WHERE codigo_Empaque = ?`;

        let [result] = await pool.query(sql, [Nombre_Empaque, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Tipo Empaque actualizado con éxito."});
        } else {
            return res.status(400).json({"Message": "Tipo Empaque no actualizado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const EliminarEmpaque = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from tipo_empaque where codigo_Empaque = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Tipo Empaque eliminado con éxito."});
        } else {
            return res.status(400).json({"Message": "Tipo Empaque no eliminado."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const DesactivarEmpaque = async (req, res) => {
    try {
        const { id } = req.params;

        const sqlGetEstado = `SELECT estado FROM tipo_empaque WHERE codigo_Empaque = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Tipo de Empaque no encontrado." });
        }

        const estadoActual = estadoResult[0].estado;
        let nuevoEstado;

        if (estadoActual === 'Activo') {
            nuevoEstado = 'Inactivo';
        } else if (estadoActual === 'Inactivo') {
            nuevoEstado = 'Activo';
        }

        const sqlUpdateEstado = `UPDATE tipo_empaque SET estado = ? WHERE codigo_Empaque = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Empaque actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Empaque no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

