import { pool } from '../database/conexion.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const validarUsuario = async (req, res) => {
  try {
    let { email_usuario, contraseña_usuario } = req.body;

    let sql = `SELECT id_usuario, nombre_usuario, apellido_usuario, rol, numero, Id_ficha, Estado, contraseña_usuario 
               FROM usuario 
               WHERE email_usuario = ?;`;
    let [rows] = await pool.query(sql, [email_usuario]);

    if (rows.length > 0) {
      let user = rows[0];

      const match = await bcrypt.compare(contraseña_usuario, user.contraseña_usuario);

      if (match) {
        // Verificar si el estado del usuario es "Activo"
        if (user.Estado === 'Activo') {
          // Generar token
          let token = jwt.sign({
            id: user.id_usuario,
            role: user.rol,
            name: user.nombre_usuario,
            lastname: user.apellido_usuario,
            email: email_usuario,
            phone: user.numero
          }, process.env.SECRET_KEY, {
            expiresIn: process.env.TIME,
          });

          res.cookie('InOutToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 2, // 2 horas
            path: '/'
          });

          return res.status(200).json({
            message: "Usuario autenticado",
            token,
            userName: user.nombre_usuario,
            role: user.rol,
            codigo: user.id_usuario,
            estado: user.Estado
          });
        } else {
          return res.status(403).json({ message: "El usuario no está activo" });
        }
      } else {
        return res.status(404).json({ message: "Contraseña incorrecta" });
      }
    } else {
      return res.status(404).json({ message: "Usuario no autenticado" });
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: e.message,
      error: "No se que paso"
    });
  }
};

export const validarToken = async (req, res, next) => {
  let token_Cliente = req.headers['token'];
  if (!token_Cliente) {
    return res.status(402).json({ "msg": "token requerido" });
  }
  try {
    const decoded = jwt.verify(token_Cliente, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token no válido', error: e.message });
  }
};