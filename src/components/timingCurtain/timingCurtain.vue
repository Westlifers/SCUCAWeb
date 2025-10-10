<template>
  <teleport to="body">
    <div class="timing-curtain" v-if="is_timing || is_inspection || is_finished">
      <div class="timing-curtain__content">
        <div class="inspection" :style="{color: is_pre_timing?'green':'red'}" v-if="is_inspection">{{inspecting_time<0?(inspecting_time<-2?'DNF':'+2'):inspecting_time.toFixed(0)}}</div>
        <div class="timing" v-if="is_timing">{{ convert_time_num2str(parseFloat(time.toFixed(3))) }}</div>
        <div class="determine" v-if="is_finished">{{ inspecting_time < -2 ? 'DNF' : `${convert_time_num2str(parseFloat(time.toFixed(3)))}${inspecting_time < 0 ? '+' : ''}` }}</div>
        <div class="determine_timing_type" v-if="is_finished">
          <el-radio-group v-model="timing_type" @change="determine_timing_type">
            <el-radio-button label="1">无惩罚</el-radio-button>
            <el-radio-button label="2">+2</el-radio-button>
            <el-radio-button label="3">DNF</el-radio-button>
          </el-radio-group>
          <p class="space_tip" v-if="!isMobile">无惩罚可按空格跳过选择；观察惩罚已自动记入</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {convert_time_num2str} from "@/utils";
import {isMobile} from "@/utils/constants";

const is_inspection = ref(false)  // 按下空格，观察中
const is_pre_timing = ref(false)  // 按下空格，等待延迟启动
const is_timing = ref(false)  // 松开空格，计时中
const inspecting_time = ref(0)
const is_finished = ref(false)  // 计时结束
const time = ref(0)
const time_stamp = ref((new Date()).getTime())
const timing_type = ref('')  // 1 for no punishment, 2 for 2 seconds, 3 for DNF

// 按ESC则重置计时
document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    is_inspection.value = false
    is_pre_timing.value = false
    is_timing.value = false
    is_finished.value = false
    inspecting_time.value = 0
    time.value = 0
    timing_type.value = ''
    // sleep a while to prevent the timeInterval in keyDown to change is_timing.value to true
    setTimeout(() => {
      is_timing.value = false
    }, 20)
  }
  else {
    keyDown(e)
  }
})
document.addEventListener('touchstart', (e) => {
  // 等价于按下1(不是空格，因为在没有开始观察时点击屏幕触发空格是愚蠢的)
  if (!is_inspection.value && !is_timing.value) return
  keyDown({code: 'Space'})
})
document.addEventListener('keyup', (e) => {
  if (e.code === 'Escape') {
    return
  }
  keyUp(e)
})
document.addEventListener('touchend', (e) => {
  if (!is_inspection.value && !is_timing.value) return
  keyUp({code: 'Space'})
})

const keyUp = (key) => {
  if (is_pre_timing.value && key.code === 'Space') {
    // if user press space, and we are at inspection, start timing and stop inspection
    is_inspection.value = false
    is_pre_timing.value = false
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

  // if user press any key, and we are at timing, stop timing
  if (is_timing.value) {
    // if time is less than 0.2, we consider it as a mistake and ignore it
    const t = ((new Date()).getTime() - time_stamp.value) / 1000
    if (t <= 0.2) {
      console.log('mistake')
      return
    }
    // 睡一会，免得连续点击到按钮，不知道为什么松开后会点到按钮
    setTimeout(() => {
      is_timing.value = false
      is_finished.value = true
    }, 10)
    // time value is the time stamp of the last key down event, to seconds
    time.value = t
    return
  }
}

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
      is_pre_timing.value = true
    }

    else if (is_finished.value) {
      // 新增空格无惩罚，下面的代码是抄的determine_timing_type，所以有重复
      let punishment = 0
      if (inspecting_time.value < -2) {
        // exit with DNF
        emits("timing-over", {time: time.value, punishment: -1})
        return
      } else if (inspecting_time.value < 0) {
        punishment += 2
      }

      emits('timing-over', {time: time.value, punishment: punishment})

      is_finished.value = false
      timing_type.value = ''  // 清除选择，防止下次计时时有焦点
      return;
    }
  }

}

