import {pool} from '../database/conexion.js';

export const RegistrarCategoria = async (req, res) => {
    try {
        let {Nombre_Categoria} = req.body;
        let sql = `insert into categoria_elemento (Nombre_Categoria) values (?)`;
        let values = [Nombre_Categoria];
        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({"message": "Categoria elemento registrado con éxito"});
        } else {
            return res.status(400).json({"message": "Categoria elemento no registrado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const ListarCategoria = async (req, res) => {
    try {
        let [result] = await pool.query(`SELECT * FROM categoria_elemento ORDER BY estado = 'activo' DESC`);

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};


export const BuscarCategoria = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `select * from categoria_elemento where Nombre_Categoria like ?`;

        let [rows] = await pool.query(sql, id2);

        if(rows.length > 0) {
            return res.status(200).json({"message": "Categría econtrada", "categoria": rows});
        } else {
            return res.status(400).json({"message": "Categoria elemento no encontrado"});
        }
    } catch {
        return res.status(500).json(error);
    }
}

export const ActualizarCategoria = async (req, res) => {
    try {
        let id = req.params.id;
        let {Nombre_Categoria} = req.body;
        let sql = `UPDATE categoria_elemento SET Nombre_Categoria = ? WHERE codigo_Categoria = ?`;

        let [result] = await pool.query(sql, [Nombre_Categoria, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Categoria Elemento actualizado con éxito."});
        } else {
            return res.status(400).json({"Message": "Categoria Elemento no actualizado."});
        }
    } catch (error){
        return res.status(500).json(error);
    }
}

export const EliminarCategoria = async (req, res) => {
    try {
        let id = req.param.id;
        let sql = `delete from categoria_elemento where codigo_Categoria = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({"Message": "Categoria Elemento eliminado con éxito."});
        } else {
            return res.status(400).json({"Message": "Categoria Elemento no eliminado."});
        }
    } catch (error){
        return res.status(500).json(error);                  
    } 
}

export const DesactivarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la categoría
        const sqlGetEstado = `SELECT estado FROM categoria_elemento WHERE codigo_Categoria = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la categoría
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Categoría Elemento no encontrada." });
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
        const sqlUpdateEstado = `UPDATE categoria_elemento SET estado = ? WHERE codigo_Categoria = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Categoría Elemento actualizada a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Categoría Elemento no actualizada." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
