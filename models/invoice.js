import async         from 'async'
import path          from 'path'
import moment        from 'moment'
import fsPromises    from 'fs/promises'
import fs            from 'fs'
import process       from 'process'
import crypto        from 'crypto-js';

const getInvoice = (req, res) => {
  const hash     = req.query.hash || ''

  let response = {
    status : 0,
  }

  if (!hash) {
    response.message = `Datos invalidos para la consulta`
    res.send(response)
    return
  }

  response.status   = 1
  response.document = { path : `https://www.gimtec.io/articles/process-is-not-defined/${hash}` }
  res.send(response)
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

  if (estructure_filename.length < 4) {
    await writeLogError(file, 'No cuenta con un nombre de archivo adecuado')
  } else if (estructure_filename[0] !== '20100131359' && estructure_filename[0] !== '20100781313') {
    await writeLogError(file, 'El primer parametro del filename no es un RUC valido')
  } else if (estructure_filename[1] !== '07' && estructure_filename[1] !== '03' && estructure_filename[1] !== '09') {
    await writeLogError(file, 'El segundo parametro del filename no es un puesto valido')
  } else {
    const year                                              = moment().format('YYYY')
    const empresa                                           = empresas[estructure_filename[0]]
    const typeInvoice                                       = invoicesType[estructure_filename[1]]
    const destinationYearDirectoryPath                      = path.join(process.cwd(), "storage_invoices", year)
    const destinationEmpresaDirectoryPath                   = path.join(process.cwd(), "storage_invoices", year, empresa)
    const destinationPDFDirectoryPath                       = path.join(process.cwd(), "storage_invoices", year, empresa, 'pdf')
    const destinationInvoiceTypeDirectoryPath               = path.join(process.cwd(), "storage_invoices", year, empresa, 'pdf', typeInvoice)
    if (!fs.existsSync(destinationYearDirectoryPath))        fs.mkdirSync(destinationYearDirectoryPath);
    if (!fs.existsSync(destinationEmpresaDirectoryPath))     fs.mkdirSync(destinationEmpresaDirectoryPath);
    if (!fs.existsSync(destinationPDFDirectoryPath))         fs.mkdirSync(destinationPDFDirectoryPath);
    if (!fs.existsSync(destinationInvoiceTypeDirectoryPath)) fs.mkdirSync(destinationInvoiceTypeDirectoryPath);
    await fsPromises.rename(currentPath, `${destinationInvoiceTypeDirectoryPath}/${file}`)
    await generateAndUpdatePathInSAP(`${year}-${file}`)
  }
}

const writeLogError = async (file, message) => {
  const fileLogErrorPath     = path.join(process.cwd(), 'storage_invoices', 'errors', 'log_invoices_listener_errors.txt')
  let data = await fsPromises.readFile(fileLogErrorPath, 'utf-8')
  data = `${data} \n ${file}: ${message} - procesado el ${moment().format('DD/MM/YYYY HH:mm')}`
  await fsPromises.writeFile(fileLogErrorPath, data)
  await fsPromises.rename(path.join(process.cwd(), "storage_invoices_listener", file), `storage_invoices/errors/${file}`)
}

const generateAndUpdatePathInSAP = async (filename) => {
  const nameEncrypt       = crypto.MD5(filename, 'hydra')
  const pathInvoiceUpdate = `${process.env.CLIENT_ROUTE}/V01?file=${nameEncrypt}`
}

export default {
  processFiles,
  getInvoice
}