import Service from './Service';

export default {
    getAll(search){
        if(search != null) 
            return Service.get('/api/peoples', {headers: search})
        
        return Service.get('/api/peoples')
    },
    getById(id){
        return Service.get(`/api/peoples/${id}`)
    },
    save(obj){
        return Service.post('/api/peoples', obj)
    },
    edit(obj){
        return Service.put(`/api/peoples/${obj.id}`, obj)
    },
    editAddres(address){
        return Service.put(`/api/peoples/address/${address.id}`, address)
    },
    delete(id){
        return Service.delete(`/api/peoples/${id}`)
    }
}