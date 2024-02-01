<template>
  <div class="practice-header-container">
    <div class="select-bar">

      <el-select v-model="event" @change="setEvent(event)">
        <el-option
            v-for="item in ALL_EVENTS"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>

      <!--   DO NOT use button in case that it keeps focus and pressing space makes it refresh   -->
      <div class="stimulate-button" @click="updateScramble"><el-icon><Refresh /></el-icon></div>
    </div>

    <p>
      {{scramble}}
    </p>

  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";

import {ALL_EVENTS} from "@/utils/constants";

const emits = defineEmits<{
  (event: 'setEvent', e: string): void
  (event: 'setScramble', s: string): void
  (event: 'updateScramble'): void
}>()
const props = defineProps<{
  event: string
  scramble: string
}>()

const event = ref(props.event)
const scramble = ref(props.scramble)

const updateScramble = () => {
  emits('updateScramble')
}
const setEvent = (e) => {
  emits('setEvent', e)
  emits('updateScramble')
}

watch(() => props.event, (e) => {
  event.value = e
  emits('setEvent', e)
})
watch(() => props.scramble, (s) => {
  scramble.value = s
  emits('setScramble', s)
})
</script>

<style scoped>
.practice-header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stimulate-button {
  width: 50px;
  height: 30px;
  background-color: #409EFF;
  color: white;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.select-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.practice-header-container p {
  font-size: 18px;
  font-weight: 500;
  opacity: 1;
  margin: 10px 10px 10px 10px;
}

:deep(.el-input__wrapper) {
  max-width: 140px;
}
</style>
