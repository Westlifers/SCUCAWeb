<script setup lang="ts">
import {computed} from "vue";

// min, max: number (0-1)
// width: number (px), 0 for full width
const props = defineProps<{
  min: number
  max: number
  showText?: boolean
  leftText?: string
  rightText?: string
}>()

const width = 300
const innerWidthRatio = computed(() => props.max - props.min)
// 注意！TranslateX的值是相对于元素自身的宽度的，所以要除以innerWidthRatio
const offsetLeftRatio = computed(() => props.min / innerWidthRatio.value)
</script>

<template>
<div class="progress-wrapper">
  <div class="progress-bar-left-text" v-if="showText">
    <span>{{leftText}}</span>
  </div>
  <div class="progress-bar" :style="{width: width ? width + 'px' : '100%'}">
    <div class="progress-bar-inner"
         :style="{
          width: innerWidthRatio * 100 + '%',
          transform: `translateX(${offsetLeftRatio * 100}%)`
       }"
    />
  </div>
  <div class="progress-bar-right-text" v-if="showText">
    <span>{{rightText}}</span>
  </div>
</div>
</template>

<style scoped>
.progress-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.progress-bar {
  height: 5px;
  background-color: var(--el-border-color-lighter);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background-color: #409eff;
  border-radius: 5px;
}

.progress-bar-left-text, .progress-bar-right-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #606266;
  width: 50px;
}

.progress-bar-left-text {
  justify-content: flex-start;
}

.progress-bar-right-text {
  justify-content: flex-end;
}

</style>
