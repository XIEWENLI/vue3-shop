<template>
  <van-tabbar fixed v-model="active" style="height: 60px">
    <router-link to="/" replace
      ><van-tabbar-item icon="home-o">首页</van-tabbar-item></router-link
    >

    <router-link fixed to="/jumpShoppingCart" replace
      ><van-tabbar-item icon="shopping-cart-o"
        >购物车</van-tabbar-item
      ></router-link
    >
    <router-link fixed to="/jumpUser" replace
      ><van-tabbar-item icon="user-circle-o">我的</van-tabbar-item></router-link
    >
  </van-tabbar>
</template>
<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Label',
  setup() {
    // 底部导航栏选中的active
    const active = ref(0)

    // 路由
    const route = useRoute()
    switch (route.path) {
      case '/':
        active.value = 0
        break
      case '/jumpShoppingCart':
        active.value = 1
        break
      case '/jumpUser':
        active.value = 2
        break

      default:
        active.value = ''
    }

    return {
      active
    }
  }
}
</script>
<style scoped>
a {
  display: flex;
  width: 100%;
}
</style>
