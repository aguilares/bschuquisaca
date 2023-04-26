
import { check } from "express-validator"
import { validaciones } from "./headers.js"


















export const listar = [
    check('usuario').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]


export const search = [
    check('usuario').isLength({ min: 1 }).exists().isNumeric(),
    check('comprobante')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]


export const ver = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]






export const listargasto = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

// buscar





















































export const insertar = [

    check('idtipo')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('idclasificacion')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('idasignacion')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('idproveedor')
        .isNumeric()
        .isLength({ min: 1 }),

    check('fecha')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/),
    check('descripcion')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    check('egreso')
        .exists()
        .matches(/^[0-9]{1,20}$/),
    check('tipopago')
        .exists()
        .isNumeric()
        .matches(/^\d{1,10}$/),
    check('comprobante')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    check('factura')
        .exists()
        .isBoolean(),
    check('tipofactura')
        .exists()
        .isNumeric()
        .matches(/^\d{1,10}$/),
    check('creado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const editar = [
    check('id').isLength({ min: 1 })
        .exists()
        .isNumeric(),

    check('idtipo')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('idclasificacion')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('idasignacion')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('idproveedor')
        .isNumeric()
        .isLength({ min: 1 }),

    check('fecha')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/),
    check('descripcion')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    check('egreso')
        .exists()
        .matches(/^[0-9]{1,20}$/),
    check('tipopago')
        .exists()
        .isNumeric()
        .matches(/^\d{1,10}$/),
    check('comprobante')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    check('factura')
        .exists()
        .isBoolean(),
    check('tipofactura')
        .exists()
        .isNumeric()
        .matches(/^\d{1,10}$/),
    check('modificado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{1,2}:\d{2}:\d{2}$/),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]


export const eliminar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('usuarioLocal').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]


