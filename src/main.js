import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import store from './store'

axios.default.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
