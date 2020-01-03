import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '@/assets/css/global.css'
import '@/assets/fonts/iconfont.css'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
// 设置基础路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
