<template>
  <div >
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table :data="cateList" :columns="columns" :selection-type='false'
      :expand-type="false"
      show-index
      index-text="#"
      border
      :show-row-hover="false">
      <!-- 是否有效 -->
      <template slot="isok" slot-scope="scope">
         <i class="el-icon-success" v-if="!scope.row.cat_deleted"
         style="color:lightgreen"></i>
         <i class="el-icon-error" v-else
         style="color:red"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope='scope'>
        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" size="min" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" size="mini" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="opt" slot-scope="">
        <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>
        <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
      </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
  <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="50%"
    @close="cateDialogClosed">
   <!-- 分类表单 -->
   <el-form :model="addCateForm" :rules="addCateRules" ref="addCateForm" label-width="80px" >
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类">
      <el-cascader
    v-model="selectedkeys"
    :options="parentCateList"
    :props="cateProps"
    @change="parentKeysChange"
    clearable change-on-select></el-cascader>
    </el-form-item>
   </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      cateList: [],
      addCateDialogVisible: false,
      parentCateList: [],
      selectedkeys: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const res = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error('获取商品分类信息失败')
      this.total = data.total
      this.cateList = data.result
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize; this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加商品分类
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类数据
    async getParentCateList() {
      const res = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      // console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      this.parentCateList = data
    },
    parentKeysChange() {
      if (this.selectedkeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedkeys[this.selectedkeys.length - 1]
        this.addCateForm.cat_level = this.selectedkeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
      // console.log(this.selectedkeys)
    },
    addCate() {
      console.log(this.addCateForm)
      // 表单提交与验证
      this.$refs.addCateForm.validate(async valid => {
        if (!valid) return
        const res = await this.$http.post('categories', this.addCateForm)
        // console.log(res.data)
        const { meta } = res.data
        if (meta.status !== 201) return this.$message.error('添加分类失败')
        this.getCateList()
        this.$message.success('添加商品分类成功')
        this.addCateDialogVisible = false
      })
    },
    // 分类对话框关闭并重置
    cateDialogClosed() {
      this.$refs.addCateForm.resetFields()
      this.selectedkeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 20px;
}
</style>
