import express from "express";
import pool from '../modelo/bdConfig.js'
import { KEY, CLAVEGMAIL } from '../config.js'

import jwt from 'jsonwebtoken'
// Admiministrador
import Informacion from "../controlador/informacion.js";
import proyecto from "../controlador/proyecto.js";
import tipo from "../controlador/tipo.js";
import clasificacion from "../controlador/clasificacion.js";
import usuario from "../controlador/usuario.js";
//funciones disponibles para el administrador, solicitante y hasta para el laboratorista
import proveedor from '../controlador/proveedor.js'

import asignacion from '../controlador/asignacion.js'
import gasto from '../controlador/gasto.js'



import reporte from '../controlador/reportes.js'
import miPerfil from '../controlador/miPerfil.js'

// archivos publicos
import rutasPublicas from "../controlador/Public/public.js";




import nodemailer from "nodemailer";

const rutas = express();

// +*********************************************************** login****************************************


// ruta de autentidicacion
rutas.get('/', async (req, res) => {
    console.log("datos de la solicitud: ", req.query)

    try {
        const sql = ` SELECT id, nombre, apellido1, apellido2, username
        from personal
        WHERE username = ${pool.escape(req.query.user)} and pass = ${pool.escape(req.query.pass)} and validar = 1 and eliminado = 0`;

        // console.log(await pool.query(sql), 'resultados de la consulta inicial')
        const [result] = await pool.query(sql)
        console.log("datos de la consulta: ", result)

        if (result.length === 1) {
            var d = new Date();
            let fecha = d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];
            const payload = {
                "usuario": result[0].username,
                "ap1": result[0].apellido1,
                "ap2": result[0].apellido2,
                "name": result[0].nombre,
                'fecha': fecha
            }
            const token = jwt.sign(payload, KEY, {
                expiresIn: "14d"
            })

            const idpersonal = result[0].id

            const datos = {
                idpersonal,
                fecha,
                token
            }

            const [sesion] = await pool.query(`INSERT INTO sesion SET ?`, datos)
            // console.log('dentro del bloque', sesion)

            if (sesion.insertId > 0) {
                console.log('dentro del bloquesss', req.query.user, req.query.pass)

                const sqlInfo = `SELECT UPPER(r.rol) as rol, ru.nivel as numRol,
                    p.username, concat(UPPER(left(p.nombre,1)),LOWER(SUBSTRING(p.nombre,2))) as nombre, 
                    concat(UPPER(left(p.apellido1,1)),LOWER(SUBSTRING(p.apellido1,2))) as apellido
                    from personal p 
                    inner join rolusuario ru on p.id = ru.idpersonal
                    inner join rol r on ru.idrol = r.id
                    where p.username = ${pool.escape(req.query.user)} and p.pass = ${pool.escape(req.query.pass)} `;
                const [info] = await pool.query(sqlInfo)
                console.log("datos de la consulta: ", info[0])

                return res.json({
                    'token': token,
                    'username': info[0].username,
                    'nombre': info[0].nombre,
                    'apellido': info[0].apellido,
                    'rol': info[0].rol,
                    'numRol': info[0].numRol,
                    ok: true,
                    msg: 'Acceso correcto'
                })
            }
            else {
                return res.json({ msg: 'Intente nuevamente ', ok: false })
            }
        }
        else {
            // console.log('El usuario no existe')
            return res.json({ msg: 'El usuario no existe !', ok: false })
        }
    } catch (error) {
        return res.json({ msg: 'El servidor no responde !', ok: false })
    }
})

rutas.post('/logout', (req, res) => {
    const sql = `delete from sesion where token = ${pool.escape(req.body.token)} `
    console.log(sql, 'cadena sql')
    pool.query(sql)
})




rutas.get('/listarProyecto', async (req, res) => {
    const sql =
        `SELECT id, nombre FROM proyecto`;
    const [rows] = await pool.query(sql)
    return res.json(rows)
})



rutas.get('/olvideMiContrasena', async (req, res) => {
    // console.log('llego', req.query.correo)
    let correo = req.query.correo
    const sqlInfo = `SELECT correo, nombre, apellidoPaterno, apellidoMaterno from usuario where correo = ${pool.escape(correo)}`;
    const [info] = await pool.query(sqlInfo)
    const sqlInfoHospital = `SELECT correo from hospital`;
    const [infoHospital] = await pool.query(sqlInfoHospital)

    // console.log(info[0].correo !== undefined)
    if (info.length === 1 && infoHospital.length === 1) {



        let ale = Math.floor((Math.random() * (10000 - 1000 + 1)) + 1000);
        const sql = `UPDATE usuario SET
        codigo = ${pool.escape(ale)}
        WHERE correo = ${pool.escape(correo)}`;
        const [info1] = await pool.query(sql)


        if (info1.affectedRows > 0) {

            let jConfig = {
                "host": "smtp.gmail.com",
                "port": "465",
                "secure": true,
                "auth": {
                    "user": infoHospital[0].correo,
                    "pass": CLAVEGMAIL
                }
            };
            console.log(infoHospital[0].correo, 'correo electronico')
            let email = {
                from: infoHospital[0].correo,  //remitente
                to: info[0].correo,  //destinatario
                subject: "CODIGO DE RECUPRACION",  //asunto del correo
                html: ` 
                    <div> 
                    <p>Hola ${info[0].nombre + ' ' + info[0].apellidoPaterno + ' ' + info[0].apellidoMaterno} </p> 
                    <p>Esto es su codigo de recupracion de su contraseña</p> 
                    <h4>${ale}</h4> 
                    </div> 
                `
            };

            let createTransport = nodemailer.createTransport(jConfig);
            createTransport.sendMail(email, function (error, info) {
                if (error) {
                    res.json({ ok: false, msg: "Error al enviar email" });
                } else {
                    res.json({ ok: true, msg: "Correo enviado correctamente" });
                }
                createTransport.close();
            });
        }
    }
    else {
        res.json({ ok: false, msg: 'CORREO NO REGISTRADO' })
    }
})




