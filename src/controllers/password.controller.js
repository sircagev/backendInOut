import { pool } from "../database/conexion.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"

const tokenPassword = async (peticion, respuesta) => {
    try {
        const { email_usuario } = peticion.body;
        const sql = "SELECT * FROM usuario WHERE email_usuario = ?"
        const [user] = await pool.query(sql, [email_usuario]);
        
        if (user.length > 0) {
            console.log(user[0].id_usuario);
        } else {
            return respuesta.status(404).json({ "message": "Usuario no encontrado" });
        }

        const token = jwt.sign({ id_usuario: user[0].id_usuario }, "palabraSecreta", { expiresIn: "2h" });
        console.log(token);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "proyectoformativoinout@gmail.com",
                pass: "htpe golx opwo gqge" 
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: "proyectoformativoinout@gmail.com",
            to: user[0].email_usuario,
            subject: "Restablecer Contraseña In-Out",
            text: `Querido Usuario da click en el siguiente enlace para restablecer la Contraseña http://localhost:3001/login?token=${token}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return respuesta.status(500).json({
                    "message": "No se pudo enviar el Correo"
                });
            }
            respuesta.send({
                "message": "Correo enviado Exitosamente"
            });
        });
    } catch (error) {
        respuesta.status(500);
        respuesta.send(error.message);
    }
}

const resetPassword = async (peticion, respuesta) => {
    try {
        const { token, contraseña_usuario } = peticion.body;

        const decoded = jwt.verify(token, "palabraSecreta");
        const user = decoded.id_usuario;

        const sql = "SELECT * FROM usuario WHERE id_usuario = ?";
        const [usuario] = await pool.query(sql, [user]);

        if (usuario.length === 0) {
            return respuesta.status(404).json({
                "message": "Usuario no encontrado"
            });
        }
        // Encriptar la identificación para usarla como contraseña
        const contraseniaForHash = contraseña_usuario.toString()
        const saltRounds = 10; // Cost factor for bcrypt
        const hashedPassword = await bcrypt.hash(contraseniaForHash, saltRounds);

        const sqlUpdate = "UPDATE usuario SET contraseña_usuario = ? WHERE id_usuario = ?";
        const [actualizar] = await pool.query(sqlUpdate, [hashedPassword, user]);

        if (actualizar.affectedRows > 0) {
            return respuesta.status(200).json({
                "message": "Contraseña actualizada"
            });
        } else {
            return respuesta.status(400).json({
                "message": "No se pudo actualizar la contraseña"
            });
        }
    } catch (error) {
        respuesta.status(500);
        respuesta.send(error.message);
    }
}

export const password = {
    tokenPassword,
    resetPassword
}
