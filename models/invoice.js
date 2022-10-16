import async         from 'async'
import path          from 'path'
import moment        from 'moment'
import fsPromises    from 'fs/promises'
import fs            from 'fs'
import request         from 'request'
import process       from 'process'
import api           from '../api/sap_invoice.js'

const renderDocumentOfHash = (req, res) => {
  let hash = req.query.hash || ''

  let response = {
    status   : 0,
    found    : false,
    base64PDF: ''
  }

  if (!hash) {
    response.message = `Datos invalidos para la consulta`
    res.send(response)
    return
  }

  if (hash.length !== 30) {
    response.message = `El identificador del documento es invalido`
    res.send(response)
    return
  }

  hash              = hash.replace('INVP', '')
  hash              = hash.replace('INVX', '')
  const year        = hash.substring(0, 4)
  const ruc         = hash.substring(4, 15)
  const puesto      = hash.substring(15, 17)
  const serie       = hash.substring(17, 21)
  const number      = hash.substring(21, hash.length)
  const filename    = `${ruc}-${puesto}-${serie}-${number}`
  const empresa     = global.business.find(e => e.value === ruc)
  const tipo        = global.documentTypes.find(e => e.value === puesto)
  const pathFilePDF = path.join(process.cwd(), "storage_invoices", year, empresa?.name || 'sin-ruc', 'pdf', tipo?.directory || 'sin-tipo', `${filename}.pdf`)
  console.log('pathFilePDF', pathFilePDF)
  const pathFileXML = path.join(process.cwd(), "storage_invoices", year, empresa?.name || 'sin-ruc', 'xml', tipo?.directory || 'sin-tipo', `${filename}.xml`)
  const foundPDF    = fs.existsSync(pathFilePDF)
  const foundXML    = fs.existsSync(pathFileXML)

  response.status      = 1
  response.foundPDF    = foundPDF
  response.foundXML    = foundXML
  response.base64PDF   = foundPDF ?  fs.readFileSync(pathFilePDF, { encoding: 'base64' }) : '',
  response.baseXML     = foundXML ?  fs.readFileSync(pathFileXML, { encoding: 'utf8' }) : '',
  res.send(response)
}

const getInvoiceSAP = async (req, res) => {
  let empresa = req.query.empresa || ''
  let folio   = req.query.folio || ''
  let numero  = req.query.numero || ''
  let tipo    = req.query.tipo || ''
  let fecha   = req.query.fecha || ''
  let monto   = req.query.monto || ''

  let response = {
    status : 0,
  }

  if (!folio || !numero || !tipo || !fecha || !monto || !empresa) {
    response.message = `Datos invalidos para realizar la consulta`
    res.send(response)
    return
  }

  try {
    const data = await api.getInvoiceSAP(empresa, folio, numero, tipo, fecha, monto)
    res.send(data)
  } catch (error) {
    res.send({ message: error });
  }
}

const processFiles = (files) => {
  async.eachSeries(files, (file, next) => {
    validarParametrosFile(file)
      .then(() => next())
      .catch(err => next(err))
  }, err => {
    if (err) console.log('Error al procesar documentos', err)
    else files.length && console.log('Total de documentos procesados', files.length)
  })
}

const validarParametrosFile = async (file = '') => {
  const currentPath         = path.join(process.cwd(), "storage_invoices_listener", file);
  const filename            = file.substring(0, file.lastIndexOf('.')) || file;
  const estructure_filename = filename.split('-')

  try {
    if (estructure_filename.length < 4) {
      await writeLogError(file, 'No cuenta con un nombre de archivo adecuado')
    } else if (!global.business.filter(e => e.value === estructure_filename[0]).length) {
      await writeLogError(file, 'El primer parametro del filename no es un RUC valido')
    } else if (!global.documentTypes.filter(e => e.value === estructure_filename[1]).length) {
      await writeLogError(file, 'El segundo parametro del filename no es un tipo de documento valido')
    } else {
      const year                                = moment().format('YYYY')
      const empresa                             = global.business.find(e => e.value === estructure_filename[0])?.name || ''
      const typeInvoice                         = global.documentTypes.find(e => e.value === estructure_filename[1])?.directory || ''
      const filenameYear                        = `${year}-${filename}`.split('-').join('')
      const pathInvoicePDFUpdate                = `${process.env.API_CLIENT_ROUTE}/V01?file=INVP${filenameYear}`
      const pathInvoiceXMLUpdate                = `${process.env.API_CLIENT_ROUTE}/V01?file=INVX${filenameYear}`
      const destinationYearDirectoryPath        = path.join(process.cwd(), "storage_invoices", year)
      const destinationEmpresaDirectoryPath     = path.join(process.cwd(), "storage_invoices", year, empresa)
      const destinationPDFDirectoryPath         = path.join(process.cwd(), "storage_invoices", year, empresa, 'pdf')
      const destinationInvoiceTypeDirectoryPath = path.join(process.cwd(), "storage_invoices", year, empresa, 'pdf', typeInvoice)
      if (!fs.existsSync(destinationYearDirectoryPath))        fs.mkdirSync(destinationYearDirectoryPath);
      if (!fs.existsSync(destinationEmpresaDirectoryPath))     fs.mkdirSync(destinationEmpresaDirectoryPath);
      if (!fs.existsSync(destinationPDFDirectoryPath))         fs.mkdirSync(destinationPDFDirectoryPath);
      if (!fs.existsSync(destinationInvoiceTypeDirectoryPath)) fs.mkdirSync(destinationInvoiceTypeDirectoryPath);
      await api.updatePathInvoiceInSAP(empresa, estructure_filename[2], estructure_filename[3], estructure_filename[1], pathInvoicePDFUpdate, pathInvoiceXMLUpdate)
      await fsPromises.rename(currentPath, `${destinationInvoiceTypeDirectoryPath}/${file}`)
    }
  } catch (error) {
    console.log('error', error)
    await writeLogError(file, error)
    throw error
  }
}

