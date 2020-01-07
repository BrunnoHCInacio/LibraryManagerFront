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
            <v-card-text v-if="alert.show">
                    <v-alert
                        v-model="alert.show"
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
                        <v-flex xs12
                                v-if="selectPeople.show">
                            <v-autocomplete
                                v-model="loans.peopleId"
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
                        <v-flex xs6 v-if="!selectPeople.show">
                            <v-text-field disabled
                                v-model="loans.peopleName"
                            ></v-text-field>
                        </v-flex>
                         <v-flex xs6 v-if="!selectPeople.show && isFormReturned">
                            <v-text-field disabled
                                v-model="loans.statusLoan"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs2 v-if="!selectPeople.show && !isFormReturned">
                            <v-btn fab color="gray">
                            <v-icon @click="selectPeople.show = true">edit</v-icon>
                            </v-btn>
                        </v-flex>

                    <v-flex xs12>
                        <v-sheet elevation="6" class="py-4 px-4">
                            <v-layout row wrap>
                                
                                    <v-flex xs5 v-if="!isFormReturned">
                                        <v-autocomplete v-model="selectBook.selected"
                                                        :items="selectBook.items"
                                                        :search-input.sync="selectBook.search"
                                                        hide-no-data
                                                        hide-selected
                                                        item-text="title"
                                                        item-value="id"
                                                        label="Livro"
                                                        placeholder="Pesquisar pelo título"
                                                        return-object/>
                                                    
                                    </v-flex>

                                    <v-flex xs6  v-if="!isFormReturned">
                                        <v-menu ref="menuDate"
                                            v-model="menuDate"
                                            :close-on-content-click="false"
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            max-width="290px"
                                            min-width="290px"
                                            >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                v-model="selectBook.expectedDateReturn"
                                                label="Date"
                                                persistent-hint
                                                prepend-icon="event"
                                                @blur="date = parseDate(selectBook.expectedDateReturn)"
                                                v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="date" no-title @input="menuDate = false"></v-date-picker>
                                            </v-menu>
                                    
                                        </v-menu>
                                    </v-flex>
                                    <v-flex v-if="!isFormReturned"
                                            xs12 sm1 md1 lg1>
                                        <v-btn color="primary" fab small dark @click="addBook">
                                            <v-icon>add</v-icon>
                                        </v-btn>
                                    </v-flex>
                                
                            </v-layout>
                        </v-sheet>
                        </v-flex>
                        <v-flex xs12>
                            <v-data-table
                                :headers="headers"
                                :items="loans.loanBooks"
                                hide-actions>
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-center">{{ props.item.title }}</td>
                                    <td class="text-xs-center">{{ formatDate(props.item.expectedDateReturn) }}</td>
                                    
                                    <td class="justify-center layout px-0">
                                        <v-icon v-if="!props.item.isReturned"
                                                small class="mr-2"
                                            @click="returnBook(props.item)"
                                        >
                                            close
                                        </v-icon>
                                        <v-icon v-if="!isFormReturned"
                                                small class="mr-2"
                                            @click="removeBook(props)"
                                        >
                                            delete
                                        </v-icon>
                                    </td>

                                </template>
                            </v-data-table>
                        </v-flex>
                    </v-layout>
                    <v-btn v-if="isFormReturned"
                            @click="returnAll">
                            Devolver todos
                    </v-btn>
                    <v-flex  v-if="!isFormReturned">
                        <v-btn v-if="!isFormEdit" 
                                class="success" 
                                @click="save">
                            Cadastrar
                        </v-btn>
                        <v-btn v-if="isFormEdit" 
                                @click="edit">
                            Editar
                        </v-btn>

                        <v-btn @click="clearForm">Limpar Formulário</v-btn>
                    </v-flex>
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

import PeoplesService from '../../services/PeoplesService'
import BooksService from '../../services/BooksService'
import LoansService from '../../services/LoansService'

