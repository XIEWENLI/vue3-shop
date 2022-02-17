import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router/index'
import vuex from '@/store/index'

// vant-ui样式
import {
  Tabbar,
  TabbarItem,
  Icon,
  NavBar,
  Loading,
  PullRefresh,
  Search,
  Button,
  Swipe,
  SwipeItem,
  Lazyload,
  List,
  Cell,
  Empty,
  Card,
  Popup,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  Stepper,
  Grid,
  GridItem,
  Form,
  Field,
  CellGroup,
  SwipeCell
} from 'vant'

const app = createApp(App)

// 按需导入
app.use(Tabbar)
app.use(TabbarItem)
app.use(Icon)
app.use(NavBar)
app.use(Loading)
app.use(PullRefresh)
app.use(Search)
app.use(Button)
app.use(Swipe)
app.use(SwipeItem)
app.use(Lazyload)
app.use(List)
app.use(Cell)
app.use(Empty)
app.use(Card)
app.use(Popup)
app.use(ActionBar)
app.use(ActionBarIcon)
app.use(ActionBarButton)
app.use(Stepper)
app.use(Grid)
app.use(GridItem)
app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(SwipeCell)

app.use(router)
app.use(vuex)

app.mount('#app')
