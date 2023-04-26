
import pool from './bdConfig.js'

export class Gasto {


    listarAsignacion = async (id) => {
        const sql =
            `SELECT a.id,a.descripcion, a.comprobante, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(id)} and a.estado = 1 and a.eliminado = false
            ORDER by a.id DESC limit 7;`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }


    search = async (datos) => {
        console.log(datos, 'modelo')
        const sql =
            `SELECT a.id, a.comprobante,a.descripcion, DATE_FORMAT(a.fecha,"%Y-%m-%d") as fecha, a.monto, a.tipo, a.estado
            from asignacion a inner join personal p on a.idpersonal = p.id
            where p.id = ${pool.escape(datos.usuario)} and a.comprobante  like '${datos.comprobante}%'
            ORDER by a.id DESC;`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }

    verAsignacion = async (id) => {
        const sql =
            `
            SELECT sum(g.egreso) as gastado, a.id, concat(p.nombre,'  ', p.apellido1, p.apellido2) as personal, 
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
            inner join proyecto on proyecto.id = p.idproyecto
            left join gasto g on a.id = g.idasignacion
            where a.id = ${pool.escape(id)}  GROUP BY a.id; 
            `;

        const rows = await pool.query(sql)
        console.log(rows, id)
        return rows
    }

    rendicion = async (id, fecha, usuario) => {
        const update = `update asignacion set estado = 2, fecharendicion = ${pool.escape(fecha)}, usuario = ${pool.escape(usuario)} where id = ${pool.escape(id)}`
        await pool.query(update)
        const result = await this.verAsignacion(id)
        console.log(result, 'resultado ver imagenes')
        return result
        // console.log(result, 'datos de la asignacion')
    }















    searchGastos = async (datos) => {
        console.log(datos, 'modelo')
        const sql =
            `SELECT id, descripcion, comprobante, DATE_FORMAT(fecha,"%Y-%m-%d") as fecha, egreso, img
            from gasto 
            where idasignacion = ${pool.escape(datos.idasignacion)} and ( comprobante like '${datos.comprobante}%' or descripcion like '${datos.comprobante}%') 
            order by id as desc limit 6`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }

