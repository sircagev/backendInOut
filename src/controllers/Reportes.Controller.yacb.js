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
            bli.quantity AS cant,
            IFNULL(SUM(CASE WHEN m.movementType_id = 4 AND m.movementLoan_status IN (1, 2, 3, 5) THEN md.quantity ELSE 0 END), 0) AS quantity,
            IFNULL(SUM(CASE WHEN m.movementType_id = 4 AND m.movementLoan_status IN (1, 2, 3, 5) THEN md.quantity ELSE 0 END), 0) + e.stock AS total
        FROM
            elements e
        LEFT JOIN
            categories c ON e.category_id = c.category_id
        LEFT JOIN
            batch_location_infos bli ON bli.batch_id = (
                SELECT
                    batch_id
                FROM
                    batches
                WHERE
                    element_id = e.element_id
                ORDER BY
                    created_at DESC
                LIMIT 1
            )
        LEFT JOIN
            warehouse_locations wl ON bli.warehouseLocation_id = wl.warehouseLocation_id
        LEFT JOIN
            warehouses w ON wl.warehouse_id = w.warehouse_id
        LEFT JOIN
            movement_details md ON md.element_id = e.element_id
        LEFT JOIN
            movements m ON md.movement_id = m.movement_id
        GROUP BY
            e.element_id, e.name, e.stock, e.created_at, c.name, w.name, wl.name, bli.quantity;
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
                  AND bl.quantity >= 1
              ORDER BY
                  b.expiration DESC;
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

