<template>
  <div class="login_container">
    <div class="login_box">
      <!-- login图片 -->
      <div class="login_img">
        <img src="../assets/logo.png" alt="" srcset="">
      </div>
      <!-- login表单 -->
      <el-form ref="formRef" :model="form" :rules="rules" label-width='80px'>
        <!-- 用户名 -->
        <el-form-item  label="用户名:" prop='username'>
          <el-input v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item  label="密码:" prop='password'>
          <el-input v-model="form.password" prefix-icon="iconfont icon-3702mima" type='password'></el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click='submitForm'>提交</el-button>
          <el-button type="info" @click="resetForm('formRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm (formRef) {
      this.$refs[formRef].resetFields()
    },
    submitForm () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        let res = await this.$http.post('login', this.form)
        console.log(res.data)
        let { meta, data } = res.data
        if (meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功！')
        sessionStorage.setItem('token', data.token)
        // 登录成功跳转到首页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
  width: 100%;
  background-color:#2b4b6b;
  .login_box{
    width: 450px;
    height: 300px;
    border-radius: 10px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    position: relative;
    .login_img{
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #ccc;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      background-color: #fff;
      top: -50%;
      left: 50%;
      transform: translate(-50%,50%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}

.el-form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }

.btns{
  text-align: right;
  }
</style>
