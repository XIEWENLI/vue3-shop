<template>
  <van-nav-bar fixed title="订单" />
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div v-if="!isLoading">
      <!-- 无订单显示 -->
      <van-empty
        v-if="isEmptyList"
        class="bj"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="购物车空空如也！"
      />
      <!-- 商品展示 -->
      <van-list
        class="bj"
        v-if="!isEmptyList"
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-swipe-cell v-for="item in list" :key="item._id">
          <van-card
            :num="item.buySum"
            :price="item.goodsPrice"
            :origin-price="item.goodsOldPrice"
            :desc="item.goodsDetail"
            :title="item.goodsName"
            :thumb="item.goodsSRC"
            ><template #tags>
              <h3 v-if="item.payState === 'true'">已付款</h3>
              <h3 v-else style="color: red">未付款</h3>
            </template></van-card
          >
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="onDelete"
            />
          </template>
        </van-swipe-cell>
      </van-list>
    </div>
  </van-pull-refresh>
  <!-- loading加载布局  -->
  <van-loading type="spinner" v-if="isLoading" />
</template>
<script>
import request from '@/utils/request.js'

import { ref } from 'vue'

export default {
  name: 'Order',
  setup() {
    const list = ref([])
    const isEmptyList = ref(false)
    // true则开启加载（加载中为true，异步函数执行）
    const loading = ref(false)
    // true数据全部加载完毕
    const finished = ref(false)

    const onLoad = () => {
      setTimeout(async () => {
        // 获取全部订单
        const token = JSON.parse(localStorage.getItem('token'))
        // 按用户_id，查order表
        const { data: res } = await request.get('/getAllOrder', {
          params: {
            userId: token.userId
          }
        })
        // 用户id查询后，先判断res.goodsData的商品id是否为空
        if (res.goodsData !== '') {
          for (let i = 0; i < res.goodsData.length; i++) {
            const { data: res2 } = await request.get('/getGoodsOne', {
              params: {
                _id: res.goodsData[i].goodsID
              }
            })
            // 解决order表存在，而goods已经删除出现的报错问题
            if (res2.goods === null) {
              request.get('/deleteOrder', {
                params: {
                  orderId: res.goodsData[i]._id
                }
              })
              break
            }
            res2.goods.buySum = res.goodsData[i].buySum
            res2.goods.orderId = res.goodsData[i]._id
            res2.goods.payState = res.goodsData[i].payState
            res2.goods.deliverState = res.goodsData[i].deliverState
            res2.goods.receiveState = res.goodsData[i].receiveState
            list.value.unshift(res2.goods)
          }
        }
        // empty显示
        if (!list.value.length) {
          isEmptyList.value = true
        }

        // 加载状态结束
        loading.value = false
        // 数据全部加载完成
        if (!loading.value) {
          finished.value = true
        }
      }, 100)
    }
    // 下拉加载
    const isLoading = ref(false)
    function onRefresh() {
      // 清空数据，重新请求
      list.value = []
      finished.value = false
      setTimeout(() => {
        isLoading.value = false
      }, 1000)
    }

    // 删除订单
    const onDelete = () => {
      alert('未实现')
    }

    return {
      list,
      onLoad,
      loading,
      finished,
      isLoading,
      onRefresh,
      isEmptyList,
      onDelete
    }
  }
}
</script>
<style scoped>
/* loading加载布局 */
.van-loading {
  position: absolute;
  top: 42%;
  left: 45.6%;
}

.van-list {
  padding-bottom: 100px;
}

/* 滑动单元格 */
.goods-card {
  margin: 0;
  background-color: white;
}
.delete-button {
  height: 100%;
}

.bj {
  margin-top: 46px;
  margin-bottom: 60%;
}

.van-card {
  background-color: white;
  border-top: 2px solid #f1f3f4;
}

.van-list .van-card:nth-last-child(2) {
  border-bottom: 2px solid #f1f3f4;
}
</style>
