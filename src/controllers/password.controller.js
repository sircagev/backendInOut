import { connection } from "../database/conexion.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"

const tokenPassword = async (peticion, respuesta) => {
    try {
        const { email_usuario } = peticion.body;
        const sql = "SELECT * FROM usuario WHERE email_usuario = ?"
        const [user] = await connection.query(sql, email_usuario);
        if (user.length > 0) {
            console.log(user[0].id_usuario);
        } else {
            return respuesta.status(404).json({"message": "Usuario no encontrado"});
        }
        

        const token = jwt.sign({ id_usuario: user[0].id_usuario }, "palabraSecreta", { expiresIn: "2h" });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "proyectoformativoinout@gmail.com",
                pass: "proyectoINOUT"
            }
        });

        const mailOptions = {
            from: "proyectoformativoinout@gmail.com",
            to: email,
            subject: "Recuperar contraseña",
            text: `Hola, da click en el siguiente enlace para restablecer la contraseña http://localhost:5173/restablecer?token=${token}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return respuesta.status(500).json({
                    "message": "No se pudo enviar el Correo"
                })
            }
            respuesta.send({
                "message": "Correo enviado Exitosamente"
            })
        })
    } catch (error) {
        respuesta.status(500)
        respuesta.send(error.message)
    }
}

const resetPassword = async (peticion, respuesta) => {
    try {
        const { token, contraseña_usuario } = peticion.body;

        const decoded = jwt.verify(token, "palabraSecreta");
        const user = decoded.id_usuario

        const sql = "SELECT * FROM usuario WHERE id_usuario = ?"
        const [usuario] = await connection.query(sql, user)

        if (!usuario) {
            return respuesta.status(404).json({
                "message": "Usuario no encontrado"
            })
        }
        const sqlUpdate = "UPDATE usuario SET contraseña_usuario = ? WHERE id_usuario = ?";
        const [actualizar] = await connection.query(sqlUpdate, [contraseña_usuario, user]);

        if (actualizar.affectedRows > 0) {
            return respuesta.status(200).json({
                "message": "Contraseña actualizada"
            })
        }
    } catch (error) {
        respuesta.status(500);
        respuesta.send(error.message);
    }
}

export const contraseña = {
    tokenPassword,
    resetPassword
}