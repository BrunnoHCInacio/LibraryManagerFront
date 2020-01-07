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
            
           <v-flex xs12 sm12 md12 lg12>
              <v-text-field
                v-model="books.title"
                label="Título do livro"
              ></v-text-field>
            </v-flex>
            
             <v-flex xs12 sm12 md12 lg12>
              <v-text-field
                v-model="books.author"
                label="Autor do livro"
              ></v-text-field>
            </v-flex>

            
             <v-flex xs12 sm12 md12 lg12>
              <v-text-field
                v-model="books.genre"
                label="Gênero do livro"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 sm12 md12 lg12>
 
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
                    <v-text-field v-model="books.publicationDate"
                                  label="Date"
                                  persistent-hint
                                  prepend-icon="event"
                                  @blur="date = parseDate(books.publicationDate)"
                                  v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title @input="menuDate = false"></v-date-picker>
                  </v-menu>
              </v-menu>

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
        v-model="snackbar.show"
        :right="true"
        :timeout="6000"
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
import BooksService from "../../services/BooksService"
export default {
  name: "register-books",
  data() {
    return {
      isFormEdit: false,
      books: {
        title: "",
        author: "",
        publicationDate: null,
        genre: "",

      },
      date: new Date().toISOString().substr(0, 10),
      menuDate: false,
      alert:{
        show: false,
        color: "",
        message: []
      },
      snackbar: {
        color: "success",
        show: false,
        message: []
      },
      nameTitle: "Cadastro de Livros"
    }
  },
  mounted(){
    if(this.$route.params.id){
      this.books = {id: this.$route.params.id}
      this.isFormEdit = true
      this.getBookById(this.books.id)
    }
  },
  watch: {
    date (val) {
      this.books.publicationDate = this.formatDate(this.date)
    },
  },
  methods: {
    async save(){
      try{
        if(!this.validateForm()) return
        let response = await BooksService.save(this.prepareSaveOrEdit(this.books))
        if(response.data.success){
          this.clearForm()
          this.clearNotifierError()
          this.notify("success", "Livro registrado com sucesso")
        }
      }catch(exception){
        if(exception)
          this.notifyError(exception.response.data.errors);
      }
    },
    prepareSaveOrEdit(obj){
      obj.publicationDate = this.parseDate(obj.publicationDate)
      return obj
    },
    async edit(){
      try{
        if(!this.validateForm()) return
        let response = await BooksService.edit(this.prepareSaveOrEdit(this.books))
        if(response.data.success){
          this.clearForm()
          this.clearNotifierError()
          this.notify("success", "Livro registrado com sucesso")
        }
      }
      catch(exception){
        if(exception)
          this.notifyError(exception.response.data.errors)
      }
    },
    async getBookById(id){
      try{
        let response = await BooksService.getById(id)
        this.books = response.data
        this.books.publicationDate = this.formatDate(this.books.publicationDate)
      }
      catch(exception){
        this.notifyError(exception.response.data.errors)
      }
    },
    validateForm(){
      let message = []
      if(!this.books.title){ 
        message.push("O título do livro deve ser informado")
      }
      if(!this.books.author){ 
        message.push("O autor do livro deve ser informado")
      }
      if(!this.books.publicationDate){ 
       message.push("A data de publicação deve ser informada")
      }
      if(!this.books.genre){ 
        message.push("O gênero do livro deve ser informado")
      }
      if(message.length > 0){
        this.notifyError(message)
        return false
      }
      return true
    },

    clearForm() {
      this.books.title = "",
      this.books.author = "",
      this.books.genre = "",
      this.books.publicationDate = null
    },

    notify(color, message) {
      this.clearNotifier()
      this.snackbar.color = color
      this.snackbar.show = true
      this.snackbar.message.push(message)
    },
    clearNotifier(){
      this.snackbar.color = ""
      this.snackbar.show = false
      this.snackbar.message = []
    },
    clearNotifierError(){
      this.alert.color = ""
      this.alert.show = false
      this.alert.message = []
    },
    notifyError(message){
      this.clearNotifierError()
      this.alert.show = true
      this.alert.color = "error",
      this.alert.message = message
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

<style scoped>
</style>
