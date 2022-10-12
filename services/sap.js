import axios from 'axios';
import general from './general.js';

const consumeSapService = async (empresa, method, form) => {
  const url           = `${process.env.API_SAP_ROUTE}/${method}.xsjs`
  try {
    const { data } = await axios.post(url, { timeout: 20000, ...form })
    return data
  } catch (error) {
    if (process.env.NODE_ENV !== 'development') await general.notifySlack(empresa, error, method, JSON.stringify(form));
    throw error
  }

  // var  body = {
  //        env: 'development',
  //        empresa: 'datacont',
  //        FolioPref: 'F010',
  //        FolioNum: '3062',
  //        Indicator: '01',
  //        fechaDocumento: '20200804',
  //        DocTotal : 31487.12
  //    };

  // post(url, { form: formStringify, timeout: 20000 }, (err, response, body) => {
  //   if (err) {
  //     if (process.env.NODE_ENV !== 'development') general.notifySlack(empresa, err, method, formStringify);
  //     reject(new Error('Error de acceso al sap service 1'));
  //     return;
  //   }

  //   if (response.statusCode === 500) {
  //     const error = new Error('Error de acceso al sap service 2');
  //     if (process.env.NODE_ENV !== 'development') general.notifySlack(empresa, error, method, formStringify);
  //     reject(error);
  //     return;
  //   }

  //   body = JSON.parse(body);

  //   if (body.status === 0) reject(new Error(body.message));
  //   else resolve(null, body)
  // });
};

export default {
  consumeSapService
}