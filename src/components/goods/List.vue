<<<<<<< HEAD
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
            <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
            <el-breadcrumb-item>Goods List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row gutter="50">
                <el-col :span="8">
                  <!-- 当用户输入关键字 并点击查询时，input已经被绑定在getGoodsList的查询参数queryInfo.query里 -->
                    <el-input placeholder="Search Products" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">Add Products</el-button>
                </el-col>
            </el-row>
            <!-- set height can fix the header of table -->
            <el-table :data="goodList" border stripe height="500">
                <el-table-column type="index"></el-table-column>
                <!-- prop☞商品属性from server data -->
                <el-table-column label="Products Name" prop="goods_name" show-overflow-tooltip></el-table-column>
                <el-table-column label="Unit Price" prop="goods_price"></el-table-column>
                <el-table-column label="Products Dimensions" prop="goods_dimensions"></el-table-column>
                <el-table-column label="Products Weight" prop="goods_weight"></el-table-column>
                <el-table-column label="Created Date" prop="add_time" sortable>
                    <!-- 时间格式全局过滤器在main.js里配置 -->
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="Action">
                    <template>
                    <!-- <template slot-scope="scope"> -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">Edit</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                blackground>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('fail to get data') }
      //   server response back res is object, include [goods array], pagenum, total
      this.goodList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm('This will permanently delete the product. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('Cancel removal') }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('fail to remove product') }
      this.getGoodsList()
      this.$message.success('remove product successfully')
    },
    // 这个新页面由路由引导，当用户点击添加时
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
||||||| 35947b9
=======
<style lang="less" scoped>
</style>

<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
            <el-breadcrumb-item>Goods List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row gutter="50">
                <el-col :span="8">
                  <!-- 当用户输入关键字 并点击查询时，input已经被绑定在getGoodsList的查询参数queryInfo.query里 -->
                    <el-input placeholder="Search Products" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">Add Products</el-button>
                </el-col>
            </el-row>
            <!-- set height can fix the header of table -->
            <el-table :data="goodList" border stripe height="500">
                <el-table-column type="index"></el-table-column>
                <!-- prop☞商品属性from server data -->
                <el-table-column label="Products Name" prop="goods_name" show-overflow-tooltip></el-table-column>
                <el-table-column label="Unit Price" prop="goods_price"></el-table-column>
                <el-table-column label="Products Dimensions" prop="goods_dimensions"></el-table-column>
                <el-table-column label="Products Weight" prop="goods_weight"></el-table-column>
                <el-table-column label="Created Date" prop="add_time" sortable>
                    <!-- 时间格式全局过滤器在main.js里配置 -->
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="Action">
                    <template>
                    <!-- <template slot-scope="scope"> -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">Edit</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                blackground>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('fail to get data') }
      //   server response back res is object, include [goods array], pagenum, total
      this.goodList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm('This will permanently delete the product. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('Cancel removal') }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('fail to remove product') }
      this.getGoodsList()
      this.$message.success('remove product successfully')
    },
    // 这个新页面由路由引导，当用户点击添加时
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
>>>>>>> c2d57ccf0906c72d5deffcb25aadb7e2c714e80d
