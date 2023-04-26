
import { check } from "express-validator"
import { validaciones } from "./headers.js"

export const insertar = [

    check('idpersonal')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('fecha')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/),

    check('monto')
        .exists()
        .matches(/^[0-9]{1,20}$/),

    check('tipo')
        .exists()
        .matches(/^\d{1,10}$/),

    check('comprobante')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,200}$/),
    check('descripcion')
        .exists()
        .matches(/^[()/a-zA-Z Ññ0-9_-]{1,400}$/),

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

    check('idpersonal')
        .exists()
        .isNumeric()
        .isLength({ min: 1 }),
    check('fecha')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/),

    check('monto')
        .exists()
        .matches(/^[0-9]{1,20}$/),

    check('tipo')
        .exists()
        .matches(/^\d{1,10}$/),

    check('comprobante')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    check('descripcion')
        .exists()
        .matches(/^[()/a-zA-Z Ññ0-9_-]{1,400}$/),

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
    check('usuarioLocal').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const listar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const search = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('dato')
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

export const siguiente = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('idUser').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const anterior = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('idUser').isLength({ min: 1 }).exists().isNumeric(),


    (req, res, next) => {
        validaciones(req, res, next)
    }
]

export const anteriorUser = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('usuario').isLength({ min: 1 }).exists().isNumeric(),


    (req, res, next) => {
        validaciones(req, res, next)
    }
]

// buscar