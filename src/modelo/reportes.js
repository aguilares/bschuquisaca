
import pool from './bdConfig.js'

export class Reportes {


    proyecto = async () => {
        const sql = `SELECT id,  nombre from proyecto where eliminado = false`
        const [rows] = await pool.query(sql)
        return rows
    }

    personal = async () => {
        const sql = `SELECT id,  concat(nombre, apellido1, apellido2 ) as nombre from personal where eliminado = false`
        const [rows] = await pool.query(sql)
        return rows
    }

    tipo = async () => {
        const sql = `SELECT id,  tipo as nombre from tipo where eliminado = false`
        const [rows] = await pool.query(sql)
        return rows
    }

    // por proyecto

    totalGatoPorProyecto = async (id) => {
        const sql = `select sum(g.egreso) as total
        from proyecto p 
        inner join personal pe on p.id = pe.idproyecto
        inner join asignacion a on pe.id = a.idpersonal
        left join gasto g on a.id = g.idasignacion
        where a.estado = 3 and p.id = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        const [rows] = await pool.query(sql)
        return rows
    }

    totalAsignacionPorProyecto = async (id) => {
        const sql = `select sum(a.monto) as total
        from proyecto p 
        inner join personal pe on p.id = pe.idproyecto
        inner join asignacion a on pe.id = a.idpersonal
        where a.estado = 3 and p.id = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        const [rows] = await pool.query(sql)
        return rows
    }


    generarReportePorProyecto = async (id) => {
        console.log(id, 'modelo')
        const sql = `select p.nombre as proyecto, concat(pe.nombre,' ', pe.apellido1, pe.apellido2) as personal, DATE_FORMAT(a.fecha, "%Y-%m-%d") as fechaasignacion,
        a.monto as montoasignado, a.descripcion as descripcionasignacion,a.comprobante as comprobanteasignacion, DATE_FORMAT(g.fecha, "%Y-%m-%d") as fechagasto, g.descripcion as descripciongasto, g.egreso as gasto, 
        g.comprobante as comprobantegasto
        
        from proyecto p 
        inner join personal pe on p.id = pe.idproyecto
        inner join asignacion a on pe.id = a.idpersonal
        left join gasto g on a.id = g.idasignacion
        where a.estado = 3 and p.id  = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha <= ${pool.escape(id.fin)}`
        const [rows] = await pool.query(sql)

        const [gasto] = await this.totalGatoPorProyecto(id)
        const [total] = await this.totalAsignacionPorProyecto(id)

        return [rows, total, gasto]
    }


    // por persona

