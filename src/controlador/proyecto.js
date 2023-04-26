import { Router } from "express"
import { Proyecto } from "../modelo/proyecto.js"
import { insertar, editar, eliminar, buscar, siguiente, anterior } from '../validacion/proyecto.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const proyecto = new Proyecto()

rutas.post("/siguiente", siguiente, async (req, res) => {
    console.log('siguiente')
    let id = req.body.id
    try {
        const resultado = await proyecto.listarSiguiente(id)
        if (resultado.length > 0)
            return res.json({ data: resultado, ok: true })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})


rutas.post("/anterior", anterior, async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await proyecto.listarAnterior(id)
        if (resultado.length > 0)
            return res.json({ data: resultado, ok: true })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})

rutas.post("/siguienteeliminado", siguiente, async (req, res) => {
    console.log('siguiente')
    let id = req.body.id
    try {
        const resultado = await proyecto.listarSiguienteEliminados(id)
        if (resultado.length > 0)
            return res.json({ data: resultado, ok: true })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})


rutas.post("/anterioreliminado", anterior, async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await proyecto.listarAnteriorEliminados(id)
        if (resultado.length > 0)
            return res.json({ data: resultado, ok: true })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})

rutas.post("/reciclaje", async (req, res) => {
    try {
        const resultado = await proyecto.listarReciclaje()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/restaurar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const {id, usuario, fecha} = req.body
        const datos= {id, usuario, fecha}
        const resultado = await proyecto.restaurar(datos)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha restaurado' })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})
rutas.post("/all", async (req, res) => {
    console.log(req.body)
    try {
        const resultado = await proyecto.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})
rutas.post("/estado", async (req, res) => {
    try {
        const resultado = await proyecto.listarEstados()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})

rutas.post("/ver", async (req, res) => {
    // console.log(req.body)
    try {
        const resultado = await proyecto.ver(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})

rutas.post("/buscar", buscar, async (req, res) => {
    const dato = req.body.dato
    try {
        const resultado = await proyecto.buscar(dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }

})

rutas.post("/insertar", insertar, async (req, res) => {

    console.log(req.body)
    const { numero, codigo, nombre, nombrecompleto,
        montocontrato, montomodificado, montopagado,
        fechainicio, plazoinicio, ampliacion, estado, creado, usuario
    } = req.body
    const datos = {
        numero,
        codigo,
        nombre,
        nombrecompleto, montocontrato, montomodificado, montopagado,
        fechainicio, plazoinicio, ampliacion, estado, creado, usuario
    }
    try {
        const resultado = await proyecto.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ ok: false, msg: 'ya existe el registro' })
        }
        if (resultado.existe === 2) {
            return res.json({ ok: false, msg: 'Este numero de registro ya fue utilizado' })
        }
        if (resultado.existe === 2) {
            return res.json({ ok: false, msg: 'Este codigo de registro ya fue utilizado' })
        }
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha guardado' })

    } catch (error) {

        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }
})

rutas.post("/actualizar", editar, async (req, res) => {

    // console.log(req.body)
    const { id, numero, codigo, nombre, nombrecompleto,
        montocontrato, montomodificado, montopagado,
        fechainicio, plazoinicio, ampliacion, idEstado, creado, usuario
    } = req.body
    const datos = {
        id,
        numero,
        codigo,
        nombre,
        nombrecompleto, montocontrato, montomodificado, montopagado,
        fechainicio, plazoinicio, ampliacion, estado: idEstado, creado, usuario
    }
    try {
        const resultado = await proyecto.actualizar(datos)
        console.log(resultado, 'okey listo ')
        if (resultado.existe === 1) {
            return res.json({ ok: false, msg: 'ya existe el registro' })
        }
        if (resultado.existe === 2) {
            return res.json({ ok: false, msg: 'Este numero de registro ya fue utilizado' })
        }
        if (resultado.existe === 2) {
            return res.json({ ok: false, msg: 'Este codigo de registro ya fue utilizado' })
        }
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const {id, usuario, fecha} = req.body
        const datos= {id, usuario, fecha}
        const resultado = await proyecto.eliminar(datos)
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha eliminado' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Intente nuevamente' })
    }
})


export default rutas;