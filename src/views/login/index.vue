<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">早鸟金流管理平台</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="input"
          v-model="loginForm.username"
          clearable
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          placeholder="账号"
        />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="pwdType"
            ref="password"
            v-model="loginForm.password"
            clearable
            :type="pwdType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="verifyCode" class="captchaForm">
        <span class="svg-container">
          <svg-icon icon-class="captcha" />
        </span>
        <el-input
          v-model.trim="loginForm.verifyCode"
          name="verifyCode"
          clearable
          auto-complete="off"
          placeholder="验证码"
          tabindex="3"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-captcha" @click="getCaptcha">
          <img :src="captchaUrl" class="image">
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          :disabled="disabled"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >{{ login }}</el-button>
      </el-form-item>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div>-->
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateCaptcha = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else if (value.length !== 4) {
        callback(new Error('验证码长度为4位'))
      } else {
        callback()
      }
    }
    return {
      login: '登陆',
      disabled: false,
      loginForm: {
        username: '',
        password: '',
        verifyCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        verifyCode: [
          { required: true, trigger: 'blur', validator: validateCaptcha }
        ]
      },
      captchaUrl: '',
      loading: false,
      capsTooltip: false,
      pwdType: 'password',
      redirect: undefined,
      timer: null
    }
  },
  computed: {
    username() {
      return this.loginForm.username
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
    username: {
      handler: function() {
        this.getLoginBtn()
      }
    }
  },
  created() {
    this.getCaptcha()
    this.getLoginBtn()
  },
  methods: {

    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    getCaptcha() {
      this.captchaUrl =
       process.env.VUE_APP_BASE_API + '/admin/base/captcha?' + new Date().getTime()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = 'text'
      } else {
        this.pwdType = 'password'
      }
    },
    getLoginBtn(time) {
      if (localStorage.getItem(this.loginForm.username) >= 3 && this.loginForm.username) {
        this.getLoginText(time)
      } else {
        this.login = '登陆'
        this.disabled = false
        clearInterval(this.timer)
      }
    },
    getLoginText(times) {
      let time = localStorage.getItem('time') && localStorage.getItem('time') !== 'null' && localStorage.getItem('time') !== '0' ? localStorage.getItem('time') : 180
      time = times || time
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (time <= 0) {
          this.login = '登陆'
          this.disabled = false
          clearInterval(this.timer)
          localStorage.setItem(this.loginForm.username, 0)
        } else {
          this.disabled = true
          this.login = `请在${time}s登陆！`
          time--
          localStorage.setItem('time', time)
        }
      }, 1000)
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch((res) => {
              this.loginForm.verifyCode = ''
              this.getCaptcha()
              this.loading = false
              if (res.error === '你的账号已被锁定180秒，请在180秒之后重试') {
                localStorage.setItem(this.loginForm.username, 3)
                this.getLoginBtn(180)
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
.image {
  height: 50px;
  margin-top: -6px;
  margin-right: -10px;
}
@media screen and (max-width: 768px) {
   .el-input {
    width: 75% !important;
    }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    min-width: 95px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .captchaForm{
    width:calc(100% - 180px)
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd,
  .show-captcha {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .show-captcha{
    right: -170px;
  }
}
</style>
