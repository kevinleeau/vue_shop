<style lang="less" scoped>
  .treeTable {
    margin-top: 20px;
  }
  .el-cascader {
    width: 100%;
  }
  /deep/.el-table th > .cell {
  text-align: center;
  }
  /deep/.el-table .cell {
  text-align: center;
  }
</style>

<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
            <el-breadcrumb-item>Goods List (this component enable user to add goods catergory, origin data provided by server)</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">Add Categories</el-button>
                </el-col>
            </el-row>
            <!-- tree-table是第三方插件安装后在main.js中导入并注册为名为tree-table -->
            <!-- Refer to https://github.com/MisterTaki/vue-table-with-tree-grid/tree/master/example -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="Index" border>
                <template slot="isOnSale" slot-scope="scope">
                  <!-- class base on boolen status (scope.row.cate_isDelete) from server -->
                  <i class="el-icon-success" v-if="scope.row.cate_isDelete === false" style="color: lightgreen"></i>
                  <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <template slot="order" slot-scope="scope">
                  <el-tag v-if="scope.row.cate_level === 0">Level 1</el-tag>
                  <el-tag type="success" v-else-if="scope.row.cate_level === 1">Level 2</el-tag>
                  <el-tag type="warning" v-else>Level 3</el-tag>
                </template>
                <template slot="opt">
                  <el-button type="primary" icon="el-icon-edit" size="mini">Edit</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini">Delete</el-button>
                </template>
            </tree-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="queryInfo.pageNum"
              :page-sizes="[5, 10, 20, 30]"
              :page-size="queryInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>
        <!-- 用户点击添加商品弹出的对话框 -->
        <el-dialog
          title="Add Category"
          :visible.sync="addCateDialogVisible"
          width="50%"
          @close="addCategoryClose">
          <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="120px">
            <el-form-item label="New Category: " prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="Main Category: ">
              <!-- :options是绑定数据源 :props是用于指定多级菜单选择配置对象 changeonselect可以选择任意一级菜单，默认只能选择最后一级菜单-->
              <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              expand-trigger="hover"
              @change="handleChangeCascader"
              clearable
              change-on-select>
              </el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addCate">Confirm</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [1, 2, 3],
      selectedKeys: [],
      // cascader配置内容由后台返回的数据结构决定
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      total: 0,
      addCateFormRules: { cat_name: [{ required: true, message: 'Please input catergeroy name', trigger: 'blur' }] },
      addCateDialogVisible: false,
      //   访问后台需要携带的参数
      queryInfo: {
        type: 3,
        pageSize: 5,
        pageNum: 1
      },
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //   为table指定列的定义，prop指定后台返回的data里面对应的属性名，如果需要自定义插槽则需要指定type和插槽名称，这是第三方插件的规定
      columns: [
        {
          label: 'Category Name',
          prop: 'cate_name'
        },
        {
          label: 'On Sale',
          type: 'template',
          template: 'isOnSale'
        },
        {
          label: 'Order',
          type: 'template',
          template: 'order'
        },
        {
          label: 'Operation',
          type: 'template',
          template: 'opt'
        }
      ],
      // parentCateList是后台返回的数据
      parentCateList: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('fail to get categories') }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听用户改变pagesize事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getCateList()
    },
    // 监听用户改变当前页码事件
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 当添加商品类对话框弹出后，同时还需要获取后台所有分类的数据，并渲染在对话框里供用户选择
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) { return this.$message.error('fail to get category data') }
      this.parentCateList = res.data
    },
    handleChangeCascader() {
      // 要先判断用户有没有改变Cascader的值，再相应提交访问后台，如果用户没有选择改变Cascader，selectedKeys的值为0，那么此时用户提交的数据成为一级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('cateroies', this.addCateForm)
        if (res.meta.status !== 200) { return this.$message.error('fail to update catergory data') }
        this.$message.success('update category data successfully')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCategoryClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>
