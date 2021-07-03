// auto rename tag/bracket pair coloizer/javascript code snippets/live serve enable
// to enable vue has Autocomplete, go setting, add files association
import Vue from 'vue'
// less needed import before use
import less from 'less'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import locale from '../node_modules/element-ui/lib/locale/lang/en.js'
// 全局配置基本url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// axios挂载在vue原型对象上
Vue.use({ locale })
Vue.prototype.$http = axios
Vue.use(less)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
