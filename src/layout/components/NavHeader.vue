<template>
  <el-menu class="el-menu-demo" mode="horizontal" background-color="#EC4141FF" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item index="1" @click="go_page('index')">
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
    <div class="user-popover">
      <Suspense>
        <el-badge type="primary" is-dot v-if="is_new_notice" @click="read_new_record">
          <nav-break-notice @receive_new_record="receive_new_record" @update_visible="update_visible" />
        </el-badge>
        <nav-break-notice v-else />
      </Suspense>
    </div>
  </el-menu>
  <div class="h-6" />
</template>

<script lang="ts" setup>
import NavUser from "@/layout/components/NavUser.vue";
import {go_page} from "@/utils";
import NavBreakNotice from "@/layout/components/NavBreakNotice.vue";
import {ref} from "vue";

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
  localStorage.setItem('latestBreakAnnouncement', JSON.stringify(new_record_title.value))
  localStorage.setItem('breakAnnouncementLength', JSON.stringify(new_length.value))
}

const update_visible = (new_visible) => {
  visible.value = new_visible
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
}
.user-popover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
}
</style>
