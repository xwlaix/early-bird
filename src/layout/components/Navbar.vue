<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="全局字体" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <!-- <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登陆</span>
          </el-dropdown-item> -->
          <el-dropdown-item>
            <span style="display:block;" @click="changePassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">退出登陆</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog v-el-drag-dialog :visible.sync="dialogFormVisible" title="修改密码">
        <el-form ref="changeform" :rules="rules" :model="password" class="changeform" label-width="120px">
          <el-form-item label="旧密码:" prop="oldpsw">
            <el-input v-model.trim="password.oldpsw" clearable />
          </el-form-item>
          <el-form-item label="新密码:" prop="newpsw1">
            <el-input v-model.trim="password.newpsw1" clearable />
          </el-form-item>
          <el-form-item label="确认密码:" prop="newpsw2">
            <el-input v-model.trim="password.newpsw2" clearable />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer group_footer">
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="updateData">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setInfo } from '@/api/login'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import Cookies from 'js-cookie'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.password.newpsw1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if ((/\unnnn|\v|\t|\r|\n|\f|\xnn/).test(value)) {
        callback(new Error('密码含有转义字符!'))
      } else if ((/\\|<|>|\//).test(value)) {
        callback(new Error('密码含有特殊字符!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      password: {
        oldpsw: '',
        newpsw1: '',
        newpsw2: ''
      },
      rules: {
        oldpsw: [
          {
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
          },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        newpsw1: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass
          },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }

        ],
        newpsw2: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePass2
          },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changePassword() {
      this.dialogFormVisible = true
      this.password = {
        oldpsw: '',
        newpsw1: '',
        newpsw2: ''
      }
      try {
        this.$refs.changeform.clearValidate()
      } catch (error) {
        console.log(error)
      }
    },
    updateData() {
      this.$refs.changeform.validate(valid => {
        if (valid) {
          setInfo({
            auth_key: Cookies.get('authKey'),
            old_pwd: this.password.oldpsw,
            new_pwd: this.password.newpsw1
          }, '.changeform').then(res => {
            Cookies.set('authKey', res.data.authKey)
            this.dialogFormVisible = false
            this.$message({
              type: +res.code === 200 ? 'success' : 'error',
              message: res.message
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: '验证失败'
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
