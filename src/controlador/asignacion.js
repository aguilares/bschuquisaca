import { Router } from "express"
import { Asignacion } from "../modelo/asignacion.js"
import { insertar, editar, listar, siguiente, anterior, anteriorUser, ver } from '../validacion/asignacion.js'


const rutas = Router()
const asignacion = new Asignacion()

rutas.post("/all", listar, async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await asignacion.listarAsignacion(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})
rutas.post("/reciclaje", listar, async (req, res) => {
    try {
        const resultado = await asignacion.listarReciclaje(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})


















rutas.post("/next", siguiente, async (req, res) => {
    const { id, idUser } = req.body
    const datos = { id, idUser }
    try {
        const resultado = await asignacion.listarSiguiente(datos)
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
    const { id, idUser } = req.body
    const datos = { id, idUser }
    try {
        const resultado = await asignacion.listarSiguienteEliminados(datos)
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
    const { id, idUser } = req.body
    const datos = { id, idUser }
    try {
        const resultado = await asignacion.listarAnteriorEliminados(datos)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
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

















rutas.post("/buscar", async (req, res) => {
    console.log(req.body, 'controlador')
    const { id, dato } = req.body
    const datos = { id, dato }
    try {
        const resultado = await asignacion.search(datos)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})
rutas.post("/buscareliminados", async (req, res) => {
    const { id, dato } = req.body
    const datos = { id, dato }
    try {
        const resultado = await asignacion.searchDelete(datos)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        // console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})


rutas.post("/check", ver, async (req, res) => {
    // console.log(req.body, 'controlador')
    try {
        const resultado = await asignacion.ver(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/insert", insertar, async (req, res) => {
    // console.log(req.body, 'controlador')
    const { idpersonal, fecha, monto, tipo, comprobante, descripcion, creado, usuario } = req.body
    const datos = { idpersonal, fecha, monto, tipo, estado: 1, comprobante, descripcion, creado, usuario }
    try {
        const resultado = await asignacion.insert(datos)
        if (resultado.existe === 1) {
            return res.json({ msg: 'El comprovante ' + comprobante + ' ya esta registrado', ok: false })

        } else return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/update", editar, async (req, res) => {
    console.log(req.body, 'controlador')
    const { id, idpersonal, fecha, monto, tipo, comprobante, descripcion, modificado, usuario } = req.body
    const datos = { id, idpersonal, fecha, monto, tipo, comprobante, descripcion, modificado, usuario }
    try {
        const resultado = await asignacion.update(datos)
        if (resultado.existe === 1)
            return res.json({ msg: 'El comprovante ' + comprobante + ' ya esta registrado', ok: false })
        if (resultado.existe === 2)
            return res.json({ msg: 'Este registro ya no se puede actualizar, la rendicion de cuentas ya fue realizado', ok: false })

        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/revertir", async (req, res) => {
    console.log(req.body, 'controlador')
    const { id, usuario } = req.body
    const datos = { id, usuario }
    try {
        const resultado = await asignacion.revertir(datos)

        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/aprobar", async (req, res) => {
    console.log(req.body, 'controlador')
    const { id, fecha, usuario } = req.body
    const datos = { id, fecha, usuario }
    try {
        const resultado = await asignacion.aprobar(datos)

        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/delete", async (req, res) => {
    // console.log(req.body, 'controlador')
    const { id, idUser, fecha, usuario } = req.body
    const datos = { id, idUser, fecha, usuario }
    try {
        const result = await asignacion.delete(datos)
        // console.log(result, 'datos actuales')
        return res.json({ data: result, ok: true, msg: 'Operacion exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Primero elimine los registro dependientes de este registro' })
    }
})

rutas.post("/restaurar", async (req, res) => {
    const { id, idUser, fecha, usuario } = req.body
    const datos = { id, idUser, fecha, usuario }
    try {
        const resultado = await asignacion.restaurar(datos)
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha restaurado' })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})


export default rutas;