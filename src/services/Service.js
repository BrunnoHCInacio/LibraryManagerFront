import axios from 'axios'
import { config } from 'shelljs'

const client = axios.create({
    baseURL: 'https://localhost:5001',
    
    timeout: 35000
})
client.interceptors.request.use(async config =>{
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
export default client
