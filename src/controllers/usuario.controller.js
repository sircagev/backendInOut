import {pool} from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const registrarUsuario = async (req, res) => {
    try {
        let { nombre_usuario, apellido_usuario, email_usuario, rol, numero, Id_ficha } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json(errors);

        // Asignar la contraseña del usuario al mismo valor que el nombre de usuario
        let contraseña_usuario = nombre_usuario;

        let sql = `INSERT INTO usuario (nombre_usuario, apellido_usuario, email_usuario, rol, numero, contraseña_usuario, Id_ficha)
                    VALUES ('${nombre_usuario}', '${apellido_usuario}', '${email_usuario}', '${rol}', '${numero}', '${contraseña_usuario}', '${Id_ficha}')`;

        let [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            return res.status(200).json({ 'message': 'Usuario Registrado con Éxito' });
        } else {
            return res.status(403).json({ 'message': 'Usuario No Registrado' });
        }
    } catch (e) {
        return res.status(500).json({ 'message': e.message });
    }
}



export const ListarUsuario = async(req, res) =>{

    let[result] = await pool.query('select *from usuario')

    if(result.length>0){
        return res.status(200).json({result});
    }
    else{
       return res.status(403).json({'message': 'No existen Usuarios Registrados'});            
    }
}

export const EliminarUsuario= async(req, res) => {

    let id_usuario = req.params.id;
    let sql = `delete from usuario where id_usuario = ${id_usuario}`;
    
    let[rows]= await pool.query(sql);

    if(rows.affectedRows){
            return res.status(200).json({'message': 'Usuarios Eliminado con exito'});
        }
        else{
           return res.status(403).json({'message': 'Usuarios no elimiado con exito'});            
        }
    }

export const BuscarUsuario = async(req, res) => {

    let id_usuario = req.params.id;
    let sql = `select * from usuario where id_usuario = ${id_usuario}`;

    let[rows]= await pool.query(sql, [id_usuario]);

    if(rows.length){
        return res.status(200).json({'Datos': rows});
    }
    else{
       return res.status(403).json({'message': 'Usuarios No encontrado'});            
    }
}

export const ActualizarUsuario= async(req, res) =>{
    try{

        let id_usuario = req.params.id;
        let{nombre_usuario,apellido_usuario,email_usuario,rol,numero,contraseña_usuario,Id_ficha}= req.body;
        let sql = `UPDATE usuario SET nombre_usuario = ?,
                                       apellido_usuario = ?,
                                       email_usuario = ?,
                                       rol = ?,
                                       numero = ?,
                                       contraseña_usuario = ?,
                                       Id_ficha = ?
                                       WHERE id_usuario = ?`
    
        let[rows] = await pool.query(sql, [nombre_usuario,apellido_usuario,email_usuario,rol,numero,contraseña_usuario,Id_ficha, id_usuario]);

        if(rows.affectedRows){
            return res.status(200).json({'message': 'Usuario actualizado con exito'});
        }
        else{
           return res.status(403).json({'message': 'Usuarios No actualizado'});            
        }
    }
    catch(e){
        return res.status(500).json({'message': e.message});  
    }

}

export const EstadoUsuario = async(req, res)=>{

    let id_usuario = req.params.id;
    let{Estado} = req.body;
    let sql = `UPDATE usuario SET Estado = ?
                 WHERE id_usuario = ?`

    let[rows]= await pool.query(sql, [Estado, id_usuario]);

    if(rows.affectedRows){
        return res.status(200).json({'message': 'Estado Actualizado con Exito'});
    }
    else{
       return res.status(403).json({'message': 'Estado no Actualizado'});            
    }
}

export const InicioSesion = async (req, res) => {
    try {
        const { email_usuario, contraseña_usuario } = req.body;
        const sql = `SELECT * FROM usuario WHERE email_usuario = ? AND contraseña_usuario = ?`;
        const [rows] = await pool.query(sql, [email_usuario, contraseña_usuario]);

        if (rows.length > 0) {
            return res.status(200).json({ 'message': 'Inicio de sesión exitoso' });
        } else {
            return res.status(403).json({ 'message': 'Email o contraseña incorrectos' });
        }
    } catch (error) {
        return res.status(500).json({ 'message': error.message });
    }
}

export const DesactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `UPDATE usuario SET Estado = 'Inactivo' WHERE id_usuario = ?`;

        const [result] = await pool.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Usuario desactivado con éxito." });
        } else {
            return res.status(404).json({ "message": "Usuario no desactivado." });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




