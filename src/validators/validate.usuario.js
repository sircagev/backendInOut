import { check } from "express-validator";

export const validar_usuario = [
    check('nombre_usuario', 'Nombre Usuario Obligatorio')
    .not().isEmpty().isLength({max:50,min:4}),

    check('email_usuario', 'Correo Obligatorio').isEmail(),

    check('apellido_usuario', 'Apellido Usuario Obligatorio')
    .not().isEmpty().isLength({max:50,min:4}),
]