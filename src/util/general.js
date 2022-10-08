import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_ROUTE,
  headers: {
    'Accept'      : 'application/json',
    'Content-Type': 'application/json'
  }
})

const params = async () => {
  return {
    token       : '',
    tokenOctopus: '',
    empresa     : '',
  }
}

export const apiGet = async (URL,  payload) =>  {
  const plusParams = await params()
  return api.get(`${URL}`, { params: { ...payload, ...plusParams } }).then(response => response);
}

export const apiPost = async (URL, payload) =>  {
  const plusParams = await params()
  return api.post(`${URL}`, {...payload, ...plusParams }).then(response => response);
}