const writeLogError = async (file, message) => {
  const fileLogErrorPath     = path.join(process.cwd(), 'storage_invoices', 'errors', 'log_invoices_listener_errors.txt')
  let data = await fsPromises.readFile(fileLogErrorPath, 'utf-8')
  data = `${data} \n ${file}: ${message} - procesado el ${moment().format('DD/MM/YYYY HH:mm')}`
  await fsPromises.writeFile(fileLogErrorPath, data)
  await fsPromises.rename(path.join(process.cwd(), "storage_invoices_listener", file), `storage_invoices/errors/${file}`)
}

const handlerObtenerTokenSunat = (empresa, callback) => {
  const SUNAT_ID     = empresa === 'datacont' ? process.env.API_DATACONT_SUNAT_CLIENT_ID : process.env.API_REPRODATA_SUNAT_CLIENT_ID
  const SUNAT_SECRET = empresa === 'datacont' ? process.env.API_DATACONT_SUNAT_CLIENT_SECRET : process.env.API_REPRODATA_SUNAT_CLIENT_SECRET
  const URL          = `https://api-seguridad.sunat.gob.pe/v1/clientesextranet/${SUNAT_ID}/oauth2/token/`

  const opciones = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form : {
      grant_type   : 'client_credentials',
      scope        : 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes',
      client_id    : SUNAT_ID,
      client_secret: SUNAT_SECRET
    }
  }
  request.post(URL, opciones, function(err, response, body) {
    if (err) callback(err)
    else {
      if (response.statusCode === 200) callback(null, body)
      else callback(`Existe un error al momento de obtener el, token de sunat - codigo error ${response.statusCode}`)
    }
  })
}

const getStatusInvoiceSunat = async (req, res) => {
  const empresa      = req.query.empresa || ''
  const codComp      = req.query.codComp || ''
  const numeroSerie  = req.query.numeroSerie || ''
  const numero       = req.query.numero || ''
  const fechaEmision = req.query.fechaEmision || ''
  const monto        = req.query.monto || ''

  var objEmpresa =  global.business.find(e => e.name === empresa)

  let response = {
    status: 0
  }

  handlerObtenerTokenSunat(empresa, function (err,  acceso) {
    if (err) {
      response.message = err
      res.send(response)
      return
    }

    const token = JSON.parse(acceso).access_token
    const url   = `https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/${objEmpresa.value}/validarcomprobante`
    const opciones = {
      headers: {
        Authorization : 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body : {
        numRuc      : objEmpresa.value,
        codComp     : codComp,
        numeroSerie : numeroSerie,
        numero      : numero,
        fechaEmision: fechaEmision,
        monto       : monto
      },
      json  :true
    }

    request.post(url, opciones, (err, resp, body) => {
      if (err) {
        response.message = err
        res.send(response)
        return
      }

      const bodyParse = typeof body === 'string' ? JSON.parse(body) : body

      if (resp.statusCode !== 200) {
        response.message = bodyParse.message || bodyParse.msg
        res.send(response)
        return
      }

      console.log('data', bodyParse)

      const objResponse = {
        ...global.responseTypeSunat.find(e => e.id === +bodyParse.data.estadoCp),
        observaciones : bodyParse.data.observaciones
      }

      console.log('objResponse', objResponse)

      response.status = 1
      response.body   = objResponse
      res.send(response)
    })
  })
}


export default {
  processFiles,
  renderDocumentOfHash,
  getInvoiceSAP,
  getStatusInvoiceSunat
}