    listarSiguiente = async (id) => {
        const sql =
            `SELECT id, descripcion, comprobante, DATE_FORMAT(fecha,"%Y-%m-%d") as fecha, egreso, img, comprobante
            from gasto  where id<${pool.escape(id.id)} and idasignacion = ${pool.escape(id.asignacion)}  ORDER BY id DESC  LIMIT 6`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarAnterior = async (id) => {
        const sql =
            `SELECT id, descripcion, comprobante, DATE_FORMAT(fecha,"%Y-%m-%d") as fecha, egreso, img, comprobante
            from gasto  where id>${pool.escape(id.id)} and idasignacion = ${pool.escape(id.asignacion)}  LIMIT 6`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }


    listargastos = async (id) => {
        const sql =
            `SELECT id, descripcion, comprobante, DATE_FORMAT(fecha,"%Y-%m-%d") as fecha, egreso, img, comprobante
            from gasto 
            where idasignacion = ${pool.escape(id)}
            ORDER by id DESC LIMIT 6 `;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }
    listarclasificacion = async () => {
        const sql =
            `SELECT id as value, clasificacion as label from clasificacion
            ORDER by id DESC;`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista clasific')
        return rows
    }

    listartipo = async () => {
        const sql =
            `SELECT id as value,  tipo as label from tipo
            ORDER by id DESC;`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista, tipos')
        return rows
    }


    listarProveedor = async (id) => {
        const sql =
            `SELECT id as value, nombre as label from proveedor
            ORDER by id DESC;`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }




    ver = async (id) => {
        const sql =
            `
            SELECT g.id, DATE_FORMAT(g.fecha, '%Y-%m-%d') as fecha, g.descripcion,
            g.egreso, g.tipo as tipopago, g.comprobante,  g.factura,
            DATE_FORMAT(g.creado, '%Y-%m-%d %H-%m') as creado,

            t.id as idtipo, t.tipo,
            c.id as idclasificacion, c.clasificacion,
            a.comprobante as asignacion,
            p.id as idproveedor, p.nombre as proveedor,
            concat(pe.nombre, pe.apellido1, pe.apellido2) as personal,
            DATE_FORMAT(g.creado, '%Y-%m-%d %H:%m') as creado, DATE_FORMAT(g.modificado, '%Y-%m-%d %H:%m') as modificado, g.img, g.img


            from gasto g
            inner join tipo t on t.id = g.idtipo
            inner join clasificacion c on c.id = g.idclasificacion
            inner join asignacion a on a.id = g.idasignacion
            inner join personal pe on pe.id = g.idpersonal
            left join proveedor p on p.id = g.idproveedor


            where g.id = ${pool.escape(id)}`;

        const [rows] = await pool.query(sql)
        return rows
    }



    insert = async (datos, archivo) => {

        // console.log('modelo intervalo')
        const sqlexist =
            `SELECT * from gasto where
            comprobante = ${pool.escape(datos.comprobante)}`;
        const [rows] = await pool.query(sqlexist)

        if (rows.length === 0) {
            const [data] = await pool.query("INSERT INTO gasto SET  ?", datos)
            if (archivo) {
                return data.insertId
            } else {
                const result = await this.ver(data.insertId)
                console.log(result, 'resultado ver imagenes')
                return result
            }
            // console.log(result, 'datos de la asignacion')
        } else {
            return {
                existe: 1,
            }
        }
    }








    actualizarRecibo = async (id) => {
        let nombre = id + '.png'
        const update = `update gasto set img = ${pool.escape(nombre)} where id = ${pool.escape(id)}`
        await pool.query(update)
        const result = await this.ver(id)
        // console.log(result, 'resultado ver imagenes')
        return result
        // console.log(result, 'datos de la asignacion')
    }

    eliminarImagen = async (id) => {
        // console.log(id, 'eliminar imagen')
        const update = `update gasto set img = null where id = ${pool.escape(id)}`
        await pool.query(update)
        const result = await this.ver(id)
        // console.log(result, 'resultado ver imagenes')
        return result
    }

    eliminarImagenArchivo = async (id, asignacion) => {
        // console.log(id, 'eliminar imagen')
        const update = `update gasto set img = null where id = ${pool.escape(id)}`
        await pool.query(update)
        const result = await this.listargastos(asignacion)
        // console.log(result, 'resultado ver imagenes')
        return result
    }























    update = async (datos) => {
        console.log('modelo de los gastos', datos)
        const sqlExists = `SELECT * FROM gasto WHERE 
            comprobante = ${pool.escape(datos.comprobante)}      
            and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sqlEstado = `SELECT a.estado FROM gasto g
            inner join asignacion a on a.id = g.idasignacion
            WHERE g.id = ${pool.escape(datos.id)}`;

            const [resultEstado] = await pool.query(sqlEstado)

            if (resultEstado[0].estado === 1) {

                const sql = `UPDATE gasto SET
                idtipo = ${pool.escape(datos.idtipo)},
                idclasificacion = ${pool.escape(datos.idclasificacion)},
                fecha = ${pool.escape(datos.fecha)},
                descripcion = ${pool.escape(datos.descripcion)},
                egreso = ${pool.escape(datos.egreso)},
                tipo = ${pool.escape(datos.tipo)},
                comprobante = ${pool.escape(datos.comprobante)},
                factura = ${pool.escape(datos.factura)},
                idproveedor = ${pool.escape(datos.idproveedor)},
                modificado = ${pool.escape(datos.modificado)}
                WHERE id = ${pool.escape(datos.id)}`;
                await pool.query(sql);

                const intervalo = await this.ver(datos.id)
                return intervalo
            } else return { existe: 2, }
        } else return { existe: 1, }

    }

    delete = async (idGasto, idAsignacion) => {
        // console.log(id)
        const sql = `delete from gasto
        WHERE id =  ${pool.escape(idGasto)}`;
        await pool.query(sql)
        return await this.listargastos(idAsignacion)
    }






}