<template>
  <div class="cubing-mobile" tabindex="-1">

    <!-- 优化的头部区域 -->
    <div class="cubing-header-mobile">
      <div class="header-title">
        <div class="title-icon">
          <el-icon :size="24"><Grid /></el-icon>
        </div>
        <div class="title-text">
          <h3>周赛参赛</h3>
          <p class="subtitle">第 {{count}} / {{maxScrambleCount}} 次</p>
        </div>
      </div>
      <div class="header-actions">
        <el-button 
          circle
          @click="isDark = !isDark"
          class="theme-toggle"
          size="small"
        >
          <el-icon :size="18">
            <component :is="isDark ? Moon : Sunny" />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- 项目选择器 -->
    <div class="event-selector-bar">
      <el-button 
        circle
        :icon="ArrowLeft"
        @click="activeEvent = events_all[events_all.indexOf(activeEvent) - 1]"
        :disabled="events_all.indexOf(activeEvent)==0"
        size="small"
      />
      <el-select v-model="activeEvent" placeholder="项目" class="event-select">
        <el-option
            v-for="item in events_all"
            :key="item"
            :label="item"
            :value="item"
        >
          <span class="cubing-icon" :class="`event-${translateEventForScramble(item)}`"><span style="margin-left: 5px">{{item}}</span></span>
        </el-option>
      </el-select>
      <el-button 
        circle
        :icon="ArrowRight"
        @click="activeEvent = events_all[events_all.indexOf(activeEvent) + 1]"
        :disabled="events_all.indexOf(activeEvent)==events_all.length-1"
        size="small"
      />
    </div>

    <!-- 参赛界面 -->
    <div class="competition-area" v-if="events_available.indexOf(activeEvent) > -1">
      
      <!-- 打乱卡片 -->
      <el-card shadow="hover" class="scramble-card">
        <template #header>
          <div class="card-header">
            <div class="event-badge">
              <span class="cubing-icon" :class="`event-${translateEventForScramble(activeEvent)}`"></span>
              <span>{{activeEvent}}</span>
            </div>
            <el-switch v-model="is3d" active-text="3D" inactive-text="2D" />
          </div>
        </template>
        <div class="scramble-display">
          <p class="scramble-text">{{scrambleOfEvent[count - 1]}}</p>
        </div>
      </el-card>

      <!-- 开始计时按钮 -->
      <div class="start-timing">
        <el-button 
          type="primary" 
          size="large" 
          circle
          class="timing-btn"
          @click="curtain_state++"
        >
          <el-icon :size="32"><Timer /></el-icon>
        </el-button>
        <p class="hint">点击开始计时</p>
      </div>

      <!-- 计时结果显示 -->
      <div class="timing-result">
        <div class="current-time">
          {{count==1?'0.000':(state.resultForm[`time_${count}`]!=''?state.resultForm[`time_${count}`]:state.resultForm[`time_${count-1}`])}}
        </div>
        <el-button 
          v-if="count==maxScrambleCount&&state.resultForm[`time_${count}`]!=''"
          type="primary" 
          size="large" 
          round
          class="submit-btn"
          @click="dialogVisible=true"
        >
          <el-icon class="btn-icon"><Check /></el-icon>
          提交成绩
        </el-button>
      </div>

      <!-- 3D预览 -->
      <div class="preview-container">
        <twisty-player
            :alg="scrambleOfEvent[count - 1]"
            :visualization="is3d ? '3D' : '2D'"
            :puzzle="translateEvent(activeEvent)"
            width="100%"
            height="200"
        />
      </div>

      <!-- 成绩浮窗 -->
      <div class="result-floater">
        <el-popover placement="left-end" width="240" trigger="click">
          <template #reference>
            <el-button circle type="primary" size="large">
              <el-icon :size="20"><List /></el-icon>
            </el-button>
          </template>
          <template #default>
            <div class="results-overview">
              <h4>本次成绩</h4>
              <div class="result-item" v-for="(result, name, i) in state.resultForm" :key="name">
                <span v-if="i+1<=maxScrambleCount" :class="['result-label', i+1<=count?'completed':'pending']">
                  <el-icon v-if="i+1<count"><CircleCheck /></el-icon>
                  <el-icon v-else-if="i+1==count"><Timer /></el-icon>
                  <el-icon v-else><Clock /></el-icon>
                  第{{i+1}}次
                </span>
                <span v-if="i+1<=maxScrambleCount" :class="['result-value', i+1<=count?'completed':'pending']">
                  {{result || '--'}}
                </span>
              </div>
            </div>
          </template>
        </el-popover>
      </div>

    </div>

    <!-- 已完成界面 -->
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
              <span class="scramble-count">第 {{count}} 次</span>
              <el-button type="primary" :icon="ArrowRight" @click="count++" :disabled="count===maxScrambleCount" size="large"></el-button>
            </el-button-group>
          </div>
          <div class="scramble">
            <p class="scramble-label">打乱：</p>
            <p class="scramble-value">{{scrambleOfEvent[count - 1]}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 计时幕布 -->
    <timing-curtain
        @timing-over="set_time"
        :state="curtain_state"
        v-if="events_available.indexOf(activeEvent) > -1 && state.resultForm[`time_${count}`] === ''"
    />

    <!-- 提交确认对话框 -->
    <el-dialog title="确认提交" v-model="dialogVisible" width="80%" center align-center>
      <div class="dialog-content">
        <el-icon :size="64" color="#67C23A"><CircleCheck /></el-icon>
        <p>确认提交成绩？</p>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false" size="large">取消</el-button>
        <el-button type="primary" @click="handleSubmit" size="large">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import type {Ref} from "vue";
import {getComp, getCompCachedResult} from "@/api/fetchData";
import {localStore} from "@/store";
import type {apiUsedEventName, CachedResult} from "@/types";
import {
  convert_time_num2str,
  convert_time_str2num, translateEvent,
  translateEventForScramble
} from "@/utils";
import {ElNotification} from "element-plus";
import {postResult, postTempResult} from "@/api/service";
import TwistyPlayer from "@/components/cubingjs/twistyPlayer.vue";
import TimingCurtain from "@/components/timingCurtain/timingCurtain.vue";
import {SPECIAL_EVENTS} from "@/utils/constants";
import {
  ArrowLeft,
  ArrowRight,
  Grid,
  Timer,
  CircleCheck,
  Check,
  List,
  Clock,
  Moon,
  Sunny
} from '@element-plus/icons-vue';
import {useDark} from "@vueuse/core";

const isDark = useDark()
const curtain_state = ref(1)
const activeEvent: Ref<apiUsedEventName> = ref('333' as apiUsedEventName)
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
        wos: 'week',
        event: activeEvent.value,
        order: count.value,
        result: time,
    })

    // 自动进入下一个打乱
    if (count.value < maxScrambleCount.value) {
        count.value += 1
    }

}

