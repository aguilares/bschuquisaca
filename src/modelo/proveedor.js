
import pool from './bdConfig.js'

export class Proveedor {


    // METODOS

    listar = async () => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor where eliminado =  false ORDER BY id DESC  LIMIT 6 `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarReciclaje = async () => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor where eliminado = true 
         ORDER by id DESC limit 7`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarSiguiente = async (id) => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor
            WHERE id < ${pool.escape(id)} and eliminado = false ORDER by id DESC  limit 6`;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarSiguienteEliminados = async (id) => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor
            WHERE id < ${pool.escape(id)} and eliminado = true ORDER by id DESC  limit 6`;
        const [rows] = await pool.query(sql)
        return rows
    }


    listarAnterior = async (id) => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor
            WHERE id > ${pool.escape(id)} and eliminado = false limit 6`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }


    listarAnteriorEliminados = async (id) => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor
            WHERE id > ${pool.escape(id)} and eliminado = true limit 6`;
        const [rows] = await pool.query(sql)
        rows.reverse()
        return rows
    }

    insertar = async (datos) => {
        console.log(datos, 'regis')
        const sqlexist =
            `SELECT * from proveedor where
            nit = ${pool.escape(datos.nit)}`;
        const [rows] = await pool.query(sqlexist)

        if (rows.length === 0) {
            const nombre =
                `SELECT * from proveedor where
                nombre = ${pool.escape(datos.nombre)}`;
            const [rowsnombre] = await pool.query(nombre)
            if (rowsnombre.length === 0) {

                await pool.query("INSERT INTO proveedor SET  ?", datos)

                return await this.listar()

            } else {
                return { existe: 2 }
            }
        } else {
            return { existe: 1 }
        }
    }

    insertaraux = async (datos) => {
        console.log(datos, 'regis')
        const sqlexist =
            `SELECT * from proveedor where
            nit = ${pool.escape(datos.nit)}`;
        const [rows] = await pool.query(sqlexist)

        if (rows.length === 0) {
            const nombre =
                `SELECT * from proveedor where
                nombre = ${pool.escape(datos.nombre)}`;
            const [rowsnombre] = await pool.query(nombre)
            if (rowsnombre.length === 0) {

                await pool.query("INSERT INTO proveedor SET  ?", datos)

                const sql = `select id as value, nombre as label from proveedor where eliminado = false order by id desc`
                const [lista] = await pool.query(sql)
                return lista

            } else {
                return { existe: 2 }
            }
        } else {
            return { existe: 1 }
        }
    }


    buscar = async (dato) => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor where (nombre like "${dato}%" or nit like "${dato}%") and eliminado = false`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        // console.log(rows, 'registro en el modelos')

        return rows
    }

    buscarEliminados = async (dato) => {
        const sql =
            `SELECT id, nombre,nit, telefono, direccion,
            pais, cuenta FROM proveedor where (nombre like "${dato}%" or nit like "${dato}%") and eliminado = true`;
        const [rows] = await pool.query(sql)
        return rows
    }

    actualizar = async (datos) => {

        const sqlExists = `SELECT * FROM proveedor WHERE 
            (nit = ${pool.escape(datos.nit)} or nombre = ${pool.escape(datos.nombre)})      
            and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sql = `UPDATE proveedor SET
                nombre = ${pool.escape(datos.nombre)},
                nit = ${pool.escape(datos.nit)},
                telefono= ${pool.escape(datos.telefono)},
                direccion = ${pool.escape(datos.direccion)},
                pais = ${pool.escape(datos.pais)},
                cuenta = ${pool.escape(datos.cuenta)},
                modificado = ${pool.escape(datos.modificado)},
                usuario = ${pool.escape(datos.usuario)}
                WHERE id = ${pool.escape(datos.id)}`;
            await pool.query(sql);

            const pacientes = await this.listar()
            return pacientes
        } else {
            return {
                existe: 1,
            }
        }
    }

    eliminar = async (id) => {
        const sql = `update proveedor set eliminado = true
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        return await this.listar()
    }

    restaurar = async (id) => {
        const sql = `update proveedor set eliminado = false
        WHERE id =  ${pool.escape(id)}`;
        await pool.query(sql)
        return await this.listar()
    }
}