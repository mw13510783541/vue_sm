<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格 -->
      <el-table :data="orderList" stripe boder>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="primary" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showAddressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialog"
      width="50%"
      @close="addressClosed">
      <!-- 表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
          v-model="editForm.address1"
          :options="cityData"
          :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
         <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="查看物流进度"
      :visible.sync="addressProcesDialog"
      width="50%">
       <el-timeline :reverse="reverse">
        <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Order',
  data() {
    return {
      orderList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      editDialog: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      addressProcesDialog: false,
      progressInfo: [],
      reverse: true
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const res = await this.$http.get('orders', {
        params: this.queryInfo
      })
      const { meta, data } = res.data
      if (meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = data.goods
      this.total = data.total
      console.log(data)
    },
    // 分页事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改
    editBox() {
      this.editDialog = true
    },
    addressClosed() {
      this.$refs.editForm.resetFields()
    },
    // 物流进度
    async showAddressBox() {
      this.addressProcesDialog = true
      const res = await this.$http.get('https://www.liulongbin.top:8888/api/private/v1/kuaidi/1106975712662')
      const { meta, data } = res.data
      if (meta.status !== 200) {
        return this.$message.error('获取物理信息失败')
      }
      console.log(data)
      this.progressInfo = data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
