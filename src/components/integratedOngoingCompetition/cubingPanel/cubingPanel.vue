<template>
  <div class="cubing" tabindex="-1">

    <div class="cubing-header">
      <div class="header-content">
        <div class="header-icon">
          <el-icon :size="28"><Timer /></el-icon>
        </div>
        <div class="header-text">
          <h2>参加比赛</h2>
          <p class="subtitle" v-if="events_available.indexOf(activeEvent) > -1">第 {{count}} / {{maxScrambleCount}} 次</p>
          <p class="subtitle" v-else>已完成</p>
        </div>
      </div>
      <div class="selector" v-if="events_available.indexOf(activeEvent) > -1">
        <el-button-group class="scramble-nav">
          <el-button :icon="ArrowLeft" size="small" :disabled="count <= 1" @click="count--" type="primary"/>
          <span class="count-display">{{count}}</span>
          <el-button :icon="ArrowRight" size="small" :disabled="count >= maxScrambleCount" @click="count++" type="primary"/>
        </el-button-group>
      </div>
    </div>


    <div class="scramble-container" v-if="events_available.indexOf(activeEvent) > -1">
      <el-card shadow="hover" class="scramble-card">

        <template #header>
          <div class="card-header-content">
            <div class="event-badge">
              <el-icon :size="20"><Grid /></el-icon>
              <span>{{props.activeEvent}}</span>
            </div>
            <el-button-group class="view-controls">
              <el-switch v-model="imgVisible" active-text="显示" inactive-text="隐藏" inline-prompt size="small" />
              <el-switch v-model="is3d" active-text="3D" inactive-text="2D" inline-prompt size="small" style="margin-left: 8px" />
            </el-button-group>
          </div>
        </template>

        <div class="scramble-content" @click="curtain_state++">
          <div class="scramble-text">
            {{scrambleOfEvent[count - 1]}}
          </div>
          <!--     ignore the following warning, it's inevitable     -->
          <twisty-player
              v-if="imgVisible"
              :puzzle="translateEvent(activeEvent)"
              :alg="scrambleOfEvent[count - 1]"
              :visualization="is3d? '3D' : '2D'"
              class="twisty-animation"
          />
        </div>

        <div class="scramble-footer">
          <div class="progress-header">
            <span class="progress-label">当前进度</span>
            <span class="progress-hint" v-if="!isMobile">按空格开始观察</span>
            <span class="progress-hint" v-else>点击打乱公式开始观察</span>
          </div>
          <el-progress 
            :percentage="count/maxScrambleCount*100" 
            :show-text="false" 
            :status="count===maxScrambleCount?'success':'exception'"
            :stroke-width="8"
            class="progress-bar"
          />
          <div class="progress-count">{{`${count} / ${maxScrambleCount}`}}</div>
        </div>

      </el-card>
    </div>

    <div class="scramble-submit" v-if="events_available.indexOf(activeEvent) > -1">
      <el-form
          ref="formRef"
          :model="state.resultForm"
          label-width="auto"
          size="large"
          :rules="state.resultRules"
          class="result-form"
      >
        <el-form-item label="第一次" prop="time_1" v-if="count===1" class="result-form-item">
          <el-input
              v-model="state.resultForm.time_1"
              placeholder="已记录"
              disabled
          />
        </el-form-item>

        <el-form-item label="第二次" prop="time_2" v-if="count===2" class="result-form-item">
          <el-input
              v-model="state.resultForm.time_2"
              placeholder="已记录"
              disabled
          />
        </el-form-item>

        <el-form-item label="第三次" prop="time_3" v-if="count===3" class="result-form-item">
          <el-input
              v-model="state.resultForm.time_3"
              placeholder="已记录"
              disabled
          />
        </el-form-item>

        <el-form-item label="第四次" prop="time_4" v-if="count===4" class="result-form-item">
          <el-input
              v-model="state.resultForm.time_4"
              placeholder="已记录"
              disabled
          />
        </el-form-item>

        <el-form-item label="第五次" prop="time_5" v-if="count===5" class="result-form-item">
          <el-input
              v-model="state.resultForm.time_5"
              placeholder="已记录"
              disabled
          />
        </el-form-item>

        <el-form-item class="submit-button-item">
          <el-button type="primary" @click="openDialog" size="large" v-if="count===maxScrambleCount" class="submit-button">
            <el-icon style="margin-right: 8px"><Check /></el-icon>
            提交成绩
          </el-button>
          <el-dialog v-model="dialogVisible" width="400px" class="result-dialog" :show-close="false">
            <template #header>
              <div class="dialog-header">
                <el-icon :size="32" color="var(--yougi-primary)"><CircleCheck /></el-icon>
                <span>确认成绩</span>
              </div>
            </template>
            <div class="dialog-content">
              <p class="dialog-intro">本次成绩如下：</p>
              <div class="result-list">
                <div class="result-item">
                  <span class="result-label">第一次：</span>
                  <span class="result-value">{{state.resultForm.time_1}}</span>
                </div>
                <div class="result-item">
                  <span class="result-label">第二次：</span>
                  <span class="result-value">{{state.resultForm.time_2}}</span>
                </div>
                <div class="result-item">
                  <span class="result-label">第三次：</span>
                  <span class="result-value">{{state.resultForm.time_3}}</span>
                </div>
                <div class="result-item" v-if="maxScrambleCount===5">
                  <span class="result-label">第四次：</span>
                  <span class="result-value">{{state.resultForm.time_4}}</span>
                </div>
                <div class="result-item" v-if="maxScrambleCount===5">
                  <span class="result-label">第五次：</span>
                  <span class="result-value">{{state.resultForm.time_5}}</span>
                </div>
              </div>
              <p class="dialog-hint">请检查成绩输入是否正确</p>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="dialogVisible = false" size="large">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false;handleSubmit(formRef)" size="large">
                  <el-icon style="margin-right: 6px"><Check /></el-icon>
                  确认提交
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-form-item>
      </el-form>
    </div>

    <div class="finished" v-else>
      <div class="finished-top">
        <div class="finished-header account-profile">
          <img :src="store.user.avatar" alt="" >
          <div class="blob-wrap">
            <div class="blob"></div>
            <div class="blob"></div>
            <div class="blob"></div>
          </div>
        </div>
        <div class="finished-badge">
          <el-icon :size="48"><CircleCheck /></el-icon>
        </div>
      </div>
      <div class="finished-content">
        <p class="finished-title">你已经完成了此项目</p>
        <p class="finished-subtitle">查看你的打乱历史</p>
        <div class="scramble-review">
          <div class="control">
            <el-button-group>
              <el-button type="primary" :icon="ArrowLeft" @click="count--" :disabled="count===1" size="large"></el-button>
              <span class="review-count">{{count}} / {{maxScrambleCount}}</span>
              <el-button type="primary" :icon="ArrowRight" @click="count++" :disabled="count===maxScrambleCount" size="large"></el-button>
            </el-button-group>
          </div>
          <div class="scramble-box">
            <p class="scramble-title">{{`第 ${count} 次打乱`}}</p>
            <p class="scramble-formula">{{scrambleOfEvent[count - 1]}}</p>
          </div>
        </div>
      </div>
    </div>


    <timing-curtain
        @timing-over="set_time"
        :state="curtain_state"
        v-if="events_available.indexOf(activeEvent) > -1 && state.resultForm[`time_${count}`] === ''"
    />


  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {getComp, getCompCachedResult} from "@/api/fetchData";
