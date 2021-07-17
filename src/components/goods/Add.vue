<style lang="less" scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
  .previewPics {
    width: 100px;
  }
  .btnAdd {
    margin-top: 15px;
  }
</style>

<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
        <el-breadcrumb-item>Add Goods</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-alert title="Product Details" type="info" center show-icon>
        </el-alert>
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="Product Overview"></el-step>
          <el-step title="Product Features"></el-step>
          <el-step title="Product Specifications"></el-step>
          <el-step title="Product Pitcure"></el-step>
          <el-step title="Product Details"></el-step>
          <el-step title="Done"></el-step>
        </el-steps>
        <!-- 用form包裹tabs，从而可以验证输入内容，并最后统一提交表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px" label-position="top">
        <!-- before-leave是一个Element自带的event监听属性，类似click，close，绑定一个函数用于定义tab切换规则，tab-click时Element自带的监听tab被点击事件，点击后判断点的是哪个tab再执行相应的功能，这样就不用在每个tab里都监听事件-->
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="Product Overview" name="0">
            <el-form-item label="Product Name:" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="Unit Price:" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Product Weight:" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Product Count:" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Product categories:" prop="goods_cat">
              <!-- 集联选择器只接受array，所以在data里addform.goods_cat预定义为empty array -->
              <el-cascader
                v-model="addForm.goods_cat"
                :props="cateProps"
                :options="cateList"
                expand-trigger="hover"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Product Features" name="1">
            <!-- 首先循环渲染item.attr_id，product features的复选框的标题，然后循环渲染item.attr_vals，标题的内容 -->
            <el-form-item :label="item.attr_id" v-for="item in featuresTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Product Specifications" name="2">
            <el-form-item :label="item.attr_name" v-for="item in specificatonsTableData" :key="item.attr_id">
              <el-input :v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Product Pitcure" name="3">
            <!-- 图片上传组件，https://element.eleme.cn/#/en-US/component/upload#upload， on-preview是图片预览监听事件属性绑定函数， on-remove是图片移除事件监听，:headers绑定请求头 on-success监听图片上传成功事件 -->
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">Click to upload</el-button>
              <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="Product Details" name="4">
            <!-- quill-editor要安装在依赖包中，并在main.js中注册为全局组件
            https://github.com/surmon-china/vue-quill-editor#readme-->
            <quill-editor v-model="addForm.good_intro"></quill-editor>
            <!-- 这个button是对整个输入表单，包括product overview, featrures, specifications, pitcure, details 的整体提交 -->
            <el-button type="primary" class="btnAdd" @click="add">Add Details</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      </el-card>
      <el-dialog
        title="Preview"
        :visible.sync="previewVisible"
        width="50%">
        <img :src="previewPath" class="previewPics">
      </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        good_intro: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: 'Please input product name', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: 'Please input product unit price', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: 'Please input product weight', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: 'Please input product number', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: 'Please select categories', trigger: 'blur' }
        ]
      },
      cateList: [],
      // cateProps的属性由后台预先定义
      cateProps: {
        label: 'cate_name',
        value: 'cate_id',
        children: 'children'
      },
      // 这是product features tabs的后台数据源
      featuresTableData: [],
      specificatonsTableData: [],
      upLoadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // because upload action doesnot use axios, so preset authorization token is required
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('fail to get data') }
      this.cateList = res.data
    },
    handleChange() {
      // 级联选择器只允许选择第三级分类
      if (this.addForm.goods_cat.length !== 3) { this.addForm.goods_cat = [] }
    },
    // 当用户没有完成上一级tab时，不允许进入下一个tab
    // 当用户切换选择tabs标签页时会触发这个函数，activename是点击进入的tabs，old是点击后离开的tabs
    beforeTabLeave(activeName, oldActiveName) {
      // 但是如果在函数体内return false则会阻止标签页切换
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('Please select the categories before move on')
        // return false
      }
    },
    // 当用户点击tabindex为1时，调用相关的后台请求，并渲染后台数据到相关位置
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'features'
          }
        })
        if (res.meta.status !== 200) { return this.$message.error('fail to get data') }
        // 将后台返回的attr_vals数据字符串转换为array
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.featuresTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'specifications'
          }
        })
        if (res.meta.status !== 200) { return this.$message.error('fail to get data') }
        this.specificatonsTableData = res.data
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) {
      // 获取临时路径，从pics里找出索引，splice array
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(index => index.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    // 当图片上传后会返回一个临时路径，需要定义在data.addForm里，然后统一提交
    handleSuccess(response) {
      const picInfo = {
        pic: response.data.tmp.path
      }
      this.addForm.pics.push(picInfo)
    },
    add() {
      // 在整个表单提交前进行预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('Please input valid data')
        }
        // 当提交后台时，后台的goods_cat只接受string，但在私有data里已经被定义为array，为了区分矛盾，对data里的addform.goods_cat进行深拷贝，形成newForm供提交后台数据使用，安装依赖包并私有导入，https://lodash.com/
        const newForm = _.cloneDeep(this.addForm)
        newForm.goods_cat = newForm.goods_cat.join(',')
        this.featuresTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.specificatonsTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        newForm.attrs = this.addForm.attrs
        const { data: res } = await this.$http.post('goods', newForm)
        if (res.meta.status !== 200) { return this.$message.error('fail to updat data') }
        this.$message.success('updat goods successfully')
        // 提交数据成功后要返回原来/goods页面，并渲染新数据给用户，当前是/add页面
        this.$router.push('/goods')
      })
    }
  },
  // 判断用户有没有选择三级categroies
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
