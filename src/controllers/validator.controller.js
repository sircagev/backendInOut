import { pool } from '../database/conexion.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const validarUsuario = async (req, res) => {
  try {
    let { email, password } = req.body;

    let sql = `SELECT user_id, name, lastname, phone, email, identification, role_id, position_id, course_id, password, status
               FROM users 
               WHERE email = ?;`;
    let [rows] = await pool.query(sql, [email]);

    if (rows.length > 0) {
      let user = rows[0];

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Verificar si el estado del usuario es "Activo"
        if (user.status === '1') {
          // Generar token
          let token = jwt.sign({
            id: user.user_id,
            name: user.name,
            lastname: user.lastname,
            phone: user.phone,
            email: user.email,
            identification: user.identification,
            role: user.role_id,
            position_id: user.position_id,
            course_id: user.course_id,
            estado: user.status
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
            userName: user.name,
            lastname: user.lastname,
            phone: user.phone,
            email: user.email,
            identification: user.identification,
            role: user.role_id,
            position_id: user.position_id,
            course_id: user.course_id,
            user_id: user.user_id,
            estado: user.status
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
    console.log(e);
    return res.status(500).json({
      message: e.message,
      error: "Error en la autenticación del usuario"
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