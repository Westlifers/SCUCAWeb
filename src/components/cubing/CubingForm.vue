<template>
  <div v-if="isLoggedIn">
    <el-space direction="vertical" :size="50">
      <el-select v-model="event" class="m-2" placeholder="未参与项目" size="large">
        <el-option
            v-for="event in events_available"
            :key="event"
            :label="event"
            :value="event"
        />
      </el-select>
      <scramble-shower :scrambles_available="scrambles_available" :event="event" :comp-id="compData.compId" :is_normal="is_normal"></scramble-shower>
    </el-space>
  </div>
  <div v-else>请先<el-button v-if="!isLoggedIn" @click="go_page('login')" round>登陆</el-button></div>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";
import {store, UPDATE_USER_PARTICIPATION_DATA} from "@/store";
import {getComp} from "@/api/fetchData";
import {Scramble} from "@/types";
import ScrambleShower from "@/components/cubing/ScrambleShower.vue";
import {go_page} from "@/utils";

const isLoggedIn = computed(() => !(store.state.user.username === ''))

// 是否是周赛
const is_normal = computed(() => props.comp==='week')
// 异步获取当前比赛数据
const compData = is_normal.value?await getComp('week'):await getComp('special')
// 请求更新用户进度
store.commit(UPDATE_USER_PARTICIPATION_DATA)

// 获取用户进度
const userParticipationData = computed(() => store.state.userParticipation)
// 根据进度，计算相关的项目
const events_all = computed(() =>
    is_normal.value?
        userParticipationData.value.week.events_all:
        userParticipationData.value.special.events_all
)
const events_finished = computed(() =>
    is_normal.value?
        userParticipationData.value.week.events_finished:
        userParticipationData.value.special.events_finished
)
const events_available = computed(() => {
  const events_available: string[] = []
  for (let event of events_all.value) {
    if (!(events_finished.value.indexOf(event) > -1)) {
      events_available.push(event)
    }
  }
  return events_available
})

// 已选项目
const event = ref('')
// 未完成的打乱
const scrambles_available = computed(() => {
  const scramble_set: Scramble[] = []
  for (let scramble of compData.scramble_set) {
    if (events_available.value.indexOf(scramble.event) > -1) {
      scramble_set.push(scramble)
    }
  }
  return scramble_set
})

const props = defineProps<{
  comp: string
}>()
</script>

<style scoped>

</style>
