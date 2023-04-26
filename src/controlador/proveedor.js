import { Router } from "express"
import { Proveedor } from "../modelo/proveedor.js"
import { insertar, editar, eliminar, buscar, anterior, siguiente } from '../validacion/proveedor.js'


const rutas = Router()
const proveedor = new Proveedor()

rutas.post("/all", async (req, res) => {
    console.log(req.body, 'proveedores')
    try {
        const resultado = await proveedor.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor', ok: false })
    }

})

rutas.post("/reciclaje", async (req, res) => {
    try {
        const resultado = await proveedor.listarReciclaje()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/next", siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await proveedor.listarSiguiente(id)
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
        const resultado = await proveedor.listarSiguienteEliminados(id)
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
        const resultado = await proveedor.listarAnterior(id)
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
        const resultado = await proveedor.listarAnteriorEliminados(id)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})



rutas.post("/buscar", buscar, async (req, res) => {
    // console.log(req.body.dato)
    const dato = req.body.dato
    try {
        const resultado = await proveedor.buscar(dato)
        return res.json({ok:true, data:resultado})

    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor', ok: false })
    }

})

rutas.post("/buscareliminados", buscar, async (req, res) => {
    console.log('eliminados')
    const dato = req.body.dato
    try {
        const resultado = await proveedor.buscarEliminados(dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})


rutas.post("/insertar", insertar, async (req, res) => {

    // console.log(req.body)
    const { nombre, nit, telefono, direccion, pais, cuenta, creado, usuario } = req.body
    const datos = {
        nombre,
        nit,
        telefono,
        direccion,
        pais,
        cuenta,
        creado,
        usuario
    }
    try {

        await proveedor.insertar(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ ok:false, msg: 'Este nit '+ nit +' ya esta registrado' })
            } if (j.existe === 2) {
                return res.json({ ok:false, msg: 'Este proveedor ya esta registrado' })
            }
            return res.json({ data: j, ok: true, msg:'Registro exitoso' })

        })


    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor', ok: false })
    }
})




rutas.post("/insertaraux", insertar, async (req, res) => {

    // console.log(req.body)
    const { nombre, nit, telefono, direccion, pais, cuenta, creado, usuario } = req.body
    const datos = {
        nombre,
        nit,
        telefono,
        direccion,
        pais,
        cuenta,
        creado,
        usuario
    }
    try {

        await proveedor.insertaraux(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ ok:false, msg: 'Este nit '+ nit +' ya esta registrado' })
            } if (j.existe === 2) {
                return res.json({ ok:false, msg: 'Este proveedor ya esta registrado' })
            }
            return res.json({ data: j, ok: true, msg:'Registro exitoso' })

        })


    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor', ok: false })
    }
})





rutas.post("/actualizar", editar, async (req, res) => {
    console.log(req.body)

    const { id, nombre, nit, telefono, direccion, pais, cuenta, modificado, usuario } = req.body
    const datos = {
        id,
        nombre,
        nit,
        telefono,
        direccion,
        pais,
        cuenta,
        modificado,
        usuario
    }
    try {
        await proveedor.actualizar(datos).then(j => {
            if (j.existe === 1) {
                return res.json({ok:false, msg: 'El registro ya exixte' })
            }

            return res.json({ data: j, ok: true, msg: 'operacion exitosa' })
        })


    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor', ok: false })
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    try {
        const id = req.body.id;

        await proveedor.eliminar(id).then(j => {
            return res.json({ data: j, ok: true, msg: 'operacion exitosa' })
        })

    } catch (error) {
        return res.json({ msg: 'Debe eliminar los registros dependientes', ok: false })
    }

})

rutas.post("/restaurar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const id = req.body.id;
        const resultado = await proveedor.restaurar(id)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha restaurado' })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})


export default rutas;