<style lang="less" scoped>
    /* table header and content center */
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
            <el-breadcrumb-item>Orders Management</el-breadcrumb-item>
            <el-breadcrumb-item>Order List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="Please input order number" v-model="queryInfo.query" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="Order Number" prop="order_number"></el-table-column>
                <el-table-column label="Order Cost" prop="order_price"></el-table-column>
                <el-table-column label="Payment Status" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">Paid</el-tag>
                        <el-tag type="danger" v-else>Pending</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Goods Delivery Status" prop="is_send"></el-table-column>
                <el-table-column label="Create Date" prop="create_time">
                    <!-- 创建时间如果需要时间过滤器，用作用域插槽 -->
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="Action">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                        <el-button type="info" icon="el-icon-location" size="mini" @click="showProgress"></el-button>
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
              background>
            </el-pagination>
        </el-card>
        <!-- show edit address -->
        <el-dialog
          title="Edit Address"
          :visible.sync="addressVisible"
          width="50%"
          @close="addressDialogClose">
          <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="120px">
            <el-form-item label="Address" prop="address">
              <el-input v-model="addressForm.address"></el-input>
            </el-form-item>
            <el-form-item label="PostCode" prop="postcode">
                <el-input v-model="addressForm.postcode"></el-input>
              </el-form-item>
            <el-form-item label="State" prop="state">
                <el-select v-model="addressForm.state" placeholder="Please Select State">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">Cancel</el-button>
          <el-button type="primary" @click="editAddress(scope.row.id)">Confirm</el-button>
          </span>
        </el-dialog>
        <!-- show progress 数据由后台提供，get带参数运单号码-->
        <el-dialog
          title="Delivery Progress"
          :visible.sync="progressVisible"
          width="50%">
          <!-- timeline needs to refer to element-plus version! activity.time是后台规定的数据属性，activity.content是后台规定的物流状态 -->
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in progressInfo"
              :key="index"
              :timestamp="activity.time">
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [1, 2, 3],
      total: 50,
      addressVisible: false,
      progressVisible: false,
      addressForm: {
        address: '',
        // state会以级联选择器渲染，所以定义为array
        state: [],
        postcode: ''
      },
      options: [{
        value: 'Option1',
        label: 'ACT'
      }, {
        value: 'Option2',
        label: 'NSW'
      }, {
        value: 'Option3',
        label: 'VIC'
      }, {
        value: 'Option4',
        label: 'SA'
      }, {
        value: 'Option5',
        label: 'NT'
      }, {
        value: 'Option6',
        label: 'QL'
      }, {
        value: 'Option7',
        label: 'TS'
      }, {
        value: 'Option8',
        label: 'SA'
      }],
      value: '',
      addressFormRules: {
        address: [
          { required: true, message: 'Please provide valid address', trigger: 'blur' }
        ],
        state: [
          { required: true, message: 'Please select state', trigger: 'blur' }
        ],
        postcode: [
          { required: true, message: 'Please provide valid postcode', trigger: 'blur' }
        ]
      },
      progressInfo: [1, 2, 3]
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('fail to get order data') }
      this.$message.success('order data access successfully')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showEditDialog() {
      this.addressVisible = true
    },
    addressDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
    async editAddress(id) {
      const { data: res } = await this.$http.put(`address/${id}`, {
        params: this.addressForm
      })
      if (res.meta.status !== 200) { return this.$message.error('fail to update address') }
      this.$message.success('update adderss successfully')
      this.addressVisible = false
    },
    async showProgress() {
      const { data: res } = await this.$http.get('progress')
      if (res.meta.status !== 200) { return this.$message.error('fail to get data') }
      this.progressInfo = res.data.progress
      this.progressVisible = true
    }
  }
}
</script>
