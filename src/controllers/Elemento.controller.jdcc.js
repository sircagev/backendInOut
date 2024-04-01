import { pool } from '../database/conexion.js';

export const RegistrarElemento = async (req, res) => {
    try {
        let {Nombre_elemento, stock, fk_tipoElemento, fk_unidadMedida, fk_categoria, fk_tipoEmpaque, fk_detalleUbicacion} = req.body;
        let sql = `insert into elemento (Nombre_elemento, stock, fk_tipoElemento, fk_unidadMedida, fk_categoria, fk_tipoEmpaque, fk_detalleUbicacion) 
                   values (?, ?, ?, ?, ?,?, ?)`;
        let values = [Nombre_elemento, stock, fk_tipoElemento, fk_unidadMedida, fk_categoria, fk_tipoEmpaque, fk_detalleUbicacion];

        let [result] = await pool.query(sql, values);
        
        if (result.affectedRows > 0) {
            return res.status(200).json({ "message": "Elemento registrado con éxito" });
        } else {
            return res.status(400).json({ "message": "Elemento no registrado." });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const AñadirStock = async (req, res) => {
    try {
        let id = req.params.id;
        let { cantidad } = req.body;

        // Obtener el stock actual del elemento
        let [elemento] = await pool.query('SELECT stock FROM elemento WHERE codigo_elemento = ?', [id]);
        let stockActual = elemento[0].stock;

        // Sumar la cantidad de stock que deseas añadir
        let nuevoStock = stockActual + cantidad;

        // Actualizar el stock en la base de datos
        let [result] = await pool.query('UPDATE elemento SET stock = ? WHERE codigo_elemento = ?', [nuevoStock, id]);
        console.log(result);
        if (result.affectedRows > 0) {
            return res.status(200).json({ "message": "Stock añadido correctamente" });
        } else {
            return res.status(400).json({ "message": "Error al añadir stock" });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}


export const ListarElemetos = async (req, res) => {
    try {
        let [result] = await pool.query(
                `SELECT e.*, c.nombre_categoria, n.nombre_tipoElemento, me.Nombre_Medida, em.Nombre_empaque, u.Nombre_ubicacion
                FROM elemento AS e 
                JOIN categoria_elemento AS c ON e.fk_categoria = c.codigo_categoria 
                JOIN tipo_elemento AS n ON e.fk_tipoElemento = n.codigo_Tipo
                JOIN unidad_medida AS me ON e.fk_unidadMedida = me.codigo_medida
                JOIN tipo_empaque AS em ON e.fk_tipoEmpaque = em.Codigo_empaque
                JOIN detalle_ubicacion AS u ON e.fk_detalleUbicacion = u.codigo_Detalle
                WHERE e.Estado = 'Activo'
                ORDER BY e.codigo_elemento ASC`);
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const BuscarElemento = async (req, res) => {
    try {
        let id = req.params.id;
        let id2 = id + '%';
        let sql = `SELECT e.*, c.nombre_categoria, n.nombre_tipoElemento, me.Nombre_Medida, em.Nombre_empaque, u.Nombre_ubicacion
                FROM elemento AS e 
                JOIN categoria_elemento AS c ON e.fk_categoria = c.codigo_categoria 
                JOIN tipo_elemento AS n ON e.fk_tipoElemento = n.codigo_Tipo
                JOIN unidad_medida AS me ON e.fk_unidadMedida = me.codigo_medida
                JOIN tipo_empaque AS em ON e.fk_tipoEmpaque = em.Codigo_empaque
                JOIN detalle_ubicacion AS u ON e.fk_detalleUbicacion = u.codigo_Detalle
                WHERE e.Estado = 'Activo'
                AND e.Nombre_elemento like ?
                ORDER BY e.codigo_elemento ASC `;
        let [rows] = await pool.query(sql, [id2]);   

        if (rows.length > 0) {
            
            return res.status(200).json({ "message": "Elemento encontrado con éxito", "Elemento": rows });
            
        } else {
            return res.status(404).json({ "message": "Elemento no encontrado" });
        }
    } catch (e) {
        return res.status(500).json({ "message": e.message });
    }
}

export const ActualizarElemento = async (req, res) => {
    try {
        let id = req.params.id;
        let { Nombre_elemento, stock, fk_tipoElemento, fk_unidadMedida, fk_categoria, fk_tipoEmpaque, fk_detalleUbicacion } = req.body;
        let sql = `UPDATE elemento SET
                   Nombre_elemento = ? ,
                   stock = ?,
                   fk_tipoElemento = ?,
                   fk_unidadMedida = ?,
                   fk_categoria = ?,
                   fk_tipoEmpaque = ?, 
                   fk_detalleUbicacion = ?
                   WHERE Codigo_elemento = ?`;
        let [result] = await pool.query(sql, [Nombre_elemento, stock, fk_tipoElemento, fk_unidadMedida, fk_categoria, fk_tipoEmpaque, fk_detalleUbicacion, id]);
        if (result.affectedRows > 0) {
            return res.status(200).json({ "message": "Elemento actualizado." });
        } else {
            return res.status(404).json({ "message": "Elemento no actualizado." })
        }
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
};

export const EliminarElemento = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `delete from elemento where Codigo_elemento = ?`;
        let [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "message": "Elemento eliminado" });
        } else {
            return res.status(404).json({ "message": "Elemento no eliminado" });
        }
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

export const DesactivarElementos = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `UPDATE elemento SET estado = 'inactivo' WHERE Codigo_elemento = ?`;

        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Elemento desactivado con éxito." });
        } else {
            return res.status(404).json({ "message": "Elemento no desactivado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};