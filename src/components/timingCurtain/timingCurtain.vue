<template>
  <teleport to="body">
    <div class="timing-curtain" v-if="is_timing || is_inspection || is_finished" @click="stimulate_space">
      <div class="timing-curtain__content">
        <div class="inspection" v-if="is_inspection">{{inspecting_time<0?(inspecting_time<-2?'DNF':'+2'):inspecting_time.toFixed(0)}}</div>
        <div class="timing" v-if="is_timing">{{time_convert(parseFloat(time.toFixed(3)))}}</div>
        <div class="determine" v-if="is_finished">{{inspecting_time<-2?'DNF':`${time_convert(parseFloat(time.toFixed(3)))}${inspecting_time<0?'+':''}`}}</div>
        <el-radio-group v-model="timing_type" @change="determine_timing_type" v-if="is_finished">
          <el-radio-button label="1">无惩罚</el-radio-button>
          <el-radio-button label="2">+2</el-radio-button>
          <el-radio-button label="3">DNF</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {time_convert} from "@/utils";

const is_inspection = ref(false)
const is_timing = ref(false)
const inspecting_time = ref(0)
const is_finished = ref(false)
const time = ref(0)
const time_stamp = ref((new Date()).getTime())
const timing_type = ref('')  // 1 for no punishment, 2 for 2 seconds, 3 for DNF

document.addEventListener('keydown', (e) => {
  keyDown(e)
})

const keyDown = (key) => {

  if (key.code === 'Space') {
    // if user press space, and we are not at any state, start inspection
    if (!is_inspection.value && !is_timing.value && !is_finished.value) {
      is_inspection.value = true
      inspecting_time.value = 15
      const inspection_timer = setInterval(() => {
        inspecting_time.value -= 0.02
        // clear inspection timer
        if (!is_inspection.value) {
          is_inspection.value = false
          is_timing.value = true
          clearInterval(inspection_timer)
        }
      }, 20)
      return
    }

    else if (is_inspection.value) {
      // if user press space, and we are at inspection, start timing and stop inspection
      is_inspection.value = false
      is_timing.value = true
      time.value = 0
      time_stamp.value = (new Date()).getTime()
      const timing_timer = setInterval(() => {
        time.value += 0.017  // 17ms 是浏览器的最高刷新频率
        // clear timing timer
        if (!is_timing.value) {
          clearInterval(timing_timer)
          // determine punishment caused by inspection time exceeding 15 seconds
          if (inspecting_time.value < 0) {
            time.value += 2  // 2 seconds
          }
          is_timing.value = false
        }
      }, 17)
      return
    }
  }

  // if user press any key, and we are at timing, stop timing
  if (is_timing.value) {
    is_timing.value = false
    is_finished.value = true
    // time value is the time stamp of the last key down event, to seconds
    time.value = ((new Date()).getTime() - time_stamp.value) / 1000
    return
  }

}

const determine_timing_type = () => {
  if (inspecting_time.value < -2) {
    // exit with DNF
    emits("timing-over", 0)
    return
  }
  if (timing_type.value === '1') {
    emits('timing-over', time.value)
  } else if (timing_type.value === '2') {
    emits('timing-over', time.value + 2)
  } else if (timing_type.value === '3') {
    emits('timing-over', 0)
  }

  is_finished.value = false
}

const emits = defineEmits<{
  (e: 'timing-over', time: number): void
}>()
const props = defineProps<{
  state: number
}>()

// check if device is mobile
const is_mobile = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})
const stimulate_space = () => {
  if (!is_mobile.value) return
  // stimulate a space key down event
  keyDown({code: 'Space'})
}
// state change means user clicked the scramble panel, so start inspection
watch(() => props.state, stimulate_space)

</script>

<style scoped>
.timing-curtain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: wheat;
  z-index: 999;
}

.timing-curtain__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  font-weight: bold;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.el-radio-button__inner) {
  color: #333;
}

.inspection {
  color: red;
}
</style>
