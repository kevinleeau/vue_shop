<style lang="less" scoped>
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
        <el-breadcrumb-item>Access Management</el-breadcrumb-item>
        <el-breadcrumb-item>Access Details</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="Rights" prop="authName"></el-table-column>
            <el-table-column label="Path" prop="path"></el-table-column>
            <el-table-column label="Class" prop="level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === 1">Class 1</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level === 2">Class 2</el-tag>
                    <el-tag type="warning" v-else>Class 3</el-tag>
                </template>
            </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
    //   rightsList set to empty array to store data from server
      rightsList: [1, 2, 3]
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // rights/list are the fixed path that server required, refer to different server
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) { return this.$message.error('fail to get rights list') }
      this.rightsList = res.data
    }
  }
}
</script>
