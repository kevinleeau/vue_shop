<style lang="less" scoped>
</style>

<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Promotion Management</el-breadcrumb-item>
            <el-breadcrumb-item>Promotion List</el-breadcrumb-item>
          </el-breadcrumb>
          <el-card>
              <!-- 头部搜索及添加功能，element内置的gutter表示列与列之间的间隙 span表示列自己的宽度 -->
              <el-row :gutter=30>
                  <el-col :span=7>
                    <el-input placeholder="Please input" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @clcik="getUserList"></el-button>
                    </el-input>
                  </el-col>
                  <el-col :span=7>
                      <el-button type="primary" @click="addDialogVisible = true">Add User</el-button>
                  </el-col>
              </el-row>
              <!-- 用户列表区，在table里绑定数据源 -->
              <el-table :data="userlist" border stripe>
                  <!-- prop的值是后台返回的userlist里面的属性 -->
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="Name" prop="username"></el-table-column>
                  <el-table-column label="Email" prop="email"></el-table-column>
                  <el-table-column label="Phone" prop="contact"></el-table-column>
                  <el-table-column label="Role" prop="role"></el-table-column>
                  <el-table-column label="Status">
                      <!-- 使用作用域插槽，取得后台返回的当前row的数据，把后台status: true or false状态通过v-model双向绑定到el-switch中，然后需要把这个值作为参数重新调用后台并修改 -->
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="userStateChange(scope.row)">
                        </el-switch>
                      </template>
                  </el-table-column>
                  <el-table-column label="Operation" width="180px">
                    <!-- 使用作用域插槽，取得后台返回的当前的id，才能进行下一步操作 -->
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="small" @click="showEdit(scope.row.id)"></el-button>
                      <el-button type="info" icon="el-icon-share" size="small"></el-button>
                      <!-- el-tooltip是element内置功能，实现当鼠标移动到button是文本跳出提示该button的功能 -->
                      <el-tooltip effect="dark" content="Delete" placement="top" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.id)"></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
              </el-table>
              <!-- 分页功能区 当前显示页码值和后台的queryInfo.pagenum绑定 total和后台total数据绑定 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
          </el-card>
          <!-- 用户点击 添加 后弹出的对话框默认状态在data里设置为false -->
          <el-dialog
           title="Add User"
           :visible.sync="addDialogVisible"
           width="50%"
           @close="dialogClose">
            <!-- 添加el-form的 数据源 和 验证规则 绑定 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
             <el-form-item label="UserName" prop="username">
              <el-input v-model="addForm.username"></el-input>
             </el-form-item>
             <el-form-item label="Password" prop="password">
              <el-input v-model="addForm.password"></el-input>
             </el-form-item>
             <el-form-item label="Email" prop="email">
              <el-input v-model="addForm.email"></el-input>
             </el-form-item>
             <el-form-item label="Phone" prop="phone">
              <el-input v-model="addForm.phone"></el-input>
             </el-form-item>
            </el-form>
           <span slot="footer" class="dialog-footer">
           <el-button @click="addDialogVisible = false">Cancel</el-button>
           <!-- 点击确定，进行表单整体检验，然后提交访问后台 -->
           <el-button type="primary" @click="addUser">Confirm</el-button>
           </span>
          </el-dialog>
          <!-- 用户点击 修改 后弹出对话框默认状态在data里为false -->
          <el-dialog
           title="Edit user"
           :visible.sync="editDialogVisiable"
           width="50%" @close="editClose">
           <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
            <el-form-item label="User name">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="Email address" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="Phone number" prop="phone">
              <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
           <el-button @click="editDialogVisiable = false">Cancel</el-button>
           <el-button type="primary" @click="editUserInfo">Confirm</el-button>
           </span>
          </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    // 在data里，在return之前定义form输入自定义校验规则，然后在addFormRules里用validator引用
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('Please provide valid email address'))
    }
    const checkPhone = (rule, value, cb) => {
      const regPhone = /^(0|82|17951)?$/
      if (regPhone.test(value)) {
        return cb()
      }
      cb(new Error('Please provide valid phone number'))
    }
    return {
      // 在data里预定义将要访问后台的携带的参数
      queryInfo: {
        query: '',
        // 当前默认页码值
        pagenum: 1,
        // 默认每页显示10条记录
        pagesize: 10
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      addFormRules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 3, max: 8, message: 'lenght must be 3 to 8', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input pasword', trigger: 'blur' },
          { min: 3, max: 8, message: 'lenght must be 3 to 8', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Please input phone', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editDialogVisiable: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Please input phone', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('user', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('data accquird fail') }
      //   把后台返回的data赋值给组件的userlist and total
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 自动监听到每页显示多少条记录的改变事件
    handleSizeChange(newSize) {
      // 把监听到的结果重新赋值给queryInfo.pagesize
      this.queryInfo.pagesize = newSize
      // 需要重新请求后台并重新渲染页面
      this.getUserList()
    },
    // 自动监听到当前页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 自动监听到用户修改status的值，并请求后台
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.state}`)
      if (res.meta.status !== 200) {
        // 如果更新失败，页面值需要更新回原来的状态
        userinfo.state = !userinfo.state
        this.$message.error('update status fail')
      }
      this.$message.success('update successfully')
    },
    // 要在表单中添加close事件，监听对话表单是否关闭，如果关闭需要清空里面的数据
    dialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      // validate是element-form的内置属性
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('Add users fail')
        }
        this.$message.success('Add users successfully')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 取得当前点击的userid，然后作为参数访问后台，才能取得(get请求)当前用户数据，展示在弹出表单，供你修改
    async showEdit(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('fail to get user info') }
      // 如果获得用户数据，先保存在data里的editForm中，然后再输入框中 双向数据 绑定
      this.editForm = res.data
      this.editDialogVisiable = true
    },
    // 监听修改用户资料对话框关闭事件，如果关闭需要清空表单里的旧数据
    editClose() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) { return this.$message.error('Please provide valid data') }
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          phone: this.editForm.phone
        })
        if (res.meta.status !== 200) { return this.$message.error('update user info fail') }
        this.$message.success('update user info successfully')
        this.editDialogVisiable = false
        this.getUserList()
      })
    },
    // 使用scope.row可以得到当前被选中的id，$confirm已经挂载在vue原型对象可以使用，如果点击OK，会返回confirm，如果点击Cancel，会报错，所以需要Catch error，catch err后返回的就是cancel了
    async removeUserById(id) {
      const confirmResult = await this.$confirm('This will permanently delete the user! Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => { return err })
      if (confirmResult !== 'confirm') {
        this.$message.info('Cancel removal')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('fail to remove user') }
      this.$message.success('successfully removal')
      this.getUserList()
    }
  }
}
</script>
