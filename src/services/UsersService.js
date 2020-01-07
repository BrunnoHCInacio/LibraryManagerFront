import Service from './Service'

export default {
    login(obj){
        return Service.post('/api/login', obj)
    }
}