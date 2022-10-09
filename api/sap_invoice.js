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

export default {
  updatePathInvoiceInSAP
}