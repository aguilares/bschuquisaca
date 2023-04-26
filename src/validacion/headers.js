// const { validationResult } = require('express-validator');
import { validationResult } from "express-validator"

export const validaciones = (req, res, next) => {

    // console.log("DATOS EN LA CABECERA: ",req.body)
    const error = validationResult(req)
    if (!error.isEmpty()) {
        console.log('no pasa validaciones', error, req.body)
        return res.json({ msg: 'El servidor no puede interpretar los campos. Verifique que sus datos esten bien escritos', ok:false })
    }
    return next()
}
// module.exports = { validaciones }