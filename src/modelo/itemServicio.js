
import pool from './bdConfig.js'

export class ItemServicio {


    // METODOS


    

    deshabilitar = async (id, idServicio) => {

        const sql = `UPDATE itemservicio SET
            ok = 0
            WHERE id = ${pool.escape(id)}`;

        await pool.query(sql);

        return await this.listar(idServicio)
    }

    habilitar = async (id, idServicio) => {

        const sql = `UPDATE itemservicio SET
            ok = 1
            WHERE id = ${pool.escape(id)}`;

        await pool.query(sql);

        return await this.listar(idServicio)
    }


    listar = async (servicio) => {
        const sql =
            `SELECT  s.id as idServicio,ise.codigo, s.nombre as servicio, ise.id, ise.nombre as item, ise.ok
            FROM itemservicio ise inner join servicio s on ise.idServicio = s.id 
            WHERE ise.encabezado = true and s.id = ${pool.escape(servicio)}
            ORDER by ise.id desc;
        `;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarExamenes = async (data) => {
        const sql =
            `SELECT ise.id as idItemServicio, ise.nombre as servicioSolicitado
        FROM itemservicio ise 
        inner join servicio s on ise.idServicio = s.id
        WHERE s.id = ${pool.escape(data)} and ise.encabezado = true and ise.ok = true
        ORDER by ise.id`;
        const [rows] = await pool.query(sql)
        return rows
    }
    listaDependientes1 = async (codigo) => {
        const sql =
            `SELECT ise.id, ise.codigo, ise.nombre as y
        FROM itemservicio ise 
        WHERE ise.codigo = ${pool.escape(codigo)}
        and ise.encabezado = false
        ORDER by ise.id`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listaDependientes = async (data) => {
        const sql =
            `SELECT ise.nombre as y, s.nombre as x
        FROM itemservicio ise 
        inner join servicio s on ise.idServicio = s.id
        WHERE s.id = ${pool.escape(data)} and  ise.encabezado = true
        ORDER by ise.id`;
        const [rows] = await pool.query(sql)
        return rows
    }


    insertar = async (datos) => {
        const sqlExists = `SELECT * FROM itemservicio WHERE nombre = ${pool.escape(datos.nombre)} and encabezado = true`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const resultado = await pool.query("INSERT INTO itemservicio SET  ?", datos)
            // console.log(resultado)
            if (resultado[0].affectedRows === 1) {
                let id = resultado[0].insertId
                let nombre = datos.nombre.charAt(0)
                let codigo = id + nombre
                const sql = `UPDATE itemservicio SET
                codigo = ${pool.escape(codigo)}
                WHERE id = ${pool.escape(id)}`;
                const [result] = await pool.query(sql);
                // console.log(result.affectedRows, 'ja ja')
                if (result.affectedRows > 0) {
                    return await this.listar(datos.idServicio)
                }
            }
        } else {
            return {
                existe: 1
            }
        }
    }

    insertarDependientes = async (datos) => {
        const sqlExists = `SELECT * FROM itemservicio WHERE nombre = ${pool.escape(datos.nombre)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            await pool.query("INSERT INTO itemservicio SET  ?", datos)

            return await this.listaDependientes1(datos.codigo)
        } else {
            return {
                existe: 1
            }
        }
    }


    buscar = async (dato) => {
        // console.log(dato)
        const sql = 'SELECT s.id as idServicio, s.nombre as servicio, ise.id, ise.nombre as item, ise.codigo FROM itemservicio  ise inner join servicio s on ise.idServicio = s.id  where ise.nombre LIKE "' + dato + '%"'
        // console.log(sql)
        const [rows] = await pool.query(sql)
        return rows
    }
    buscarporservicio = async (dato) => {
        const sql =
            `SELECT s.id as idServicio, s.nombre as servicio, ise.id, ise.nombre as item, ise.codigo FROM itemservicio ise
        inner join servicio s on ise.idServicio = s.id where s.id =${pool.escape(dato)} and ise.encabezado = true `;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {
        console.log(datos, 'llega al modelo')
        const sqlExists =
            `SELECT * FROM itemservicio WHERE nombre = ${pool.escape(datos.nombre)} and id != ${pool.escape(datos.id)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE itemservicio SET
            idServicio = ${pool.escape(datos.idServicio)},
            nombre = ${pool.escape(datos.nombre)},
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;

            const [resultado] = await pool.query(sql);
            if (resultado.affectedRows > 0) {
                return await this.listar(datos.idServicio)
            }
        } else {
            return {
                existe: 1,
            }
        }
    }

    actualizarDependiente = async (datos) => {
        const sqlExists =
            `SELECT * FROM itemservicio WHERE nombre = ${pool.escape(datos.nombre)} and id != ${pool.escape(datos.id)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE itemservicio SET
            idServicio = ${pool.escape(datos.idServicio)},
            nombre = ${pool.escape(datos.nombre)},
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;

            const [resultado] = await pool.query(sql);
            if (resultado.affectedRows > 0) {
                return await this.listaDependientes1(datos.codigo)
            }
        } else {
            return {
                existe: 1,
            }
        }
    }

    eliminar = async (datos) => {
        const sql = `delete from itemservicio 
        WHERE codigo =  ${pool.escape(datos.codigo)}`;
        await pool.query(sql)
        return await this.listar(datos.idServicio)
    }
    eliminarDependiente = async (id, codigo) => {
        const sql = `delete from itemservicio 
        WHERE id =  ${pool.escape(id)} and encabezado = false`;
        await pool.query(sql)
        return await this.listaDependientes1(codigo)
    }



}