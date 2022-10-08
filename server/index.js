import dotenv from 'dotenv'
import express from "express";
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url';
import invoice from './routes/invoice.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path:  path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) })

const PORT = process.env.PORT
const app  = express()

app.use(cors())
app.use('/storage', express.static(__dirname + '/storage'))

app.use('/invoice', invoice)
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`))

