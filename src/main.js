// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import components from './components/index'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueProgressBar from 'vue-progressbar'

Vue.use(Vuetify, { theme: {
  primary: '#4FC3F7',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#00838F',
  warning: '#FFC107'
}})

Vue.use(VueProgressBar, {
  color: '#2196F3',
  failedColor: 'red',
  height: '2px'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: components,
  template: '<App/>'
})
