import {  Router } from "express"
import { Usuario } from "../modelo/usuario.js"
import { eliminar, buscar,  siguiente, validar, deshabilitar, actualizarRol } from '../validacion/usuario.js'
import pool from '../modelo/bdConfig.js'
import { CLAVEGMAIL } from '../config.js'
import nodemailer from "nodemailer";
//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const usuarios = new Usuario()


rutas.post("/usuario", async (req, res) => { 
    // console.log(req.body, 'controlador')
    try {
        const resultado = await usuarios.listarAsignacion(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})




rutas.post("/ver", async (req, res) => {
    // console.log(req.body, 'ver usuario')
    try {
        const resultado = await usuarios.ver(req.body.id)
        // console.log(resultado)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})




rutas.post("/rol", async (req, res) => {
    try {
        const resultado = await usuarios.listarRol()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }
})

rutas.post("/proyectos", async (req, res) => {
    try {
        const resultado = await usuarios.listarProyectos()
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }
})



rutas.post("/buscar", buscar, async (req, res) => {
    // console.log(req.body)
    const dato = req.body.dato
    try {
        const resultado = await usuarios.buscar(dato)
        return res.send({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})
rutas.post("/buscareliminados", buscar, async (req, res) => {
    // console.log(req.body)
    const dato = req.body.dato
    try {
        const resultado = await usuarios.buscarEliminado(dato)
        return res.send({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})

rutas.post("/actualizarrol", actualizarRol, async (req, res) => {
    try {
        const { id, modificado, usuario } = req.body
        const { idproyecto, sueldo } = req.body

        let nivel = null

        let datos = req.body.rol1
        // console.log(datos, "niveles de acceso del usuario")


        if (datos.includes(3))
            nivel = 7

        if (datos.includes(2))
            nivel = 3

        if (datos.includes(1))
            nivel = 2

        if (datos.includes(1) && datos.includes(2))
            nivel = 4
        if (datos.includes(1) && datos.includes(3))
            nivel = 5
        if (datos.includes(2) && datos.includes(3))
            nivel = 6
        if (datos.includes(1) && datos.includes(2) && datos.includes(3))
            nivel = 1

        // console.log(nivel, 'nivel escogido')
        let c = datos.length
        const sqlRestricciones = `
            select a.estado from personal p inner join asignacion a on p.id = a.idpersonal
            where p.id = ${pool.escape(id)} and (a.estado = 1 or a.estado = 2)
        `
        const [restricciones] = await pool.query(sqlRestricciones)
        if (restricciones.length === 0) {
            await datos.forEach(async element => {
                const sqlrol = `select id from rol where numero = ${pool.escape(element)}`
                const [listaRol] = await pool.query(sqlrol)

                const datos1 = {
                    idpersonal: id,
                    idRol: listaRol[0].id,
                    nivel,
                    modificado,
                    usuario,
                }
                // console.log(datos1, 'datos ahora')
                const sqlRol = `delete from rolusuario where idpersonal = ${pool.escape(id)}`
                await pool.query(sqlRol)

                await usuarios.actualizarRol(datos1).then(async j => {
                    c--
                    if (c === 0) {
                        const ssql = `delete from sesion
                        WHERE idpersonal = ${pool.escape(id)}`;
                        await pool.query(ssql)

                        const updatePerson = `update personal set 
                            idproyecto = ${pool.escape(idproyecto)},
                            sueldo = ${pool.escape(sueldo)},
                            modificado = ${pool.escape(modificado)},
                            usuario = ${pool.escape(usuario)}
                            where id = ${pool.escape(id)}
                        `
                        await pool.query(updatePerson)

                        const result = await usuarios.ver(id)

                        // console.log(result, 'datos de la consulta ver usuario', id)
                        return res.json({ data: result, ok: true, msg: 'Los privilegios se actualizaron correctamente' })
                    }
                })
            });
        } else return res.json({ ok: false, msg: 'El usurio debe rendir cuentas' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})


rutas.post("/validar", validar, async (req, res) => {
    console.log(req.body, 'datos')
    try {
        const { id, idproyecto, idrol, modificado, usuario, sueldo, user } = req.body;
        const datos = {
            id, idproyecto, idrol, sueldo, modificado, usuario
        }
        const resultado = await usuarios.validar(datos)
        // console.log(resultado)




        // const sqlInfoHospital = `SELECT correo, telefono from hospital`;
        // const [infoHospital] = await pool.query(sqlInfoHospital)

        // if (infoHospital.length === 1) {


        //     let jConfig = {
        //         "host": "smtp.gmail.com",
        //         "port": "465",
        //         "secure": true,
        //         "auth": {
        //             "user": infoHospital[0].correo,
        //             "pass": CLAVEGMAIL
        //         }
        //     };
        //     // console.log(infoHospital[0].correo, 'correo electronico')
        //     let email = {
        //         from: infoHospital[0].correo,  //remitente
        //         to: user.correo,  //destinatario
        //         subject: "UNIDAD SERVICIOS COMPLEMENTARIOS HOSPITAL SAN PEDRO CLAVER",  //asunto del correo
        //         html: ` 
        //             <div> 
        //             <p>Hola ${user.nombre + ' ' + user.apellidoPaterno + ' ' + user.apellidoMaterno} </p> 
        //             <h2>Su cuenta en el Sistema de Solicitudes de Servicios Somplementarios ha sido confirmado.</h2>  
        //             <label>Ya puede acceder.</label>  

        //             <p>Para mas informacion contactese con el administrador del área de Informatica.</p> 
        //             <p>Tel/cel: ${infoHospital[0].telefono}</p> 

        //             </div> 
        //         `
        //     };

        //     let createTransport = nodemailer.createTransport(jConfig);
        //     createTransport.sendMail(email, function (error, info) {
        //         if(error) console.log(error)
        //         createTransport.close();
        //     });
        // }

        return res.json({ data: resultado, msg: 'Operacion Exitosa', ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error del servidor' })
    }

})


rutas.post("/deshabilitar", deshabilitar, async (req, res) => {
    // console.log(req.body)
    try {
        const { id, modificado, usuario } = req.body;
        const datos = {
            id, modificado, usuario
        }
        const sqlRestricciones = `
        select a.estado from personal p inner join asignacion a on p.id = a.idpersonal
        where p.id = ${pool.escape(id)} and (a.estado = 1 or a.estado = 2)
    `
        const [restricciones] = await pool.query(sqlRestricciones)
        if (restricciones.length === 0) {
            const resultado = await usuarios.deshabilitar(datos)
            console.log(resultado)
            return res.json({ data: resultado, ok: true, msg: 'El usuario se ha deshabilitado exitosamente' })
        } else return res.json({ ok: false, msg: 'El usurio debe rendir cuentas' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error del servidor' })
    }

})

rutas.post("/habilitar", deshabilitar, async (req, res) => {
    // console.log(req.body)
    try {
        const { id, modificado, usuario } = req.body;
        const datos = {
            id, modificado, usuario
        }
        const sqlRestricciones = `
        select a.estado from personal p inner join asignacion a on p.id = a.idpersonal
        where p.id = ${pool.escape(id)} and (a.estado = 1 or a.estado = 2)
    `
        const [restricciones] = await pool.query(sqlRestricciones)
        if (restricciones.length === 0) {
            const resultado = await usuarios.habilitar(datos)
            console.log(resultado)
            return res.json({ data: resultado, ok: true, msg: 'El usuario se ha habilitado exitosamente' })
        } else return res.json({ ok: false, msg: 'El usurio debe rendir cuentas' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error del servidor' })
    }

})

rutas.post("/eliminar", eliminar, async (req, res) => {
    console.log(req.body)
    try {

        const { id, fecha, usuario } = req.body;
        const datos = {
            id, modificado:fecha, usuario
        }
        const resultado = await usuarios.eliminar(datos)
        return res.json({ data: resultado, ok: true, msg: 'El usuario se ha eliminado exitosamente' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error, Elimine los registros dependientes' })
    }

})
rutas.post("/restaurar", eliminar, async (req, res) => {
    // console.log(req.body)
    try {
        const { id, fecha, usuario } = req.body;
        const datos = {
            id, modificado:fecha, usuario
        }
        const resultado = await usuarios.restaurar(datos)
        if (resultado.affectedRows === 0)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, data: resultado, msg: 'El registro se ha restaurado' })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }
})


rutas.post("/next", siguiente, async (req, res) => {

    let id = req.body.id
    try {
        const resultado = await usuarios.listarSiguiente(id)
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
        const resultado = await usuarios.listarSiguienteEliminados(id)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})


rutas.post("/anterior", siguiente, async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await usuarios.listarAnterior(id)
        if (resultado.length > 0)
            return res.json({ ok: true, data: resultado })
        else
            return res.json({ ok: false, msg: 'Ya no hay mas registros!' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})
rutas.post("/anterioreliminados", siguiente, async (req, res) => {
    let id = req.body.id
    try {
        const resultado = await usuarios.listarAnteriorEliminados(id)
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
    // console.log(req.body, 'controlador')
    try {
        const resultado = await usuarios.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/reciclaje", async (req, res) => {
    try {
        const resultado = await usuarios.listarReciclaje()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})



export default rutas;