const cachedResult = await getCompCachedResult('week')



// 下面是直接复制以前的代码，所以有些变量名可能不太合适，并且可能很混乱。但是这个组件的功能是可以正常使用的。
const count = ref(1)
const dialogVisible = ref(false)
const is3d = ref(false)

// 异步获取当前比赛数据
const compData = await getComp('week')
// 请求更新用户进度
store.updateUserParticipationData()

// 获取用户进度
const userParticipationData = computed(() => store.userParticipation)
// 根据进度，计算相关的项目
const events_all = computed(() =>
    userParticipationData.value.week.events_all as apiUsedEventName[]
)
const events_finished = computed(() =>
    userParticipationData.value.week.events_finished
)
const events_available = computed(() => {
    const events_available: apiUsedEventName[] = []
    for (let event of events_all.value) {
        if (!(events_finished.value.indexOf(event) > -1)) {
            events_available.push(event)
        }
    }
    return events_available
})

// 打乱数
const maxScrambleCount = computed(() => {
    if (SPECIAL_EVENTS.indexOf(activeEvent.value) > -1) {
        return 3
    } else {
        return 5
    }
})
// 切换项目时清除表单
const clearForm = () => {
  let cacheOfThisEvent: CachedResult = {
    event: activeEvent.value,
    time_1: -1, time_2: -1, time_3: -1, time_4: -1, time_5: -1
  }
  // 遍历寻找是否有对应的缓存，否则取以上的默认值
  for (const cache of cachedResult) {
    if (cache.event == activeEvent.value) cacheOfThisEvent = cache
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
watch(() => activeEvent.value, () => {
  clearForm()
})
// 初始时也要清除表单
onMounted(() => {
  clearForm()
})

// 是否是特殊项目
const is_special = computed(() => maxScrambleCount.value === 3)
const scrambleOfEvent = computed(() => {
    for (let scramble of compData.scramble_set) {
        if (scramble.event === activeEvent.value) {
            return [scramble.scramble_1, scramble.scramble_2, scramble.scramble_3, scramble.scramble_4, scramble.scramble_5]
        }
    }
    return []  // will never work
})




// form part
const compId = computed(() => compData.compId)

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


const handleSubmit =  async () => {
      const req = {
          competition: compId.value,
          event: activeEvent.value,
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
          await store.updateUserParticipationData()
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

</script>

<style scoped>
.cubing-mobile {
    background: var(--yougi-bg-primary);
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    /* 优先使用 dvh (动态视口高度)，不支持则回退到自定义变量，最后回退到 vh */
    height: calc(100dvh - 60px);
    height: calc(var(--viewport-height, 100vh) - 60px);
    transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
    /* 隐藏滚动条 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
}

.cubing-mobile::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

/* 头部样式 */
.cubing-header-mobile {
    background: var(--yougi-card-bg);
    border-radius: var(--radius-2xl);
    padding: 16px 20px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-md);
    border: 2px solid var(--yougi-border);
    animation: fadeIn 0.5s ease-out;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title {
    display: flex;
    align-items: center;
    flex: 1;
}

.title-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-right: 12px;
}

.title-text h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--yougi-text-primary);
    margin: 0;
}

.title-text .subtitle {
    font-size: 13px;
    color: var(--yougi-text-secondary);
    margin: 2px 0 0 0;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.theme-toggle {
    background: var(--yougi-bg-secondary) !important;
    border: 1px solid var(--yougi-border) !important;
    color: var(--yougi-text-primary) !important;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    background: var(--yougi-bg-tertiary) !important;
    transform: rotate(180deg);
}

/* 项目选择器栏 */
.event-selector-bar {
    background: var(--yougi-card-bg);
    border-radius: var(--radius-xl);
    padding: 12px 16px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
    border: 2px solid var(--yougi-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.event-select {
    flex: 1;
}

:deep(.el-input__wrapper) {
  background-color: var(--yougi-bg-secondary) !important;
  box-shadow: none !important;
  border: 1px solid var(--yougi-border);
}

/* 竞赛区域 */
.competition-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* 打乱卡片 */
.scramble-card {
    border-radius: var(--radius-xl) !important;
    border: 2px solid var(--yougi-border) !important;
    box-shadow: var(--shadow-md) !important;
    animation: fadeIn 0.5s ease-out 0.1s both;
}

:deep(.el-card__header) {
    background: linear-gradient(135deg, var(--yougi-bg-secondary), var(--yougi-bg-tertiary));
    border-bottom: 2px solid var(--yougi-border);
    padding: 16px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.event-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--yougi-text-primary);
}

.scramble-display {
    padding: 8px 0;
}

.scramble-text {
    font-size: 15px;
    line-height: 24px;
    color: var(--yougi-text-primary);
    text-align: center;
    word-break: break-word;
    margin: 0;
}

/* 3D预览 */
.preview-container {
    background: var(--yougi-card-bg);
    border-radius: var(--radius-xl);
    padding: 16px;
    box-shadow: var(--shadow-md);
    border: 2px solid var(--yougi-border);
    display: flex;
    justify-content: center;
    animation: fadeIn 0.5s ease-out 0.2s both;
}

/* 计时结果 */
.timing-result {
    background: var(--yougi-card-bg);
    border-radius: var(--radius-xl);
    padding: 24px;
    box-shadow: var(--shadow-lg);
    border: 2px solid var(--yougi-border);
    text-align: center;
    animation: fadeIn 0.5s ease-out 0.3s both;
}

.current-time {
    font-size: 48px;
    font-weight: 700;
    color: var(--yougi-primary);
    margin-bottom: 16px;
    font-variant-numeric: tabular-nums;
}

.submit-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
}

.btn-icon {
    margin-right: 8px;
}

/* 开始计时按钮 */
.start-timing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px 0;
    animation: fadeIn 0.5s ease-out 0.4s both;
}

.timing-btn {
    width: 80px !important;
    height: 80px !important;
    background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent)) !important;
    border: none !important;
    box-shadow: 0 8px 24px rgba(64, 158, 255, 0.3) !important;
    transition: all 0.3s ease;
}

