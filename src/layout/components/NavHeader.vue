<template>
  <el-menu class="el-menu-demo" mode="horizontal" text-color="#fff">
    <div class="el-menu-item" @click="go_page('index')">
      <el-icon size="50"><ElementPlus /></el-icon>
      SCUCAComp
    </div>
  </el-menu>
  <el-menu class="func" text-color="#fff" active-text-color="#fff" background-color="#EC4141FF">
    <div class="user-popover">
      <Suspense>
        <nav-user />
      </Suspense>
    </div>
    <div class="user-popover">
      <Suspense>
        <el-badge type="primary" is-dot v-if="is_new_notice" @click="read_new_record">
          <nav-break-notice @receive_new_record="receive_new_record" @update_visible="update_visible" @receive_no_new_record="receive_no_new_record" />
        </el-badge>
        <nav-break-notice v-else />
      </Suspense>
    </div>
    <div class="user-popover">
      <el-switch size="large" v-model="isDark" active-icon="Sunny" inactive-icon="Moon" style="--el-switch-on-color: #ff4949; --el-switch-off-color: #409EFF" inline-prompt/>
    </div>
  </el-menu>
  <div class="h-6" />
</template>

<script lang="ts" setup>
import NavUser from "@/layout/components/NavUser.vue";
import {go_page} from "@/utils";
import NavBreakNotice from "@/layout/components/NavBreakNotice.vue";
import {ref} from "vue";
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const is_new_notice = ref(true)
const new_record_title = ref('')
const new_length = ref(0)
const visible = ref(false)
const receive_new_record = (record_title_and_new_length) => {
  is_new_notice.value = true
  new_record_title.value = record_title_and_new_length.record_title
  new_length.value = record_title_and_new_length.new_length
}

const read_new_record = async () => {
  // there's a variable named visible in nav-break-notice, if it's true, return
  if (visible.value) return
  is_new_notice.value = false
  localStorage.setItem('latestBreakAnnouncement', new_record_title.value)
  localStorage.setItem('breakAnnouncementLength', JSON.stringify(new_length.value))
}

const update_visible = (new_visible) => {
  visible.value = new_visible
}

const receive_no_new_record = () => {
  is_new_notice.value = false
}
</script>

<style scoped>
.func {
  display: flex;
  position: absolute;
  float: right;
  right: 0;
  flex-direction: row-reverse;
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
.el-menu-demo {
  background-color: #EC4141FF;
  height: 100%;
}
.el-menu-item {
  --el-menu-hover-bg-color: #EC4141FF;
}
</style>
