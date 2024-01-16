<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { Layout, LayoutSider, Menu, MenuItem, LayoutContent, LayoutFooter } from 'ant-design-vue'
import Header from '@/components/layout/Header.vue'

import { ref, h, watch, watchEffect } from 'vue'
import { routes } from '@/router'
import { useAuth } from '@/composables/useAuth'
import { RoleEnum } from '@/types'
import compact from 'lodash/compact'

const route = useRoute()

const { user, isAdmin, isEditor } = useAuth()

const menuItems = ref([])

const selectedKeys = ref([])

watch(
  () => user.value,
  () => {
    menuItems.value = compact(
      routes.map((route) => {
        const role = route?.meta?.role
        if (role === RoleEnum.ADMIN && !isAdmin.value) {
          return null
        }

        if (role === RoleEnum.EDITOR && !(isAdmin.value || isEditor.value)) {
          return null
        }

        return {
          key: route.name,
          path: route.path,
          label: route.label,
          icon: () => h(route.icon)
        }
      })
    )
  }
)

watch(
  () => route.name,
  () => {
    selectedKeys.value = [route.name]
  }
)
</script>

<template>
  <Layout has-sider :style="{ minHeight: '90vh', backgroundColor: 'white' }">
    <Header />
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
  margin-left: 200px;
  margin-top: 64px;
  background: unset;
  & .content {
    margin: 24px 16px 0;
    overflow: initial;
    background: unset;
  }
}
</style>