export default {
    data(){
        return {
            isFormEdit: false,
            isFormReturned: false,
            dateFormatted: null,
            loans:{
                peopleId: null,
                loanBooks:[]
            },
            selectPeople: {
                show: true,
                items: [],
                search: null,
                selected: null
            },
            selectBook: {
                show: true,
                items: [],
                search: null,
                expectedDateReturn: this.formatDate(new Date().toISOString().substr(0, 10)),
                selected: null
            },
            alert:{
                show: false,
                color: "",
                message: []
            },
            snackbar: {
                show: false,
                color: "",
                message: []
            },
            headers: [
                {text: "Livro", valua: "bookTitle"},
                {text: "Data de devolução", value: "dataReturn"},
                {text: "Ações", value: "actions"}

            ],
            date: new Date().toISOString().substr(0, 10),
            menuDate: false,
            nameTitle: "Novo Empréstimo"
        }
    },
    mounted(){
        if(this.$route.params.id){
            this.loans = {
                id: this.$route.params.id
            }
            this.selectPeople.show = false;
            this.selectBook.show = false;
            this.isFormEdit = true
            this.nameTitle = "Editar Empréstimo"
            if(this.$route.params.isDevolution) {
                this.isFormReturned = true
                this.nameTitle = "Devolver Empréstimo"
            }
            this.getLoanById(this.$route.params.id)
            console.log(this.isFormReturned)
        }
    },
    watch: {
        "selectPeople.search" (name){
            this.getPeoplesByName(name)
        },
        "selectBook.search" (name){
            this.getBooksByName(name)
        },
        date (dateSelected){
            this.selectBook.expectedDateReturn = this.formatDate(dateSelected)
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
                    this.notity(exception.response.data.errors)
            }
        },
        async save(){
            try{
                let response = await LoansService.save(this.prepareSaveOrEdit(this.loans)) 
                console.log(response)
                if(response.data.success){
                    this.clearForm()
                    this.notify("success", "Cadastro realizado com sucesso")
                }
            }
            catch(exception){
                console.log(exception.response)
                if(exception)
                    this.notifyErros(exception.response.data.errors)
            }
        },
        prepareSaveOrEdit(obj){
            obj.expectedDateReturn = this.parseDate(obj.expectedDateReturn)
            return obj
        },
        async edit(){
            try{
                let response = await LoansService.edit(this.loans);
                if(response.data.success){
                    this.clearForm()
                    this.alert.show = false
                    this.notify("success", "Registro alterado com sucesso")
                }
            }catch(exception){
                if(exception)
                    this.notifyErros(exception.response.data.errors)
            }
        },
        
        async getLoanById(id){
            try{
                console.log("consultando emprestimo")
                let response = await LoansService.getById(id)
                this.loans = response.data
            }
            catch(exception){
                if(exception)
                    this.notifyErros(exception.response.data.errors)
            }
        },
        
        
        addBook() {
            if(!this.isValidDataAddBook()) return
            
            const book = {
                bookId: this.selectBook.selected.id,
                expectedDateReturn: this.parseDate(this.selectBook.expectedDateReturn),
                isReturned: false,
                title: this.selectBook.selected.title,
                author: this.selectBook.selected.author
            };
            
            this.loans.loanBooks.push(book);
            this.clearDateAndBook();
        },
        removeBook(obj){
            this.loans.loanBooks.splice(obj.index, 1);
        },
        isValidDataAddBook(){
            if(!this.selectBook.selected) {
                this.notify("error","Selecione o livro")
                return false
            }
            if(!this.selectBook.expectedDateReturn){
                this.notify("error","Selecione a data prevista para entrega")
                return false
            }
            let isNotEqual = false
            this.loans.loanBooks.forEach(obj => {
                if(obj.bookId == this.selectBook.selected.id){
                    this.notify("error", "Livro ja adicionado")
                    isNotEqual = true
                }
            });
            if(isNotEqual)
                return false
            return true
        },

        async returnBook(loanBook){
            try{
                let response = await LoansService.returnBook(loanBook) 
                if(response.data.success){
                    this.notify("success", "Livro devolvido com sucesso")
                    this.getLoanById(this.loans.id)
                }
            }
            catch(exception){
                console.log(exception)
                if(exception)
                    this.notifyErros(exception.response.data.errors)
            }
        },

        async returnAll(){
            try{
                let response = await LoansService.returnAll(this.loans) 
                if(response.data.success){
                    this.notify("success", "Devolução total realizada com sucesso")
                    this.backPage()
                }
            }
            catch(exception){
                console.log(exception)
                if(exception)
                    this.notifyErros(exception.response.data.errors)
            }
        },
        backPage() {
            this.$router.go(-1)
        },
        clearForm(){
            this.loans.peopleId = "",
            this.loans.bookId = "",
            this.loans.expectedDateReturn = "",
            this.loans.dateReturn = ""
            this.loans.loanBooks = []
            this.clearDateAndBook()
            this.clearNotifierErrors()
        },
        clearDateAndBook(){
            this.selectBook.selected = null
            this.selectBook.expectedDateReturn  = null
            this.selectBook.items = []
        },
        notifyErros(message){
            this.alert.show = true
            this.alert.color = "error"
            this.alert.message = message
        },
        notify(type, message){
            this.clearNotifier()
            this.snackbar.show = true
            this.snackbar.color = type
            this.snackbar.message.push(message)
        },
        clearNotifier(){
            this.snackbar.show = false
            this.snackbar.color = ""
            this.snackbar.message = []
        },
        clearNotifierErrors(){
            this.alert.show = false
            this.alert.color = ""
            this.alert.message = []
        },
        formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day.substring(0, 2)}/${month}/${year}`
        },
        parseDate (date) {
            if (!date) return null

            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
    }
}
</script>