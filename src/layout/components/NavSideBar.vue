<template>
  <el-menu default-active="1-1" class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened>

    <el-button icon="MoreFilled" id="collapse-button" @click="isCollapse=!isCollapse" circle />


    <el-sub-menu index="1">
      <template #title>
        <el-icon><Bicycle /></el-icon>
        <span>进行赛事</span>
      </template>

      <el-menu-item index="1-1" @click="go_page('week')">
        <el-icon><TrendCharts /></el-icon>
        <template #title>周赛</template>
      </el-menu-item>

      <el-menu-item index="1-2" @click="go_page('special')">
        <el-icon><Grid /></el-icon>
        <template #title>正赛</template>
      </el-menu-item>
    </el-sub-menu>


    <el-menu-item index="2" @click="go_page('history')">
      <el-icon><document /></el-icon>
      <template #title>历史赛事</template>
    </el-menu-item>

    <el-menu-item index="3" @click="go_page('record')">
      <el-icon><Medal /></el-icon>
      <template #title>社团记录</template>
    </el-menu-item>


    <el-menu-item index="4" @click="go_page('rank')">
      <el-icon><Tickets /></el-icon>
      <template #title>排名</template>
    </el-menu-item>


    <el-sub-menu index="5">
      <template #title>
        <el-icon><Management /></el-icon>
        <span>管理</span>
      </template>

      <el-menu-item index="5-1" @click="go_page('create')">
        <el-icon><Management /></el-icon>
        <template #title>发布比赛</template>
      </el-menu-item>

      <el-menu-item index="5-2" @click="go_page('post')">
        <el-icon><FolderAdd /></el-icon>
        <template #title>发布通知</template>
      </el-menu-item>
    </el-sub-menu>


    <el-menu-item index="6" @click="go_page('pk')">
      <el-icon><Timer /></el-icon>
      <template #title>实时PK</template>
    </el-menu-item>


    <el-menu-item index="7" @click="go_page('practice')">
      <el-icon><PictureRounded /></el-icon>
      <template #title>练习</template>
    </el-menu-item>


    <el-menu-item index="8" @click="go_page('about')">
      <el-icon><InfoFilled /></el-icon>
      <template #title>关于</template>
    </el-menu-item>


  </el-menu>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";
import {go_page} from "@/utils";
import {localStore} from "@/store";

const isCollapse = ref(true)
const store = localStore()

const isLoggedIn = computed(() => !(store.user.username===''))
</script>

<style scoped>
#collapse-button {
  width: 100%;
  border-radius: 0;
  background-color: var(--yougi-app-container);
  border: none !important;
}

.el-menu {
  border: none;
}

.el-menu-vertical-demo,
.el-menu-vertical-demo .el-menu-item{
  background-color: var(--yougi-app-container);
}
</style>
