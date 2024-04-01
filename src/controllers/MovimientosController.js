import { pool } from "../database/conexion.js";

//Lista Todos los Movimientos
export const ListarTodosMovimientos = async (req, res) => {
    try {
        //Consulta trayendo la información completa de los movimientos
        const sql = `SELECT 
                        m.Codigo_movimiento AS "Codigo",
                        m.fecha_movimiento AS "Fecha",
                        CONCAT(u.nombre_usuario,' ',u.apellido_usuario) AS "Usuario",
                        tm.Nombre_movimiento AS "Tipo" 
                    FROM movimiento AS m 
                    JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
                    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
                    ORDER BY Codigo ASC`;

        //Ejecutar la consulta
        const [result] = await pool.query(sql);
        console.log(result)
        //Revisar que llego información y ejecutar manejo de errores
        if (result.length > 0) {
            return res.status(200).json({ message: "Movimientos listados", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron movimientos" });
        }
    } catch (error) {
        //Enviar error por servidor
        return res.status(500).json({ message: error });
    }
}

export const BuscarMovimiento = async (req, res) => {
    try {
        let { id } = req.params;

        let sql = `SELECT 
                        m.Codigo_movimiento AS "Codigo",
                        m.fecha_movimiento AS "Fecha",
                        CONCAT(u.nombre_usuario,' ',u.apellido_usuario) AS "Usuario",
                        tm.Nombre_movimiento AS "Tipo" 
                    FROM movimiento AS m 
                    JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
                    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
                    WHERE m.Codigo_movimiento =?
                    ORDER BY Fecha DESC;`;
        let [rows] = await pool.query(sql, [id]);

        if (rows.length > 0) {
            return res.status(200).json({ "message": "Movimiento encontrado con éxito", "Movimiento": rows });
        } else {
            return res.status(404).json({ "message": "Movimiento no encontrado" });
        }
    } catch (error) {

    }
}

export const ListarDetallesMovimiento = async (req, res) => {
    try {
        let { id } = req.params;
        //Consulta trayendo la información completa de los movimientos
        const sql = `SELECT 
                        dm.codigo_detalle AS "Codigo",
                        e.Nombre_elemento AS "Elemento",
                        dm.estado AS "Estado",
                        dm.fecha_vencimiento AS "Fecha",
                        dm.cantidad AS "Cantidad",
                        CONCAT(ur.nombre_usuario,' ',ur.apellido_usuario) AS "Recibe",
                        CONCAT(ue.nombre_usuario,' ',ue.apellido_usuario) AS "Entrega",
                        dm.Observaciones AS "Observaciones"
                    FROM detalle_movimiento AS dm
                    JOIN elemento AS e ON dm.fk_elemento = e.Codigo_elemento
                    JOIN usuario AS ur ON dm.Usuario_recibe = ur.id_usuario
                    JOIN usuario AS ue ON dm.Usuario_entrega = ue.id_usuario
                    WHERE dm.fk_movimiento = ?
                    ORDER BY Codigo ASC;
                    `;
        //Ejecutar la consulta
        const [result] = await pool.query(sql, [id]);
        console.log(result)
        //Revisar que llego información y ejecutar manejo de errores
        if (result.length > 0) {
            return res.status(200).json({ message: "Movimientos listados", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron movimientos" });
        }
    } catch (error) {

    }
}

//Registrar nuevos movimientos
export const RegistrarMovimientoPrestamo = async (req, res) => {
    try {
        //Traer datos enviados por el body
        let { usuario_solicitud, fk_movimiento, Estado, detalles } = req.body;

        //Iniciar un transaccion en Sql
        await pool.query("START TRANSACTION");

        //Crear un Nuevo Movimiento de tipo Prestamo
        const sqlMovimientoPrestamo = `INSERT INTO movimiento (usuario_solicitud, fk_movimiento, Estado) 
                                        VALUES (?,?,?)`;
        const valuesMovimientoPrestamo = [usuario_solicitud, fk_movimiento, Estado]
        let [rowsMovimientoPrestamo] = await pool.query(sqlMovimientoPrestamo, valuesMovimientoPrestamo);

        //Obtener ID del movimiento recién creado
        const movimientoID = rowsMovimientoPrestamo.insertId;
        const detallesInfo = [];

        for (const detalle of detalles) {
            //Traer informacion de los detalles
            const { fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones } = detalle;
            console.log(detalle)
            //Insertar de a un detalle
            const detalleSql = `INSERT INTO detalle_movimiento (fk_movimiento, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones) 
                                    VALUES (?,?,?,?,?,?,?,?)`;
            const detalleValues = [movimientoID, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones];
            let [detalleRows] = await pool.query(detalleSql, detalleValues);

            detallesInfo.push(detalleRows);
        };

        await pool.query("COMMIT");
        return res.status(200).json({ message: "Registro Exitoso", movimiento: rowsMovimientoPrestamo, detalles: detallesInfo });
    } catch (error) {
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({ message: error });
    }
}

export const RegistrarMovimientoIngreso = async (req, res) => {
    try {
        let { usuario_solicitud, fk_movimiento, Estado, detalles } = req.body;
        //Iniciar un transaccion en Sql
        await pool.query("START TRANSACTION");

        //Crear un Nuevo Movimiento de tipo Prestamo
        const sqlMovimientoIngreso = `INSERT INTO movimiento (usuario_solicitud, fk_movimiento, Estado) 
                                    VALUES (?,?,?)`;
        const valuesMovimientoIngreso = [usuario_solicitud, fk_movimiento, Estado]
        let [rowsMovimientoIngreso] = await pool.query(sqlMovimientoIngreso, valuesMovimientoIngreso);

        //Obtener ID del movimiento recién creado
        const movimientoID = rowsMovimientoIngreso.insertId;
        const detallesInfo = [];

        for (const detalle of detalles) {
            //Traer informacion de los detalles
            const { fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones } = detalle;

            //Insertar de a un detalle
            const detalleSql = `INSERT INTO detalle_movimiento (fk_movimiento, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones) 
                                VALUES (?,?,?,?,?,?,?,?)`;
            const detalleValues = [movimientoID, fk_elemento, estado, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega, Observaciones];
            let [detalleRows] = await pool.query(detalleSql, detalleValues);

            detallesInfo.push(detalleRows);

            const elementoSql = `SELECT stock FROM elemento WHERE Codigo_Elemento = ?;`;
            const elementoValues = [fk_elemento];
            const [elementoRows] = await pool.query(elementoSql, elementoValues);


            if (elementoRows.length > 0) {
                const stockNuevo = parseInt(elementoRows[0].stock) + parseInt(cantidad);

                const stockSql = `UPDATE elemento SET stock =? WHERE Codigo_Elemento =?`;
                const stockValues = [stockNuevo, fk_elemento];
                const [responseStock] = await pool.query(stockSql, stockValues);
                console.log(responseStock);
            }
        };

        await pool.query("COMMIT");
        return res.status(200).json({ message: "Registro Exitoso", movimiento: rowsMovimientoIngreso, detalles: detalles });
    } catch (error) {
        await pool.query("ROLLBACK");
        //Enviar error por servidor
        return res.status(500).json({ message: error });
    }
};

export const RegistrarDetalleMovimiento = async (req, res) => {
    try {
        const { Movimiento, Elemento, Fecha, Cantidad, Recibe, Entrega } = req.body;
        const { movimientoId } = req.params.id;
        let fecha;

        if(Fecha === '') fecha = null 
        else Fecha = Fecha

        const detalleSql = `INSERT INTO detalle_movimiento (fk_movimiento, fk_elemento, fecha_vencimiento, cantidad, Usuario_recibe, Usuario_entrega) 
        VALUES ( ?, ?, ?, ?, ?, ?)`;
        const detalleValues = [Movimiento, Elemento, fecha, Cantidad, Recibe, Entrega];
        let [detalleRows] = await pool.query(detalleSql, detalleValues);

        if(detalleRows.affectedRows > 0) {
            return res.status(200).json({ message: "Detalle Registrado" });
        }
    } catch (error) {
        console.log(error);
    }
}