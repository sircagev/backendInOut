import { check } from "express-validator";

export const validar_usuario = [
    check('name', 'Nombre Usuario Obligatorio')
    .not().isEmpty().isLength({max:50}),

    check('email', 'Correo Obligatorio').isEmail(),

    check('lastname', 'Apellido Usuario Obligatorio')
    .not().isEmpty().isLength({max:50}),
]