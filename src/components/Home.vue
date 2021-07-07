<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  /* element 子tag 可以作为css class选择器 */
  .el-header {
    background-color: rgb(20, 75, 110);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: blanchedalmond;
    font-size: 30px;
    > div {
      display: flex;
      align-items: center;
      img {
        height: 50px;
        width: 50px;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: rgb(38, 49, 52);
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: rgb(190, 205, 211);
  }
  #icon {
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #384952;
    font-size: 20px;
    line-height: 50px;
    color: cornsilk;
    text-align: center;
    /* letter-spacing: 2rem; */
    cursor: pointer;
  }
</style>

<template>
<!-- header container -->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>Eshop Management</span>
      </div>
      <el-button type="primary" @click="logOut">LogOut</el-button>
    </el-header>
<!-- second container for aside and main -->
  <el-container>
    <!-- el-aside是否整体折叠和istoggle绑定 -->
    <el-aside :width="isToggle ? '50px' : '250px'">
      <div class="toggle-button" @click="toggleMenu">
        <i :class="isToggle ? 'el-icon-right' : 'el-icon-back'"></i>
      </div>
      <el-menu
      background-color="#384952"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse="isToggle"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath">
      <!-- rounter是element内置实现router跳转功能 -->
      <!-- 在一级菜单绑定二级菜单当前动态的地址 -->
      <!-- first level menu -->
      <!-- 用v-for对获取的数据先渲染一级菜单，.id是后台返回data里的自带属性 -->
      <!-- :index="item.id"动态对当前一级菜单激活，但只接收number，所以+''转化为string -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <!-- 动态绑定一级菜单的图标 -->
          <i :class="iconObj[item.id]" id="icon"></i>
          <!-- authName为后台返回的data里的一个属性 -->
          <span>{{item.authName}}</span>
        </template>
      <!-- second level menu -->
      <!-- 二级菜单也用for循环渲染，:index已经在上面定义了element内置路由跳转功能，subitem.path是后台返回的子路由路径，只实现网页路径跳转-->
      <!-- 在点击二级菜单时保存其路径名称，从而可以调用element内置功能实现其高亮显示 -->
        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
          <template slot="title">
            <i class="el-icon-s-unfold"></i>
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
  <el-main>
    <!-- main里面是home的子路由，在route里的index.js定义路由规则 -->
    <router-view></router-view>
  </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  // 预定义menu数据
  data() {
    return {
      // 模拟后台数据，如果后台有数据则设置为空array
      menulist: [1, 2, 3],
      // 在data里定义一级菜单的图标，然后在循环渲染时一起渲染，key是后台返回的一级菜单的id
      iconObj: {
        1: 'el-icon-user-solid',
        2: 'el-icon-star-on',
        3: 'el-icon-setting'
      },
      // 默认菜单不折叠
      isToggle: false,
      // 预设定当前因该被高亮显示的二级菜单的地址
      activePath: ''
    }
  },
  // created生命周期函数立即调用一旦页面加载, sessionstorage同时赋值给activePath
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 左侧页面导航menu是由后台提供数据，menus为后台路径
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('menus accquired fail')
      // if获取菜单成功，赋值给data里的menulist
      this.menulist = res.data
    },
    toggleMenu() {
      this.isToggle = !this.isToggle
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