.timing-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(64, 158, 255, 0.4) !important;
}

.timing-btn:active {
    transform: scale(0.95);
}

.hint {
    font-size: 14px;
    color: var(--yougi-text-secondary);
    margin: 0;
}

/* 成绩浮窗 */
.result-floater {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 100;
    animation: slideInRight 0.5s ease-out;
}

.results-overview h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--yougi-text-primary);
    margin: 0 0 16px 0;
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--yougi-border);
}

.result-item:last-child {
    border-bottom: none;
}

.result-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
}

.result-label.completed {
    color: var(--yougi-primary);
}

.result-label.pending {
    color: var(--yougi-text-tertiary);
}

.result-value {
    font-size: 14px;
    font-weight: 600;
}

.result-value.completed {
    color: var(--yougi-text-primary);
}

.result-value.pending {
    color: var(--yougi-text-tertiary);
}

/* 已完成界面 */
.finished {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    animation: fadeIn 0.5s ease-out;
}

.finished-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
    position: relative;
}

.finished-header {
    margin-bottom: 0;
}

.account-profile {
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
}

.account-profile img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    padding: 5px;
    border: 3px solid var(--yougi-primary);
    flex-shrink: 0;
}

.account-profile .blob {
    position: absolute;
    border-radius: 50%;
    animation: fly 5.8s linear infinite alternate;
}

