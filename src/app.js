import express from 'express'
import {dirname,join} from 'path'
import {fileURLToPath} from 'url'
import path from 'path'
import cors from 'cors'


// mis modulos
import rutas from "./rutas/rutas.js"
import {PORT} from "./config.js"


//inicializar 
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
// console.log(__dirname)
// app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("puerto", PORT)
// app.use(cors())
// app.use(express.static(path.join(__dirname,"../imagenes")));
app.use(cors())


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });


app.use(express.static(path.join(__dirname,"../imagenes/recibos")));

app.disable('x-powered-by') // evita que el atacante sepa que 
//ejecutamos express js como servidor
app.use(rutas)



app.listen(app.get("puerto"),()=>{
    console.log("servidor corriendo en: ", PORT)
});

