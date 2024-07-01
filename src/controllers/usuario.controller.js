import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

export const registrarUsuario = async (req, res) => {
    try {
        let { user_id, name, lastname, email, phone, identification, role_id, position_id, couse_id } = req.body;


        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(errors);

        // Verificar si el correo ya existe
        let checkEmailSql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        let [emailRows] = await pool.query(checkEmailSql, [email]);
        // Asignar la contraseña del usuario al mismo valor que el nombre de usuario

        if (emailRows[0].count > 0) { 
            return res.status(400).json({ 'message': 'El correo ya está registrado' });
        }

        // Verificar si el correo ya existe
        let checkIdentification = 'SELECT COUNT(*) as count FROM users WHERE identification = ?';
        let [emailIdentification] = await pool.query(checkIdentification, [identification]);
        // Asignar la contraseña del usuario al mismo valor que el nombre de usuario

        if (emailIdentification[0].count > 0) {
            return res.status(400).json({ 'message': 'La identificación ya está registrada' });
        }

        // Encriptar la identificación para usarla como contraseña
        const contraseniaForHash = identification.toString()
        const saltRounds = 10; // Cost factor for bcrypt
        const hashedPassword = await bcrypt.hash(contraseniaForHash, saltRounds);

        let sql = `INSERT INTO users (user_id, name, lastname, email, phone, identification, role_id, position_id, course_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let values = [user_id, name, lastname, email, phone , identification, role_id, position_id, couse_id];

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

export const EliminarUsuario = async (req, res) => {

    let id_usuario = req.params.id;
    let sql = `delete from users where user_id = ${id_usuario}`;

    let [rows] = await pool.query(sql);

    if (rows.affectedRows) {
        return res.status(200).json({ 'message': 'Usuarios Eliminado con exito' });
    }
    else {
        return res.status(403).json({ 'message': 'Usuarios no elimiado con exito' });
    }
}

export const BuscarUsuario = async (req, res) => {
    try {
        // Validar el ID de usuario
        const identificacion = req.params.id;
        if (!identificacion) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado' });
        }

        const sql = 'SELECT * FROM usuario WHERE identificacion = ?';
        const [rows] = await pool.query(sql, [identificacion]);

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

        let id_usuario = req.params.id;
        let { nombre_usuario, apellido_usuario, email_usuario, rol, numero, contraseña_usuario, Id_ficha, identificacion } = req.body;

        let sql = `UPDATE usuario SET nombre_usuario = ?,
                                       apellido_usuario = ?,
                                       email_usuario = ?,
                                       rol = ?,
                                       numero = ?,
                                       contraseña_usuario = ?,
                                       Id_ficha = ?,
                                       identificacion = ?
                                       WHERE id_usuario = ?`

        let [rows] = await pool.query(sql, [nombre_usuario, apellido_usuario, email_usuario, rol, numero, contraseña_usuario, Id_ficha, identificacion, id_usuario]);

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

export const EstadoUsuario = async (req, res) => {

    let id_usuario = req.params.id;
    let { Estado } = req.body;
    let sql = `UPDATE usuario SET Estado = ?
                 WHERE id_usuario = ?`

    let [rows] = await pool.query(sql, [Estado, id_usuario]);

    if (rows.affectedRows) {
        return res.status(200).json({ 'message': 'Estado Actualizado con Exito' });
    }
    else {
        return res.status(403).json({ 'message': 'Estado no Actualizado' });
    }
}

export const InicioSesion = async (req, res) => {
    try {
        const { identificacion, contraseña_usuario } = req.body;
        const sql = `SELECT * FROM usuario WHERE identificacion = ? AND contraseña_usuario = ? AND Estado = 'Activo'`;
        const [rows] = await pool.query(sql, [identificacion, contraseña_usuario]);

        if (rows.length > 0) {
            return res.status(200).json({ 'message': 'Inicio de sesión Exitoso' });
        } else {
            return res.status(403).json({ 'message': 'Usuario o Contraseña Incorrectos' });
        }
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

export const DesactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Consulta SQL para obtener el estado actual de la ubicación
        const sqlGetEstado = `SELECT Estado FROM usuario WHERE id_usuario = ?`;
        const [estadoResult] = await pool.query(sqlGetEstado, [id]);

        // Verificar si se encontró la ubicación
        if (estadoResult.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const estadoActual = estadoResult[0].Estado;
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
        const sqlUpdateEstado = `UPDATE usuario SET Estado = ? WHERE id_usuario = ?`;
        const [result] = await pool.query(sqlUpdateEstado, [nuevoEstado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `usuario actualizado a estado ${nuevoEstado} con éxito.` });
        } else {
            return res.status(404).json({ "message": "usuario no actualizado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};