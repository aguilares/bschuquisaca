import { Router } from "express"
import { Clasificacion } from "../modelo/clasificacion.js"
import { insertar, editar, eliminar, buscar, siguiente, anterior } from '../validacion/clasificacion.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const clasificacion = new Clasificacion()


rutas.post("/next", siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await clasificacion.listarSiguiente(id)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})
rutas.post("/nextdelete", siguiente, async (req, res) => {
    console.log('nextdelete')

    let id = req.body.id
    try {
        const resultado = await clasificacion.listarSiguienteEliminados(id)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/anterior", anterior, async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await clasificacion.listarAnterior(id)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})
rutas.post("/anterioreliminados", anterior, async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await clasificacion.listarAnteriorEliminados(id)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})


rutas.post("/all", async (req, res) => {
    // console.log(req.body)
    try {
        const resultado = await clasificacion.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/reciclaje", async (req, res) => {
    try {
        const resultado = await clasificacion.listarReciclaje()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/buscar", buscar, async (req, res) => {
    const dato = req.body.dato
    try {
        const resultado = await clasificacion.buscar(dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        // console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})
rutas.post("/buscareliminados", buscar, async (req, res) => {
    // console.log('eliminados')
    const dato = req.body.dato
    try {
        const resultado = await clasificacion.buscarEliminados(dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        // console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/insertar", insertar, async (req, res) => {

    const { nombre, creado, usuario } = req.body
    const datos = {
        clasificacion: nombre,
        creado,
        usuario
    }
    try {

        const resultado = await clasificacion.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ ok: false, msg: 'ya existe el registro' })
        }
        return res.json({ ok: true, data: resultado, msg: 'Registro Guardado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})

rutas.post("/insertaraux", insertar, async (req, res) => {  // insertar clasificacion desde la ventana registrar gasto

    const { nombre, creado, usuario } = req.body
    const datos = {
        clasificacion: nombre,
        creado,
        usuario
    }
    try {

        const resultado = await clasificacion.insertaraux(datos)
        if (resultado.existe === 1) {
            return res.json({ ok: false, msg: 'ya existe el registro' })
        }
        return res.json({ ok: true, data: resultado, msg: 'Registro Guardado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})

rutas.post("/actualizar", editar, async (req, res) => {

    const { id, nombre, modificado, usuario } = req.body
    const datos = {
        id,
        clasificacion: nombre,
        modificado,
        usuario
    }
    try {
        const resultado = await clasificacion.actualizar(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro', ok: false })
        }
        if (resultado.ok === false) return res.json({ msg: 'Error en la opearación', ok: false })

        return res.json({ ok: true, data: resultado, msg: 'El registro se ha actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const id = req.body.id;
        const resultado = await clasificacion.eliminar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha eliminado' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})

rutas.post("/restaurar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const id = req.body.id;
        const resultado = await clasificacion.restaurar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha restaurado' })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})


export default rutas;