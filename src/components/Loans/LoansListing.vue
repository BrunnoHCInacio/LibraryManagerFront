<template>
    <v-container grid-list-md text-center>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <h2 class="title mb-0">Empréstimos</h2>
                            <span class="caption">Faça uma pesquisa utilizando os filtros abaixo para um melhor resultado.</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-layout>
                                        <v-flex xs1/>
                                            <v-flex xs6>
                                                <v-autocomplete
                                                    v-model="search.peopleId"
                                                    :items="selectPeople.items"
                                                    :search-input.sync="selectPeople.search"
                                                    hide-no-data
                                                    hide-selected
                                                    item-text="name"
                                                    item-value="id"
                                                    label="Pessoa"
                                                    placeholder="Pesquisar pela pessoa"
                                                />
                                            </v-flex>
                                        <v-flex xs1/>
                                    </v-layout>
                                </v-flex>
                                <v-btn color="success" v-on:click="getLoans()">Buscar!</v-btn>
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
                                <td class="text-xs-center"> 
                                    <v-chip color="black" dark> {{props.item.statusLoan}} </v-chip>
                                </td>
                                <td class="text-xs-center">{{ props.item.peopleName }}</td>
                                                                
                                <td class="justify-center layout px-0">
                                    <v-icon small class="mr-2" v-if="!props.item.isReturned"
                                            @click="returnBook(props.item.id)">
                                        cancel
                                    </v-icon>
                                    <v-icon small class="mr-2"
                                        @click="edit(props.item.id)">
                                        edit
                                    </v-icon>
                                    <v-icon small class="mr-2"
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
import PeoplesService from '../../services/PeoplesService'
import BooksService from '../../services/BooksService'
import LoansService from '../../services/LoansService'
 
export default {
    data(){
        return {
            items: [],
            search: {
                peopleId: "",
                bookId: ""
            },
            headers: [
                {text: "Estado", value: "status"},
                {text: "Pessoa", value: "peopleName"},
                {text: "Ações", value: "actions"}

            ],
            selectPeople: {
                items: [],
                search: null
            },
            selectBook: {
                items: [],
                search: null
            },
            snackbar: {
                status: false,
                color: "",
                message: []
            },
            statusLoan: {
                color: "",
                message: ""
            },
            showDialogRemove: false,
            idRemove: null
        }
    },
    mounted(){
        this.getLoans()
    },
    watch:{
        "selectPeople.search" (name){
            this.getPeoplesByName(name)
        },
        "selectBook.search" (name){
            this.getBooksByName(name)
        }
    },
    methods:{
        async getBooksByName(name){
            let search = {
                name: name
            }
            try{
                let response = await BooksService.getAll(search)
                this.selectBook.items = response.data
            }
            catch(exception){
                if(exception)
                    this.notity("error", exception.response.data.errors)
            }
        },
        async getPeoplesByName(name){
            let search = {
                name: name
            }
            try{
                let response = await PeoplesService.getAll(search)
                this.selectPeople.items = response.data
            }
            catch(exception){
                if(exception)
                    this.notity("error", exception.response.data.errors)
            }
        },
        async getLoans(){
            try{
                let response = await LoansService.getAll(this.search)
                this.items = response
            }
            catch(exception){
                if(exception)
                    this.notity("error", exception.response.data.errors)
            }
        },
        edit(loanId){
            
            this.$router.push({
                name: 'LoansRegister',
                params: {id: loanId}
            })
        },
        returnBook(loanId){

            this.$router.push({
                name: 'LoansRegister',
                params: {
                    id: loanId,
                    isDevolution: true
                }
            })
        },
        remove(id){
            this.idRemove = id
            this.showDialogRemove = true
        },
        async removeConfirmed(){
            this.showDialogRemove = false   
            try{
                let response = await LoansService.delete(this.idRemove)
                if(response) {
                    this.notify("success", ["Registro removido com sucesso"])
                    this.showDialogRemove = false
                    this.getLoans()
                }
                
            }
            catch(exception){
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
            this.snackbar.status = false
            this.snackbar.color = ""
            this.snackbar.message = []
        },
        clearFilters(){
            this.search.peopleId = ""
            this.search.bookId = ""
            this.getLoans()
        },
        formatDate (date) {
            if (!date) return null
            const [year, month, day] = date.split('-')
            return `${day.substring(0, 2)}/${month}/${year}`
        }
    },
    
}
</script>