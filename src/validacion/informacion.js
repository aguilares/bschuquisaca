// const { check } = require('express-validator')
import { check } from "express-validator"
// const { validaciones } = require('./headers')
import { validaciones } from "./headers.js"

export const insertar = [


    check('nombre')
        .exists()
        .isLength({ min: 4, max: 50 }),

    check('telefono')
        .exists()
        .isNumeric()
        .isLength({ min: 4, max: 25 }),
    check('direccion')
        .exists()
        .isString()
        .isLength({ min: 5, max: 100 }),
    check('correo')
        .exists()
        .matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/),
    check('creado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('nombre')
        .isLength({ min: 4 })
        .exists(),
    check('telefono')
        .isNumeric()
        .isLength({ min: 4, max: 25 })
        .exists(),
    check('direccion')
        .exists()
        .isString()
        .isLength({ min: 5, max: 70 }),
    check('correo')
        .exists()
        .matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/),
    check('modificado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const eliminar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const buscar = [
    check('dato').isLength({ min: 1 }).exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

// buscar