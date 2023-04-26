import { check } from "express-validator"
import { validaciones } from "./headers.js"

export const habilitar = [


    check('id')
        .exists()
        .isLength({ min: 1 }).isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const insertar = [

    check('idServicio1')
        .exists()
        .isLength({ min: 1 }).isNumeric(),
    check('nombre')
        .isLength({ min: 4 })
        .exists(),
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
export const insertarDependientes = [

    check('codigo')
        .exists()
        .isLength({ min: 1 }),
    check('idServicio1')
        .exists()
        .isLength({ min: 1 }).isNumeric(),
    check('nombre')
        .isLength({ min: 4 })
        .exists(),
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
    check('idServicio1')
        .exists()
        .isLength({ min: 1 }).isNumeric(),
    check('nombre')
        .isLength({ min: 4 })
        .exists(),
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
export const editarDependiente = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('idServicio1')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('codigo')
        .exists()
        .isLength({ min: 1 }),
    check('nombre')
        .isLength({ min: 4 })
        .exists(),
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
    check('codigo').isLength({ min: 1 }).exists(),
    check('idServicio1')
        .isLength({ min: 1 })
        .exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]
export const eliminarDependiente = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('codigo').isLength({ min: 1 }).exists(),

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

export const lista = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

// buscar