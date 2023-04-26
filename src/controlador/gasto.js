import { Router } from "express"
import { Gasto } from "../modelo/gasto.js"
import { Asignacion } from "../modelo/asignacion.js"
import {  listar, listargasto, ver, search } from '../validacion/gasto.js'
import { anteriorUser } from '../validacion/asignacion.js'




const rutas = Router()
const gasto = new Gasto()
const asignacion = new Asignacion()












import multer from "multer"
import fs from 'fs'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const disktorage = multer.diskStorage({

    destination: path.join(__dirname, '../../imagenes/recibos'),

    filename: (req, file, cb) => {
        // console.log(req.query, 'nombre imagen, gurdar imagen')
        cb(null, req.query.nombre + '.png')
    }
})
const fileUpload = multer({
    storage: disktorage
}).single('resultado')






rutas.post("/delete", async (req, res) => {
    console.log(req.body, 'controlador Eliminar')
    try {
        if (req.body.eliminar)
            fs.unlinkSync(path.join(__dirname, '../../imagenes/recibos/' + req.body.id + '.png'))
        const result = await gasto.delete(req.body.id, req.body.idasignacion)
        console.log(result, 'datos actuales')
        return res.json({ data: result, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Primero elimine los registro dependientes de este registro' })
    }
})







rutas.post("/anterioruser", anteriorUser, async (req, res) => {
    console.log( 'anterior user')
    const { id, usuario } = req.body
    const datos = { id, idUser:usuario }
    try {
        const resultado = await asignacion.listarAnteriorUser(datos)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})

rutas.post("/nextuser", anteriorUser, async (req, res) => {
    console.log( 'next user')
    
    const { id, usuario } = req.body
    const datos = { id, idUser:usuario }
    try {
        const resultado = await asignacion.listarSiguienteUser(datos)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})




















rutas.post("/guardarImagen", fileUpload, async (req, res) => {
    try {
        // console.log(req.query, 'datos de la imagen para volver a guardar')
        // fs.readdirSync(path.join(__dirname, '../../imagenes/recibos/'))

        const resultado = await gasto.actualizarRecibo(req.query.nombre)
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/eliminarImagen", fileUpload, async (req, res) => {

    // console.log('eliminar imagen en e. controlador')
    try {
        // console.log(req.query, 'datos de la imagen')
        if (req.body.existeArchivo)
            fs.unlinkSync(path.join(__dirname, '../../imagenes/recibos/' + req.body.id + '.png'))

        const resultado = await gasto.eliminarImagen(req.body.id)
        return res.json({ data: resultado, ok: true, msg: 'la foto del recibo se ha eliminó' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/eliminarImagenArchivo", fileUpload, async (req, res) => {

    // console.log('eliminar imagen en e. controlador')
    try {
        // console.log(req.query, 'datos de la imagen')
        if (req.body.existeArchivo)
            fs.unlinkSync(path.join(__dirname, '../../imagenes/recibos/' + req.body.id + '.png'))

        const resultado = await gasto.eliminarImagenArchivo(req.body.id, req.body.idasignacion)
        return res.json({ data: resultado, ok: true, msg: 'la foto del recibo se ha eliminó' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})


rutas.post("/insert", async (req, res) => {
    console.log(req.body, 'controlador')
    const { fecha, egreso, descripcion, comprobante,
        idtipo, idclasificacion, idasignacion, tipopago, factura,
        proveedor, usuario, creado, archivo } = req.body
    const datos = {
        idtipo,
        idclasificacion,
        idasignacion,
        idpersonal: usuario,
        fecha,
        descripcion,
        egreso,
        tipo: tipopago,
        comprobante,
        factura,
        idproveedor: proveedor ? proveedor : null,
        creado,
    }
    try {
        const resultado = await gasto.insert(datos, archivo)
        if (resultado.existe === 1) {
            return res.json({ msg: 'El comprovante ' + comprobante + ' ya esta registrado', ok: false })

        } else return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/update", async (req, res) => {
    console.log(req.body, 'controlador de gastos')
    const { id, fecha, egreso, descripcion, comprobante,
        idtipo, idclasificacion, tipopago, factura,
        proveedor, usuario, modificado } = req.body
    const datos = {
        id,
        idtipo,
        idclasificacion,
        idpersonal: usuario,
        fecha,
        descripcion,
        egreso,
        tipo: tipopago,
        comprobante,
        factura,
        idproveedor: proveedor ? proveedor : null,
        modificado,
    }
    try {
        const resultado = await gasto.update(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'El comprovante ' + comprobante + ' ya esta registrado', ok: false })

        } else return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error, 'error al actualizar en sql')
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})





rutas.post("/veregreso", ver, async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.ver(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/rendicion", ver, async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.rendicion(req.body.id, req.body.fecha, req.body.usuario)
        return res.json({ data: resultado, ok: true, msg: 'La asignacion se cerró correctamente' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

















rutas.post("/listarasignacion", listar, async (req, res) => {
    console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.listarAsignacion(req.body.usuario)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/searchassignment", search, async (req, res) => {
    console.log(req.body, 'controlador buscar')
    const { usuario, comprobante } = req.body
    const datos = { usuario, comprobante }
    try {
        const resultado = await gasto.search(datos)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/verasignacion", ver, async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.verAsignacion(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})





















rutas.post("/siguiente", async (req, res) => {
    console.log('nextdelete')
    const { id, asignacion } = req.body
    const datos = { id, asignacion }

    try {
        const resultado = await gasto.listarSiguiente(datos)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/anterior", async (req, res) => {
    const { id, asignacion } = req.body
    const datos = { id, asignacion }
    try {
        const resultado = await gasto.listarAnterior(datos)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/listargasto", listargasto, async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.listargastos(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/listarclasificacion", async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.listarclasificacion()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/listartipo", async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.listartipo()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/listarproveedor", async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await gasto.listarProveedor()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/searchgastos", search, async (req, res) => {
    console.log(req.body, 'controlador buscar')
    const { idasignacion, comprobante } = req.body
    const datos = { idasignacion, comprobante }
    try {
        const resultado = await gasto.searchGastos(datos)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})




















































rutas.post("/search", search, async (req, res) => {
    console.log(req.body, 'controlador')
    const { id, dato } = req.body
    const datos = { id, dato }
    try {
        const resultado = await gasto.search(datos)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})






// rutas.post("/update", editar, async (req, res) => {
//     console.log(req.body, 'controlador')
//     const { idtipo, idclasificacion, idasignacion,
//         idproveedor, fecha, descripcion, egreso, tipopago, comprobante,
//         factura, tipofactura, creado } = req.body
//     const datos = {
//         idtipo, idclasificacion, idasignacion,
//         idproveedor: idproveedor ? idproveedor : null, fecha, descripcion, egreso, tipopago, comprobante,
//         factura, tipofactura, creado
//     }
//     try {
//         const resultado = await gasto.update(datos)
//         if (resultado.existe === 1)
//             return res.json({ msg: 'El comprovante ' + comprobante + ' ya esta registrado', ok: false })
//         if (resultado.existe === 2)
//             return res.json({ msg: 'Este registro ya no se puede actualizar, la rendicion de cuentas ya fue realizado', ok: false })

//         return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })

//     } catch (error) {
//         console.log(error)
//         return res.json({ ok: false, msg: 'Error en el servidor' })
//     }
// })





export default rutas;