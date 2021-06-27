<style lang="less" scoped>
</style>

<template>
 <div>
     home component
     <el-button type="info" @click="logOut">LogOut</el-button>
 </div>
</template>

<script>
export default {
  methods: {
    logOut () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
