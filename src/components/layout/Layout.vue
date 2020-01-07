<template>
  <v-app>
    <left-navigation/>
    <v-toolbar
      class="cyan"
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="enviarDrawer" class="hidden-lg-and-up white--text"/>
      <v-btn icon @click.stop="voltarPagina" class="hidden-md-and-down">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'" class="white--text"/>
      </v-btn>
      <v-toolbar-title @click="abrirDashborad" v-text="title" class="white--text"/>
        <v-spacer/>
        <v-menu
        transition="slide-y-transition"
        bottom
        >
          <v-btn
            slot="activator"
            class="purple"
            color="primary"
            dark
          >
            {{getUser()}}
          </v-btn>
          <v-list>
            <v-list-tile>
              <v-list-tile-title @click="logout">Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        
    </v-toolbar>
    <v-content class="grey lighten-2">
      <router-view/>
    </v-content>

    <v-footer :fixed="fixed" app class="elevation-2">
      <v-container fluid grid-list-md>
        <span>Library Manager</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
  import LeftNavigation from './LeftNavigation'
  import Bus from '../../util/bus'


  export default {
    name: 'Layout',
    components: {LeftNavigation},
    data() {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Library Manager',
        user: {
          funcionario: {
            pessoa: {
              nome: ''
            }
          }
        }
      }
    },
    mounted(){
      
    },
    methods: {
      abrirDashborad(){
        this.$router.push({
          name: 'Dashboard'
        })
      },
      voltarPagina: function () {
        this.$router.go(-1)
      },
      enviarDrawer: function () {
        this.drawer = !this.drawer
        Bus.$emit('shareDrawer', this.drawer)
      },
      getUser(){
        return localStorage.getItem('email')
      },
      logout: function (){
        localStorage.clear('token')
        this.$router.push('/login?q=unauthenticated')
      },
      perfilUsuario(){
        this.$router.push({
          name: '',
          params: {id: this.user.id}
        })
      }
    }
  }
</script>

<style scoped>

</style>
