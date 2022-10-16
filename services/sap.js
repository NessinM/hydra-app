import axios from 'axios';
import general from './general.js';

const consumeSapService = async (empresa, method, form) => {
  const url           = `${process.env.API_SAP_ROUTE}/${method}.xsjs`
  console.log('url', url)
  try {
    const { data } = await axios.post(url, { timeout: 20000, ...form })
    console.log('data', data)
    return data
  } catch (error) {
    if (process.env.NODE_ENV !== 'development') await general.notifySlack(empresa, error, method, JSON.stringify(form));
    throw error
  }
};

export default {
  consumeSapService
}