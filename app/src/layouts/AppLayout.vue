<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { Layout, LayoutSider, Menu, MenuItem, LayoutContent, LayoutFooter } from 'ant-design-vue'

import { ref, h, watch } from 'vue'
import { routes } from '@/router'

const route = useRoute()

const menuItems = ref(
  routes.map((route) => ({
    key: route.name,
    path: route.path,
    label: route.label,
    icon: () => h(route.icon)
  }))
)

const selectedKeys = ref([])

watch(
  () => route.name,
  () => {
    selectedKeys.value = [route.name]
  }
)

// console.log('!_NAME_!', route)
</script>

<template>
  <Layout has-sider :style="{ minHeight: '90vh', backgroundColor: 'white' }">
    <LayoutSider class="sider">
      <div class="logo-container">
        <img src="https://5ly.co/content/images/2022/05/home.png" alt="logo" class="logo" />
      </div>
      <Menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <MenuItem v-for="item in menuItems" class="menu-item" :key="item.key" :icon="item.icon">
          <RouterLink :to="item.path" class="nav-text">{{ item.label }}</RouterLink>
        </MenuItem>
      </Menu>
    </LayoutSider>
    <Layout class="content-container">
      <LayoutContent class="content">
        <slot />
      </LayoutContent>
      <LayoutFooter :style="{ textAlign: 'center' }"> TS hiring test ©2024 </LayoutFooter>
    </Layout>
  </Layout>
</template>

<style scoped>
.logo-container {
  height: 100px;
  margin: 16px;
  & .logo {
    width: 100%;
  }
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

.menu-item {
  display: flex;
  justify-content: space-between;
}

.sider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}
.content-container {
  margin: 0;
  background: unset;
  & .content {
    margin: 24px 16px 0;
    overflow: initial;
    background: unset;
  }
}
</style>