import {localStore} from "@/store";
import type {apiUsedEventName, CachedResult} from "@/types";
import {convert_time_num2str, convert_time_str2num, translateEvent} from "@/utils";
import type {FormInstance} from "element-plus";
import {ElMessage, ElNotification} from "element-plus";
import {postResult, postTempResult} from "@/api/service";
import TwistyPlayer from "@/components/cubingjs/twistyPlayer.vue";
import TimingCurtain from "@/components/timingCurtain/timingCurtain.vue";
import {isMobile, SPECIAL_EVENTS} from "@/utils/constants";
import { Timer, ArrowLeft, ArrowRight, Grid, Check, CircleCheck } from '@element-plus/icons-vue'

const curtain_state = ref(1)
const store = localStore()
const set_time = async (time_) => {
  let time = time_.punishment === -1?0:time_.time

  if (time === 0) {
    state.resultForm[`time_${count.value}`] = 'DNF'
  }
  else {
    state.resultForm[`time_${count.value}`] = convert_time_num2str(convert_time_str2num(time.toFixed(3))).replace(/\s*/g,"")
  }

  // 将成绩缓存到服务器
  await postTempResult({
    wos: props.comp,
    event: props.activeEvent,
    order: count.value,
    result: time,
  })

  // 自动进入下一个打乱
  if (count.value < maxScrambleCount.value) {
    count.value += 1
  }

}

