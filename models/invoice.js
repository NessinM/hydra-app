const getInvoice = (req, res) => {

  let path = 'https://www.gimtec.io/articles/process-is-not-defined/'
  if (req.query.hash !== 'nesyn') {
    path  = ''
  }
  res.send({ status : 1, document : { path } })
}

export default {
  getInvoice
}