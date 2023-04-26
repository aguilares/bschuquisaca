import { check } from "express-validator"
import { validaciones } from "./headers.js"

export const insertar = [
    check('numero')
        .exists()
        .matches(/^[0-9]{1,20}$/),
    check('codigo')
        .exists()
        .matches(/^[-_a-zA-ZÑñ0-9 ]{2,50}$/),
    check('nombre')
        .exists()
        .matches(/^[a-zA-Z Ññ0-9_-]{1,200}$/),
    check('nombrecompleto')
        .exists()
        .matches(/^[a-zA-Z Ññ0-9_-]{1,200}$/),
    check('montocontrato')
        .exists()
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('montomodificado')
        .exists()
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('montopagado')
        .exists()
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('fechainicio')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/),
    check('plazoinicio')
        .exists()
        .matches(/^[0-9]{1,20}$/),
    check('ampliacion')
        .exists()
        .matches(/^-?\d*(\.\d+)?$/),
    check('idEstado')
        .exists()
        .matches(/^\d{1,10}$/),
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
    check('numero')
        .exists()
        .matches(/^[0-9]{1,20}$/),
    check('codigo')
        .exists()
        .matches(/^[-_a-zA-ZÑñ0-9 ]{2,50}$/),
    check('nombre')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,200}$/),
    check('nombrecompleto')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,200}$/),
    check('montocontrato')
        .exists()
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('montomodificado')
        .exists()
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('montopagado')
        .exists()
        .matches(/^-?\d+([.]\d+)?(?:[Ee][-+]?\d+)?$/),
    check('fechainicio')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/),
    check('plazoinicio')
        .exists()
        .matches(/^[0-9]{1,20}$/),
    check('ampliacion')
        .exists()
        .matches(/^-?\d*(\.\d+)?$/),
    check('idEstado')
        .exists()
        .matches(/^\d{1,10}$/),
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