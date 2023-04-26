import { Router } from "express"
import { Usuario } from '../../modelo/usuario.js'
import { insertar } from '../../validacion/usuario.js'
import {Informacion} from '../../modelo/informacion.js'
// import nodemailer from "nodemailer";
// import { CLAVEGMAIL } from '../../config.js'
// import pool from '../../modelo/bdConfig.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()

const info = new Informacion()
const usuario = new Usuario()

rutas.get('/empresa', async(req, res)=>{
    console.log('Ok public')
    try {
        const resultado= await info.listar()
        return res.json({ok:true, data: resultado})
        
    } catch (error) {
        return res.json({ok:true, msg:'error en el servidor'})
    }
})

rutas.get("/registrarme", insertar, async (req, res) => {

    console.log('datos: ', req.query)

    const { username, xyz, ci, nombre, apellido1,
        apellido2, telefono, idProyecto, creado } = req.query
    const datos = {
        username,
        pass: xyz,
        idProyecto,
        ci,
        nombre,
        apellido1,
        apellido2,
        celular: telefono,
        creado,
    }
    try {
        const resultado = await usuario.insertar(datos)

        if (resultado.existe === 1)
            return res.json({ ok: false, msg: 'Este usuario ya esta registrado' })
        else
            return res.json({ ok: true, msg: "Su cuenta ha sido creado correctamente" });

        // const empresa = `SELECT correo, telefono from empresa`;
        // const [infoEmpresa] = await pool.query(empresa)

        // if (infoEmpresa.length === 1) {

        //     let jConfig = {
        //         "host": "smtp.gmail.com",
        //         "port": "465",
        //         "secure": true,
        //         "auth": {
        //             "user": infoEmpresa[0].correo,
        //             "pass": CLAVEGMAIL
        //         }
        //     };
        //     console.log(infoEmpresa[0].correo, 'correo electronico')
        //     let email = {
        //         from: infoEmpresa[0].correo,  //remitente
        //         to: correo,  //destinatario
        //         subject: "EMPRESA COBURCA",  //asunto del correo
        //         html: ` 
        //             <div> 
        //             <p>Hola ${nombre + ' ' + apellido1 + ' ' + apellido2} </p> 
        //             <p>Su cuenta en el sistema de la Empresa Coburca ha sido creada con éxito.</p> 
        //             <p>En las próximas horas se hara la correspondiente validacion para otorgarle el acceso al sistema.</p> 

        //             <h3>Sus credenciales de acceso son:</h3>
        //             <h4>${'Usuario:'+username}</h4> 
        //             <h4>${'Contraseña:'+xyz}</h4> 

        //             <p>Para mas informacion contactese con el administrador de Area de Informatica.</p> 
        //             <p>Tel/cel: ${infoEmpresa[0].telefono}</p> 

        //             </div> 
        //         `
        //     };

        //     let createTransport = nodemailer.createTransport(jConfig);
        //     createTransport.sendMail(email, function (error, info) {

        //         createTransport.close();
        //     });
        //     res.json({ ok: true, msg: "Su cuenta ha sido creado correctamente, para mas informacion revise su correo " });
        // }
        // else {
        //     res.json({ ok: false, msg: 'CORREO NO REGISTRADO' })
        // }

    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Intente nuevamente', ok: false })
    }
})


















rutas.get("/hospital", async (req, res) => {

    try {
        const resultado = await hospital.listarParaRegistro()
        console.log(resultado)
        return res.json(resultado)
    } catch (error) {
        return res.status(500).send(error)
    }

})



export default rutas;