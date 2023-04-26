import { Router } from "express"
import { Tipo } from "../modelo/tipo.js"
import { insertar, editar, eliminar, buscar, siguiente, anterior } from '../validacion/tipo.js'


const rutas = Router()
const C_tipo = new Tipo()

rutas.post("/next", siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await C_tipo.listarSiguiente(id)
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
        const resultado = await C_tipo.listarSiguienteEliminados(id)
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
        const resultado = await C_tipo.listarAnterior(id)
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
        const resultado = await C_tipo.listarAnteriorEliminados(id)
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
    try {
        const resultado = await C_tipo.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})
rutas.post("/reciclaje", async (req, res) => {
    try {
        const resultado = await C_tipo.listarReciclaje()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/ver", async (req, res) => {
    try {
        const resultado = await C_tipo.ver(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})


rutas.post("/buscar", buscar, async (req, res) => {
    const dato = req.body.dato
    try {
        const resultado = await C_tipo.buscar(dato)
        return res.json({ data: resultado, ok: true })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})

rutas.post("/buscareliminados", buscar, async (req, res) => {
    console.log('eliminados')
    const dato = req.body.dato
    try {
        const resultado = await C_tipo.buscarEliminados(dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})


rutas.post("/insertar", insertar, async (req, res) => {

    // console.log(req.body)
    try {
        const { tipo, descripcion, creado, usuario } = req.body
        const datos = {
            tipo,
            descripcion,
            creado,
            usuario
        }


        const resultado = await C_tipo.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro', ok: false })
        }
        return res.json({ ok: true, data: resultado, msg: 'Registro gurdado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/actualizar", editar, async (req, res) => {

    // console.log(req.body)
    try {
        const { id, tipo, descripcion, modificado, usuario } = req.body
        const datos = {
            id,
            tipo,
            descripcion,
            modificado,
            usuario
        }

        const resultado = await C_tipo.actualizar(datos)
        if (resultado.existe === 0)
            return res.json({ msg: 'No existe el registro', ok: false })
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro', ok: false })
        }
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha actualizado' })

    } catch (error) {
        // console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log('datos antes de aliminar : ',req.body)
    try {
        const id = req.body.id;
        const resultado = await C_tipo.eliminar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, data: resultado, msg: 'Registro eliminado' })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/restaurar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const id = req.body.id;
        const resultado = await C_tipo.restaurar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha restaurado' })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})

export default rutas;