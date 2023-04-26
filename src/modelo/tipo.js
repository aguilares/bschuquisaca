
import pool from './bdConfig.js'

export class Tipo {

    // METODOS

    listar = async () => {
        const sql =
            `SELECT id, tipo, descripcion, codigo FROM tipo where eliminado = false ORDER BY id DESC limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarReciclaje = async () => {
        const sql =
            `SELECT id, tipo, descripcion, codigo FROM tipo where eliminado = true 
         ORDER by id DESC limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarSiguiente = async (id) => {
        const sql =
            `SELECT id, tipo, descripcion, codigo FROM tipo 
            WHERE id < ${pool.escape(id)} and eliminado = false ORDER by id DESC  limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguienteEliminados = async (id) => {
        const sql =
            `SELECT id, tipo, descripcion, codigo FROM tipo
            WHERE id < ${pool.escape(id)} and eliminado = true ORDER by id DESC  limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarAnterior = async (id) => {
        const sql =
            `SELECT id, tipo, descripcion, codigo FROM tipo
            WHERE id > ${pool.escape(id)} and eliminado = false limit 7`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }


    listarAnteriorEliminados = async (id) => {
        const sql =
            `SELECT id, tipo, descripcion, codigo FROM tipo
            WHERE id > ${pool.escape(id)} and eliminado = true limit 7`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }


    insertar = async (datos) => {
        const sqlExists =
            `SELECT * FROM tipo WHERE tipo = ${pool.escape(datos.tipo)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const [row] = await pool.query("INSERT INTO tipo SET  ?", datos)
            let codigo = row.insertId
            const sqlUpdate = `update tipo set codigo = ${pool.escape('T-' + codigo)} where id = ${pool.escape(codigo)}`
            await pool.query(sqlUpdate)
            return await this.listar()


        } else {
            return {
                existe: 1,
            }
        }
    }

    buscar = async (dato) => {
        const sql =
            `SELECT id, tipo, descripcion, codigo  from tipo where tipo like '${dato}%' or codigo like '${dato}'`;
        const [rows] = await pool.query(sql)
        console.log(rows)
        return rows
    }

    buscarEliminados = async (dato) => {
        const sql =
            `SELECT id, tipo, descripcion, codigo  from tipo where tipo like '${dato}%' and eliminado = true`;
        const [rows] = await pool.query(sql)
        return rows
    }
    actualizar = async (datos) => {
        const sqlExists =
            `SELECT * FROM tipo WHERE tipo = ${pool.escape(datos.tipo)} and id != ${pool.escape(datos.id)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sql = `UPDATE tipo SET
                    tipo = ${pool.escape(datos.tipo)},
                    descripcion = ${pool.escape(datos.descripcion)},
                    modificado = ${pool.escape(datos.modificado)},
                    usuario = ${pool.escape(datos.usuario)}
                    WHERE id = ${pool.escape(datos.id)}`;

            const [resultado] = await pool.query(sql);
            if (resultado.affectedRows === 0) {
                return {
                    existe: 0,
                }
            }
            return await this.listar()

        } else {
            return {
                existe: 1,
            }
        }
    }

    eliminar = async (id) => {
        const sql = `update tipo set eliminado = true
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        return await this.listar()
    }
    restaurar = async (id) => {
        const sql = `update tipo set eliminado = false
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        return await this.listar()
    }
}