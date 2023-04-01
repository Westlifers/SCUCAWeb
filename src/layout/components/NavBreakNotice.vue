<!-- deprecated -->

<template>
  <el-popover
      :visible="visible"
      placement="top"
      :width="width"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <el-button class="out-btn" @click="visible=!visible" icon="Bell" round/>
    </template>
    <template #default>
      <div class="breaks-header">
        <h3>最近纪录</h3>
      </div>
      <div class="breaks">
        <el-scrollbar max-height="300">
          <div class="break-notice" v-for="(announcement, i) in breakAnnouncements" :key="i">
            <el-tag type="warning">{{getUserAndEventAndAorb(announcement.content).event}}</el-tag>
            <el-tag :type="getUserAndEventAndAorb(announcement.content).aorb==='平均'?'':'success'">{{getUserAndEventAndAorb(announcement.content).aorb}}</el-tag>
            <el-tag type="info">{{getUserAndEventAndAorb(announcement.content).time}}</el-tag>
            <el-tag effect="dark">{{getUserAndEventAndAorb(announcement.content).user}}</el-tag>
          </div>
        </el-scrollbar>
      </div>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {getAnnouncement} from "@/api/fetchData";
import {Announcement} from "@/types";
import {getUserAndEventAndAorb} from "@/utils";

const visible = ref(false)
const width = ref(300)

const breakAnnouncements: Announcement[] = await getAnnouncement('scur break')
// compare the first announcement and length of breakAnnouncement with local storage
// if the first announcement is not the same as the one in local storage and the length of breakAnnouncement is more than local storage
// then update the local storage, and set is_new_notice to true
// otherwise, set is_new_notice to false
const emits = defineEmits<{
  (e: 'receive_new_record', record_title_and_new_length: object): void
  (e: 'update_visible', visible: boolean): void
  (e: 'receive_no_new_record'): void
}>()

let latestBreakAnnouncementInLocalStorage: string | null = await localStorage.getItem('latestBreakAnnouncement')
// if latestBreakAnnouncementInLocalStorage is null, then set it to '', otherwise, parse it to string
if (latestBreakAnnouncementInLocalStorage === null) {
  latestBreakAnnouncementInLocalStorage = ''
}

let breakAnnouncementsInLocalStorageLength: string | null | number = await localStorage.getItem('breakAnnouncementLength')
// if breakAnnouncementsInLocalStorageLength is null, then set it to 0, otherwise, parse it to int
if (breakAnnouncementsInLocalStorageLength === null) {
  breakAnnouncementsInLocalStorageLength = 0
} else {
  breakAnnouncementsInLocalStorageLength = parseInt(breakAnnouncementsInLocalStorageLength)
}

if (breakAnnouncements[0].title !== latestBreakAnnouncementInLocalStorage || breakAnnouncements.length > breakAnnouncementsInLocalStorageLength) {
  emits('receive_new_record', {record_title: breakAnnouncements[0].title, new_length: breakAnnouncements.length})
} else {
  emits('receive_no_new_record')
}

// watch visible, to sync father component's visible
watch(visible, (newVisible, oldValue) => {
  emits('update_visible', newVisible)
})

</script>

<style scoped>
.breaks-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 20px;
}

.breaks {
  display: flex;
  flex-direction: column;
}

.break-notice {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}

button.out-btn {
  border: none;
  background-color: var(--yougi-bg-color);
  color: var(--yougi-main-color);
}
</style>
