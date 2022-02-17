<template>
  <van-nav-bar title="注册界面" />
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
      <van-field
        v-model="username"
        type="password"
        name="密码2"
        label="重复密码"
        placeholder="重复密码"
        :rules="[{ required: true, message: '请重复密码' }]"
      />
    </van-cell-group>
    <div style="margin: 25px">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
    </div>
    <div style="text-align: center; margin-top: 60%">
      <router-link style="text-decoration: underline" to="/jumpLogin" replace
        >登录</router-link
      >
      <router-link
        style="margin-left: 50px; text-decoration: underline"
        to="/"
        replace
        >首页</router-link
      >
    </div>
  </van-form>
</template>
<script>
import request from '@/utils/request.js'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    // 提交
    const username = ref('')
    const password = ref('')
    const onSubmit = async values => {
      // 判断注册功能状态
      const { data: ZCState } = await request.get('/getAdminZC')
      if (ZCState.data === 'false') {
        alert('注册功能已关闭，待开启状态！')
        return
      } else if (values['密码'] === values['密码2']) {
        const { data: userData } = await request.post('/addUser', {
          username: values['用户名'],
          password: values['密码']
        })
        // 这里的userData.data就是dt.username
        if (userData.data === values['用户名']) {
          const tokenData = {
            userId: userData.userId,
            username: userData.data
          }
          localStorage.setItem('token', JSON.stringify(tokenData))
          alert('欢迎您：' + userData.data)
          router.replace('/')
        } else {
          alert(userData.data)
        }
      } else {
        alert('密码和重复密码不一致！！！')
      }
    }

    // 跳转登录界面
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
