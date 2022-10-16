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

dotenv.config({ path:  path.resolve(__dirname, `.env.${ process.env.NODE_ENV }`) })

const PORT = process.env.API_PORT
const app  = express()

app.use(cors())
// app.use(history())

//global
global.documentTypes = [
  {
    value    : '01',
    directory: 'factura',
    name     : 'FACTURA'
  },
  {
    value    : '03',
    directory: 'boleta',
    name     : 'BOLETA'
  },
  {
    value    : '07',
    directory: 'nota-de-credito',
    name     : 'NOTA DE CREDITO'
  },
  {
    value    : '08',
    directory: 'nota-de-debito',
    name     : 'NOTA DE DEBITO'
  },
  {
    value    : '09',
    directory: 'guia-remision',
    name     : 'GUIA DE REMISION REMITENTE'
  }
]
global.business = [
  {
    value: '20100131359',
    name : 'datacont'
  },
  {
    value: '20100340438',
    name : 'reprodata'
  }
]
global.responseTypeSunat = [
  {
    titulo   : 'NO EXISTE EN SUNAT',
    subtitulo: 'El comprobante todavia no fue informado',
    type     : 'danger',
    id       : 0
  },
  {
    titulo   : 'ACEPTADO POR SUNAT',
    subtitulo: 'El comprobante fué aceptado',
    type     : 'success',
    id       : 1
  },
  {
    titulo   : 'ANULADO',
    subtitulo: 'El comprobante fué dado de baja',
    type     : 'danger',
    id       : 2
  },
  {
    titulo   : 'AUTORIZADO',
    subtitulo: 'El comprobante cuenta con autorización de imprenta',
    type     : 'info',
    id       : 3
  },
  {
    titulo   : 'NO AUTORIZADO',
    subtitulo: 'El comprobante no cuenta con autorización de imprenta',
    type     : 'warning',
    id       : 4
  }
]

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