const props = defineProps<{
    comp: string
    activeEvent: apiUsedEventName
}>()

const cachedResult = await getCompCachedResult(props.comp)



// 下面是直接复制以前的代码，所以有些变量名可能不太合适，并且可能很混乱。但是这个组件的功能是可以正常使用的。
const count = ref(1)
const dialogVisible = ref(false)
const imgVisible = ref(false)
const is3d = ref(false)

// 是否是周赛
const is_normal = computed(() => props.comp==='week')
// 异步获取当前比赛数据
const preCompData = is_normal.value?await getComp('week'):await getComp('special')
const compData = preCompData.is_record?undefined:preCompData  // 如果是手动录入成绩的比赛，假装没看到
// 请求更新用户进度
store.updateUserParticipationData()

// 获取用户进度
const userParticipationData = computed(() => store.userParticipation)
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

// 打乱数
const maxScrambleCount = computed(() => {
  if (SPECIAL_EVENTS.indexOf(props.activeEvent) > -1) {
    return 3
  } else {
    return 5
  }
})

// 切换项目时清除表单
const clearForm = () => {
  let cacheOfThisEvent: CachedResult = {
    event: props.activeEvent,
    time_1: -1, time_2: -1, time_3: -1, time_4: -1, time_5: -1
  }
  // 遍历寻找是否有对应的缓存，否则取以上的默认值
  for (const cache of cachedResult) {
    if (cache.event == props.activeEvent) cacheOfThisEvent = cache
  }
  // 计算现在应该到哪一把了
  for (let i = 1; i <= 5; i++) {
    if (cacheOfThisEvent[`time_${i}`] === -1) {
      count.value = i
      // 但是注意不能超出最大轮数，这会发生在用户已经完成但忘了提交后重新加载时
      if (count.value > maxScrambleCount.value) count.value = maxScrambleCount.value
      break
    }
    // 如果没有找到，那就是已经完成，count就是最大轮数
    if (i === maxScrambleCount.value) count.value = maxScrambleCount.value
  }
  // 把缓存成绩填进去
  for (let i = 1; i <= 5; i++) {
    if (cacheOfThisEvent[`time_${i}`] === -1) {
      state.resultForm[`time_${i}`] = ''
    }
    else {
      state.resultForm[`time_${i}`] = cacheOfThisEvent[`time_${i}`]==0?'DNF':convert_time_num2str(cacheOfThisEvent[`time_${i}`]).replace(/\s*/g,"")
    }
  }
}

watch(() => props.activeEvent, () => {
  clearForm()
})

// 初始时也要清除表单
onMounted(() => {
  clearForm()
})

// 是否是特殊项目
const is_special = computed(() => maxScrambleCount.value === 3)
const scrambleOfEvent = computed(() => {
  if (!compData) return []
  for (let scramble of compData.scramble_set) {
    if (scramble.event === props.activeEvent) {
      return [scramble.scramble_1, scramble.scramble_2, scramble.scramble_3, scramble.scramble_4, scramble.scramble_5]
    }
  }
  return []  // will never work
})




// form part
const formRef = ref<FormInstance>()
const compId = computed(() => compData?.compId || 0)

// eslint-disable-next-line @typescript-eslint/ban-types
const resultValidator = (rule: any, value: string, callback: Function) => {
  if (value == 'DNF' || value == 'dnf' || value == 'd') {
    callback()
  } else {
    const pattern = /^\s*\d+(\.\d+)?(:\d+(\.\d+)?)?\s*$/
    if (pattern.test(value)) {
      callback()
    }
    else {
      callback(new Error('成绩格式错误'))
    }
  }
}

