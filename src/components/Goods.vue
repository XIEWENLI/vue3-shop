<template>
  <!-- 目标商品购买弹窗 -->
  <van-popup
    v-model:show="show"
    closeable
    position="bottom"
    :style="{ height: '45%' }"
  >
    <van-card
      style="margin-top: 35px; border: 0px"
      :key="goodsDetail._id"
      :price="goodsDetail.goodsPrice"
      :origin-price="goodsDetail.goodsOldPrice"
      :desc="goodsDetail.goodsDetail"
      :title="goodsDetail.goodsName"
      :thumb="goodsDetail.goodsSRC"
    >
      <template #tags> 库存： {{ goodsDetail.goodsSum }} </template>
      <template #footer>
        <van-stepper v-model="buySum" :max="goodsDetail.goodsSum" integer />
      </template>
    </van-card>
    <!-- 动作栏 -->
    <van-action-bar style="margin-bottom: 5px">
      <van-action-bar-icon
        style="margin-left: 25px"
        icon="cart-o"
        text="购物车"
      />
      <van-action-bar-button type="warning" text="加入购物车" />
      <van-action-bar-button type="danger" text="立即购买" />
    </van-action-bar>
  </van-popup>
  <!-- 商品展示内容 -->
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-card
      v-for="item in list"
      :key="item._id"
      :price="item.goodsPrice"
      :origin-price="item.goodsOldPrice"
      :desc="item.goodsDetail"
      :title="item.goodsName"
      :thumb="item.goodsSRC"
      @click="onShowGoodsPopup(item._id)"
    >
      <template #tags> 库存： {{ item.goodsSum }} </template>
    </van-card>
  </van-list>
</template>
<script>
import request from '@/utils/request.js'

import { reactive, ref } from 'vue'

export default {
  name: 'GoodsDetail',
  setup() {
    // 请求回商品的数据-跳过数和总数
    const Skip = ref(0)
    const count = ref(0)
    // 下拉加载执行函数
    const list = ref([])
    // true则开启加载（加载中为true，异步函数执行）
    const loading = ref(false)
    // true数据全部加载完毕
    const finished = ref(false)
    const onLoad = () => {
      setTimeout(async () => {
        // 请求商品数据
        const { data: res } = await request.get('/getGoods', {
          params: {
            count: Skip.value
          }
        })
        Skip.value += 12
        count.value = res.goodsCount
        list.value = [...list.value, ...res.data]

        // 加载状态结束
        loading.value = false
        // 数据全部加载完成
        if (Skip.value > count.value) {
          finished.value = true
        }
      }, 100)
    }
    // 目标商品购买弹窗
    const show = ref(false)
    const buySum = ref(1)
    const goodsDetail = reactive({})
    const onShowGoodsPopup = async goodsId => {
      const { data: res } = await request.get('/getGoodsOne', {
        params: {
          _id: goodsId
        }
      })
      Object.assign(goodsDetail, res.goods)
      // 没打开一次弹窗就格式化一次售卖数量
      if (!show.value) {
        buySum.value = 1
      }
      // 是否弹窗
      show.value = true
    }

    return {
      list,
      onLoad,
      loading,
      finished,
      onShowGoodsPopup,
      show,
      goodsDetail,
      buySum
    }
  }
}
</script>
<style scoped>
.van-list {
  margin-top: 8px;
  margin-bottom: 100px;
}

.van-card {
  background-color: white;
  border-top: 2px solid #f1f3f4;
}

.van-list .van-card:nth-last-child(3) {
  border-bottom: 2px solid #f1f3f4;
}
</style>
