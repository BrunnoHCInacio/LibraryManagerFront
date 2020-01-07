import Service from "./Service"
import Params from "../util/mapParams"

export default {
    getAll(search) {
        if(search != null)
            return Service.get(`/api/books`, {headers: search})
                
        return Service.get('/api/books')
    },
    getById(id){
        return Service.get(`/api/books/${id}`)
    },
    save(obj){
        return Service.post('/api/books', obj)
    },
    edit(obj){
        return Service.put(`/api/books/${obj.id}`, obj)
    },
    delete(id){
        return Service.delete(`/api/books/${id}`)
    }
}