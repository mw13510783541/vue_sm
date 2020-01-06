<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span='8'>
          <el-button type='primary'>添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" stripe border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <el-row v-for="(item1,i1) in scope.row.children" :class="['bdbottom', i1 === 0? 'bdtop': '', 'vcenter']" :key="item1.id">
              <el-col :span="8">
                <el-tag closable @close="removeRights(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="16">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0? '': 'bdtop', 'vcenter']">
                  <el-col :span="8">
                    <el-tag type="success" closable @close="removeRights(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                       <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id" @close="removeRights(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" >
          <template v-slot="scope">
            <el-button type='primary' icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type='danger' icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type='warning' icon="el-icon-setting" size="mini" @click="showRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限弹框 -->
<el-dialog
  title="分配权限"
  :visible.sync="dialogVisible"
  width="50%"
  @close="resetNodeKey">
  <!-- 树形控件 -->
  <el-tree :data="rightsList" :props="roleProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="checkedkeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRightsNode">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      roleList: [],
      rightsList: [],
      dialogVisible: false,
      checkedkeys: [],
      roleId: '',
      roleProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const res = await this.$http.get('roles')
      console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) return
      this.roleList = data
    },
    // 删除权限
    removeRights(role, rightid) {
      console.log(role.id, rightid)
      this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除角色权限
        const res = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        console.log(res.data)
        const { meta, data } = res.data
        if (meta.status !== 200) return this.$message.error('删除角色权限失败')
        // this.getRolesList()
        role.children = data
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    // 分配权限
    async showRightDialog(role) {
      // 存储用户角色id
      this.roleId = role.id
      // 获取权限列表
      const res = await this.$http.get('rights/tree')
      console.log(res.data)
      const { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = data
      this.getNodeKey(role, this.checkedkeys)
      this.dialogVisible = true
    },
    // 获取三级权限节点id
    getNodeKey(node, arr) {
      // 没有children就是三级节点
      if (!node.children) return arr.push(node.id)
      // 有children
      node.children.forEach(item => {
        this.getNodeKey(item, arr)
      })
    },
    // 监听分配权限的关闭事件
    resetNodeKey() {
      this.checkedkeys = []
    },
    // 添加权限节点
    async addRightsNode() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idstr = keys.join(',')
      // 发送分配权限请求
      const res = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idstr })
      console.log(res.data)
      const { meta } = res.data
      if (meta.status !== 200) return this.$message.error('添加角色权限失败')
      this.getRolesList()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #ccc
}
.bdbottom{
  border-bottom: 1px solid #ccc
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
