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
                                label="Buscar pelo título do livro"
                                v-model="search.title"
                              />
                            </v-flex>
                              <v-flex xs4>
                              <v-text-field xs12 md3
                                label="Buscar pelo autor do livro"
                                v-model="search.author"
                              />
                            </v-flex>
                          <v-flex xs1/>
                         </v-layout>
                        </v-flex>
                    <v-btn color="success" v-on:click="getBooks">Buscar!</v-btn>
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
                  <td class="text-xs-center">{{ props.item.title }}</td>
                  <td class="text-xs-center">{{ props.item.author }}</td>
                  <td class="text-xs-center">{{ props.item.genre }}</td>
                  <td class="text-xs-center">{{ formatDate(props.item.publicationDate) }}</td>
                  <td class="justify-center layout px-0">
                    <v-icon
                      small
                      class="mr-2"
                      @click="edit(props.item.id)"
                    >
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
            v-model="snackbar.show"
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
              @click="snackbar.mode = false"
            >
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
  import BooksService from '../../services/BooksService'

  export default {
    name: 'books-listings',
    data() {
      return {
        items: [],
        search: {
          title: "",
          author: ""
        },
       
        headers: [
          {text: 'Título', value: 'title'},
          {text: 'Autor', value: 'author'},
          {text: 'Genero', value: 'genre'},
          {text: 'Data de publicação', value: 'publicationDate'},
          {text: 'Ações', value: ''}
        ],
       
        snackbar: {
          color: "",
          show: false,
          message: []
        },
        showDialogRemove: false,
        idRemove: null,
        showMenu: false
      }
    },
    mounted() {
      this.getBooks()
    },
    methods: {
      show(){
        this.$nextTick(() => {this.showMenu = true})
      }, 
      async getBooks(){
        try{
          let response = await BooksService.getAll(this.search);
          this.items = response
        }
        catch(exception){
          this.notify("error", exception.response.data.errors);
        }
      },
      edit(bookId){
          this.$router.push({
                name: 'BooksRegister',
                params: {id: bookId}
            })
      },
      remove(id){
        this.idRemove = id
        this.showDialogRemove = true
      },
      async removeConfirmed(){
        try{
          let response = await BooksService.delete(this.idRemove)
          if(response.data.success){
            this.idRemove = null
            this.showDialogRemove = false
            this.notify("success", ["Registro removido com sucesso"])
            this.getBooks()
          }
        }
        catch(exception){
          this.notify("error", exception.response.data.errors)
          this.showDialogRemove = false
        }
      },
      clearFilters(){
        this.search.name = ""
      },
      notify(type, message) {
        this.clearNotifier()
        this.snackbar.color = type,
        this.snackbar.show = true,
        this.snackbar.message = message
      },
      clearNotifier(){
        this.snackbar.color = "",
        this.snackbar.show = false,
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

<style scoped>

</style>
