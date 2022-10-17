import axios from 'axios'
import { notify } from "@kyvg/vue3-notification";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_ROUTE,
  headers: {
    'Accept'      : 'application/json',
    'Content-Type': 'application/json'
  }
})

// const params = async () => {
//   return {
  // agregar token, empresa etc
//   }
// }

export const apiGet = async (URL,  payload) =>  {
  // const plusParams = await params()
  try {
    const { data } = await api.get(`${URL}`, { params: { ...payload } });
    if (!data.status) {
      throw data
    }

    return data
  } catch (error) {
    throw error
  }
}

export const apiPost = async (URL, payload) =>  {
  // const plusParams = await params()
  console.log('payload', payload)
  return api.post(`${URL}`, payload);
}

export const notificacion = (type, title, text) =>  {
  notify({
    title   : title,
    text    : text,
    position: 'bottom right',
    type    : type
  });
}