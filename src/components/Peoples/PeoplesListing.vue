<template>
    <v-container grid-list-md text-center>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h2 class="title mb-0">Pesquisa</h2>
                            <span class="caption">Faça uma pesquisa utilizando os filtros abaixo para um melhor resultado.</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-layout>
                                        <v-flex xs1/>
                                            <v-flex xs4>
                                                <v-text-field xs12 md3
                                                    label="Buscar por nome"
                                                    v-model="search.name"/>
                                            </v-flex>
                                        <v-flex xs1/>
                                    </v-layout>
                                </v-flex>
                                <v-btn color="success" v-on:click="getPeoples">Buscar!</v-btn>
                                <v-btn color="secondary" v-on:click="clearFilters">Redefinir busca</v-btn>
                            </v-layout>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs12>
                <v-card>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="items.data"
                            hide-actions
                        >
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-center">{{ props.item.name }}</td>
                                <td class="text-xs-center">{{ props.item.document }}</td>
                                <td class="text-xs-center">{{ props.item.phone }}</td>
                                <td class="justify-center layout px-0">
                                    <v-icon
                                        small
                                        class="mr-2"
                                        @click="edit(props.item.id)">
                                        edit
                                    </v-icon>
                                    <v-icon
                                        small
                                        @click="remove(props.item.id)"
                                    >
                                        delete
                                    </v-icon>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card-text>
          
                    <!-- Componente de alerta -->
                    <v-snackbar
                        v-model="snackbar.status"
                        :right="true"
                        :timeout="4000"
                        :multi-line="true"
                        :top="true"
                        :color="snackbar.color">

                        <li v-for="message in snackbar.message">
                            {{ message }}
                        </li>
                        <v-btn
                            color="black"
                            flat
                            @click="snackbar.mode = false">
                            Close
                        </v-btn>
                    </v-snackbar>
                </v-card>
            </v-flex>

            <v-dialog
                v-model="showDialogRemove"
                width="500">
                <v-card>
                    <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                    >
                        Confirmar remoção!
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12> 
                                    <v-flex xs12>
                                        Deseja realmente remover este registro?
                                    </v-flex>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat @click="removeConfirmed"> Sim </v-btn>
                        <v-btn flat @click="showDialogRemove = false"> Não </v-btn>
                    </v-card-actions> 
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>
<script>
import PeoplesServices from '../../services/PeoplesService'

export default {
    data(){
        return {
            items: [],
            search:{
                name: ""
            },
            headers: [
                {text: "Nome", value: "name"},
                {text: "CPF", value: "document"},
                {text: "Telefone/Celular", value: "phone"},
                {text: "Ações", value: ""}
            ],
            snackbar: {
                status: false,
                color: "",
                message: []
            },
            idRemove: null,
            showDialogRemove: false,
        }
    },
    mounted(){
        this.getPeoples()
    },
    methods: {
       async getPeoples(){
            try{
                let response = await PeoplesServices.getAll(this.search)
                this.items = response 
            }
            catch(exception){
                console.log(exception)
                this.notify("error", exception.response.data.errors)
            }
       },
       edit(id){
           this.$router.push({
                name: 'PeoplesRegister',
                params: {id: id}
            })
        },
        remove(id){
            this.idRemove = id
            this.showDialogRemove = true
        },
        async removeConfirmed(){
            this.showDialogRemove = false   
            try{
                let response = await PeoplesServices.delete(this.idRemove)
                if(response) {
                    this.notify("success", ["Registro removido com sucesso"])
                }
                this.getPeoples()
            }
            catch(exception){
                console.log(exception.response)
                if(exception)
                    this.notify("error", exception.response.data.errors)
            }
        },
        notify(type, message){
            this.clearNotifier()
            this.snackbar.status = true
            this.snackbar.color = type
            this.snackbar.message = message
        },
        clearNotifier(){
            this.snackbar.color = "",
            this.snackbar.show = false,
            this.snackbar.message = []
        },
        clearFilters(){
            this.search.name = ""
            this.getPeoples()
        }
    }
}
</script>