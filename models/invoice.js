import async         from 'async'
import path          from 'path'
import moment        from 'moment'
import fsPromises    from 'fs/promises'
import fs            from 'fs'
import process       from 'process'
import api           from '../api/sap_invoice.js'

const empresas            = {
  '20100131359': 'datacont',
  '20100781313': 'reprodata'
}
const invoicesType        = {
  '01': 'factura',
  '02': 'boleta',
  '03': 'nota-credito',
  '07': 'nota-debito'
}

const getInvoice = (req, res) => {
  let   hash      = req.query.hash || ''
  const extension = req.query.extension || 'pdf'

  let response = {
    status : 0,
  }

  console.log('Get invoice: ', hash)

  if (!hash) {
    response.message = `Datos invalidos para la consulta`
    res.send(response)
    return
  }

  if (hash.length !== 29) {
    response.message = `El identificador del documento es invalido`
    res.send(response)
    return
  }

  const { pathFile, found, filename } = findInvoiceInStorage(hash, extension)

  try {
    response = {
      base64PDF : found ?  fs.readFileSync(pathFile, { encoding: 'base64' }) : '',
      found,
    }
    res.send(response)
  } catch (err) {
    res.send({ message: err });
  }

}

const findInvoiceInStorage = (hash, extension = 'pdf') => {
  hash     = hash.replace('INV', '')
  const year     = hash.substring(0, 4)
  const ruc      = hash.substring(4, 15)
  const puesto   = hash.substring(15, 17)
  const serie    = hash.substring(17, 21)
  const number   = hash.substring(21, hash.length)
  const filename = `${ruc}-${puesto}-${serie}-${number}.${extension}`
  const pathFile = path.join(process.cwd(), "storage_invoices", year, empresas[ruc], extension, invoicesType[puesto], filename)
  const found    = fs.existsSync(pathFile)
  return { pathFile, found, filename }
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
    } else if (estructure_filename[0] !== '20100131359' && estructure_filename[0] !== '20100781313') {
      await writeLogError(file, 'El primer parametro del filename no es un RUC valido')
    } else if (estructure_filename[1] !== '07' && estructure_filename[1] !== '03' && estructure_filename[1] !== '09') {
      await writeLogError(file, 'El segundo parametro del filename no es un puesto valido')
    } else {
      const year                                               = moment().format('YYYY')
      const empresa                                            = empresas[estructure_filename[0]]
      const typeInvoice                                        = invoicesType[estructure_filename[1]]
      const filenameYear                                       = `${year}-${filename}`.split('-').join('')
      const pathInvoiceUpdate                                  = `${process.env.API_CLIENT_ROUTE}/V01?file=INV${filenameYear}`
      const destinationYearDirectoryPath                       = path.join(process.cwd(), "storage_invoices", year)
      const destinationEmpresaDirectoryPath                    = path.join(process.cwd(), "storage_invoices", year, empresa)
      const destinationPDFDirectoryPath                        = path.join(process.cwd(), "storage_invoices", year, empresa, 'pdf')
      const destinationInvoiceTypeDirectoryPath                = path.join(process.cwd(), "storage_invoices", year, empresa, 'pdf', typeInvoice)
      if (!fs.existsSync(destinationYearDirectoryPath))        fs.mkdirSync(destinationYearDirectoryPath);
      if (!fs.existsSync(destinationEmpresaDirectoryPath))     fs.mkdirSync(destinationEmpresaDirectoryPath);
      if (!fs.existsSync(destinationPDFDirectoryPath))         fs.mkdirSync(destinationPDFDirectoryPath);
      if (!fs.existsSync(destinationInvoiceTypeDirectoryPath)) fs.mkdirSync(destinationInvoiceTypeDirectoryPath);
      await fsPromises.rename(currentPath, `${destinationInvoiceTypeDirectoryPath}/${file}`)
      console.log('ruta actualizar en SAP', pathInvoiceUpdate)
      await api.updatePathInvoiceInSAP(empresa, typeInvoice, pathInvoiceUpdate)
    }
  } catch (error) {
    console.log('Error al render ddddd', error)
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

export default {
  processFiles,
  getInvoice
}