
import pool from './bdConfig.js'

export class Clasificacion {


    listar = async () => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion where eliminado = false
         ORDER by id DESC limit 7`;
        const [rows] = await pool.query(sql)
        console.log(rows)
        return rows
    }

    listarReciclaje = async () => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion where eliminado = true
         ORDER by id DESC `;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarSiguiente = async (id) => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion 
            WHERE id < ${pool.escape(id)} and eliminado = false ORDER by id DESC  limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguienteEliminados = async (id) => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion 
            WHERE id < ${pool.escape(id)} and eliminado = true ORDER by id DESC  limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarAnterior = async (id) => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion 
            WHERE id > ${pool.escape(id)} and eliminado = false limit 7`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }


    listarAnteriorEliminados = async (id) => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion 
            WHERE id > ${pool.escape(id)} and eliminado = true limit 7`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }


    insertar = async (datos) => {
        const sqlExists = `SELECT * FROM clasificacion WHERE clasificacion = ${pool.escape(datos.clasificacion)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            await pool.query("INSERT INTO clasificacion SET  ?", datos)
            return await this.listar()
        } else {
            return {
                existe: 1,
            }
        }
    }

    insertaraux = async (datos) => {
        const sqlExists = `SELECT * FROM clasificacion WHERE clasificacion = ${pool.escape(datos.clasificacion)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            await pool.query("INSERT INTO clasificacion SET  ?", datos)

            const sql =
                `SELECT id as value, clasificacion as label FROM clasificacion where eliminado = false
                ORDER by id DESC`;

            const [lista] = await pool.query(sql)

            return lista
        } else {
            return {
                existe: 1,
            }
        }
    }


    buscar = async (dato) => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion where clasificacion like '${dato}%' and eliminado = false`;
        const [rows] = await pool.query(sql)
        return rows
    }

    buscarEliminados = async (dato) => {
        const sql =
            `SELECT id, clasificacion FROM clasificacion where clasificacion like '${dato}%' and eliminado = true`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {
        const sqlExists =
            `SELECT * FROM clasificacion WHERE clasificacion = ${pool.escape(datos.clasificacion)} and id !=${pool.escape(datos.id)} `;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE clasificacion SET
            clasificacion = ${pool.escape(datos.clasificacion)},
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;

            const [resultado] = await pool.query(sql);
            if (resultado.affectedRows === 0) {
                return { ok: false }
            } else return await this.listar()
        } else {
            return {
                existe: 1,
            }
        }
    }

    eliminar = async (id) => {
        const sql = `update clasificacion set eliminado = true
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        return await this.listar()
    }
    restaurar = async (id) => {
        const sql = `update clasificacion set eliminado = false
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        return await this.listar()
    }
}