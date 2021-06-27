import Vue from 'vue'
// 按需导入时写在一起，用逗号分隔，否则报错多次重复导入
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
