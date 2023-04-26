
import pool from './bdConfig.js'

export class Asignacion {



    insert = async (datos) => {

        // console.log('modelo intervalo')
        const sqlexist =
            `SELECT * from asignacion where
            comprobante = ${pool.escape(datos.comprobante)}`;
        const [rows] = await pool.query(sqlexist)

        if (rows.length === 0) {
            const [data] = await pool.query("INSERT INTO asignacion SET  ?", datos)
            const result = await this.ver(data.insertId)
            console.log('ver resultado', data.insertId, result)
            return result
            // console.log(result, 'datos de la asignacion')
        } else {
            return {
                existe: 1,
            }
        }
    }


    ver = async (id) => {
        const sql =
            `
            SELECT a.id, concat(p.nombre,'  ', p.apellido1, p.apellido2) as personal,sum(g.egreso) as gastado,
            proyecto.nombre as proyecto,
            a.monto, 
            a.estado, a.tipo, a.descripcion,
            DATE_FORMAT(a.fecha, "%Y-%m-%d") as fecha,
            DATE_FORMAT(a.fecharendicion, "%Y-%m-%d") as fecharendicion,
            DATE_FORMAT(a.fechaaprobacion,"%Y-%m-%d") as fechaaprobacion ,
            a.comprobante,
            DATE_FORMAT(a.creado,"%Y-%m-%d") as creado,
            DATE_FORMAT(a.modificado,"%Y-%m-%d") as modificado ,
            concat(pe.nombre, pe.apellido1, pe.apellido2) as usuario
            from asignacion a
            inner join personal p on p.id = a.idpersonal
            inner join personal pe on pe.id = a.usuario
            left join gasto g on a.id = g.idasignacion
            inner join proyecto on proyecto.id = p.idproyecto
            where a.id = ${pool.escape(id)} GROUP BY a.id;
            `;

        const rows = await pool.query(sql)
        return rows
    }


    update = async (datos) => {
        const sqlExists = `SELECT * FROM asignacion WHERE 
            comprobante = ${pool.escape(datos.comprobante)}      
            and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sqlEstado = `SELECT estado FROM asignacion 
            WHERE id = ${pool.escape(datos.id)}`;
            const [resultEstado] = await pool.query(sqlEstado)

            if (resultEstado[0].estado < 2) {
                const sql = `UPDATE asignacion SET
                idpersonal = ${pool.escape(datos.idpersonal)},
                descripcion = ${pool.escape(datos.descripcion)},
                fecha = ${pool.escape(datos.fecha)},
                monto = ${pool.escape(datos.monto)},
                tipo = ${pool.escape(datos.tipo)},
                comprobante = ${pool.escape(datos.comprobante)},
                modificado = ${pool.escape(datos.modificado)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)} and estado = 1`;
                await pool.query(sql);

                const intervalo = await this.ver(datos.id)
                return intervalo
            } else return { existe: 2 }
        } else {
            return {
                existe: 1,
            }
        }
    }


    revertir = async (datos) => {
        console.log(datos)
        const sql = `update asignacion set estado = 1, fecharendicion = null, usuario = ${pool.escape(datos.usuario)}
        WHERE id =  ${pool.escape(datos.id)} and estado = 2`;
        await pool.query(sql)
        return await this.ver(datos.id)
    }

    aprobar = async (datos) => {
        console.log(datos)
        const sql = `update asignacion set estado = 3, fechaaprobacion = ${pool.escape(datos.fecha)}, usuario = ${pool.escape(datos.usuario)}
        WHERE id =  ${pool.escape(datos.id)} and estado = 2`;
        await pool.query(sql)
        return await this.ver(datos.id)
    }



    search = async (datos) => {
        const sql =
            `SELECT a.id,a.comprobante, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(datos.id)} and (a.comprobante  like '${datos.dato}%' or a.descripcion like '${datos.dato}%') and a.eliminado = false
            ORDER by a.id DESC;`;
        console.log(sql)
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }

    searchDelete = async (datos) => {
        const sql =
            `SELECT a.id,a.comprobante, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(datos.id)} and (a.comprobante  like '${datos.dato}%' or a.descripcion like '${datos.dato}%') and a.eliminado = true
            ORDER by a.id DESC;`;
        console.log(sql)
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista') 
        return rows
    }


    delete = async (datos) => {
        console.log(datos)
        const sql = `update asignacion set eliminado = true, usuario = ${pool.escape(datos.usuario)}, modificado=${pool.escape(datos.fecha)}
        WHERE id =  ${pool.escape(datos.id)} and estado = 1 `;
        await pool.query(sql)
        return await this.listarAsignacion(datos.idUser)
    }

    restaurar = async (datos) => {
        console.log(datos)
        const sql = `update asignacion set eliminado = false, usuario = ${pool.escape(datos.usuario)}, modificado=${pool.escape(datos.fecha)}
        WHERE id =  ${pool.escape(datos.id)}`;
        await pool.query(sql)
        return await this.listarAsignacion(datos.idUser)
    }

    listarAsignacion = async (id) => {
        const sql =
            `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id)} and a.eliminado = false
            ORDER by a.id DESC limit 7`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }

    listarReciclaje = async (id) => {

        const sql =
            `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id)} and a.eliminado = true
            ORDER by a.id DESC limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarSiguiente = async (id) => {
        const sql = `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id.idUser)} and a.id < ${pool.escape(id.id)} and a.eliminado = false
            ORDER by a.id DESC limit 7`
        const [rows] = await pool.query(sql)
        return rows
    }


    listarSiguienteEliminados = async (id) => {
        const sql = `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id.idUser)} and a.id < ${pool.escape(id.id)} and a.eliminado = true
            ORDER by a.id DESC limit 7`
        const [rows] = await pool.query(sql)
        return rows
    }


    listarAnterior = async (id) => {
        const sql = `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id.idUser)} and a.id > ${pool.escape(id.id)} and a.eliminado = false limit 7`
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }
    


    listarAnteriorEliminados = async (id) => {
        const sql = `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id.idUser)} and a.id > ${pool.escape(id.id)} and a.eliminado = true limit 7`
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }



    listarSiguienteUser = async (id) => {
        const sql = `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id.idUser)} and a.id < ${pool.escape(id.id)} and a.eliminado = false and a.estado = 1
            ORDER by a.id DESC limit 7`
        const [rows] = await pool.query(sql)
        return rows
    }

    listarAnteriorUser = async (id) => {
        const sql = `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id.idUser)} and a.id > ${pool.escape(id.id)} and a.eliminado = false and a.estado = 1 limit 7`
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }




















}