.account-profile .blob:nth-child(1) {
    width: 16px;
    height: 16px;
    top: 25px;
    left: -20px;
    background: var(--yougi-primary);
    animation-delay: 0.9s;
}

.account-profile .blob:nth-child(2) {
    width: 20px;
    height: 20px;
    background: var(--yougi-accent);
    right: -20px;
    top: -20px;
    animation-delay: 0.2s;
}

.account-profile .blob:nth-child(3) {
    width: 14px;
    height: 14px;
    background: var(--yougi-success);
    right: -35px;
    top: 50%;
    animation-delay: 1.8s;
}

.finished-badge {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #67C23A, #85CE61);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 24px rgba(103, 194, 58, 0.3);
    animation: pulse 2s ease-in-out infinite;
    position: absolute;
    left: 50%;
    top: 70px;
    transform: translateX(-100%);
}

.finished-content {
    text-align: center;
}

.finished-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--yougi-text-primary);
    margin: 0 0 8px 0;
}

.finished-subtitle {
    font-size: 14px;
    color: var(--yougi-text-secondary);
    margin: 0 0 24px 0;
}

.scramble-review {
    background: var(--yougi-card-bg);
    border-radius: var(--radius-xl);
    padding: 24px;
    box-shadow: var(--shadow-md);
    border: 2px solid var(--yougi-border);
}

.control {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.control .el-button-group {
    display: flex;
    align-items: center;
}

.scramble-count {
    padding: 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: var(--yougi-primary);
}

.scramble {
    background: var(--yougi-bg-secondary);
    border-radius: var(--radius-lg);
    padding: 16px;
}

.scramble-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--yougi-text-secondary);
    margin: 0 0 8px 0;
}

.scramble-value {
    font-size: 15px;
    line-height: 24px;
    color: var(--yougi-text-primary);
    word-break: break-word;
    margin: 0;
}

/* 对话框样式 */
.dialog-content {
    text-align: center;
    padding: 20px 0;
}

.dialog-content p {
    font-size: 16px;
    color: var(--yougi-text-primary);
    margin-top: 16px;
}

/* 动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
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

@keyframes pulse {
    0%, 100% {
        transform: translateX(-100%) scale(1);
    }
    50% {
        transform: translateX(-100%) scale(1.05);
    }
}
</style>
