import express from 'express';
import path from 'path';
import routerServer from './routes.js';
import { fileURLToPath } from 'url';
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
var app = express();

// configuracion de gestor de vistas
app.set('view engine', 'ejs');
app.set('views',  path.resolve(__dirname, 'views'));

// configuro express para recibir data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// configuracion de path a exponer publicamente 
app.use('/', express.static(path.join(__dirname, 'public-static')));
app.use('/p/', express.static(path.join(__dirname, '../practicas')));


const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// importo rutas desde modulo en archivo aparte
app.use('/', routerServer); 

// inicio del servidor 
app.listen(PORT, () => {
    console.clear();
    console.log('\x1Bc'); //esta linea limpia la pantalla antes de volver a ejectuar la aplicacion por cada cambio
    console.log('\x1b[7m%s\x1b[0m', ' El servidor de JS esta corriendo correctamente          '); 
    console.log('\x1b[7m%s\x1b[0m', ' Ultima actualización a las: '+ new Date().toLocaleTimeString()+'                  \r\n');
    console.log('---------------------------------------------------------')
    console.log('\x1b[34m%s\x1b[0m', 'Acceder desde [Ctrl + Clic ] ==>','\x1b[32m\x1b[0m',` http://localhost:${PORT} \r`);
    console.log('---------------------------------------------------------')
    console.log('\x1b[31m%s\x1b[0m', ' Para salir precione en esta ventana [Ctrl + C ]        \r\n');    
});

export default app;