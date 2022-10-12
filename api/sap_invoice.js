import service from '../services/sap.js'

const updatePathInvoiceInSAP = async (empresa, serie, path) => {
  const method = 'services/salida_mercancia_borrador_get'
  const form   = {
    env    : process.env.NODE_ENV,
    empresa: empresa,
    serie  : serie,
    path   : path
  };

  try {
    const response = await service.consumeSapService(empresa, method, form)
    console.log('response updatePathInvoiceInSAP', response)
    return response
  } catch (error) {
    throw error
  }
}

const getDocumentSAP = async (empresa, folio, numero, tipo, fecha, monto) => {
  const folder = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
  const method = `${folder}/consulta_factura_electronica`
  const form   = {
    env           : process.env.NODE_ENV,
    empresa       : empresa,
    FolioPref     : folio,
    FolioNum      : numero,
    Indicator     : tipo,
    fechaDocumento: fecha,
    DocTotal      : monto
  };

  console.log('form', form)

  try {
    const response = await service.consumeSapService(empresa, method, form)
    console.log('response getDocumentSAP', response)
    return response
  } catch (error) {
    throw error
  }
}

export default {
  updatePathInvoiceInSAP,
  getDocumentSAP
}