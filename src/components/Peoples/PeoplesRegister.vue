<template>
    <v-container grid-list-md>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <h2 class="title mb-0">
                        {{nameTitle}}
                    </h2>
                    <span class="caption">
                        Aqui você poderá realizar o cadastro
                    </span>
                </div>
            </v-card-title>
            <v-card-text v-if="alert.status">
                    <v-alert
                        v-model="alert.status"
                        dismissible
                        :color="alert.color"
                        border="left"
                        elevation="2"
                        colored-border
                        icon="mdi-twitter"
                    >
                        <li v-for="message in alert.message">
                            {{ message }}
                        </li>
                    </v-alert>
            </v-card-text>
            <v-card-text>
                <v-form>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 md6 lg6>
                            <v-text-field
                                v-model="peoples.name"
                                label="Nome completo"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm3 md3 lg3>
                            <v-text-field
                                v-model="peoples.document"
                                label="CPF"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm3 md3 lg3>
                            <v-text-field
                                v-model="peoples.phone"
                                label="Telefone/Celular"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                        <br/>
                        <v-divider></v-divider>
                        <br/>
                        </v-flex>
                        <v-flex xs12 sm2 md2 lg2>
                            <v-text-field
                                v-model="peoples.address.zipCode"
                                label="CEP"
                            ></v-text-field>
                        </v-flex>
                          <v-flex xs12 sm8 md8 lg8>
                            <v-text-field
                                v-model="peoples.address.street"
                                label="Logradouro"
                            ></v-text-field>
                        </v-flex>
                          <v-flex xs12 sm2 md2 lg2>
                            <v-text-field
                                v-model="peoples.address.number"
                                label="Número"
                            ></v-text-field>
                        </v-flex>
                          <v-flex xs12 sm8 md8 lg8>
                            <v-text-field
                                v-model="peoples.address.complement"
                                label="Complemento"
                            ></v-text-field>
                        </v-flex>
                          <v-flex xs12 sm4 md4 lg4>
                            <v-text-field
                                v-model="peoples.address.district"
                                label="Bairro"
                            ></v-text-field>
                        </v-flex>
                          <v-flex xs12 sm4 md4 lg4>
                            <v-text-field
                                v-model="peoples.address.city"
                                label="Cidade"
                            ></v-text-field>
                        </v-flex>
                          <v-flex xs12 sm4 md4 lg4>
                            <v-text-field
                                v-model="peoples.address.state"
                                label="Estado"
                            ></v-text-field>
                        </v-flex>
                          <v-flex xs12 sm4 md4 lg4>
                            <v-text-field
                                v-model="peoples.address.country"
                                label="País"
                            ></v-text-field>
                        </v-flex>

                    </v-layout>
                    <v-flex>
                        <v-btn v-if="!isFormEdit" class="success" @click="save">Cadastrar</v-btn>
                        <v-btn v-if="isFormEdit" @click="edit">Editar</v-btn>

                        <v-btn @click="clearForm">Limpar Formulário</v-btn>
                    </v-flex>
                </v-form>
            </v-card-text>
            <!--Componente de alerta-->
            <v-snackbar
                v-model="snackbar.status"
                :right="true"
                :timeout="4000"
                :multi-line="true"
                :top="true"
                :color="snackbar.color"
            >
                <li v-for="message in snackbar.message">
                {{ message }}
                </li>
                <v-btn color="black" flat @click="snackbar.mode = false">Close</v-btn>
            </v-snackbar>
        </v-card>
    </v-container>
</template>
<script>
import PeoplesService from '../../services/PeoplesService'

export default {
    data(){
        return {
            isFormEdit: false,
            peopleId: null,
            peoples:{
                name: null,
                document: null,
                phone: null,
                address: {
                    zipCode: null,
                    street: null,
                    number: null,
                    complement: null,
                    district: null,
                    city: null,
                    state: null,
                    country: null
                }
            },
            alert: {
                color: "",
                status: false,
                message: []
            },
            snackbar: {
                color: "success",
                status: false,
                message: []
            },
            nameTitle: "Cadastrar Pessoa"
        }
    },
    mounted(){
        console.log(this.$route)
        if(this.$route.params.id){
            this.peoples = { 
                id: this.$route.params.id 
            } 
            this.isFormEdit = true
            this.nameTitle = 'Editar Pessoa'
            this.getPeopleById(this.$route.params.id)
        }
    },
    methods:{
        async getPeopleById(id){
            try{
                let response = await PeoplesService.getById(id)
                this.peoples = response.data
            }
            catch(exception){
                if(exception)
                    this.notifyError(exception.response.data.errors)
            }
        },
        async save(){
            try{
                if(!this.validateForm()) return
                let response = await PeoplesService.save(this.peoples);
                
                if(response){
                    this.alert.status = false;
                    this.clearForm()
                    this.notify("success", "pessoa cadastrada com sucesso")
                }
            }
            catch(exception){
                if(exception)
                    this.notifyError(exception.response.data.errors)
            }
        },
        async edit(){
            try{
                if(!this.validateForm()) return
                let responseAddress = await PeoplesService.editAddres(this.peoples.address)
                if(responseAddress){
                    if(responseAddress.data.success){
                        let responsePeople = await PeoplesService.edit(this.peoples)
                        if(responsePeople){
                            this.alert.status = false;
                            this.clearForm()
                            this.notify("success", "cadastro editado com sucesso")
                        }

                    }
                }
            }
            catch(exception){
                if(exception)
                    this.notifyError(exception.response.data.errors)
            }
        },
        clearForm(){
            this.peoples.name = ""
            this.peoples.document = ""
            this.peoples.phone = ""
            this.peoples.address.zipCode = ""
            this.peoples.address.street = ""
            this.peoples.address.number = ""
            this.peoples.address.complement = ""
            this.peoples.address.district = ""
            this.peoples.address.city = ""
            this.peoples.address.state = ""
            this.peoples.address.country = ""
        },
        async getById(id){

        },
        notifyError(message){
            this.alert.color = "error",
            this.alert.status = true,
            this.alert.message = message;
        },
        notify(type, message){
            this.snackbar.status = true
            this.snackbar.color = type
            this.snackbar.message.push(message)
        },
        validateForm(){
            let message = []
            if(!this.peoples.name) message.push("O nome completo deve ser informado")
            if(!this.peoples.document) message.push("O CPF deve ser informado")
            if(!this.peoples.phone) message.push("O telefone/celular deve ser informado")
            if(!this.peoples.address.zipCode) message.push("O CEP deve ser informado")
            if(!this.peoples.address.street) message.push("O logradouro deve ser informado")
            if(!this.peoples.address.district) message.push("O bairro deve ser informado")
            if(!this.peoples.address.city) message.push("A cidade deve ser informada")
            if(!this.peoples.address.state) message.push("O estado deve ser informado")
            if(!this.peoples.address.country) message.push("O país deve ser informado")
            
            if(message.length > 0) {
                this.notifyError(message)
                return false
            }
            return true;
        }
    }
}
</script>