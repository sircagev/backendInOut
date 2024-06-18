import { pool } from "../database/conexion.js";

// Reporte de elementos bajo Stock y ubicación
export const stockMinElementos = async (req, res) => {
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
                e.Estado = 'Activo' AND e.stock < 10
            GROUP BY
                Bodega, Nombre_elemento, Id_elemento, Nombre_ubicacion, Stock
            ORDER BY
                Bodega, Nombre_elemento;
        `;

    const [rows] = await pool.query(sql);

    if (rows.length > 0) {
      const reporte = {};
      rows.forEach((row) => {
        const elemento = {
          Bodega: row.Bodega,
          Nombre_elemento: row.Nombre_elemento,
          Id_elemento: row.Id_elemento,
          Nombre_ubicacion: row.Nombre_ubicacion,
          Stock: row.Stock,
        };

        if (!reporte[row.Bodega]) {
          reporte[row.Bodega] = [];
        }
        reporte[row.Bodega].push(elemento);
      });
      return res.status(200).json(reporte);
    } else {
      return res
        .status(404)
        .json({ message: "No hay elementos con bajo Stock por el momento" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Stock mínimo de elementos para el modal
export const stockMinModal = async (req, res) => {
    try {
      const sql = `
        SELECT 
          COUNT(*) AS Total
        FROM 
          elemento e
          JOIN detalle_ubicacion du ON e.fk_detalleUbicacion = du.codigo_Detalle
          JOIN bodega b ON du.fk_bodega = b.codigo_Bodega
        WHERE
          e.Estado = 'Activo' 
          AND e.stock < 10;
      `;
  
      const [rows] = await pool.query(sql);
  
      if (rows.length > 0) {
        const cantidadResultados = rows[0].Total;
        return res.status(200).json(cantidadResultados);
      } else {
        return res.status(404).json({ message: "No hay elementos con bajo Stock por el momento" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

// reporte por usuario
export const ReporteSolicitudesUsuario = async (req, res) => {
  try {
    const sql = `SELECT 
            u.rol AS Rol,
            u.numero AS Numero,
            u.id_ficha AS ID_Ficha,
            CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS Nombre_Usuario,
            m.usuario_solicitud AS Usuario_Solicitud,
            dm.fecha_vencimiento AS Fecha_de_Entrega,
            dm.fecha_creacion AS Fecha_de_Solicitud,
            dm.Observaciones AS Observaciones,
            dm.cantidad AS Cantidad,
            e.Nombre_elemento AS Elemento
        FROM 
            usuario u
        JOIN 
            movimiento m ON u.id_usuario = m.Usuario_solicitud
        JOIN 
            detalle_movimiento dm ON m.Codigo_movimiento = dm.fk_movimiento
        JOIN 
            elemento e ON dm.fk_elemento = e.Codigo_elemento;
        `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Reporte de Movimientos por Usuario", datos: result });
    } else {
      return res.status(404).json({
        message: "No se encontraron movimientos para generar el reporte",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Modulo movimientos
//movimientos activos

export const ReportePrestamosActivos = async (req, res) => {
  try {
    const sql = `SELECT 
            dm.fecha_vencimiento AS "Fecha de entrega",
            dm.fecha_creacion AS "Fecha de solicitud",
            dm.estado AS "Estado",
            CONCAT(u_recibe.nombre_usuario, ' ', u_recibe.apellido_usuario) AS "Solicitado por",
            CONCAT(u_entrega.nombre_usuario, ' ', u_entrega.apellido_usuario) AS "Autorizado por",
            dm.Observaciones,
            dm.cantidad,
            e.Nombre_elemento AS "Elemento"
        FROM 
            detalle_movimiento dm
        JOIN 
            usuario u_recibe ON dm.Usuario_recibe = u_recibe.id_usuario
        JOIN 
            usuario u_entrega ON dm.Usuario_entrega = u_entrega.id_usuario
        JOIN 
            elemento e ON dm.fk_elemento = e.Codigo_elemento
        WHERE 
            dm.estado IN ('En Prestamo', 'Confirmada');
            `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Prestamos activos encontrados", datos: result });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontraron prestamos activos" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Prestamos activos para modal
export const PrestamosActivosModal = async (req, res) => {
    try {
      const sql = `
        SELECT COUNT(*) AS cantidadPrestamosActivos
        FROM detalle_movimiento dm
        WHERE dm.estado = 'En Prestamo';
      `;
  
      const [result] = await pool.query(sql);
  
      if (result.length > 0) {
        const cantidadResultados = result[0].cantidadPrestamosActivos;
        return res.status(200).json(cantidadResultados);
      } else {
        return res.status(404).json({ message: "No se encontraron préstamos activos" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  //historial de todos los movimientos
export const ReporteHistorialMovimientos = async (req, res) => {
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
      return res
        .status(200)
        .json({ message: "Historial de movimientos: ", datos: result });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró historial de movimientos" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el historial de movimientos",
      error: error.message,
    });
  }
};