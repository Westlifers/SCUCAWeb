<script setup lang="ts">
import {go_page} from "@/utils";

</script>

<template>
  <el-menu default-active="1" class="nav-footer-mobile" mode="horizontal">

    <el-menu-item index="1" @click="go_page('mobileWeek')">
      <el-icon :size="28"><Grid /></el-icon>
      <span class="nav-label">参赛</span>
    </el-menu-item>

    <el-menu-item index="2" @click="go_page('mobileWeekRank')">
      <el-icon :size="28"><Trophy /></el-icon>
      <span class="nav-label">排行</span>
    </el-menu-item>

  </el-menu>
</template>

<style scoped>
.nav-footer-mobile {
  width: 100%;
  background: var(--yougi-card-bg);
  border-top: 1px solid var(--yougi-border);
  overflow: hidden;
}

.el-menu {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-evenly !important;
  align-items: center !important;
  height: 100% !important;
  width: 100% !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

.el-menu-item:hover {
  background: var(--yougi-bg-secondary) !important;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.el-menu-item.is-active .nav-label {
  color: var(--yougi-primary);
}
</style>
