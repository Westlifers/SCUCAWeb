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

      <el-button @click="updateScramble">Update Scramble</el-button>
    </div>

    <p>
      {{scramble}}
    </p>

  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {ALL_EVENTS} from "@/utils";

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

.select-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.practice-header-container p {
  font-size: 18px;
  margin: 10px 10px 10px 10px;
}

:deep(.el-input__wrapper) {
  max-width: 140px;
}
</style>