const state = reactive({
  resultForm: {
    time_1: '',
    time_2: '',
    time_3: '',
    time_4: '',
    time_5: '',
  },
  resultRules: {
    time_1: [{
      required: true,
      trigger: "blur",
      validator: resultValidator
    }],
    time_2: [{
      required: true,
      trigger: "blur",
      validator: resultValidator
    }],
    time_3: [{
      required: true,
      trigger: "blur",
      validator: resultValidator
    }],
    time_4: [{
      required: !is_special.value,
      trigger: "blur",
      validator: resultValidator
    }],
    time_5: [{
      required: !is_special.value,
      trigger: "blur",
      validator: resultValidator
    }],
  }
})

// watch count, every time it increases, validate the form, if not valid, decrease count
watch([count], (value, oldValue) => {
  if (value > oldValue) {
    formRef.value?.validate((valid) => {
      if (!valid) {
        count.value--
        ElMessage({
          message: '请检查成绩格式！',
          type: 'error',
          duration: 2000
        })
      }
    })
  }
})
// check if the form is valid before open the dialog
const openDialog = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      dialogVisible.value = true
    } else {
      ElMessage({
        message: '请检查成绩格式！',
        type: 'error',
        duration: 2000
      })
    }
  })
}

const handleSubmit =  (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      const req = {
        competition: compId.value,
        event: props.activeEvent,
        time_1: convert_time_str2num(state.resultForm.time_1),
        time_2: convert_time_str2num(state.resultForm.time_2),
        time_3: convert_time_str2num(state.resultForm.time_3),
        time_4: convert_time_str2num(state.resultForm.time_4),
        time_5: convert_time_str2num(state.resultForm.time_5),
      }
      try {
        await postResult(req)
        ElNotification({
          title: '成功',
          message: '提交成功！',
          type: 'success',
        })
        store.updateUserParticipationData()
        window.location.reload()
      }
      catch (e) {
        ElNotification({
          title: '失败',
          message: '提交成绩失败！',
          type: 'error',
        })
      }
    }
  })
}

</script>

<style scoped>
.cubing {
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 32px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: calc(100vh - 120px);
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--yougi-border);
  position: relative;
  animation: fadeInRight 0.6s ease-out;
}

.cubing::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--yougi-accent), var(--yougi-primary), var(--yougi-accent));
  background-size: 200% 100%;
  animation: gradientSlide 3s ease infinite;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes gradientSlide {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
}

/* Header Styles */
.cubing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--yougi-accent), var(--yougi-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-md);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.header-text h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--yougi-accent), var(--yougi-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.header-text .subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--yougi-text-secondary);
  font-weight: 500;
}

.scramble-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.count-display {
  min-width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: var(--yougi-primary);
  padding: 0 8px;
}

.scramble-nav :deep(.el-button) {
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.scramble-nav :deep(.el-button:hover:not(:disabled)) {
  transform: scale(1.1);
}

/* Card Styles */
.scramble-container {
  margin-bottom: 24px;
}

.scramble-card {
  border-radius: var(--radius-xl) !important;
  border: 2px solid var(--yougi-border);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
  overflow: hidden;
  transition: all 0.3s ease;
}

.scramble-card:hover {
  border-color: var(--yougi-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.event-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 16px;
  box-shadow: var(--shadow-sm);
}

.view-controls {
  display: flex;
  gap: 8px;
}

:deep(.el-card__header) {
  background: var(--yougi-bg-secondary);
  border-bottom: 2px solid var(--yougi-border);
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 24px;
}

/* Scramble Content */
.scramble-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scramble-content:hover {
  transform: scale(1.02);
}

.scramble-text {
  font-size: 15px;
  line-height: 1.8;
  color: var(--yougi-text);
  text-align: center;
  padding: 16px;
  background: var(--yougi-card-bg);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--yougi-border);
  width: 100%;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  word-break: break-word;
}

.twisty-animation {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Progress Footer */
.scramble-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--yougi-text);
}

.progress-hint {
  font-size: 12px;
  color: var(--yougi-text-secondary);
  font-style: italic;
}

.progress-bar {
  margin: 4px 0;
}

.progress-bar :deep(.el-progress-bar__outer) {
  background-color: var(--yougi-bg-secondary) !important;
  border-radius: var(--radius-md);
}

.progress-bar :deep(.el-progress-bar__inner) {
  border-radius: var(--radius-md);
  background: linear-gradient(90deg, var(--yougi-primary), var(--yougi-accent));
  transition: all 0.3s ease;
}

