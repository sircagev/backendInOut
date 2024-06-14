import { pool } from '../database/conexion.js';


//modulo bodegas

export const ReportesBodegas = async (req, res) => {
    try {
        const sql = `SELECT nombre_bodega, ubicacion_bodega, estado FROM bodegas`;
        const [rows] = await pool.query(sql);

        if (rows.length > 0) {
            const bodegasActivas = rows.filter(bodega => bodega.estado === 'activo');
            const bodegasInactivas = rows.filter(bodega => bodega.estado === 'inactivo');
            
            return res.status(200).json({ 
                "bodegas_activas": bodegasActivas,
                "bodegas_inactivas": bodegasInactivas
            });
        } else {
            return res.status(404).json({ "message": "No se encontraron bodegas" });
        }
    } catch (e) {
        return res.status(500).json({ "message": `Error en el servidor: ${e.message}` });
    }
};  


//modulo usuarios

export const ReportesUsuarios = async (req, res) => {
    try {
        const sql = `SELECT nombre_usuario, apellido_usuario, email_usuario, rol, Estado, fecha_ingreso, fecha_desactivacion, Id_ficha FROM usuario`;
        const [rows] = await pool.query(sql);

        if (rows.length > 0) {
            const usuariosActivos = rows.filter(usuario => usuario.Estado === 'activo');
            const usuariosInactivos = rows.filter(usuario => usuario.Estado === 'inactivo');
            
            return res.status(200).json({ 
                "usuarios_activos": usuariosActivos,
                "usuarios_inactivos": usuariosInactivos
            });
        } else {
            return res.status(404).json({ "message": "No se encontraron usuarios" });
        }
    } catch (e) {
        return res.status(500).json({ "message": `Error en el servidor: ${e.message}` });
    }
};


//modulo elementos

