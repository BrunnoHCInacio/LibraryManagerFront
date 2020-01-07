<template>
    <v-container grid-list-md>
        <v-card>
            <v-card-title primary-title>
                <div>
                    <h2 class="title mb-0">
                        Devolução de livros
                    </h2>
                </div>
            </v-card-title>
            
            <v-card-text>
                <v-form>
                    <v-layout row wrap>
                         <v-flex xs6 >
                            <v-text-field disabled
                                v-model="loans.peopleName"
                            ></v-text-field>
                        </v-flex>
                         <v-flex xs6 >
                            <v-text-field disabled
                                v-model="loans.PeopleDocument"
                            ></v-text-field>
                        </v-flex>
                        <v-divider></v-divider>
                        <v-flex>
                            <v-btn @click="returnAll()">Devolver todos</v-btn>
                        </v-flex>
                        <v-flex xs12>
                            <v-data-table
                                :headers="headers"
                                :items="loans.loanBooks"
                                hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ formatDate(props.item.expectedDateReturn) }}</td>
                                    
                                   
                                </template>
                            </v-data-table>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <!--Componente de alerta-->
            <v-snackbar
                v-model="snackbar.show"
                :right="true"
                :timeout="4000"
                :multi-line="true"
                :top="true"
                :color="snackbar.color"
            >
                <li v-for="message in snackbar.message">
                    {{ message }}
                </li>
                <v-btn color="black" flat @click="snackbar.show = false">Close</v-btn>
            </v-snackbar>
        </v-card>

    </v-container>
</template>
<script>
import LoansService from '../../services/LoansService'

export default {
    data(){
        return{
            loans: {
                id: null,
                peopleId: null,
                loanBooks: []
            },
            headers: [
                {text: "Livro", valua: "bookTitle"},
                {text: "Data de devolução", value: "dataReturn"}
            ],
            snackbar: {
                show: false,
                color: "",
                message: []
            }
        }
    },
    mounted(){
        //this.getLoanId(this.$router.params.id)
        console.log(this.$router.id)
    },
    method:{
        async getLoanId(id){
             try{
                let response = await LoansService.getById(id) 
                console.log(response)
            }
            catch(exception){
                 console.log(exception)
                if(exception)
                    this.notifyErros("error", exception.response.data.errors)
            }
        },
        async returnAll(){
            try{
                let response = await LoansService.returnAll(this.loans) 
                console.log(response)
                if(response.data.success){
                    this.notify("success", "Devolução total realizada com sucesso")
                    this.backPage()
                }
            }
            catch(exception){
                if(exception)
                    this.notifyErros("error", exception.response.data.errors)
            }
        },
        
       
        notify(type, message){
            this.clearNotifier()
            this.snackbar.show = true
            this.snackbar.color = type
            this.snackbar.message = message
        },
        clearNotifier(){
            this.snackbar.show = false
            this.snackbar.color = ""
            this.snackbar.message = []
        },
       
        formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day.substring(0, 2)}/${month}/${year}`
        }
    }

}
</script>