const determine_timing_type = () => {
  let punishment = 0
  if (inspecting_time.value < -2) {
    // exit with DNF
    emits("timing-over", {time: time.value, punishment: -1})
    return
  } else if (inspecting_time.value < 0) {
    punishment += 2
  }

  if (timing_type.value === '1') {
    emits('timing-over', {time: time.value, punishment: punishment})
  } else if (timing_type.value === '2') {
    emits('timing-over', {time: time.value + 2, punishment: punishment + 2})
  } else if (timing_type.value === '3') {
    emits('timing-over', {time: time.value, punishment: -1})
  }

  is_finished.value = false
  timing_type.value = ''  // 清除选择，防止下次计时时有焦点
  return;
}

const emits = defineEmits<{
  (e: 'timing-over', time: object): void
}>()
const props = defineProps<{
  state: number
}>()


const stimulate_space = () => {
  if (!isMobile) return
  // stimulate a space key down event
  keyDown({code: 'Space'});
  keyUp({code: 'Space'})
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
  /* 毛玻璃背景 - 可以看到原页面 */
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  z-index: 999;
  /* 添加柔和的渐变叠加 */
  background-image: 
    radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
}

.timing-curtain__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  font-weight: 800;
  color: rgba(100, 116, 139, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 观察时间样式 */
.inspection {
  animation: fadeInScale 0.3s ease-out;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  position: relative;
}

/* 根据状态改变颜色 - 柔和版本 */
.inspection[style*="green"] {
  color: rgba(34, 197, 94, 0.9);
  text-shadow: 0 4px 16px rgba(34, 197, 94, 0.2);
}

.inspection[style*="red"] {
  color: rgba(239, 68, 68, 0.9);
  text-shadow: 0 4px 16px rgba(239, 68, 68, 0.2);
}

/* 计时样式 - 移除跳动，保留渐入 */
.timing {
  animation: fadeInScale 0.3s ease-out;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  color: rgba(59, 130, 246, 0.95);
  text-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

/* 完成状态样式 - 移除跳动，保留渐入 */
.determine {
  animation: fadeInScale 0.4s ease-out;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  color: rgba(168, 85, 247, 0.95);
  text-shadow: 0 4px 16px rgba(168, 85, 247, 0.15);
}

/* 按钮组容器 */
.determine_timing_type {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  animation: slideUp 0.4s ease-out 0.2s both;
}

/* Element Plus 按钮样式覆盖 - 毛玻璃风格 */
:deep(.el-radio-group) {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
              0 1px 2px rgba(0, 0, 0, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

:deep(.el-radio-button__inner) {
  background: transparent;
  color: rgba(71, 85, 105, 0.9);
  border: none;
  font-size: 18px;
  font-weight: 600;
  padding: 12px 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.el-radio-button__inner:hover) {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(59, 130, 246, 0.95);
  transform: translateY(-1px);
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: rgba(255, 255, 255, 0.95);
  color: rgba(59, 130, 246, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15),
              0 2px 4px rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}

:deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 12px 0 0 12px;
}

:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 0 12px 12px 0;
}

/* 提示文字 - 毛玻璃风格 */
.space_tip {
  color: rgba(71, 85, 105, 0.85);
  font-size: 18px;
  margin-top: 24px;
  font-weight: 500;
  text-align: center;
  animation: fadeIn 0.6s ease-out 0.4s both;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* 动画定义 */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .timing-curtain__content {
    font-size: 72px;
  }
  
  :deep(.el-radio-button__inner) {
    font-size: 16px;
    padding: 10px 24px;
  }
  
  .space_tip {
    font-size: 14px;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  .timing-curtain__content {
    font-size: 56px;
  }
  
  :deep(.el-radio-button__inner) {
    font-size: 14px;
    padding: 8px 16px;
  }
  
  .space_tip {
    font-size: 12px;
    padding: 8px 16px;
  }
}
</style>
