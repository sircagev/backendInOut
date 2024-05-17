import { pool } from '../database/conexion.js';
import jwt from 'jsonwebtoken';

export const validarUsuario = async (req, res) => {
  try {
    let { email_usuario, contraseña_usuario } = req.body;
    let sql = `SELECT id_usuario, nombre_usuario, apellido_usuario, rol, numero, Id_ficha, Estado 
               FROM usuario 
               WHERE email_usuario = '${email_usuario}' AND contraseña_usuario = '${contraseña_usuario}'`;
    let [rows] = await pool.query(sql);

    if (rows.length > 0) {
      let user = rows[0];

      // Verificar si el estado del usuario es "Activo"
      if (user.Estado === 'Activo') {
        // Generar token
        let token = jwt.sign({ userId: user.id_usuario }, process.env.SECRET_KEY, {
          expiresIn: process.env.TIME,
        });

        // Devolver nombre de usuario, rol y token
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
      return res.status(404).json({ message: "Usuario no autenticado" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};


  export const validarToken = async (req, res, next) => {
    try {
      let token_Cliente = req.headers['token'];
      if(!token_Cliente){
      return res.status(402).json({"msg": "token requerido"});
      }else {
    let decode = jwt.verify(token_Cliente, process.env.SECRET_KEY,(error, decoded) =>{
      if(error) return res.status(402).json({"msg": "token inválido"});
      else next();
    }); 
    } 
  }catch (e) {
   return res.status(500).json({"msg": e.message})   
  }
  };