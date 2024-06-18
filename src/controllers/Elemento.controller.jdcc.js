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
        return res.status(500).json(error.message);
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
            `SELECT 
                e.Codigo_elemento,
                e.Nombre_elemento,
                e.stock,
                c.nombre_categoria AS fk_categoria,
                n.nombre_tipoElemento AS fk_tipoElemento,
                me.Nombre_Medida AS fk_unidadMedida,
                em.Nombre_empaque AS fk_tipoEmpaque,
                u.Nombre_ubicacion AS fk_detalleUbicacion,
                e.Estado,
                DATE_FORMAT(e.fecha_creacion, '%d/%m/%Y') AS fecha_creacion,
                e.fecha_actualizacion
            FROM 
                elemento AS e 
            JOIN 
                categoria_elemento AS c ON e.fk_categoria = c.codigo_categoria 
            JOIN 
                tipo_elemento AS n ON e.fk_tipoElemento = n.codigo_Tipo
            JOIN 
                unidad_medida AS me ON e.fk_unidadMedida = me.codigo_medida
            JOIN 
                tipo_empaque AS em ON e.fk_tipoEmpaque = em.Codigo_empaque
            JOIN 
                detalle_ubicacion AS u ON e.fk_detalleUbicacion = u.codigo_Detalle`
        );

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error("Error al listar elementos:", error);
        return res.status(500).json({ message: 'Error al listar elementos', error: error.message });
    }
};

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
        const id = req.params.id;
        const { Nombre_elemento, fk_tipoElemento, fk_categoria, fk_unidadMedida, fk_tipoEmpaque, fk_detalleUbicacion } = req.body;

        // Obtener el valor actual de stock
        const [elementoResult] = await pool.query('SELECT stock FROM elemento WHERE Codigo_elemento = ?', [id]);
        if (elementoResult.length === 0) {
            return res.status(400).json({ "Message": "Elemento no encontrado." });
        }
        const currentStock = elementoResult[0].stock;

        // Obtener codigo_categoria a partir del nombre_categoria
        const [categoriaResult] = await pool.query('SELECT codigo_categoria FROM categoria_elemento WHERE nombre_categoria = ?', [fk_categoria]);
        if (categoriaResult.length === 0) {
            return res.status(400).json({ "Message": "Categoría no encontrada." });
        }
        const codigo_categoria = categoriaResult[0].codigo_categoria;

        // Obtener codigo_Tipo a partir del nombre_tipoElemento
        const [tipoElementoResult] = await pool.query('SELECT codigo_Tipo FROM tipo_elemento WHERE nombre_tipoElemento = ?', [fk_tipoElemento]);
        if (tipoElementoResult.length === 0) {
            return res.status(400).json({ "Message": "Tipo de elemento no encontrado." });
        }
        const codigo_Tipo = tipoElementoResult[0].codigo_Tipo;

        // Obtener codigo_medida a partir del Nombre_Medida
        const [unidadMedidaResult] = await pool.query('SELECT codigo_medida FROM unidad_medida WHERE Nombre_medida = ?', [fk_unidadMedida]);
        if (unidadMedidaResult.length === 0) {
            return res.status(400).json({ "Message": "Unidad de medida no encontrada." });
        }
        const codigo_medida = unidadMedidaResult[0].codigo_medida;

        // Obtener Codigo_empaque a partir del Nombre_empaque
        const [tipoEmpaqueResult] = await pool.query('SELECT Codigo_empaque FROM tipo_empaque WHERE Nombre_empaque = ?', [fk_tipoEmpaque]);
        if (tipoEmpaqueResult.length === 0) {
            return res.status(400).json({ "Message": "Tipo de empaque no encontrado." });
        }
        const Codigo_empaque = tipoEmpaqueResult[0].Codigo_empaque;

        // Obtener codigo_Detalle a partir del Nombre_ubicacion
        const [ubicacionResult] = await pool.query('SELECT codigo_Detalle FROM detalle_ubicacion WHERE Nombre_ubicacion = ?', [fk_detalleUbicacion]);
        if (ubicacionResult.length === 0) {
            return res.status(400).json({ "Message": "Ubicación no encontrada." });
        }
        const codigo_Detalle = ubicacionResult[0].codigo_Detalle;

        // Consulta SQL para actualizar el elemento
        const sql = `
            UPDATE elemento 
            SET
                Nombre_elemento = ?, 
                stock = ?, 
                fk_tipoElemento = ?, 
                fk_categoria = ?, 
                fk_unidadMedida = ?,
                fk_tipoEmpaque = ?, 
                fk_detalleUbicacion = ?
            WHERE 
                Codigo_elemento = ?`;

        const [result] = await pool.query(sql, [
            Nombre_elemento, 
            currentStock,  // Usamos el valor actual de stock
            codigo_Tipo, 
            codigo_categoria, 
            codigo_medida,
            Codigo_empaque, 
            codigo_Detalle, 
            id
        ]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ "Message": "Elemento actualizado con éxito." });
        } else {
            return res.status(400).json({ "Message": "Elemento no actualizado. Verifique que el ID exista." });
        }
    } catch (error) {
        console.error("Error al actualizar el elemento:", error);
        return res.status(500).json({ "Message": "Error interno del servidor.", "Error": error.message });
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

        // Consulta SQL para obtener el estado actual de la ubicación
        const sqlGetEstado = `SELECT estado FROM elemento WHERE Codigo_elemento = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la ubicación
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Elemento no encontrado." });
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
        const sqlUpdateEstado = `UPDATE elemento SET estado = ? WHERE Codigo_elemento = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Elemento actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "Elemento no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};