<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 查询区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" class="addBtn" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表表格-->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column  label="商品名称" prop="goods_name" width="400px"></el-table-column>
        <el-table-column  label="商品价格" prop="goods_price" width="100px"></el-table-column>
        <el-table-column  label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column  label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="goodsSizeChange"
      @current-change="goodsCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 1.获取商品列表
    async getGoodsList() {
      const res = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = data.goods
      this.total = data.total
    },
    // 2.处理分页事件
    goodsSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    goodsCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 3.删除商品
    deleteGoods(goodsId) {
      // console.log(goodsId)
      this.$confirm('是否删除该商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`goods/${goodsId}`)
        const { meta } = res.data
        if (meta.status !== 200) {
          return false
        }
        this.getGoodsList()
        this.$message.success('删除商品成功')
      }).catch(() => {
        this.$message.info('已取消商品删除')
      })
    },
    // 4.跳转添加商品页面
    goAddGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.addBtn{
  margin-left: 20px;
}
.el-table{
  font-size: 12px;
}
</style>
