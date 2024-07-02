import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

export const registrarUsuario = async (req, res) => {
    try {
        let { user_id, name, lastname, phone, email, identification, role_id, position_id, course_id } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(errors);

        // Verificar si el correo ya existe
        let checkEmailSql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        let [emailRows] = await pool.query(checkEmailSql, [email]);
        if (emailRows[0].count > 0) {
            return res.status(400).json({ 'message': 'El correo ya está registrado' });
        }

        // Verificar si la identificación ya existe
        let checkIdentificationSql = 'SELECT COUNT(*) as count FROM users WHERE identification = ?';
        let [identificationRows] = await pool.query(checkIdentificationSql, [identification]);
        if (identificationRows[0].count > 0) {
            return res.status(400).json({ 'message': 'La identificación ya está registrada' });
        }

        // Verificar si el role_id existe
        let checkRoleIdSql = 'SELECT COUNT(*) as count FROM roles WHERE role_id = ?';
        let [roleRows] = await pool.query(checkRoleIdSql, [role_id]);
        if (roleRows[0].count === 0) {
            return res.status(400).json({ 'message': 'El rol no existe' });
        }

        // Verificar si el position_id existe
        let checkPositionIdSql = 'SELECT COUNT(*) as count FROM positions WHERE position_id = ?';
        let [positionRows] = await pool.query(checkPositionIdSql, [position_id]);
        if (positionRows[0].count === 0) {
            return res.status(400).json({ 'message': 'La posición no existe' });
        }

        // Encriptar la identificación para usarla como contraseña
        const contraseniaForHash = identification.toString();
        const saltRounds = 10; // Cost factor for bcrypt
        const hashedPassword = await bcrypt.hash(contraseniaForHash, saltRounds);

        let sql = `INSERT INTO users (user_id, name, lastname, phone, email, identification, role_id, position_id, course_id, password)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let values = [user_id, name, lastname, phone, email, identification, role_id, position_id, course_id, hashedPassword];

        let [rows] = await pool.query(sql, values);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ 'message': 'Usuario Registrado con Éxito' });
        } else {
            return res.status(403).json({ 'message': 'Usuario No Registrado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': e.message });
    }
};


export const ListarUsuario = async (req, res) => {

    let [result] = await pool.query('select *from users')

    if (result.length > 0) {
        return res.status(200).json(result);
    }
    else {
        return res.status(403).json({ 'message': 'No existen Usuarios Registrados' });
    }
}

export const BuscarUsuario = async (req, res) => {
    try {
        // Validar el ID de usuario
        const identification = req.params.id;
        if (!identification) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado' });
        }

        const sql = 'SELECT * FROM users WHERE identification = ?';
        const [rows] = await pool.query(sql, [identification]);

        if (rows.length > 0) {
            return res.status(200).json({ Datos: rows });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const ActualizarUsuario = async (req, res) => {
    try {

        let user_id = req.params.id;
        let { name, lastname, phone, email, identification, role_id, position_id, course_id } = req.body;

        let sql = `UPDATE users SET name = ?,
                                    lastname = ?,
                                    phone = ?,
                                    email = ?,
                                    identification = ?,
                                    role_id = ?,
                                    position_id = ?,
                                    course_id = ?
                                    WHERE user_id = ?`

        let [rows] = await pool.query(sql, [name, lastname, phone, email, identification, role_id, position_id, course_id, user_id]);

        if (rows.affectedRows) {
            return res.status(200).json({ 'message': 'Usuario actualizado con exito' });
        }
        else {
            return res.status(403).json({ 'message': 'Usuarios No actualizado' });
        }
    }
    catch (e) {
        return res.status(500).json({ 'message': e.message });
    }
}
export const DesactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual del usuario
        const sqlGetEstado = `SELECT status FROM users WHERE user_id = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró el usuario
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const estadoActual = estadoResult[0].status; // Asegúrate de que el nombre de la columna es 'status'
        let nuevoEstado;

        // Determinar el nuevo estado según el estado actual
        if (estadoActual === '0') {
            nuevoEstado = '1';
        } else if (estadoActual === '1') {
            nuevoEstado = '0';
        } else {
            // En caso de un estado no esperado, mantener el estado actual
            nuevoEstado = estadoActual;
        }

        // Actualizar el estado en la base de datos
        const sqlUpdateEstado = `UPDATE users SET status = ? WHERE user_id = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Usuario actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ message: "Usuario no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const ActualizarPerfil = async (req, res) => {
    try {
        const user_id = req.params.id;
        const { name, lastname, phone, email, identification, position_id, course_id } = req.body;

        // Validación básica de los campos de entrada
        if (!name || !lastname || !phone || !email || !identification || !position_id || !course_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Comprobar si el email tiene un formato válido
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'El correo electrónico no es válido' });
        }

        // Consulta SQL para actualizar el perfil del usuario
        const sql = `
            UPDATE users 
            SET name = ?, lastname = ?, phone = ?, email = ?, identification = ?, position_id = ?, course_id = ?
            WHERE user_id = ?
        `;

        const [rows] = await pool.query(sql, [name, lastname, phone, email, identification, position_id, course_id, user_id]);

        if (rows.affectedRows) {
            return res.status(200).json({ message: 'Perfil actualizado con éxito' });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};