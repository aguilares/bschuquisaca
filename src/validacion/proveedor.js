
import { check } from "express-validator"
import { validaciones } from "./headers.js"

export const insertar = [


    check('nombre')
        .exists()
        .isLength({ min: 3 })
        .isString(),

    check('nit')
        .exists()
        .isLength({ min: 3 })
        .isString(),
    check('pais')
        .exists()
        .isLength({ min: 3, max: 100 })
        .isString(),
    check('cuenta')
        .exists()
        .matches(/^\d{5,30}$/),
    check('telefono')
        .exists()
        .isNumeric()
        .isLength({ min: 4, max: 100}),
    check('direccion')
        .exists()
        .isString()
        .isLength({ min: 3, max: 100 }),
    check('creado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const editar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('nombre')
        .exists()
        .isLength({ min: 3 })
        .isString(),

    check('nit')
        .exists()
        .isLength({ min: 3 })
        .isString(),
    check('pais')
        .exists()
        .isLength({ min: 3 })
        .isString(),
    check('cuenta')
        .exists()
        .matches(/^\d{5,30}$/),
    check('telefono')
        .exists()
        .isNumeric()
        .isLength({ min: 4, max: 25 }),
    check('direccion')
        .exists()
        .isString()
        .isLength({ min: 3, max: 100 }),
    check('modificado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
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

export const siguiente = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const anterior = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

// buscar