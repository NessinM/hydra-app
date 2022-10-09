import dotenv            from 'dotenv'
import express           from "express";
import cors              from 'cors'
import path              from 'path'
import fs                from 'fs'
import cron              from 'node-cron'
import invoiceModel      from './models/invoice.js'
import { fileURLToPath } from 'url';
// import  history          from 'connect-history-api-fallback'
import invoice from './routes/invoice.js'

const __filename          = fileURLToPath(import.meta.url);
const __dirname           = path.dirname(__filename);
const __directoryInvoices = './storage_invoices_listener'

dotenv.config({ path:  path.resolve(__dirname, `.env.${process.env.NODE_ENV}`) })

const PORT = process.env.PORT
const app  = express()

app.use(cors())
// app.use(history())

// statics
app.use('/', express.static('dist'))
app.use('/storage', express.static(__dirname + '/storage'))

// routes
app.use('/api/invoice', invoice)
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
  cron.schedule("*/2 * * * * *", function () {
    fs.readdir(__directoryInvoices, (err, files) => {
      err ? console.log('Error al intentar buscar archivos') : invoiceModel.processFiles(files)
    })
  })
})

