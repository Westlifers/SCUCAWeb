<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#EC4141FF" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item index="1">
      <el-icon size="50"><ElementPlus /></el-icon>
      <template #title> SCUCAComp </template>
    </el-menu-item>
  </el-menu>
  <el-menu class="func" text-color="#fff" active-text-color="#fff" background-color="#EC4141FF">
    <div class="user-popover">
      <Suspense>
        <nav-user />
      </Suspense>
    </div>
  </el-menu>
  <div class="h-6" />
</template>

<script lang="ts" setup>
import NavUser from "@/layout/components/NavUser.vue";</script>

<style scoped>
.func {
  display: flex;
  position: absolute;
  float: right;
  right: 0;
  flex-direction: row-reverse;
  top: 0;
  height: 56px;
}
.user-popover {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
