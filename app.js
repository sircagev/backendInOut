import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express();

//Configuración
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Rutas
app.get('/',(req, res) => {
    res.send('pagina Inicial')
});

//Servidor
app.listen(3000, ()=>{
    console.log('El servidor se esta ejecutando en el purto 3000');
})