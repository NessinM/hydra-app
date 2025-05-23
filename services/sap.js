import axios from 'axios';

const consumeSapService = async (empresa, method, form) => {
  const url           = `${process.env.API_SAP_ROUTE}/${method}.xsjs`
  console.log('url', url)
  try {
    const { data } = await axios.post(url, { timeout: 20000, ...form })
    return data
  } catch (error) {
    console.error('Error:', error.message)
    throw error
  }
};

export default {
  consumeSapService
}