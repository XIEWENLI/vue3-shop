<template>
  <van-nav-bar fixed title="购物车" />
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div v-if="!isLoading">
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
          <van-action-bar-button
            type="danger"
            @click="buyGoods"
            text="立即购买"
          />
        </van-action-bar>
      </van-popup>
      <!-- 空白界面 -->
      <van-empty
        v-if="isEmptyList"
        class="bj"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="购物车空空如也！"
      />
      <!-- 商品内容 -->
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
            @click="onShowGoodsPopup(item._id)"
          />
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="onDelete(item.shoppingCarId)"
            />
          </template>
        </van-swipe-cell>
      </van-list>
    </div>
  </van-pull-refresh>
  <!-- loading加载布局  -->
  <van-loading type="spinner" v-if="isLoading" />
  <!-- 底部导航组件 -->
  <Label></Label>
</template>
<script>
import request from '@/utils/request.js'
import Label from '@/components/Label'

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ShoppingCart',
  components: {
    Label
  },
  setup() {
    const router = useRouter()
    const list = ref([])
    const isEmptyList = ref(false)
    // true则开启加载（加载中为true，异步函数执行）
    const loading = ref(false)
    // true数据全部加载完毕
    const finished = ref(false)

    const onLoad = () => {
      setTimeout(async () => {
        const token = JSON.parse(localStorage.getItem('token'))
        // 获取购物车订单
        const { data: res } = await request.get('/getShoppingCar', {
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
              request.get('/deleteShoopingCar', {
                params: {
                  shoppingCarId: res.goodsData[i]._id
                }
              })
              break
            }
            res2.goods.buySum = res.goodsData[i].buySum
            res2.goods.shoppingCarId = res.goodsData[i]._id
            list.value.push(res2.goods)
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
      }, 10)
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
      // 每打开一次弹窗就格式化一次售卖数量
      if (!show.value) {
        buySum.value = list.value.filter(val => goodsId === val._id)[0].buySum
      }
      // 是否弹窗
      show.value = true
    }

    // 购买商品
    const buyGoods = async () => {
      // 判断登录状态
      const { data: DLSatate } = await request.get('/getAdminDL')
      if (DLSatate.data === 'false') {
        localStorage.removeItem('token')
      }
      const token = JSON.parse(localStorage.getItem('token'))
      if (!token) {
        router.replace('/jumpLogin')
        return
      }
      // 判断购买数量是否符合库存
      const { data: res } = await request.get('/getGoodsOne', {
        params: {
          _id: goodsDetail._id
        }
      })
      if (buySum.value > res.goods.goodsSum) {
        alert('库存不足')
      } else {
        const payState = confirm('是否支付!')
        // 订单添加
        const tokenData = JSON.parse(localStorage.getItem('token'))
        request.get('/addOrder', {
          params: {
            userId: tokenData.userId,
            goodsId: goodsDetail._id,
            buySum: buySum.value,
            payState,
            deliverState: false,
            receiveState: false
          }
        })
        // 购买后（无论是否付款），修改库存 goodsSum
        request.get('/updateGoodsSum', {
          params: {
            goodsId: goodsDetail._id,
            goodsSum: res.goods.goodsSum - buySum.value
          }
        })
        if (payState) {
          alert('支付成功！')
          // 购买后刷新页面
          location.reload()
        } else {
          alert('支付失败！')
          // 购买后刷新页面
          location.reload()
        }
      }
    }

    // 删除购物车订单
    const onDelete = async shoppingCarId => {
      // 判断登录状态
      const { data: DLSatate } = await request.get('/getAdminDL')
      if (DLSatate.data === 'false') {
        localStorage.removeItem('token')
      }
      const token = JSON.parse(localStorage.getItem('token'))
      if (!token) {
        router.replace('/jumpLogin')
        return
      }
      request.get('deleteShoopingCar', {
        params: {
          shoppingCarId
        }
      })
      // 刷新当前页面
      location.reload()
    }

    return {
      list,
      onLoad,
      loading,
      finished,
      isLoading,
      onRefresh,
      isEmptyList,
      onShowGoodsPopup,
      show,
      goodsDetail,
      buySum,
      buyGoods,
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
