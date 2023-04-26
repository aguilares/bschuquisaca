import { Router } from "express"
import { ItemServicio } from "../modelo/itemServicio.js"
import { insertar, editar, eliminar, buscar, lista, insertarDependientes, editarDependiente, eliminarDependiente, habilitar } from '../validacion/itemServicio.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const itemServicio = new ItemServicio()

rutas.post("/all", async (req, res) => {
    console.log('llega la solicitud')
    let idServicio = req.body.idServicio1
    try {
        const resultado = await itemServicio.listar(idServicio)
        return res.json(resultado)

    } catch (error) {
        console.log(error)

        return res.status(500).send(error)
    }

})

rutas.post("/listar", lista, async (req, res) => {
    // console.log(req.body)
    try {
        const resultado = await itemServicio.listarExamenes(parseInt(req.body.id))
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})

rutas.post("/dependientes", lista, async (req, res) => {
    // console.log(req.body)
    try {
        const resultado = await itemServicio.listaDependientes(parseInt(req.body.id))
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/dependientes1", buscar, async (req, res) => {

    try {
        const resultado = await itemServicio.listaDependientes1(req.body.dato)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})



rutas.post("/insertar", insertar, async (req, res) => {

    // console.log(req.body)
    const { idServicio1, nombre, creado, usuario } = req.body
    const datos = {
        idServicio: idServicio1,
        nombre,
        encabezado: 1,
        creado,
        usuario
    }
    try {

        const resultado = await itemServicio.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json(resultado)

    } catch (error) {

        console.log(error)
        return res.status(500).send(error)
    }
})
rutas.post("/anadirDependientes", insertarDependientes, async (req, res) => {
    // console.log(req.body)

    const { codigo, idServicio1, nombre, creado, usuario } = req.body
    const datos = {
        codigo,
        idServicio: idServicio1,
        nombre,
        encabezado: 0,
        creado,
        usuario
    }
    try {

        const resultado = await itemServicio.insertarDependientes(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})




rutas.post("/actualizar", editar, async (req, res) => {
 console.log(req.body)
    const { id, idServicio1, nombre, modificado, usuario } = req.body
    const datos = {
        id,
        idServicio: idServicio1,
        nombre,
        modificado,
        usuario
    }
    try {
        const resultado = await itemServicio.actualizar(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json(resultado)

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/actualizarDependientes", editarDependiente, async (req, res) => {
    console.log(req.body)

    const { id, idServicio1, codigo, nombre, creado, usuario } = req.body
    const datos = {
        id,
        idServicio:idServicio1,
        codigo,
        nombre,
        creado,
        usuario
    }
    try {

        const resultado = await itemServicio.actualizarDependiente(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'ya existe el registro' })
        }
        return res.json(resultado)

    } catch (error) {

        console.log(error)
        return res.status(500).send(error)
    }
})

rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log(req.body)
    const { codigo, idServicio1 } = req.body
    const datos = { codigo, idServicio:idServicio1 }
    try {
        const resultado = await itemServicio.eliminar(datos)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})
rutas.post("/eliminarDependiente", eliminarDependiente, async (req, res) => {
    try {
        const { id, codigo } = req.body
        const resultado = await itemServicio.eliminarDependiente(id, codigo)
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})


rutas.post("/habilitar", habilitar, async (req, res) => {
    // console.log(req.body)

    try {
        const resultado = await itemServicio.habilitar(req.body.id, req.body.idServicio1)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})
rutas.post("/deshabilitar", habilitar, async (req, res) => {
    console.log(req.body)
    try {
        const resultado = await itemServicio.deshabilitar(req.body.id, req.body.idServicio1)
        return res.json(resultado)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})


export default rutas;