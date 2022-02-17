<template>
  <!-- 内容区 -->
  <van-pull-refresh :head-height="160" v-model="isLoading" @refresh="onRefresh">
    <div v-if="!isLoading" class="content">
      <!-- 搜索栏 -->
      <van-search
        v-model="searchValue"
        shape="round"
        background="#1989fa"
        show-action
        placeholder="请输入商品名称"
      >
        <template #action>
          <van-button
            type="primary"
            style="margin: 0 -8px; border-radius: 0"
            @click="onSearch"
            >搜索</van-button
          >
        </template>
      </van-search>
      <!-- 轮播图 -->
      <van-swipe :autoplay="3000" class="my-swipe">
        <van-swipe-item v-for="(image, index) in imgs" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
      <!-- 商品展示区域 -->
      <Goods></Goods>
    </div>
  </van-pull-refresh>
  <!-- loading加载布局 -->
  <van-loading type="spinner" v-if="isLoading" />
  <!-- 底部栏 -->
  <Label></Label>
</template>
<script>
import Label from '@/components/Label'
import Goods from '@/components/Goods'
import { ref, reactive } from 'vue'

export default {
  name: 'Index',
  components: {
    Label,
    Goods
  },
  setup() {
    // 下拉加载和内容隐藏
    const isLoading = ref(false)

    // 搜索栏
    const searchValue = ref('')
    function onSearch() {
      console.log('搜索内容')
    }
    // 轮播图
    const imgs = reactive([
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgfs17.gomein.net.cn%2FT1zmh7BTE_1RCvBVdK_800.jpg%3Fv%3D1&refer=http%3A%2F%2Fgfs17.gomein.net.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647577692&t=804892efb36701b9bd1d3a9e2070d3ba',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp8.itc.cn%2Fimages01%2F20210611%2F5de6ce0d50a44042af5683f779d1d387.png&refer=http%3A%2F%2Fp8.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647577737&t=e491d3885c34f669880e7a0b36783c8f',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fy.zdmimg.com%2F202106%2F16%2F60c9dc4f80ff96607.jpg_d250.jpg&refer=http%3A%2F%2Fy.zdmimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647577766&t=cd04fdfda8d6948fded66d82f5235fa6'
    ])
    // 下拉刷新
    function onRefresh() {
      setTimeout(() => {
        isLoading.value = false
      }, 1000)
    }

    return {
      isLoading,
      onRefresh,
      searchValue,
      onSearch,
      imgs
    }
  }
}
</script>
<style scoped>
/* 搜索栏 */
.van-search {
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  z-index: 99;
}

/* loading加载布局 */
.van-loading {
  position: absolute;
  top: 42%;
  left: 45.6%;
}

/* 轮播图 */
.my-swipe .van-swipe-item {
  margin-top: 60px;
  width: 100%;
  height: 160px;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 100%;
}
</style>
