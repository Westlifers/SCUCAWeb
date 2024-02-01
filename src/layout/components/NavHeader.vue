<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <div class="el-menu-item" @click="go_page('index')">
      <el-icon size="100"><ElementPlus /></el-icon>
      <p class="app-name">SCUCAComp</p>
    </div>
  </el-menu>
  <el-menu class="func">
    <div class="user-popover" id="nav-user">
      <Suspense>
        <nav-user />
      </Suspense>
    </div>

    <el-divider direction="vertical" style="height: 70%" />

    <div class="user-popover">
      <el-switch size="large" v-model="isDark" active-icon="Moon" inactive-icon="Sunny" active-color="black" inline-prompt/>
    </div>
  </el-menu>
  <div class="h-6" />
</template>

<script lang="ts" setup>
import NavUser from "@/layout/components/NavUser.vue";
import {go_page} from "@/utils";
import {watch} from "vue";
import {useDark, useToggle} from '@vueuse/core'
import {localStore} from "@/store";

const store = localStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)

// below is for nav-break-notice previously, but is deprecated now

// const is_new_notice = ref(true)
// const new_record_title = ref('')
// const new_length = ref(0)
// const visible = ref(false)
// const receive_new_record = (record_title_and_new_length) => {
//   is_new_notice.value = true
//   new_record_title.value = record_title_and_new_length.record_title
//   new_length.value = record_title_and_new_length.new_length
// }
//
// const read_new_record = async () => {
//   // there's a variable named visible in nav-break-notice, if it's true, return
//   if (visible.value) return
//   is_new_notice.value = false
//   localStorage.setItem('latestBreakAnnouncement', new_record_title.value)
//   localStorage.setItem('breakAnnouncementLength', JSON.stringify(new_length.value))
// }
//
// const update_visible = (new_visible) => {
//   visible.value = new_visible
// }
//
// const receive_no_new_record = () => {
//   is_new_notice.value = false
// }

watch(isDark, (newVal) => {
  store.toggleDarkMode(typeof newVal === "boolean" ? newVal : false)
})
</script>

<style scoped>
.el-menu-demo {
  background-color: var(--yougi-app-container);
  height: 100%;
  color: var(--yougi-main-color);
  --el-menu-bg-color: var(--yougi-main-color);
}

.el-menu-demo .el-menu-item p {
  font-size: 20px;
  line-height: 24px;
  font-weight: 400;
  margin: 0 32px;
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
  background-color: inherit;
}

.user-popover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
  background-color: inherit;
}

.el-menu-item {
  --el-menu-hover-bg-color: var(--yougi-app-container);
}

.el-menu--horizontal {
  border: none !important;
}

.el-menu-item:hover p,
.el-menu-item:hover .el-icon svg{
  color: var(--yougi-main-color);
  fill: var(--yougi-main-color);
}

/* 扒源码扒出来的，我也不知道为什么这么选 */
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: var(--yougi-main-color);
}

/* 针对极窄页面 */
@media screen and (max-width: 430px) {
  .el-menu-demo .el-menu-item p {
    display: none;
  }
}
</style>
