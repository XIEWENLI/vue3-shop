<template>
  <van-nav-bar title="登录界面" />
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 25px">
      <van-button round block type="primary" native-type="submit">
        登录
      </van-button>
    </div>
  </van-form>
  <div style="text-align: center; margin-top: 60%">
    <router-link style="text-decoration: underline" to="/jumpRegister" replace
      >注册</router-link
    >
    <router-link
      style="margin-left: 50px; text-decoration: underline"
      to="/"
      replace
      >首页</router-link
    >
  </div>
</template>
<script>
import request from '@/utils/request.js'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    // 登录
    const username = ref('')
    const password = ref('')
    const onSubmit = async values => {
      const { data: DLState } = await request.get('/getAdminDL')
      if (DLState.data === 'false') {
        alert('登录功能已关闭，待开启状态！')
        return
      } else if (values['用户名'] !== '' && values['密码'] !== '') {
        const { data: userData } = await request.get('/getUser', {
          params: {
            username: values['用户名'],
            password: values['密码']
          }
        })
        if (userData.isLogin) {
          alert('你的登录权限被禁止了！')
          return
        }
        // 这里的userData.data就是dt.username
        if (userData.data === values['用户名']) {
          const tokenData = {
            userId: userData.userId,
            username: userData.data
          }
          localStorage.setItem('token', JSON.stringify(tokenData))
          router.replace('/')
          alert('欢迎你   ' + userData.data)
        } else {
          alert(userData.data)
        }
      }
    }

    // 跳转注册界面
    const jumpIndex = () => {
      router.replace('/')
    }

    return {
      username,
      password,
      onSubmit,
      jumpIndex
    }
  }
}
</script>
<style scoped>
.van-form {
  margin-top: 40%;
}
</style>
