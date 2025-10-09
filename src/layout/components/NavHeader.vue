<template>
  <el-menu class="el-menu-demo glass-nav animate-fade-in-down" mode="horizontal">
    <div class="el-menu-item logo-container" @click="go_page('index')">
      <div class="logo-wrapper hover-scale">
        <el-icon size="100" class="logo-icon"><ElementPlus /></el-icon>
      </div>
      <p class="app-name text-gradient">SCUCAComp</p>
    </div>
  </el-menu>
  <div class="func">
    <div class="user-popover" id="nav-user">
      <Suspense>
        <nav-user />
      </Suspense>
    </div>

    <div class="user-popover theme-toggle">
      <el-switch 
        size="large" 
        v-model="isDark" 
        active-icon="Moon" 
        inactive-icon="Sunny" 
        active-color="#6366f1" 
        inline-prompt
        class="modern-switch"
      />
    </div>
  </div>
  <div class="h-6" />
</template>

<script lang="ts" setup>
import NavUser from "@/layout/components/NavUser.vue";
import {go_page} from "@/utils";
import {watch} from "vue";
import {useDark} from '@vueuse/core'
import {localStore} from "@/store";

const store = localStore()
const isDark = useDark()

watch(isDark, (newVal) => {
  store.toggleDarkMode(typeof newVal === "boolean" ? newVal : false)
})
</script>

<style scoped>
.glass-nav {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all var(--transition-base) var(--ease-out);
}

.dark .glass-nav {
  background: rgba(15, 23, 42, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.el-menu-demo {
  height: 100%;
  color: var(--yougi-main-color);
  --el-menu-bg-color: transparent;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base) var(--ease-out);
}

.logo-wrapper:hover {
  box-shadow: var(--shadow-xl);
  transform: rotate(10deg) scale(1.05);
}

.logo-icon {
  color: white !important;
  font-size: 28px !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: all var(--transition-base) var(--ease-out);
}

.logo-wrapper:hover .logo-icon {
  transform: scale(1.1);
}

.app-name {
  font-size: 22px;
  line-height: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all var(--transition-base) var(--ease-out);
}

.func {
  display: flex;
  position: absolute;
  float: right;
  right: 0;
  flex-direction: row-reverse;
  align-items: center;
  top: 0;
  height: 56px;
  padding-right: 16px;
  gap: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  transition: all var(--transition-base) var(--ease-out);
}

.dark .func {
  background: rgba(15, 23, 42, 0.8);
}

.user-popover {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.theme-toggle {
  padding: 8px;
  border-radius: var(--radius-md);
  transition: all var(--transition-base) var(--ease-out);
}

.theme-toggle:hover {
  background: var(--yougi-link-color-hover);
}

.modern-switch {
  transition: all var(--transition-base) var(--ease-out);
}

.modern-switch:hover {
  transform: scale(1.05);
}

.el-menu-item {
  --el-menu-hover-bg-color: transparent;
  border: none !important;
}

.el-menu--horizontal {
  border: none !important;
}

.logo-container:hover .app-name {
  transform: scale(1.05);
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, 
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: var(--yougi-primary);
  background: transparent;
}

@media screen and (max-width: 430px) {
  .app-name {
    display: none;
  }
  
  .logo-container {
    padding: 0 12px;
  }
}
</style>
