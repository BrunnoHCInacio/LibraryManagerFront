import Service from './Service'

export default {
    getAll(search){
        if(search){
            return Service.get('/api/loans', {headers: search})
        }
        return Service.get('/api/loans')
    },
    getById(id){
        return Service.get(`/api/loans/${id}`)
    },
    save(obj){
        return Service.post('/api/loans', obj)
    },
    edit(obj){
        return Service.put(`/api/loans/${obj.id}`, obj)
    },
    returnAll(obj){
        return Service.put(`/api/loans/returnAll/${obj.id}`, obj)
    }
    ,
    returnBook(obj){
        
        return Service.put(`/api/loans/return/${obj.id}`, obj)
    },
    delete(id){
        return Service.delete(`/api/loans/${id}`)
    }
}