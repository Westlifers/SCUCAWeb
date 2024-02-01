<template>
  <el-space direction="vertical" :size="100">
    <el-space :direction="direction">
      <el-space>
        <el-button type="primary" icon="ArrowLeft" @click="subIndex" v-if="index > 1" />
        <el-button type="primary" icon="ArrowLeft" @click="subIndex" v-if="index === 1" disabled />
        <el-progress type="dashboard" :percentage="percentage * 100">
          <template #default>
            <span class="percentage-value">{{ index }} / {{ maxScrambleCount }}</span>
            <span class="percentage-label">Progressing</span>
          </template>
        </el-progress>
        <el-button type="primary" icon="ArrowRight" @click="addIndex" v-if="index < maxScrambleCount" />
        <el-button type="primary" icon="ArrowRight" @click="addIndex" v-if="index === maxScrambleCount" disabled />
      </el-space>
      <el-card shadow="hover" class="scramble-card">{{scrambleOfEvent[index - 1]}}</el-card>
    </el-space>
    <submit-form :event="event" :comp-id="compId" :is_normal="is_normal"/>
  </el-space>
</template>

<script lang="ts" setup>

import type {Scramble} from "@/types";
import {computed, ref, watch} from "vue";
import SubmitForm from "@/components/cubing/form/SubmitForm.vue";
import {isMobile, SPECIAL_EVENTS} from "@/utils/constants";

const maxScrambleCount = computed(() => {
  if (SPECIAL_EVENTS.indexOf(props.event) > -1) {
    return 3
  } else {
    return 5
  }
})

const index = ref(1)
const percentage = computed(() => index.value/maxScrambleCount.value)
const subIndex = () => {
  if (index.value > 1) index.value -= 1
}
const addIndex = () => {
  if (index.value < maxScrambleCount.value) index.value += 1
}
const scrambleOfEvent = computed(() => {
  for (let scramble of props.scrambles_available) {
    if (scramble.event === props.event) {
      return [scramble.scramble_1, scramble.scramble_2, scramble.scramble_3, scramble.scramble_4, scramble.scramble_5]
    }
  }
  return []  // will never work
})

const props = defineProps<{
  scrambles_available: Scramble[]
  event: string
  compId: string
  is_normal: boolean
}>()

// 重选项目时重置index，防止溢出
watch([maxScrambleCount], () => {index.value = 1})

const direction = computed(() => {
  return isMobile ? 'vertical' : 'horizontal'
})
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}

.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.scramble-card {
  width: 500px;
  line-height: 1.7
}

@media only screen and (max-width: 768px) {
  .scramble-card {
    width: 300px;
  }
}
</style>
