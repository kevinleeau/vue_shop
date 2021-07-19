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
import treeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器，用户可以在Add Products页面中输入并编辑产品明细 https://github.com/surmon-china/vue-quill-editor#readme
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import Print from 'vue-print-nb'
// 全局配置基本url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// axios挂载在vue原型对象上
Vue.use({ locale })
Vue.use(Print)
Vue.prototype.$http = axios
Vue.use(less)
Vue.component('tree-table', treeTable)
Vue.config.productionTip = false
// 富文本编辑器注册为全局组件
Vue.use(VueQuillEditor)
// 注册时间全局过滤器
Vue.filter('dateFormat', function(originDate) {
  const newDate = new Date(originDate)
  const y = newDate.getFullYear()
  const m = (newDate.getMonth() + 1 + '').padStart(2, '0')
  const d = (newDate.getDate() + '').padStart(2, '0')
  const hh = (newDate.getHours() + '').padStart(2, '0')
  const mm = (newDate.getMinutes() + '').padStart(2, '0')
  const ss = (newDate.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
