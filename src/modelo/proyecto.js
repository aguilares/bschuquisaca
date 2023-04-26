
import pool from './bdConfig.js'

export class Proyecto {

    // METODOS
    listar = async () => {
        const sql =
            `SELECT p.id,p.numero, p.codigo, p.nombre,
            p.montocontrato, p.montomodificado, e.nombre as estado
            from proyecto p inner join estado e on e.id = p.estado where p.eliminado = false ORDER by p.id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarReciclaje = async () => {
        const sql =
            `SELECT p.id,p.numero, p.codigo, p.nombre,
            p.montocontrato, p.montomodificado, e.nombre as estado
            from proyecto p inner join estado e on e.id = p.estado where p.eliminado = true ORDER by p.id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarEstados = async () => {
        const sql =
            `SELECT id,nombre
            from estado ORDER by id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    ver = async (id) => {
        const sql =
            `SELECT p.id ,p.numero, p.codigo, p.nombre as proyecto, p.nombrecompleto, p.montocontrato, 
            p.montomodificado, p.montopagado, DATE_FORMAT(p.fechainicio, "%Y-%m-%d") as fechainicio, 
            p.plazoinicio, p.ampliacion, e.id as idestado, e.nombre as estado, DATE_FORMAT(p.creado, "%Y-%m-%d %H:%m") as creado, 
            DATE_FORMAT(p.modificado, "%Y-%m-%d %H:%m") as modificado, pe.nombre, pe.apellido1, pe.apellido2 
            from proyecto p 
            left JOIN personal pe on pe.id = p.usuario 
            inner join estado e on e.id=p.estado 
            where p.id = ${pool.escape(id)}`;
        const [rows] = await pool.query(sql)
        // console.log(rows, id)
        return rows
    }

    listarSiguiente = async (id) => {
        const sql =
            `SELECT p.id,p.numero, p.codigo, p.nombre,
            p.montocontrato, p.montomodificado, e.nombre as estado
            from proyecto p inner join estado e on e.id = p.estado where p.id<${pool.escape(id)} and eliminado = false order by p.id desc limit 7 `;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarAnterior = async (id) => {
        const sql =
            `SELECT p.id,p.numero, p.codigo, p.nombre,
            p.montocontrato, p.montomodificado, e.nombre as estado
            from proyecto p inner join estado e on e.id = p.estado where p.id>${pool.escape(id)} and eliminado = false limit 7`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }

    listarSiguienteEliminados = async (id) => {
        const sql =
            `SELECT p.id,p.numero, p.codigo, p.nombre,
            p.montocontrato, p.montomodificado, e.nombre as estado
            from proyecto p inner join estado e on e.id = p.estado where p.id<${pool.escape(id)} and eliminado = true order by p.id desc limit 7 `;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarAnteriorEliminados = async (id) => {
        const sql =
            `SELECT p.id,p.numero, p.codigo, p.nombre,
            p.montocontrato, p.montomodificado, e.nombre as estado
            from proyecto p inner join estado e on e.id = p.estado where p.id>${pool.escape(id)} and eliminado = true limit 7`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }



    insertar = async (datos) => {
        const sqlExists =
            `SELECT * FROM proyecto WHERE nombre = ${pool.escape(datos.nombre)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sqlExistsNumero =
                `SELECT * FROM proyecto WHERE numero = ${pool.escape(datos.numero)}`;
            const [resultNumero] = await pool.query(sqlExistsNumero)

            if (resultNumero.length === 0) {
                const sqlExistsCodigo =
                    `SELECT * FROM proyecto WHERE codigo = ${pool.escape(datos.codigo)}`;
                const [resultCodigo] = await pool.query(sqlExistsCodigo)
                if (resultCodigo.length === 0) {



                    await pool.query("INSERT INTO proyecto SET  ?", datos)
                    return await this.listar()




                } else return { existe: 3 }
            } else return { existe: 2 }
        } else return { existe: 1 }
    }

    buscar = async (dato) => {
        const sql = `SELECT id, nombre FROM seguro
        WHERE nombre = ${pool.escape(dato)}`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {
        const sqlExists =
            `SELECT * FROM proyecto WHERE nombre = ${pool.escape(datos.nombre)} and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sqlExistsNumero =
                `SELECT * FROM proyecto WHERE numero = ${pool.escape(datos.numero)} and id !=${pool.escape(datos.id)}`;
            const [resultNumero] = await pool.query(sqlExistsNumero)

            if (resultNumero.length === 0) {
                const sqlExistsCodigo =
                    `SELECT * FROM proyecto WHERE codigo = ${pool.escape(datos.codigo)} and id !=${pool.escape(datos.id)}`;
                const [resultCodigo] = await pool.query(sqlExistsCodigo)

                if (resultCodigo.length === 0) {
                    const sql = `UPDATE proyecto SET
                    numero = ${pool.escape(datos.numero)},
                    codigo = ${pool.escape(datos.codigo)},
                    nombre = ${pool.escape(datos.nombre)},
                    nombrecompleto = ${pool.escape(datos.nombrecompleto)},
                    montocontrato = ${pool.escape(datos.montocontrato)},
                    montomodificado = ${pool.escape(datos.montomodificado)},
                    montopagado = ${pool.escape(datos.montopagado)},
                    fechainicio = ${pool.escape(datos.fechainicio)},
                    plazoinicio = ${pool.escape(datos.plazoinicio)},
                    ampliacion = ${pool.escape(datos.ampliacion)},
                    estado = ${pool.escape(datos.estado)},
                    modificado = ${pool.escape(datos.modificado)},
                    usuario = ${pool.escape(datos.usuario)}
                    WHERE id = ${pool.escape(datos.id)}`;
                    await pool.query(sql);
                    return await this.ver(datos.id)
                } else return { existe: 3 }
            } else return { existe: 2 }
        } else return { existe: 1 }
    }



    eliminar = async (id) => {
        const sql = `update proyecto set eliminado  = true, modificado = ${pool.escape(id.fecha)}, usuario= ${pool.escape(id.usuario)}
            WHERE id =  ${pool.escape(id.id)}`;
        await pool.query(sql)
        return await this.listar()
    }
    restaurar = async (id) => {
        const sql = `update proyecto set eliminado  = false, modificado = ${pool.escape(id.fecha)}, usuario= ${pool.escape(id.usuario)}
            WHERE id =  ${pool.escape(id.id)}`;
        await pool.query(sql)
        return await this.listar()
    }
}