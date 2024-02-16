<script setup lang="ts">
import {computed} from "vue";
import {get_user_avatar, go_page} from "@/utils";
import {localStore} from "@/store";
import {useDark} from "@vueuse/core";

const store = localStore()
const isDark = useDark()
const isLoggedIn = computed(() => !(store.user.username===''))

const avatar = await get_user_avatar(store.user.username)
</script>

<template>
  <el-menu default-active="1" class="nav-footer-mobile" mode="horizontal">

    <el-menu-item index="1" @click="go_page('index')">
      <el-icon size="100"><ElementPlus /></el-icon>
    </el-menu-item>


    <el-menu-item index="2" @click="go_page('mobileWeek')">
      <el-icon size="100"><Grid /></el-icon>
    </el-menu-item>


    <el-menu-item index="3" @click="go_page('pk')">
      <el-icon size="100"><Timer /></el-icon>
    </el-menu-item>

    <el-switch size="large" v-model="isDark" active-icon="Moon" inactive-icon="Sunny" active-color="black" inline-prompt/>


  </el-menu>
</template>

<style scoped>
.nav-footer-mobile {
  width: 100%;
}
.el-menu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
.el-menu-item {
  height: 100% !important;
}
.el-menu-item.is-active {
  border-bottom: none !important;
}

</style>