// Reporte de elementos por categoría
export const ReporteElementosPorCategoria = async (req, res) => {
    try {
        
        const sql = `
            SELECT c.nombre_categoria, e.Nombre_elemento, e.stock, n.nombre_tipoElemento, me.Nombre_Medida, em.Nombre_empaque, u.Nombre_ubicacion
            FROM elemento AS e 
            JOIN categoria_elemento AS c ON e.fk_categoria = c.codigo_categoria 
            JOIN tipo_elemento AS n ON e.fk_tipoElemento = n.codigo_Tipo
            JOIN unidad_medida AS me ON e.fk_unidadMedida = me.codigo_medida
            JOIN tipo_empaque AS em ON e.fk_tipoEmpaque = em.Codigo_empaque
            JOIN detalle_ubicacion AS u ON e.fk_detalleUbicacion = u.codigo_Detalle
            WHERE e.Estado = 'Activo'
            ORDER BY c.nombre_categoria, e.Nombre_elemento ASC
        `;
        const [rows] = await pool.query(sql);

        if (rows.length > 0) {
            
            const reporte = {};
            rows.forEach(row => {
                if (!reporte[row.nombre_categoria]) {
                    reporte[row.nombre_categoria] = [];
                }
                reporte[row.nombre_categoria].push({
                    "Nombre_elemento": row.Nombre_elemento,
                    "stock": row.stock,
                    "Tipo_elemento": row.nombre_tipoElemento,
                    "Unidad_medida": row.Nombre_Medida,
                    "Empaque": row.Nombre_empaque,
                    "Ubicacion": row.Nombre_ubicacion
                });
            });
            return res.status(200).json(reporte);
        } else {
            return res.status(404).json({ "message": "No hay elementos registrados." });
        }
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
};

// Reporte de elementos por ubicación
export const ubicacionElementos = async (req, res) => {
    try {
        const sql = `
            SELECT 
                b.Nombre_bodega AS Bodega,
                e.Nombre_elemento AS Nombre_elemento,
                e.Codigo_elemento AS Id_elemento,
                du.Nombre_ubicacion AS Nombre_ubicacion,
                e.stock AS Stock
            FROM 
                bodega b
                JOIN detalle_ubicacion du ON b.codigo_Bodega = du.fk_bodega
                JOIN elemento e ON du.codigo_Detalle = e.fk_detalleUbicacion
                LEFT JOIN detalle_movimiento dm ON e.Codigo_elemento = dm.fk_elemento
            WHERE
                e.Estado = 'Activo'
            GROUP BY
                Bodega, Nombre_elemento, Id_elemento, Nombre_ubicacion, Stock
            ORDER BY
                Bodega, Nombre_elemento;
        `;
        
        const [rows] = await pool.query(sql);

        if (rows.length > 0) {
            const reporte = {};
            rows.forEach(row => {
                const elemento = {
                    "Bodega": row.Bodega,
                    "Nombre_elemento": row.Nombre_elemento,
                    "Id_elemento": row.Id_elemento,
                    "Nombre_ubicacion": row.Nombre_ubicacion,
                    "Stock": row.Stock
                };

                if (!reporte[row.Bodega]) {
                    reporte[row.Bodega] = [];
                }
                reporte[row.Bodega].push(elemento);
            });
            return res.status(200).json(reporte);
        } else {
            return res.status(404).json({ "message": "No hay elementos registrados." });
        }
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
};





//reporte inventario bajo

export const ReporteInventarioBajo = async (req, res) => {
    try {
        const umbral = 20; 

        const sql = `SELECT 
                        Nombre_elemento AS "Elemento",
                        stock AS "Cantidad Disponible"
                    FROM elemento
                    WHERE stock < ?`;

        const [result] = await pool.query(sql, [umbral]);

        if (result.length > 0) {
            return res.status(200).json({ message: "Elementos de inventario bajo encontrados", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron elementos de inventario bajo" });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

//modulo reservas



/*SELECT 
    tm.Nombre_movimiento AS "Tipo Movimiento",
    COUNT(*) AS "Cantidad de Movimientos"
FROM detalle_movimiento AS dm 
JOIN movimiento AS m ON dm.fk_movimiento = m.Codigo_movimiento
JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
GROUP BY tm.Nombre_movimiento;

SELECT 
    CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS "Usuario",
    COUNT(*) AS "Cantidad de Movimientos"
FROM detalle_movimiento AS dm 
JOIN movimiento AS m ON dm.fk_movimiento = m.Codigo_movimiento
JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
GROUP BY u.nombre_usuario, u.apellido_usuario;

SELECT 
    Codigo_movimiento AS "Código",
    fecha_movimiento AS "Fecha",
    CONCAT(nombre_usuario, ' ', apellido_usuario) AS "Usuario",
    Nombre_movimiento AS "Tipo Movimiento" 
FROM detalle_movimiento AS dm 
JOIN movimiento AS m ON dm.fk_movimiento = m.Codigo_movimiento
JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
WHERE fecha_movimiento BETWEEN '2024-01-01' AND '2024-03-01';*/

// reporte por tipo 


export const ReporteMovimientosPorTipo = async (req, res) => {
    try {
        const sql = `SELECT 
                        tm.Nombre_movimiento AS "Tipo Movimiento",
                        COUNT(*) AS "Cantidad de Movimientos"
                    FROM detalle_movimiento AS dm 
                    JOIN movimiento AS m ON dm.fk_movimiento = m.Codigo_movimiento
                    JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
                    GROUP BY tm.Nombre_movimiento`;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
            return res.status(200).json({ message: "Reporte de Movimientos por Tipo", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron movimientos para generar el reporte" });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}


// reporte por usuario


export const ReporteMovimientosPorUsuario = async (req, res) => {
    try {
        const sql = `SELECT 
                        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS "Usuario",
                        COUNT(*) AS "Cantidad de Movimientos"
                    FROM detalle_movimiento AS dm 
                    JOIN movimiento AS m ON dm.fk_movimiento = m.Codigo_movimiento
                    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
                    GROUP BY u.nombre_usuario, u.apellido_usuario`;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
            return res.status(200).json({ message: "Reporte de Movimientos por Usuario", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron movimientos para generar el reporte" });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

//reporte por fecha

//direccion para hacer la consulta  http://localhost:3000/reporte/movimientosfecha?fecha_inicio=2024-01-01&fecha_fin=2024-03-01


export const ReporteMovimientosPorFecha = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body;

        const sql = `SELECT 
                        Codigo_movimiento AS "Código",
                        fecha_movimiento AS "Fecha",
                        CONCAT(nombre_usuario, ' ', apellido_usuario) AS "Usuario",
                        Nombre_movimiento AS "Tipo Movimiento" 
                    FROM detalle_movimiento AS dm 
                    JOIN movimiento AS m ON dm.fk_movimiento = m.Codigo_movimiento
                    JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
                    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
                    WHERE fecha_movimiento BETWEEN ? AND ?`;

        const [result] = await pool.query(sql, [fechaInicio, fechaFin]);

        if (result.length > 0) {
            return res.status(200).json({ message: "Reporte de Movimientos por Fecha", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron movimientos para generar el reporte en el rango de fechas especificado" });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

//Modulo movimientos
//movimientos activos


export const ReportePrestamosActivos = async (req, res) => {
    try {
        const sql = `SELECT 
        Codigo_movimiento AS 'ID del Prestamo',
        CONCAT(nombre_usuario, ' ', apellido_usuario) AS 'Usuario',
        Nombre_elemento AS 'Elemento',
        fecha_movimiento AS 'Fecha del Prestamo'
    FROM movimiento AS m
    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
    JOIN detalle_movimiento AS dm ON m.Codigo_movimiento = dm.fk_movimiento
    JOIN elemento AS e ON dm.fk_elemento = e.Codigo_elemento
    WHERE m.Estado = 'En Prestamo'`;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
            return res.status(200).json({ message: "Prestamos activos encontrados", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron prestamos activos" });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}


//estado de todos los movimientos

export const ReporteEstadoPrestamos = async (req, res) => {
    try {
        const sql = `SELECT 
        Codigo_movimiento AS 'ID del Prestamo',
        CONCAT(nombre_usuario, ' ', apellido_usuario) AS 'Usuario',
        Nombre_elemento AS 'Elemento',
        m.Estado AS 'Estado del Prestamo'
    FROM movimiento AS m
    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
    JOIN detalle_movimiento AS dm ON m.Codigo_movimiento = dm.fk_movimiento
    JOIN elemento AS e ON dm.fk_elemento = e.Codigo_elemento`;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
            return res.status(200).json({ message: "Estado de prestamos encontrados", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontraron prestamos" });
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}


//historial de todos los movimientos

export const ReporteHistorialPrestamos = async (req, res) => {
    try {
        const sql = `
          SELECT 
    m.Codigo_movimiento AS 'ID del Prestamo',
    CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS 'Usuario',
    m.fecha_movimiento AS 'Fecha del Prestamo',
    tm.Nombre_movimiento AS 'Tipo de Movimiento',
    dm.Observaciones AS 'Observaciones',
    e.nombre_elemento AS 'Nombre del Elemento',
    e.stock AS 'Stock',
    dm.cantidad AS 'Cantidad',
    CONCAT(ur.nombre_usuario, ' ', ur.apellido_usuario) AS 'Usuario Recibe',
    CONCAT(ue.nombre_usuario, ' ', ue.apellido_usuario) AS 'Usuario Entrega',
    b.Nombre_bodega AS 'Nombre_bodega',
    du.Nombre_ubicacion AS 'Nombre_ubicacion'
FROM 
    movimiento AS m
    JOIN usuario AS u ON m.Usuario_solicitud = u.id_usuario
    JOIN detalle_movimiento AS dm ON m.Codigo_movimiento = dm.fk_movimiento
    JOIN elemento AS e ON dm.fk_elemento = e.Codigo_elemento
    JOIN usuario AS ur ON dm.Usuario_recibe = ur.id_usuario
    JOIN usuario AS ue ON dm.Usuario_entrega = ue.id_usuario
    JOIN tipo_movimiento AS tm ON m.fk_movimiento = tm.codigo_tipo
    JOIN detalle_ubicacion AS du ON e.fk_detalleUbicacion = du.codigo_Detalle
    JOIN bodega AS b ON du.fk_bodega = b.codigo_Bodega

        `;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
            return res.status(200).json({ message: "Historial de movimientos: ", datos: result });
        } else {
            return res.status(404).json({ message: "No se encontró historial de movimientos" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el historial de movimientos", error: error.message });
    }
};




