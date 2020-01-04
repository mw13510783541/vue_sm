<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span='12'>
          <div class="text item">
            <el-input placeholder="请输入内容" class="input-with-select" v-model="usersInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click='getUsersList'></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span='6'>
          <el-button type="primary" @click="addUsers">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表表格 -->
      <el-table :data="usersList" stripe  border style="width: 100%">
        <el-table-column type="index" label='#'></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUsersState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type='primary' icon="el-icon-edit" size="mini" @click='editUsers(scope.row.id)'></el-button>
            <el-button type='danger' icon="el-icon-delete"  size="mini" @click='userDelete(scope.row.id)'></el-button>
            <el-tooltip  effect="dark" content="用户管理" placement="top" :enterable="false">
              <el-button type='warning' icon="el-icon-setting"  size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
       </el-table>
       <!-- 分页 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="usersInfo.pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="usersInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="addUserDialog"
  width="50%"
  @close="addDialogClosed"
  >
  <!-- 表单 -->
  <el-form ref="userform" :model="userform" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop='username'>
      <el-input v-model="userform.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop='password'>
      <el-input v-model="userform.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop='email'>
      <el-input v-model="userform.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop='mobile'>
      <el-input v-model="userform.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialog = false">取 消</el-button>
    <el-button type="primary" @click="addBtn">确 定</el-button>
  </span>
</el-dialog>

  <!-- 修改用户对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialog"
  width="50%"
  @close="editDialogClosed"
  >
  <!-- 编辑用户表单 -->
  <el-form ref="editForm" :rules='rules' :model="editForm" label-width="80px">
    <el-form-item label="用户名">
      <el-input v-model="editForm.username" disabled style="width:100px"></el-input>
    </el-form-item>
     <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email"></el-input>
    </el-form-item>
     <el-form-item label="手机" prop="mobile">
      <el-input v-model="editForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialog = false">取 消</el-button>
    <el-button type="primary" @click="editQuest">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 验证邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 验证手机号
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      usersInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: 0,
      addUserDialog: false,
      editDialog: false,
      editForm: {},
      userform: {
        usernmae: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ]

      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      const res = await this.$http.get('/users', { params: this.usersInfo })
      const { meta, data } = res.data
      // console.log(data)
      if (meta.status !== 200) return this.$message.error('请求用户列表失败')
      this.usersList = data.users
      this.total = data.total
    },
    handleSizeChange(newSize) {
      console.log(newSize)
      this.usersInfo.pagesize = newSize
      // 重新渲染
      this.getUsersList()
    },
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.usersInfo.pagenum = newPage
      // 重新渲染
      this.getUsersList()
    },
    // 更新用户状态
    async changeUsersState(user) {
      console.log(user)
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const { meta } = res.data
      if (meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 添加用户弹框
    addUsers() {
      this.addUserDialog = true
    },
    addBtn() {
      this.$refs.userform.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发送请求
        const res = await this.$http.post('users', this.userform)
        console.log(res.data)
        const { meta } = res.data
        if (meta.status !== 201) return this.$message.error('添加用户失败')
        this.getUsersList()
        // 关闭模态框
        this.addUserDialog = false
        this.$message.success('添加用户成功')
      })
    },
    // 重置添加用户啊弹框
    addDialogClosed() {
      this.$refs.userform.resetFields()
    },
    // 编辑用户
    async editUsers(id) {
      this.editDialog = true
      // console.log(id)
      const res = await this.$http.get('users/' + id)
      const { meta, data } = res.data
      console.log(data)
      if (meta.status !== 200) return this.$message.error('编辑用户失败')
      this.editForm = data
    },
    // 重置编辑框
    editDialogClosed() {
      this.$refs.editForm.resetFields()
    },
    // 修改提交
    editQuest() {
      this.$refs.editForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 请求提交
        const res = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        const { meta } = res.data
        if (meta.status !== 200) return this.$message.error('更新用户失败')
        // 重新渲染
        this.getUsersList()
        this.$message.success('更新用户信息成功')
        // 关闭弹框
        this.editDialog = false
      })
    },
    // 删除用户
    userDelete(id) {
      // console.log(id)
      this.$confirm('是否确认要删除用户信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送请求
        const res = await this.$http.delete(`users/${id}`)
        console.log(res.data)
        this.getUsersList()
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row{
  margin-bottom: 20px;
}
</style>
