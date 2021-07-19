<style lang="less" scoped>
.printBtn {
    background-color: #2e3a47;
    margin-top: 15px;
    border: none;
}
</style>

<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item>Report Management</el-breadcrumb-item>
            <el-breadcrumb-item>Report Diagram</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="qrCode">
            <el-card>
                <p1>Mock data source refer to https://echarts.apache.org/en/tutorial.html#Get%20Started%20with%20ECharts%20in%205%20minutes</p1>
                <!-- container for echarts -->
                <div id="main" style="width: 800px; height: 400px;"></div>
            </el-card>
        </div>
        <!-- npm install vue-print-nb --save -->
        <!-- import Print from 'vue-print-nb' & Vue.use(Print) at main.js -->
        <el-button type="primary" v-print="'#qrCode'" class="printBtn">Print Report</el-button>
    </div>
</template>

<script>
// **********import private echarts************
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      //   后台返回的数据要和这里的**私有数据options:{}**合并，最后生成图表
      options: {}
    }
  },
  create() {},
  //   在生命周期函数完成后（dom元素已经渲染完成后）才加载mounted echarts
  async mounted() {
    // 定义并初始化实例
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports')
    if (res.meta.status !== 201) { return this.$message.error('fail to access data') }
    // mock data source
    // var option = {
    //   title: {
    //     text: 'ECharts entry example'
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ['Sales']
    //   },
    //   xAxis: {
    //     data: ['shirt', 'cardign', 'chiffon', 'shirt', 'pants', 'heels', 'socks']
    //   },
    //   yAxis: {},
    //   series: [{
    //     name: 'Sales',
    //     type: 'bar',
    //     data: [5, 20, 36, 10, 10, 20]
    //   }]
    // }
    // 用lodash合并2个数据源
    const finalResult = _.merge(res.data, this.options)
    // 展示数据图
    myChart.setOption(finalResult)
  },
  methods: {}
}
</script>
