import Vue from 'vue'

import { Button, Form, FormItem, Input, Message, Table, TableColumn,
  Switch, Tooltip, Pagination, Dialog, MessageBox, Tree, Select, Option, Cascader, Alert } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
