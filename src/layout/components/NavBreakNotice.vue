<template>
  <el-popover
      :visible="visible"
      placement="top"
      :width="width"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <el-button @click="visible=!visible" icon="Bell" color="#EC4141FF" round/>
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
import {ref} from "vue";
import {getAnnouncement} from "@/api/fetchData";
import {Announcement} from "@/types";
import {time_convert} from "@/utils";

const visible = ref(false)
const width = ref(300)
const breakAnnouncements: Announcement[] = await getAnnouncement('scur break')

// compute the event and aorb from each announcement
const getUserAndEventAndAorb = (content: string) => {
  const pos_1 = content.indexOf('在')
  const pos_2 = content.indexOf('了')
  const pos_3 = content.indexOf('的')
  const pos_4 = content.indexOf('记录')
  const pos_5 = content.indexOf('：')
  const user = content.substring(0, pos_1)
  const event = content.substring(pos_2 + 1, pos_3)
  const aorb = content.substring(pos_3 + 1, pos_4)
  const time = content.substring(pos_5 + 1)
  return {
    user: user,
    event: event,
    aorb: aorb,
    time: parseFloat(time) > 0?time_convert(parseFloat(time)):'DNF'
  }
}

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
</style>
