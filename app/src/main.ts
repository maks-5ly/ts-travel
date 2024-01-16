import './assets/main.css'
import Antd from 'ant-design-vue'

import { createApp, provide, h } from 'vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import { apolloClient } from '@/apollo/client'
import { DefaultApolloClient } from '@vue/apollo-composable'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App)
})

app.use(router).use(Antd)

app.mount('#app')
