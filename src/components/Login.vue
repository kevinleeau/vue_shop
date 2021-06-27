<!-- less and less-loader installed at main dependecy -->
<!-- use scoped, style only apply to this files  -->
<!-- prettier & vetur disable -->
<style lang="less" scoped>
 .login_container {
  background: #2b4b6b;
  height: 100%
 }
.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 100px;
    width: 100px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: center;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>

<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- element数据绑定成为一个对象：1 在form用:model, 2 在data里定义 3 在input里用v-model表明要绑定得具体项目 -->
      <!-- 在element里对表单预验证: 1 在form用:rules, 2 在data里定义 3 在item里用prop引进 -->
      <!-- 定义ref可以得到表单实例对象，然后调用element内置resetFields可以重置表单 -->
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form" :rules="loginFormRules">
        <el-form-item prop="username">
          <!-- 在input里两种插入图标方式：1 添加element自带属性，2 slot -->
          <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-info" placeholder="password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">Login</el-button>
          <el-button type="info" @click="resetLoginForm">Cancel</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: 'Please input valid name', trigger: 'blur' },
          { min: 3, max: 6, message: 'Length should be 3 to 6', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input valid password', trigger: 'blur' },
          { min: 6, max: 12, message: 'Length should be 6 to 12', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 在访问服务器之前用element内置validate对表单整体内容进行验证，if验证通过了然后再发起请求
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // baseURL在main.js提前配置，请求参数引用data里的loginForm
        const { data: res } = await this.$http.post('login', this.loginForm)
        // $message在element.js里导入并注册为vue全局prototype
        if (res.meta.status !== 200) return this.$message.error('Login fail')
        this.$message.success('Login successfully')
        // 1 token from serve after loginin save to sessionStorage 2 编程式导航到后台主页
        // 后台主页时完全分离的页面，所以路由平级关系
        window.sessionStorage.setItem('token', res.data.token)
        // 在路由.js里设置用户是否有权限进入/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
