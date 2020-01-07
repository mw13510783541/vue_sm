<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-alert
    title="注意：只允许为第三级分类设置相关参数!"
    type="warning"  :closable="false" show-icon>
  </el-alert>

  <!-- 商品分类二级联动 -->
  <el-row>
    <el-col>选择商品分类：
      <el-cascader
    v-model="selectedKeys"
    :options="cateList"
    :props="setProps"
    @change="handleChange"></el-cascader>
    </el-col>
  </el-row>
  <!-- 动/静参数 -->
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" :disabled="isBtnDisabled" @click='addManyDialog'>动态参数</el-button>
      <!-- 动态参数表格 -->
      <el-table :data="manyTableData" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag  closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i,scope.row)">{{item}}</el-tag>
            <el-input
            class="input-new-tag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label='#'></el-table-column>
        <el-table-column label='参数名称' prop="attr_name"></el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" @click="editDialog(scope.row.attr_id)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态参数" name="only" >
      <el-button type="primary" :disabled="isBtnDisabled" @click="addOnlyDialog">静态参数</el-button>
       <!-- 静态参数表格 -->
      <el-table :data="onlyTableData" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag  closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i,scope.row)">{{item}}</el-tag>
            <el-input
            class="input-new-tag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" label='#'></el-table-column>
        <el-table-column label='参数名称' prop="attr_name"></el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" @click="editDialog(scope.row.attr_id)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
  :title="'添加'+titleText"
  :visible.sync="paramsDialogVisible"
  width="50%"
  @close="paramsDialogClosed">
  <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="paramsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改参数对话框 -->
    <el-dialog
  :title="'修改'+titleText"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed">
  <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="80px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      cateList: [],
      selectedKeys: [],
      setProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      paramsDialogVisible: false,
      editDialogVisible: false, // 编辑框
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) return true
      return false
    },
    // 三级分类id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const res = await this.$http.get('categories')
      const { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.cateList = data
      // console.log(res.data)
    },
    // 获取分类参数函数
    async getCateParams() {
      //  说明选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return false
      }
      // console.log(this.selectedKeys)
      // 当选中三级分类后发送请求商品参数
      const res = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error('获取商品参数失败')
      // this.$message.success('获取参数成功')
      data.forEach(item => {
        const newArry = item.attr_vals ? item.attr_vals.split(' ') : []
        // console.log(newArry)
        item.attr_vals = newArry
        item.inputVisible = false
        item.inputValue = ''
        console.log(data)
      })

      if (this.activeName === 'many') {
        // 获取的是动态参数数据
        this.manyTableData = data
      } else {
        // 获取的是静态参数数据
        this.onlyTableData = data
      }
    },
    async handleChange() {
      this.getCateParams()
      this.manyTableData = []
      this.onlyTableData = []
    },
    handleClick() {
      console.log(this.activeName)
      this.getCateParams()
    },
    // 添加动态参数
    addManyDialog() {
      this.paramsDialogVisible = true
    },
    // 添加静态参数
    addOnlyDialog() {
      this.paramsDialogVisible = true
    },
    // 添加参数对话框关闭重置
    paramsDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    // 提交添加参数请求数据
    addParams() {
      // 提交前预验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const res = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        const { meta } = res.data
        if (meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getCateParams()
        this.paramsDialogVisible = false
      })
    },
    // 修改参数
    async editDialog(attrid) {
      const res = await this.$http.get(`categories/${this.cateId}/attributes/${attrid}`)
      const { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error('获取参数失败')
      this.editForm = data
      this.editDialogVisible = true
    },
    // 修改矿关闭重置
    editDialogClosed() {
      this.$refs.editForm.resetFields()
    },
    // 修改参数提交
    editParams() {
      this.$refs.editForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const res = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        const { meta } = res.data
        if (meta.status !== 200) {
          return this.$message.error('提交失败')
        }
        this.$message.success('编辑参数提交成功')
        this.getCateParams()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    deleteDialog(attrid) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)
        const { meta } = res.data
        if (meta.status !== 200) {
          return this.$message.error('删除提交失败')
        }
        this.getCateParams()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      // 添加标签
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      this.saveAttr(row)
    },
    // 提取添加参数请求
    async saveAttr(row) {
      // 发送请求将数据添加到后台数据库
      const res = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      const { meta } = res.data
      if (meta.status !== 200) {
        return this.$message.error('提交参数失败')
      }
      this.$message.success('提交参数成功')
      // this.getCateParams()
    },
    showInput(row) {
      row.inputVisible = true
      // 文本框自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 关闭对应的参数选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttr(row)
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  margin-top: 20px;
}
.el-tag{
  margin:10px
}
.el-input{
  width: 120px
}
</style>