.progress-count {
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--yougi-primary);
}

/* Form Styles */
.scramble-submit {
  margin-bottom: 24px;
}

.result-form {
  background: var(--yougi-bg-secondary);
  padding: 20px;
  border-radius: var(--radius-xl);
  border: 2px solid var(--yougi-border);
}

.result-form-item :deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--yougi-text);
}

.result-form-item :deep(.el-input__wrapper) {
  background: var(--yougi-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.submit-button-item {
  margin-bottom: 0;
}

.submit-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  border: none;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.submit-button:active {
  transform: translateY(0);
}

/* Dialog Styles */
.result-dialog {
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

.result-dialog :deep(.el-dialog__header) {
  padding: 24px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  border-bottom: 2px solid var(--yougi-border);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: var(--yougi-text);
}

.dialog-content {
  padding: 0 24px;
}

.dialog-intro {
  font-size: 15px;
  font-weight: 600;
  color: var(--yougi-text);
  margin-bottom: 16px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--yougi-border);
}

.result-label {
  font-size: 14px;
  color: var(--yougi-text-secondary);
  font-weight: 500;
}

.result-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--yougi-primary);
  font-family: 'Courier New', monospace;
}

.dialog-hint {
  font-size: 13px;
  color: var(--yougi-text-secondary);
  text-align: center;
  font-style: italic;
  margin: 0;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 0 24px 24px;
}

.dialog-footer .el-button {
  min-width: 100px;
  border-radius: var(--radius-lg);
}

/* Finished State */
.finished {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  animation: fadeIn 0.5s ease-out;
}

.finished-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.finished-header {
  margin-bottom: 24px;
}

.finished-badge {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-xl);
  animation: pulse 2s ease-in-out infinite;
  position: absolute;
  left: 150%;
  z-index: 1;
}

.finished-content {
  width: 100%;
}

.finished-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--yougi-text);
  margin: 0 0 8px 0;
  text-align: center;
}

.finished-subtitle {
  font-size: 14px;
  color: var(--yougi-text-secondary);
  margin: 0 0 32px 0;
  text-align: center;
}

.scramble-review {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control {
  display: flex;
  justify-content: center;
  align-items: center;
}

.control .el-button-group {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
  padding: 4px;
  box-shadow: var(--shadow-sm);
}

.review-count {
  min-width: 80px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: var(--yougi-primary);
  padding: 0 16px;
}

.scramble-box {
  background: var(--yougi-bg-secondary);
  padding: 24px;
  border-radius: var(--radius-xl);
  border: 2px solid var(--yougi-border);
}

.scramble-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--yougi-text);
  margin: 0 0 12px 0;
  text-align: center;
}

.scramble-formula {
  font-size: 14px;
  line-height: 1.8;
  color: var(--yougi-text-secondary);
  text-align: center;
  font-family: 'Courier New', monospace;
  word-break: break-word;
  margin: 0;
}

.el-card {
  border-radius: 30px !important;
}

/* Account Profile Animation */
.account-profile {
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.account-profile img {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  padding: 5px;
  flex-shrink: 0;
}
.account-profile .blob {
  position: absolute;
  border-radius: 50%;
  -webkit-animation: fly 5.8s linear infinite alternate;
          animation: fly 5.8s linear infinite alternate;
}
.account-profile .blob:nth-child(1) {
  width: 14px;
  height: 14px;
  top: 25px;
  left: -20px;
  background: #28327a;
  -webkit-animation-delay: 0.9s;
          animation-delay: 0.9s;
}
.account-profile .blob:nth-child(2) {
  width: 18px;
  height: 18px;
  background: #87344c;
  right: -20px;
  top: -20px;
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
}
.account-profile .blob:nth-child(3) {
  width: 12px;
  height: 12px;
  background: #13645b;
  right: -35px;
  top: 50%;
  -webkit-animation-delay: 1.8s;
          animation-delay: 1.8s;
}
@-webkit-keyframes fly {
  40% {
    transform: translate(-6px, -6px);
  }
  60% {
    transform: translate(-12px, -2px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes fly {
  40% {
    transform: translate(-6px, -6px);
  }
  60% {
    transform: translate(-12px, -2px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

:deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