rutas.get('/codigo', async (req, res) => {
    console.log('llego', req.query.correo, req.query.codigo)
    let correo = req.query.correo
    let codigo = req.query.codigo
    const sqlInfo = `SELECT correo, nombre, apellidoPaterno, apellidoMaterno, codigo from usuario where correo = ${pool.escape(correo)} and codigo = ${pool.escape(codigo)}`;
    const [info] = await pool.query(sqlInfo)
    if (info.length === 1) {
        res.json({ ok: true });
    }
    else {
        res.json({ ok: false, msg: 'EL CODIGO QUE INGRESO NO ES EL CORRECTO' })
    }
})
rutas.get('/nuevaContrasena', async (req, res) => {
    console.log('llego', req.query.correo, req.query.pass)
    let correo = req.query.correo
    let pass = req.query.pass
    const sql = `UPDATE usuario SET
    pass = ${pool.escape(pass)}
    WHERE correo = ${pool.escape(correo)}`;
    const [info] = await pool.query(sql)
    console.log(info.affectedRows)
    if (info.affectedRows > 0) {
        res.json({ ok: true });
    }
    else {

        const sql = `UPDATE usuario SET
        codigo = ${pool.escape(null)}
        WHERE correo = ${pool.escape(correo)}`;
        await pool.query(sql)
        res.json({ ok: false, msg: 'OPERACION FALLIDA, VUELVA A EMPEZAR' })
    }
})






//VERIFICACION DE LA SESION QUE ESTA ALMACENADA EN LA BD
const verificacion = express();

verificacion.use((req, res, next) => {
    // console.log('verificacion')

    try {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearetoken = bearerHeader.split(" ")[1];
            // console.log('pasa la primera condicional, se ha obtenido los encabezados', bearetoken )

            jwt.verify(bearetoken, KEY, async (errtoken, authData) => {
                if (errtoken) {
                    // console.log('error en la verificacion token alterado: ', bearetoken)
                    pool.query('delete from sesion where token = ?', [bearetoken])
                    return res.json({ ok: false, msg: 'Su token a expirado, cierre sesion y vuelva a iniciar sesion' })
                }

                // console.log('pasa la verificacion del token', bearetoken)
                const sql = `SELECT pe.id, ru.nivel as numero, p.id as idproyecto from sesion s 
                inner join personal pe on s.idpersonal = pe.id
                inner join rolusuario ru on pe.id = ru.idpersonal
                inner join rol r on ru.idrol = r.id
                left join proyecto p on pe.idproyecto = p.id
                where s.token  = ${pool.escape(bearetoken)} and pe.validar = true and pe.eliminado = false`;
                const [result] = await pool.query(sql)
                // console.log(result)
                if (result.length > 0) {
                    req.body.usuario = await result[0].id
                    req.body.rol = await result[0].numero
                    req.body.idproyecto = await result[0].idproyecto
                    next()
                }
                else {

                    return res.json({ ok: false, msg: 'El Servidor no puede identificar su autencidad en la base de datos, cierre sesion y vuelva a intetentar' })
                }
            })
        }
        else {
            return res.json({ ok: false, msg: 'El Servidor no puede interpretar su autenticidad' })
        }
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

const rolesAdmin = (req, res, next) => {
    if (parseInt(req.body.rol) === 1 || parseInt(req.body.rol) === 2 || parseInt(req.body.rol) === 3 || parseInt(req.body.rol) === 4 || parseInt(req.body.rol) === 5
        || parseInt(req.body.rol) === 6) {
        next()
        // console.log('pasa por aqui')
    }
}
const rolesUsuer = (req, res, next) => {
    if (parseInt(req.body.rol) === 7) {
        next()
        // console.log('pasa por aqui')
    }
}

const rolesUsuerAdmin = (req, res, next) => {
    if (parseInt(req.body.rol) === 7 || parseInt(req.body.rol) === 1 || parseInt(req.body.rol) === 2 || parseInt(req.body.rol) === 3 || parseInt(req.body.rol) === 4 || parseInt(req.body.rol) === 5
    || parseInt(req.body.rol) === 6) {
        next()
        // console.log('pasa por aqui')
    }
}


rutas.use('/public', rutasPublicas)

rutas.use("/proyecto", verificacion, rolesAdmin, proyecto)
rutas.use("/tipo", verificacion, rolesAdmin, tipo)
rutas.use("/usuario", verificacion, rolesAdmin, usuario)
rutas.use("/asignacion", verificacion, rolesAdmin, asignacion)
rutas.use("/reportes", verificacion, rolesAdmin, reporte)
rutas.use("/informacion", verificacion, rolesAdmin, Informacion)




rutas.use("/gasto", verificacion, rolesUsuerAdmin, gasto)

rutas.use("/proveedor", verificacion, rolesUsuerAdmin, proveedor)
rutas.use("/clasificacion", verificacion, rolesUsuerAdmin, clasificacion)

rutas.use("/miPerfil", verificacion, miPerfil)



export default rutas;