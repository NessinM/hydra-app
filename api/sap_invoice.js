import service from '../services/sap.js'

const updatePathInvoiceInSAP = async (empresa, serie, numero, indicator, pathPDF, pathXML) => {
  const folder = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
  const method = `${folder}/documentos_electronicos_update`
  const form   = {
    env      : process.env.NODE_ENV,
    empresa  : empresa,
    FolioPref: serie,
    FolioNum : numero,
    Indicator: indicator,
    enlaceXML: pathXML,
    enlacePDF: pathPDF
  };

  console.log('form', form)

  try {
    const response = await service.consumeSapService(empresa, method, form)
    console.log('response', response)
    if (!response.status) throw response.message
    else return response
  } catch (error) {
    throw error
  }
}

const getInvoiceSAP = async (empresa, folio, numero, tipo, fecha, monto) => {
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
    return response
  } catch (error) {
    throw error
  }
}

export default {
  updatePathInvoiceInSAP,
  getInvoiceSAP
}