//Reporetes Elementos Desactivados
export const ReportOffItems = async (req, res) => {
  try {
    const sql = `
          SELECT 
              e.element_id AS element_id, 
              e.name AS element_name, 
              e.stock AS stock,
              DATE_FORMAT(e.updated_at, '%d/%m/%Y') AS update_at, 
              c.name AS category,
              et.name AS element_type,
              mu.name AS measurement_unit
          FROM 
              elements e
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
                e.element_id,
                e.name AS element_name,
                e.stock,
                COALESCE(SUM(md.quantity), 0) AS LoanElementsCount,
                et.name AS element_type,
                mu.name AS measurement,
                c.name AS category
            FROM 
                elements e
            JOIN 
                categories c ON e.category_id = c.category_id
            JOIN 
                element_types et ON e.elementType_id = et.elementType_id
            JOIN 
                measurement_units mu ON e.measurementUnit_id = mu.measurementUnit_id
            LEFT JOIN 
                movement_details md ON e.element_id = md.element_id AND md.loanStatus_id = '5'
            WHERE 
                e.status = '1'
                AND e.stock < 10
                AND e.stock > 0
            GROUP BY 
                e.element_id,
                e.name,
                e.stock,
                et.name,
                mu.name,
                c.name
            HAVING 
                e.stock + COALESCE(SUM(md.quantity), 0) < 10
            ORDER BY 
                e.element_id;
            `;

        const [result] = await pool.query(sql);

        if (result.length > 0) {
          return res
            .status(200)
            .json({ message: "Report stock min", datos: result });
        } else {
          return res.status(200).json({
            message: "No data were found to generate the report",
          });
        }
      } catch (error) {
        return res.status(500).json({ message: error });
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
            GROUP_CONCAT(CONCAT(md.quantity, ' ', e.name) SEPARATOR ', ') AS element_name,
            DATE_FORMAT(m.estimated_return, '%d/%m/%Y') AS estimated_return,
            DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at,
            m.movement_id
        FROM 
            users u
        LEFT JOIN 
            movements m ON u.user_id = m.user_application
        LEFT JOIN 
            movement_details md ON m.movement_id = md.movement_id
        LEFT JOIN 
            elements e ON md.element_id = e.element_id
        WHERE 
            m.estimated_return < CURDATE()
        GROUP BY 
            u.name, u.lastname, u.identification, u.phone, md.remarks, m.estimated_return, m.created_at, m.movement_id
        ORDER BY 
            m.movement_id;
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

//Préstamos activos
export const CarryOverActiveLoans = async (req, res) => {
  try {
    const sql = `
            SELECT 
                GROUP_CONCAT(CONCAT(md.quantity, ' ', e.name) SEPARATOR ', ') AS element_name,
                md.remarks,
                m.movement_id AS movement_id,
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
                AND m.estimated_return >= CURDATE()
            GROUP BY 
                md.remarks, m.movement_id, ua.name, ua.lastname, ur.name, ur.lastname, ls.name, m.created_at, m.estimated_return
            ORDER BY 
                m.movement_id;
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
              GROUP_CONCAT(CONCAT(md.quantity, ' ', e.name,'') SEPARATOR ', ') AS element_name,
              md.remarks,
              CONCAT(ua.name, ' ', ua.lastname) AS user_application,
              CONCAT(ur.name, ' ', ur.lastname) AS user_receiving,
              ls.name AS loan_status,
              m.movement_id,
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
              loan_statuses ls ON m.movementLoan_status = ls.loanStatus_id
          GROUP BY 
              m.movement_id, md.remarks, ua.name, ua.lastname, ur.name, ur.lastname, ls.name, m.movement_id, m.created_at, m.estimated_return, m.actual_return, ur2.name, ur2.lastname
          ORDER BY 
              m.movement_id;
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
              GROUP_CONCAT(CONCAT(md.quantity, ' ', e.name) SEPARATOR ', ') AS element_name,
              u.course_id,
              m.movement_id,
              u.identification AS user_id,
              u.phone,
              DATE_FORMAT(m.created_at, '%d/%m/%Y') AS created_at
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
          WHERE 
              m.movementLoan_status = '1'
          GROUP BY 
              u.name, u.lastname, r.name, u.course_id, m.movement_id, u.identification, u.phone, m.created_at
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


//Modals
//Modal StockMin
 export const stockMinModal = async (req, res) => {
  try {
    const sql = `
          SELECT 
              COUNT(*) AS Total
          FROM (
              SELECT 
                  e.element_id,
                  e.stock,
                  COALESCE(SUM(md.quantity), 0) AS LoanElementsCount
              FROM 
                  elements e
              JOIN 
                  batches b ON e.element_id = b.element_id
              JOIN 
                  batch_location_infos bli ON b.batch_id = bli.batch_id
              LEFT JOIN 
                  movement_details md ON e.element_id = md.element_id AND md.loanStatus_id = '5'
              WHERE
                  e.status = '1'
                  AND e.stock <10
                  AND e.stock >0
              GROUP BY 
                  e.element_id, e.stock
              HAVING 
                  e.stock + COALESCE(SUM(md.quantity), 0) < 10
          ) AS filtered_elements;
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

//modal prestamos vencidos
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

//modal elementos expirados
export const ExpiredModal = async (req, res) => {
  try {
    const sql = `
          SELECT 
          COUNT(DISTINCT e.element_id) AS total_count
          FROM batches b
          INNER JOIN elements e ON b.element_id = e.element_id
          INNER JOIN categories c ON e.category_id = c.category_id
          INNER JOIN element_types et ON e.elementType_id = et.elementType_id
          LEFT JOIN measurement_units mu ON e.measurementUnit_id = mu.measurementUnit_id
          INNER JOIN batch_location_infos bl ON b.batch_id = bl.batch_id
          INNER JOIN warehouse_locations wl ON bl.warehouseLocation_id = wl.warehouseLocation_id
          INNER JOIN warehouses w ON wl.warehouse_id = w.warehouse_id
          WHERE b.expiration IS NOT NULL
          AND (b.expiration <= CURRENT_DATE()
              OR b.expiration BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 15 DAY))
          AND bl.quantity >= 1;
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

//modal solicitudes
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
              users u2 ON m.user_receiving = u2.user_id
          WHERE
              m.movementLoan_status = '1';
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

//modal prestamos activos
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



