import { pool } from "../database/conexion.js";

//Elementos
export const ReportOfElements = async (req, res) => {
  try {
    const sql = `
        SELECT 
            e.element_id,
            e.name AS element_name,
            e.stock,
            DATE_FORMAT(e.created_at, '%d/%m/%Y') AS created_at,
            c.name AS category,
            w.name AS warehouse,
            wl.name AS wlocation,
            COALESCE(SUM(md.quantity), 0) AS quantity,
            (e.stock + COALESCE(SUM(md.quantity), 0)) AS total
        FROM 
            elements e
        JOIN 
            categories c ON e.category_id = c.category_id
        JOIN 
            batches b ON e.element_id = b.element_id
        JOIN 
            batch_location_infos bli ON b.batch_id = bli.batch_id
        JOIN 
            warehouse_locations wl ON bli.warehouseLocation_id = wl.warehouseLocation_id
        JOIN 
            warehouses w ON wl.warehouse_id = w.warehouse_id
        LEFT JOIN 
            movement_details md ON e.element_id = md.element_id
        WHERE 
            e.status = '1'
        GROUP BY 
            e.element_id,
            e.name,
            e.stock,
            e.created_at,
            c.name,
            w.name,
            wl.name
        ORDER BY 
            e.element_id;
        `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report of Elements", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Reporte Elementos expirados
export const ReportingOfExpiredItems = async (req, res) => {
  try {
    const sql = `
SELECT 
    b.batch_id,
    e.element_id,
    e.stock,
    e.name AS element_name,
    c.name AS category,
    et.name AS element_type,
    mu.name AS measurement_unit,
    b.batch_serial,
    DATE_FORMAT(b.expiration, '%d/%m/%Y') AS expiration_date,
    bl.quantity,
    wl.name AS wlocation,
    w.name AS warehouse
FROM
    batches b
    INNER JOIN elements e ON b.element_id = e.element_id
    INNER JOIN categories c ON e.category_id = c.category_id
    INNER JOIN element_types et ON e.elementType_id = et.elementType_id
    LEFT JOIN measurement_units mu ON e.measurementUnit_id = mu.measurementUnit_id
    INNER JOIN batch_location_infos bl ON b.batch_id = bl.batch_id
    INNER JOIN warehouse_locations wl ON bl.warehouseLocation_id = wl.warehouseLocation_id
    INNER JOIN warehouses w ON wl.warehouse_id = w.warehouse_id
WHERE
    b.expiration IS NOT NULL
 AND (b.expiration <= CURRENT_DATE()
         OR b.expiration BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY))

ORDER BY
    b.expiration;
      `;
    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report of Expired Items", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Modal Elementos expirados
export const ExpiredModal = async (req, res) => {
  try {
    const sql = `
SELECT 
    COUNT(*) AS total_count
FROM
    batches b
    INNER JOIN elements e ON b.element_id = e.element_id
    INNER JOIN categories c ON e.category_id = c.category_id
    INNER JOIN element_types et ON e.elementType_id = et.elementType_id
    LEFT JOIN measurement_units mu ON e.measurementUnit_id = mu.measurementUnit_id
    INNER JOIN batch_location_infos bl ON b.batch_id = bl.batch_id
    INNER JOIN warehouse_locations wl ON bl.warehouseLocation_id = wl.warehouseLocation_id
    INNER JOIN warehouses w ON wl.warehouse_id = w.warehouse_id
WHERE
    b.expiration IS NOT NULL
 AND (b.expiration <= CURRENT_DATE()
         OR b.expiration BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY))
        `;

    const [rows] = await pool.query(sql);

    if (rows.length > 0) {
      const quantityResults = rows[0].total_count;
      return res.status(200).json(quantityResults);
    } else {
      return res
        .status(200)
        .json({ message: "No data were found to generate the report" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Reporetes Elementos Desactivados
export const ReportOffItems = async (req, res) => {
  try {
    const sql = `
          SELECT 
              e.element_id AS element_id, 
              e.name AS element_name, 
              e.stock AS stock,
              DATE_FORMAT(e.updated_at, '%d/%m/%Y') AS update_at, 
              w.name AS warehouse,
              wl.name AS wlocation,
              c.name AS category,
              et.name AS element_type,
              b.batch_serial AS batch_serial,
              mu.name AS measurement_unit
          FROM 
              elements e
          JOIN 
              batches b ON e.element_id = b.element_id
          JOIN 
              batch_location_infos bli ON b.batch_id = bli.batch_id
          JOIN 
              warehouse_locations wl ON bli.warehouseLocation_id = wl.warehouseLocation_id
          JOIN 
              warehouses w ON wl.warehouse_id = w.warehouse_id
          LEFT JOIN 
              categories c ON e.category_id = c.category_id
          JOIN 
              element_types et ON e.elementType_id = et.elementType_id
          LEFT JOIN 
              measurement_units mu ON e.measurementUnit_id = mu.measurementUnit_id
          WHERE 
              e.status = '0'
          ORDER BY 
              e.updated_at DESC;
      `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report Off Items", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Reporte Stock mínimo
export const ReportStockMin = async (req, res) => {
  try {
    const sql = `
            SELECT 
                w.name AS warehouse,
                e.name AS element_name, 
                e.element_id AS element_id, 
                wl.name AS wlocation, 
                e.stock AS stock,
                et.name AS element_type,
                mu.name AS measurement_unit,
                c.name AS category,
                GROUP_CONCAT(DISTINCT b.batch_serial ORDER BY b.batch_serial ASC SEPARATOR ', ') AS batch_serial,
                COUNT(CASE WHEN md.loanStatus_id = '1' THEN 1 END) AS LoanElementsCount
            FROM 
                warehouses w
            JOIN 
                warehouse_locations wl ON w.warehouse_id = wl.warehouse_id
            JOIN 
                batch_location_infos bli ON wl.warehouseLocation_id = bli.warehouseLocation_id
            JOIN 
                batches b ON bli.batch_id = b.batch_id
            JOIN 
                elements e ON b.element_id = e.element_id
            LEFT JOIN 
                movement_details md ON b.batch_id = md.batch_id
            LEFT JOIN 
                element_types et ON e.elementType_id = et.elementType_id
            LEFT JOIN 
                measurement_units mu ON e.measurementUnit_id = mu.measurementUnit_id
            LEFT JOIN 
                categories c ON e.category_id = c.category_id
            WHERE 
                e.stock < 10 
                AND e.status = '1'
            GROUP BY 
                e.element_id, w.name, wl.name, et.name, mu.name, c.name
            ORDER BY 
                w.name, e.name;
    `;
    const [rows] = await pool.query(sql);

    if (rows.length > 0) {
      const report = {};
      rows.forEach((row) => {
        const element = {
          warehouse: row.warehouse,
          element_name: row.element_name,
          element_id: row.element_id,
          wlocation: row.wlocation,
          Measurement_unit: row.measurement_unit,
          element_type: row.element_type,
          category: row.category,
          stock: row.stock,
          batch_serial: row.batch_serial,
          LoanElementsCount: row.LoanElementsCount,
        };

        if (!report[row.warehouse]) {
          report[row.warehouse] = [];
        }
        report[row.warehouse].push(element);
      });
      return res.status(200).json(report);
    } else {
      return res
        .status(200)
        .json({ message: "No data were found to generate the report" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Modal StockMin
export const stockMinModal = async (req, res) => {
  try {
    const sql = `
          SELECT 
            COUNT(*) AS Total
          FROM 
            elements e
          WHERE
            e.status = '1' 
            AND e.stock < 10;
        `;

    const [rows] = await pool.query(sql);

    if (rows.length > 0) {
      const quantityResults = rows[0].Total;
      return res.status(200).json(quantityResults);
    } else {
      return res
        .status(200)
        .json({ message: "No data were found to generate the report" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Prestamos vencidos
export const CarryOverOfLoansDue = async (req, res) => {
  try {
    const sql = `
                SELECT 
                CONCAT(u.name, ' ', u.lastname) AS user_application,
                u.identification,
                u.phone,
                md.remarks,
                md.quantity,
                DATE_FORMAT(m.estimated_return, '%d/%m/%Y') AS estimated_return,
                DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at,
                e.name AS element_name,
                e.element_id
            FROM 
                users u
            LEFT JOIN 
                movements m ON u.user_id = m.user_application
            LEFT JOIN 
                movement_details md ON m.movement_id = md.movement_id
            LEFT JOIN 
                elements e ON md.element_id = e.element_id
            WHERE 
                m.estimated_return < CURDATE();
      `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report Loans Due", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Prestamos Vencidos modal
export const LoansDueModal = async (req, res) => {
  try {
    const sql = `
SELECT 
    COUNT(*) AS total
FROM 
    users u
LEFT JOIN 
    movements m ON u.user_id = m.user_application
LEFT JOIN 
    movement_details md ON m.movement_id = md.movement_id
LEFT JOIN 
    elements e ON md.element_id = e.element_id
WHERE 
    m.estimated_return < CURDATE();
      `;

      const [rows] = await pool.query(sql);

      if (rows.length > 0) {
        const quantityResults = rows[0].total;
        return res.status(200).json(quantityResults);
      } else {
        return res
          .status(200)
          .json({ message: "No data were found to generate the report" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

//Préstamos activos
export const CarryOverActiveLoans = async (req, res) => {
  try {
    const sql = `
      SELECT 
    e.name AS element_name,
    e.element_id,
    md.quantity,
    md.remarks,
    CONCAT(ua.name, ' ', ua.lastname) AS user_application,
    CONCAT(ur.name, ' ', ur.lastname) AS user_receiving,
    ls.name AS loan_status,
    DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at,
    DATE_FORMAT(m.estimated_return, '%d/%m/%Y') AS estimated_return
FROM 
    movement_details md
JOIN 
    movements m ON md.movement_id = m.movement_id
JOIN 
    elements e ON md.element_id = e.element_id
LEFT JOIN 
    users ua ON m.user_application = ua.user_id
LEFT JOIN 
    users ur ON md.user_receiving = ur.user_id
JOIN 
    loan_statuses ls ON m.movementLoan_status = ls.loanStatus_id
WHERE 
    m.movementLoan_status = '5' 
    AND m.estimated_return >= CURDATE();

      `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report Loans Outstanding", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Historial Préstamos
export const HistoryOfLoans = async (req, res) => {
  try {
    const sql = `
          SELECT 
                e.name AS element_name,
                e.element_id,
                md.quantity,
                md.remarks,
                CONCAT(ua.name, ' ', ua.lastname) AS user_application,
                CONCAT(ur.name, ' ', ur.lastname) AS user_receiving,
                ls.name AS loan_status,
                DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at,
                DATE_FORMAT(m.estimated_return, '%d/%m/%Y') AS estimated_return,
                DATE_FORMAT(m.actual_return, '%d/%m/%Y') AS actual_return,
                CONCAT(ur2.name, ' ', ur2.lastname) AS user_returning
            FROM 
                movement_details md
            JOIN 
                movements m ON md.movement_id = m.movement_id
            JOIN 
                elements e ON md.element_id = e.element_id
            LEFT JOIN 
                users ua ON m.user_application = ua.user_id
            LEFT JOIN 
                users ur ON m.user_receiving = ur.user_id
            LEFT JOIN 
                users ur2 ON m.user_returning = ur2.user_id
            JOIN 
                loan_statuses ls ON m.movementLoan_status = ls.loanStatus_id;
        `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report History Loans", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Prestamos activos para modal
export const CarryOverActiveLoansModal = async (req, res) => {
  try {
    const sql = `
      SELECT COUNT(*) AS AmountOfLoans
      FROM 
          movements m
      JOIN 
          loan_statuses ls ON m.movementLoan_status = ls.loanStatus_id
      WHERE 
          m.movementLoan_status = '5' AND m.estimated_return >= CURDATE();
    `;
    const [result] = await pool.query(sql);

    if (result.length > 0) {
      const quantityResults = result[0].AmountOfLoans;
      return res.status(200).json(quantityResults);
    } else {
      return res
        .status(200)
        .json({ message: "No data were found to generate the report" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Reporte Movimientos
export const ReportOfMovements = async (req, res) => {
  try {
    const sql = `
        SELECT 
            CONCAT(u1.name, ' ', u1.lastname) AS user_manager,
            CONCAT(u2.name, ' ', u2.lastname) AS user_action,
            m.movement_id, 
            DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at,
            md.element_id, 
            md.quantity, 
            md.remarks, 
            b.batch_serial, 
            e.name AS element_name,
            mt.name AS movement_type
        FROM 
            movements m
        JOIN 
            movement_details md ON m.movement_id = md.movement_id
        JOIN 
            batches b ON md.batch_id = b.batch_id
        JOIN 
            elements e ON md.element_id = e.element_id
        JOIN 
            movement_types mt ON m.movementType_id = mt.movementType_id
        JOIN 
            users u1 ON m.user_manager = u1.user_id
        LEFT JOIN 
            users u2 ON m.user_returning = u2.user_id
        WHERE 
            m.movementType_id = 1

        UNION

        SELECT 
            CONCAT(u1.name, ' ', u1.lastname) AS user_manager,
            CONCAT(u2.name, ' ', u2.lastname) AS user_action,
            m.movement_id, 
            DATE_FORMAT(m.created_at, ('%d/%m/%Y')) AS created_at,
            md.element_id, 
            md.quantity, 
            md.remarks, 
            b.batch_serial, 
            e.name AS element_name,
            mt.name AS movement_type_name
        FROM 
            movements m
        JOIN 
            movement_details md ON m.movement_id = md.movement_id
        JOIN 
            batches b ON md.batch_id = b.batch_id
        JOIN 
            elements e ON md.element_id = e.element_id
        JOIN 
            movement_types mt ON m.movementType_id = mt.movementType_id
        JOIN 
            users u1 ON m.user_manager = u1.user_id
        LEFT JOIN 
            users u2 ON m.user_receiving = u2.user_id
        WHERE 
            m.movementType_id = 2
        ORDER BY 
            movement_id ASC;
      `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report of Movements", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Reporte solicitudes
export const ReportOfApplications = async (req, res) => {
  try {
    const sql = `
        SELECT 
            CONCAT(u.name, ' ', u.lastname) AS user_applicant,
            r.name AS role_name,
            e.name AS element_name,
            e.element_id,
            u.course_id,
            u.user_id,
            DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at,
            DATE_FORMAT(m.actual_return, '%d/%m/%Y') AS actual_return,
            CONCAT(u2.name, ' ', u2.lastname) AS user_receiving
        FROM 
            movement_details md
        JOIN 
            movements m ON md.movement_id = m.movement_id
        JOIN 
            users u ON m.user_application = u.user_id
        JOIN 
            roles r ON u.role_id = r.role_id
        JOIN 
            elements e ON md.element_id = e.element_id
        LEFT JOIN 
            users u2 ON m.user_receiving = u2.user_id
        ORDER BY
            created_at DESC;
      `;

    const [result] = await pool.query(sql);

    if (result.length > 0) {
      return res
        .status(200)
        .json({ message: "Report of Applications", datos: result });
    } else {
      return res.status(200).json({
        message: "No data were found to generate the report",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//Solicitudes Modal
export const ApplicationsModal = async (req, res) => {
  try {
    const sql = `
          SELECT 
              COUNT(*) AS count
          FROM 
              movement_details md
          JOIN 
              movements m ON md.movement_id = m.movement_id
          JOIN 
              users u ON m.user_application = u.user_id
          JOIN 
              roles r ON u.role_id = r.role_id
          JOIN 
              elements e ON md.element_id = e.element_id
          LEFT JOIN 
              users u2 ON m.user_receiving = u2.user_id;
        `;

    const [rows] = await pool.query(sql);

    if (rows.length > 0) {
      const quantityResults = rows[0].count;
      return res.status(200).json(quantityResults);
    } else {
      return res
        .status(200)
        .json({ message: "No data were found to generate the report" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