    totalGatoPorPersona = async (id) => {
        const sql = `select sum(g.egreso) as total
    from proyecto p 
    inner join personal pe on p.id = pe.idproyecto
    inner join asignacion a on pe.id = a.idpersonal
    left join gasto g on a.id = g.idasignacion
    where a.estado = 3 and pe.id = ${pool.escape(id.persona)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        const [rows] = await pool.query(sql)
        return rows
    }

    totalAsignacionPorPersona = async (id) => {
        const sql = `select sum(a.monto) as total
    from proyecto p 
    inner join personal pe on p.id = pe.idproyecto
    inner join asignacion a on pe.id = a.idpersonal
    where a.estado = 3 and pe.id = ${pool.escape(id.persona)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        const [rows] = await pool.query(sql)
        return rows
    }


    generarReportePorPersona = async (id) => {
        console.log(id, 'modelo')
        const sql = `select p.nombre as proyecto, concat(pe.nombre,' ', pe.apellido1, pe.apellido2) as personal, DATE_FORMAT(a.fecha, "%Y-%m-%d") as fechaasignacion,
    a.monto as montoasignado, a.descripcion as descripcionasignacion,a.comprobante as comprobanteasignacion, DATE_FORMAT(g.fecha, "%Y-%m-%d") as fechagasto, g.descripcion as descripciongasto, g.egreso as gasto, 
    g.comprobante as comprobantegasto
    
    from proyecto p 
    inner join personal pe on p.id = pe.idproyecto
    inner join asignacion a on pe.id = a.idpersonal
    left join gasto g on a.id = g.idasignacion
    where a.estado = 3 and pe.id  = ${pool.escape(id.persona)} and a.fecha>=${pool.escape(id.ini)} and a.fecha <= ${pool.escape(id.fin)}`
        const [rows] = await pool.query(sql)

        const [gasto] = await this.totalGatoPorPersona(id)
        const [total] = await this.totalAsignacionPorPersona(id)

        return [rows, total, gasto]
    }


    /// por estado de asignacion
    totalGatoPorEstado = async (id) => {
        const sql = `select sum(g.egreso) as total
    from proyecto p 
    inner join personal pe on p.id = pe.idproyecto
    inner join asignacion a on pe.id = a.idpersonal
    left join gasto g on a.id = g.idasignacion
    where a.estado = ${pool.escape(id.estado)}  and p.id = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        const [rows] = await pool.query(sql)
        return rows
    }

    totalAsignacionPorEstado = async (id) => {
        const sql = `select sum(a.monto) as total
    from proyecto p 
    inner join personal pe on p.id = pe.idproyecto
    inner join asignacion a on pe.id = a.idpersonal
    where a.estado = ${pool.escape(id.estado)}  and p.id = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        const [rows] = await pool.query(sql)
        return rows
    }


    generarReportePorEstado = async (id) => {
        console.log(id, 'modelo')
        const sql = `select p.nombre as proyecto, concat(pe.nombre,' ', pe.apellido1, pe.apellido2) as personal, DATE_FORMAT(a.fecha, "%Y-%m-%d") as fechaasignacion,
    a.monto as montoasignado, a.descripcion as descripcionasignacion,a.comprobante as comprobanteasignacion, DATE_FORMAT(g.fecha, "%Y-%m-%d") as fechagasto, g.descripcion as descripciongasto, g.egreso as gasto, 
    g.comprobante as comprobantegasto
    
    from proyecto p 
    inner join personal pe on p.id = pe.idproyecto
    inner join asignacion a on pe.id = a.idpersonal
    left join gasto g on a.id = g.idasignacion
    where a.estado = ${pool.escape(id.estado)} and p.id  = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha <= ${pool.escape(id.fin)}`
        const [rows] = await pool.query(sql)

        const [gasto] = await this.totalGatoPorEstado(id)
        const [total] = await this.totalAsignacionPorEstado(id)

        return [rows, total, gasto]
    }


    // por tipo

    totalGatoPorTipo = async (id) => {
        const sql = `select sum(g.egreso) as total
            from proyecto p 
            inner join personal pe on p.id = pe.idproyecto
            left join asignacion a on pe.id = a.idpersonal
            left join gasto g on a.id = g.idasignacion
            left join tipo t on g.idtipo = t.id

            where a.estado = 3 and t.id = ${pool.escape(id.tipo)}  and p.id = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        // console.log(sql)
        const [rows] = await pool.query(sql)
        if (rows.length === 0)
            return [0]
        return rows
    }

    totalAsignacionPorTipo = async (id) => {
        const sql = `select sum(a.monto) as total
                from proyecto p 
                inner join personal pe on p.id = pe.idproyecto
                inner join asignacion a on pe.id = a.idpersonal
                left join gasto g on g.idasignacion = a.id

                left join tipo t on g.idtipo = t.id

                where a.estado = 3 and t.id = ${pool.escape(id.tipo)} and p.id = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha<=${pool.escape(id.fin)} GROUP by p.id;`
        console.log(sql)
        const [rows] = await pool.query(sql)
        if (rows.length === 0)
            return [0]
        return rows
        // return rows
    }


    generarReportePorTipo = async (id) => {
        console.log(id, 'modelo')
        const sql = `select p.nombre as proyecto, concat(pe.nombre,' ', pe.apellido1, pe.apellido2) as personal, DATE_FORMAT(a.fecha, "%Y-%m-%d") as fechaasignacion,
        a.monto as montoasignado, a.descripcion as descripcionasignacion,a.comprobante as comprobanteasignacion, DATE_FORMAT(g.fecha, "%Y-%m-%d") as fechagasto, g.descripcion as descripciongasto, g.egreso as gasto, 
        g.comprobante as comprobantegasto

        from proyecto p 
        inner join personal pe on p.id = pe.idproyecto
        inner join asignacion a on pe.id = a.idpersonal
        left join gasto g on a.id = g.idasignacion
        left join tipo t on g.idtipo = t.id

        where a.estado = 3 and t.id= ${pool.escape(id.tipo)} and p.id  = ${pool.escape(id.proyecto)} and a.fecha>=${pool.escape(id.ini)} and a.fecha <= ${pool.escape(id.fin)}`
        const [rows] = await pool.query(sql)

        const [gasto] = await this.totalGatoPorTipo(id)
        const [total] = await this.totalAsignacionPorTipo(id)

        return [rows, total, gasto]
    }











}