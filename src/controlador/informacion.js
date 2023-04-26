import { Router } from "express"
import { Informacion } from "../modelo/informacion.js"
import { insertar, editar } from '../validacion/informacion.js'
import multer from "multer"
import fs from 'fs'

import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { DB_DATABASE, DB_PASSWORD, DB_USER } from '../config.js'
import { exec } from "child_process"


const __dirname = dirname(fileURLToPath(import.meta.url));



const rutas = Router()
const informacion = new Informacion()



rutas.post("/copiaSeguridad", async (req, res) => {
    const dire = path.join(__dirname, '../../backup/copia' + req.body.fecha + '.sql')
    const comando =
        `mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_DATABASE} > ${dire}`;
    console.log(comando)

    exec(comando, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return res.json({ msg: 'Error al realizar la copia de seguridad' });
        }

        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);

        return res.json({ msg: 'La copia de seguridad fue realizada con exito!!!. El archivo se encuentra en la direccion :' + dire });

    });

    // return system(comando)
    // return exec(comando)
})





rutas.post("/all", async (req, res) => {
    try {

        const resultado = await informacion.listar()
        if(resultado.length>0)
            return res.json({ ok: true, data: resultado })
        return res.json({ok:false})
    } catch (error) {

        return res.json({ ok: false, msg: 'Error en el servidor' })
    }

})


rutas.post("/insertar", insertar, async (req, res) => {

    const {  nombre, telefono, direccion, correo, creado, usuario } = req.body
    const datos = {
        nombre,
        telefono,
        direccion,
        correo,
        creado,
        usuario,
    }
    try {

        const resultado = await informacion.insertar(datos)
        if (resultado.existe === 1) {
            return res.json({ ok: false, msg: 'Ya existe el registro' })
        }
        return res.json({ ok: true, data: resultado, msg: 'Operacion Exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})

rutas.post("/actualizar", editar, async (req, res) => {
    console.log('data: ', req.body)

    const { id, red, nombre, telefono, direccion, correo, modificado, usuario } = req.body
    const datos = {
        id,
        red,
        nombre,
        telefono,
        direccion,
        correo,
        modificado,
        usuario,
    }
    try {
        const resultado = await informacion.editar(datos)
        if (resultado.existe === 1) {
            return res.json({ ok: false, msg: 'Ya existe el registro' })
        }
        return res.json({ ok: true, data: resultado, msg: 'Operacion Exitosa' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})



export default rutas;