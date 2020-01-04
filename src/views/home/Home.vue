<template>
    <el-container class="home">
      <!-- 头部 -->
    <el-header class="header">
      <div>
        <img src="../../assets/img/heima.png" alt="" srcset="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container class="container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'" class="aside">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#292C36"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse='isCollapse'
      :collapse-transition="false"
      router>
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconList[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + child.path" v-for="child in item.children" :key="child.id">
           <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{child.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <!-- 主体内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menulist: [],
      iconList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单权限
    async getMenuList() {
      const res = await this.$http.get('/menus')
      let { meta, data } = res.data
      if (meta.status !== 200) return this.$message.error('请求失败')
      // console.log(data)
      this.menulist = data
    },
    // 折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home{
  height:100%;
  .header{
    height: 60px;
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    >div{
      display: flex;
      align-items: center;
      justify-content: space-between;
      img{
        width: 50px;
      }
      span{
        color: #fff;
        font-size: 24px;
        margin-left: 10px;
      }
    }
  }
  .container{
    height: 100%;
    .aside{
      width: 180px;
      background-color: #333744;
      .iconfont{
        margin-right: 10px;
      }
    }
    .main{
      padding: 10px;
      background-color:#EAEDF1;
    }
  }
}

.el-menu{
  border-right: none;
}

.toggle-button{
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.5em;
  cursor: pointer;
}
</style>
