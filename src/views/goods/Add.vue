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
      <!-- 警告条 -->
      <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable="false">
    </el-alert>
    <!-- 步骤条 -->
    <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center >
      <el-step title="基本信息"></el-step>
      <el-step title="商品信息"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" label-position="top">
    <!-- tab栏 -->
    <el-tabs :tab-position="tabPosition"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click='selectTab'>
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addForm.goods_price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addForm.goods_number" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="goods_cat">
        <el-cascader
        v-model="addForm.goods_cat"
        :options="cateList"
        :props="cateProps"
        @change="handleChange"></el-cascader>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <el-form-item :label="item.attr_name" v-for="(item) in manyTableData" :key="item.attr_id">
        <!-- 多选框 -->
        <el-checkbox-group v-model="item.attr_vals">
          <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
      <el-form-item :label="item.attr_name" prop="" v-for="(item,i) in onlyTableData " :key="i">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
      <el-upload
        class="upload-demo"
        :action="uploadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        list-type="picture"
        :headers='headers'
        :on-success="uploadSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
      <quill-editor v-model="addForm.goods_introduce"
      ref="myQuillEditor">
      </quill-editor>
      <el-button type="primary" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>
    </el-card>
    <!-- 图片预览框 -->
    <el-dialog
    title="图片预览"
    :visible.sync="previewDialog"
    width="70%">
    <img :src="previewPath" alt="" srcset="">
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Add',
  data () {
    return {
      activeIndex: '0',
      tabPosition: 'left',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      // 图片上传地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      previewPath: '',
      previewDialog: false
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const res = await this.$http.get('categories')
      const { meta, data } = res.data
      if (meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = data
      // console.log(this.cateList)
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName, oldactiveName) {
      // console.log('进入' + activeName, '离开' + oldactiveName)
      if (oldactiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类再切换')
        return false
      }
    },
    // 获取商品参数
    async selectTab() {
      // console.log('获取动态参数')
      if (this.activeIndex === '1') {
        const res = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' }
        })
        const { meta, data } = res.data
        if (meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        console.log(res.data)
        data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = data
      } else if (this.activeIndex === '2') {
        // 获取商品静态参数
        const res = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' }
        })
        const { meta, data } = res.data
        if (meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        console.log(data)
        this.onlyTableData = data
      }
    },
    // 图片预览
    handlePreview() {
      this.previewDialog = true
    },
    // 图便移除
    handleRemove(file) {
      // console.log(file)
      // 找到移出图片的的下标
      const filepath = file.response.data.tmp_path
      const idx = this.addForm.pics.findIndex(item => {
        return item.pic === filepath
      })
      // console.log(idx)
      this.addForm.pics.splice(idx, 1)
      console.log(this.addForm)
    },
    uploadSuccess(response) {
      // console.log(response)
      const upInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(upInfo)
      console.log(this.addForm)
      this.previewPath = response.data.url
      // console.log(this.previewPath)
    },
    // 添加商品
    add() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        console.log(valid)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(this.addForm)
        // 处理attrs数组
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发送请求
        const res = await this.$http.post('goods', form)
        console.log(res)
        const { meta } = res.data
        if (meta.status !== 201) {
          return this.$message.error('提交失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps{
  margin-top: 20px;
}
.el-checkbox{
  margin: 10px !important;
}
</style>
