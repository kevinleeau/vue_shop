<style lang="less" scoped>
    .firstRow {
        margin: 15px 0;
    }
    .el-tag {
      margin: 10px;
    }
    .input-new-tag {
      width: 120px;
    }
</style>

<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Products Management</el-breadcrumb-item>
            <el-breadcrumb-item>Products feature and details (this component enable admin to edit goods feature, origin data from server)</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="Selected last menu only !" type="info" show-icon center></el-alert>
            <el-row class="firstRow">
                <el-col>
                    <span>Please select products category:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <!-- :options指定数据源绑定，:props指定数据结构绑定 -->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" expandTrigger="hover" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="Products Overview" name="overview">Products Overview data from server ...</el-tab-pane>
                <!-- button的激活状态和用户选择的菜单有关联，只有用户选择了第三级菜单时，才激活，允许添加，否则处于禁用状态 -->
                <el-tab-pane label="Features" name="features">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">Add Features</el-button>
                    <el-table :data="featuresTableData" border stripe>
                      <!-- expand默认收起状态，在里面渲染后台数据为tag标签，scope.row.attr_vals已经在methods中被转换为array -->
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>
                          <!-- close event to add and remove tag dynamically. -->
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column type="index"></el-table-column>
                      <el-table-column label="Features" prop="attr_name"></el-table-column>
                      <el-table-column label="Operation">
                        <!-- 如果有后台数据应该使用template slot-scope="scope" -->
                        <template>
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">Edit</el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">Delete</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="Specifications" name="specifications">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">Add Specifications</el-button>
                    <el-table :data="specificationsTableData" border stripe>
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>
                          <!-- close event to add and remove tag dynamically. -->
                          <el-input
                            class="input-new-tag"
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            size="mini"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                          </el-input>
                          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column type="index"></el-table-column>
                      <el-table-column label="Specifications" prop="attr_name"></el-table-column>
                      <el-table-column label="Operation">
                        <!-- 如果有后台数据应该使用template slot-scope="scope" -->
                        <template>
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">Edit</el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">Delete</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 这是一级对话框，用于增加产品features or specifications, Same dialog use base on products features or specifications，在computed属性里判断用户点击的是哪个 -->
        <el-dialog
          :title="'Add    ' + dialogTitleText"
          :visible.sync="addDialogVisible"
          width="60%"
          @close="addDialogClose">
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="110px">
            <el-form-item :label="dialogTitleText + ':'" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addParams">Confirm</el-button>
          </span>
        </el-dialog>
        <!-- 这是二级弹出对话框，用于修改edit产品features and specifications use same dialog 当对话框弹出时，应该访问GET后台，取得当前数据渲染到对话框里供用户修改，修改完后再次POST后台提交数据-->
        <el-dialog
          :title="'Edit    ' + dialogTitleText"
          :visible.sync="editDialogVisible"
          width="60%"
          @close="editDialogClose">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="110px">
            <el-form-item :label="dialogTitleText + ':'" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="editParams">Confirm</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      //   data from server, preset to empty array
      cateList: [1, 2, 3],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      //   default activeName assign to first
      activeName: 'features',
      // 对后台返回的数据区分为features or specifications
      featuresTableData: ['F1', 'F2', 'F3'],
      specificationsTableData: ['S1', 'S2', 'S3', 'S4'],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: 'Please input valid data', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: 'Please input valid data', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('fail to get data from server') }
      this.cateList = res.data
    },
    // 当用户改变选择框时判断被选中的数组长度，从而知道用户选择的时哪一级的菜单，如果用户选择的是非三级菜单，会通过v-model，selectedCateKeys被强制清空
    handleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        // 如果有后台数据，当用户没有选择三级菜单时，需要清空原来的旧数据
        // this.featuresTableData = []
        // this.specificationsTableData = []
      }
      // 如果用户选择了三级菜单，需要将其id作为参数访问后台，获得对应的products features or specification data
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.error('fail to access products details') }
      // 后台返回数据后要将里面的部分属性分离出来作为expand里面的数据源，1先循环数据源得到新array，要先判断后台数据是否为空，如果为空返回empty array，否则会渲染出空白tag，2在template里把这个array循环渲染到expand里面的tag标签里，3用户可以点击增加或删除tag，4再次发起后台请求，5重新渲染整个页面
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // item.inputVisible是tag文本输入框，item.inputValue是它的值
        item.inputVisible = false
        item.inputValue = ''
      })
      // 对后台返回的数据再分为产品的featuresor or specifications
      if (this.activeName === 'features') { this.featuresTableData = res.data }
      this.specificationsTableData = res.data
    },
    // 当用户关闭对话框时，需要清空里面的旧数据，否则下次打开数据仍在
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) { return this.$message.error('fail to add data') }
        this.$message.success('Add data successfully')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 用户点击edit后不但要弹出对话框，还要立即访问后台取得当前数据并渲染到对话框里
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params:
        { attrSel: this.activeName }
      })
      if (res.meta.status !== 200) { return this.$message.error('fail to get current data') }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_id,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) { return this.$message.error('fail to edit & update data') }
        this.$message.success('edit data successfully')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // features and specifications use same methods
    async removeParams(attrId) {
      const confirmResult = await this.$confirm('This will permanently delete this features. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('cancel removal') }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${this.attrId}`)
      if (res.meta.status !== 200) { return this.$message.error('fail to remove data') }
      this.$message.success('removal successfully')
      this.getParamsData()
    },
    // 无论用户点击添加或删除tag都会调用这个函数
    async saveAttrVlas(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) { return this.$message.error('fail to update server') }
      this.$message.success('update server successfully')
      this.getParamsData()
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      // 如果用户在tag里输入合法数据，需要访问后台更新数据
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVlas(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVlas(row)
    }
  },
  computed: {
    // 如果产品Feature and Specifications button 需要被禁用，返回true，否则返回false
    isBtnDisabled() {
      // 如果有后台数据，this.selectedCateKeys.length 在不等于3时返回true
      if (this.selectedCateKeys.length !== 0) { return true }
      return false
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      } return null
    },
    dialogTitleText() {
      if (this.activeName === 'features') { return 'Features' }
      return 'Specifications'
    }
  }
}
</script>
