<template>
  <!-- 内容区 -->
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div v-if="!isLoading">
      <div class="userName">用户名：{{ username }}</div>
      <van-grid>
        <van-grid-item icon="photo-o" text="订单" @click="jumpOrder" />
        <van-grid-item icon="photo-o" text="修改密码" />
        <van-grid-item icon="photo-o" text="退出" @click="signOut" />
        <van-grid-item icon="photo-o" text="未实现" />
      </van-grid>
    </div>
  </van-pull-refresh>
  <!-- loading加载布局  -->
  <van-loading type="spinner" v-if="isLoading" />
  <!-- 底部栏 -->
  <Label></Label>
</template>
<script>
import Label from '@/components/Label'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'User',
  components: {
    Label
  },
  setup() {
    // 获取用户名
    const username = ref('XXX')
    const token = localStorage.getItem('token')
    if (token) {
      username.value = JSON.parse(token).username
    }

    // 下拉加载
    const isLoading = ref(false)
    function onRefresh() {
      setTimeout(() => {
        isLoading.value = false
      }, 1000)
    }

    // 跳转订单页面
    const router = useRouter()
    const jumpOrder = () => {
      console.log('000')
      router.push('/jumpOrder')
    }

    // 退出登录
    const signOut = () => {
      localStorage.removeItem('token')
      router.replace('/')
    }

    return {
      username,
      isLoading,
      onRefresh,
      jumpOrder,
      signOut
    }
  }
}
</script>
<style scoped>
.van-pull-refresh {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* loading加载布局 */
.van-loading {
  position: absolute;
  top: 42%;
  left: 45.6%;
}

.userName {
  margin: 40px 0;
  width: 100%;
  text-align: center;
}
</style>
