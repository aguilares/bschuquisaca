
import pool from './bdConfig.js'

export class Informacion {
  
    // METODOS

    listarParaRegistro = async () => {

        // console.log('solicitud')

        const [rows] = await pool.query("SELECT red, nombre, telefono, direccion FROM hospital")
        return rows
    } 

    listar = async () => {
        const sql = `select e.id,  e.nombre, e.telefono, e.direccion, e.correo, concat(u.nombre,'  ', u.apellido1, u.apellido2) as usuario, 
        DATE_FORMAT(e.creado, "%Y-%m-%d") as creado, DATE_FORMAT(e.modificado, "%Y-%m-%d") as modificado
        from empresa e 
        left join personal u on e.usuario = u.id;
        `
        const [rows] = await pool.query(sql)
        console.log('Solicitud para info', rows) 
        return rows
    } 


    insertar = async (datos) => {
        const sqlExists =
            `SELECT * FROM empresa WHERE nombre = ${pool.escape(datos.nombre)}`;

        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            await pool.query("INSERT INTO empresa SET  ?", datos)
            return await this.listar()
        } else {
            return {
                existe:1,
            }
        }
    }

    buscar = async (dato) => {
        const sql = `SELECT red, nombre, telefono, direccion, correo FROM empresa WHERE (nombre = ${pool.escape(dato)} 
        or red = ${pool.escape(dato)})`;
        const [rows] = await pool.query(sql)
        return rows
    }

    editar = async (datos) => {
            const sql = `UPDATE empresa SET
            nombre = ${pool.escape(datos.nombre)},
            telefono = ${pool.escape(datos.telefono)},
            direccion = ${pool.escape(datos.direccion)},
            correo = ${pool.escape(datos.correo)},
            modificado = ${pool.escape(datos.modificado)},
            usuario = ${pool.escape(datos.usuario)}
            WHERE id = ${pool.escape(datos.id)}`;

            await pool.query(sql);
            return this.listar()
    }

    borrar = async (id) => {
        const sql = `delete from hospital 
        WHERE id =  ${pool.escape(id)}`;
        const [resultado] = await pool.query(sql)
        return resultado
    }
}