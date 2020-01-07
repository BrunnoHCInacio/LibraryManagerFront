<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12
                    style="height: 45vh; padding-top: 7vh;">
            </v-flex>
            <v-flex style="height: 55vh; background-color:#F5F5F5"/>
            <v-flex style="margin-top: -25vh"
                    xs12>
                <v-container fill-height>
                    <v-layout align-center row wrap>
                        <v-flex xs12 sm4 md4 lg4 xl2 offset-sm4 offset-md4 offset-lg4 offset-xl5>
                            <v-card class="elevation-5">
                                <v-card-title primary-title>
                                    <div style="text-align: center; width: 100%;">
                                        <h3 class="mb-0">Library Manager</h3>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-form>
                                                <v-text-field
                                                        v-model="user.email"
                                                        label="Login"
                                                        required
                                                ></v-text-field>
                                                <v-text-field
                                                        v-model="user.password"
                                                        label="Senha"
                                                        type="password"
                                                        required
                                                ></v-text-field>
                                            </v-form>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-btn depressed
                                                   large
                                                   color="primary"
                                                   block
                                                   @click="signin">
                                                Entrar
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-snackbar
                        v-model="snackbar.visible"
                        top
                >
                    {{ snackbar.text}}
                    <v-btn color="primary"
                           flat
                           @click="snackbar.visible = false"
                    >
                        fechar
                    </v-btn>
                </v-snackbar>
                <v-snackbar
                  v-model="snackbar.visible"
                  :timeout="4000"
                  top
                >
                  <li v-for="message in snackbar.text">
                    {{ message }}
                  </li>
                  <v-btn color="black" flat @click="snackbar.mode = false">Close</v-btn>
                </v-snackbar>
            </v-flex>
            
        </v-layout>
    </div>
</template>

<script>

import UsersService from '../../services/UsersService'

export default {
  name: 'login',
  data() {
    return {
      snackbar: {
        visible: false,
        text: []
      },
      user:{
        email: "",
        password: ""
      },
    }
  },
  
  methods: {
      async signin() {
      try{
        if(!this.validate()) return
        let response = await UsersService.login(this.user)
        if(response.data.success){
          localStorage.setItem("email", response.data.data.email)
          localStorage.setItem("token", response.data.data.accessToken)
          this.$router.push('Dashboard')
        }
      }
      catch(exception){
        let message = ""
        exception.response.data.errors.forEach(error => {
          message += " "+ error
        });

        this.notify(message)
      }
      
    },
    validate(){
    
      if(!this.user.email) {
        this.notify("Informe o e-mail")
        return false
      }
      if(!this.user.password) {
        this.notify("Informe a senha")
        return false
      }
      if(this.user.password.length < 8){
        this.notify("A senha deve conter pelo menos 8 caracteres")
        return false
      }
      return true
    },
    notify(message)
    {
      this.snackbar.visible = true,
      this.snackbar.text.push(message)
    }
  }
}
</script>
