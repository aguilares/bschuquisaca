import { Router } from "express"
import {  Reportes } from "../modelo/reportes.js"


const rutas = Router()
const reportes = new Reportes()

rutas.post("/proyecto", async (req, res) => {
    console.log(req.body, 'controlador')
    try {
        const resultado = await reportes.proyecto()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})
rutas.post("/personal", async (req, res) => {
    try {
        const resultado = await reportes.personal()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/tipo", async (req, res) => {
    try {
        const resultado = await reportes.tipo()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/porproyecto", async (req, res) => {  
    // console.log('llega al controlador', req.body) 
    const {proyecto, ini, fin} = req.body         
    const datos = {ini, fin, proyecto}    
    try {
        const resultado = await reportes.generarReportePorProyecto(datos)
        console.log(resultado)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/porpersona", async (req, res) => {  
    // console.log('llega al controlador', req.body) 
    const {persona, ini, fin} = req.body         
    const datos = {ini, fin, persona}    
    try {
        const resultado = await reportes.generarReportePorPersona(datos)
        console.log(resultado)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})


rutas.post("/porestado", async (req, res) => {  
    // console.log('llega al controlador', req.body) 
    const {estado, proyecto, ini, fin} = req.body         
    const datos = {ini, fin, proyecto, estado}    
    try {
        const resultado = await reportes.generarReportePorEstado(datos)
        console.log(resultado)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})

rutas.post("/portipo", async (req, res) => {  
    // console.log('llega al controlador', req.body) 
    const {tipo, proyecto, ini, fin} = req.body         
    const datos = {ini, fin, proyecto, tipo}    
    try {
        const resultado = await reportes.generarReportePorTipo(datos)
        console.log(resultado)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el Servidor' })
    }

})







export default rutas;