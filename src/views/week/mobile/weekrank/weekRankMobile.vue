<script setup lang="ts">
import {getComp} from "@/api/fetchData";
import type {apiUsedEventName} from "@/types";
import type {Ref} from "vue";
import {computed, ref} from "vue";
import {
  classifyTableDataByEvent,
  convert_time_num2str,
  get_user_avatar,
  getSortedEventsFromTableData,
  translateEventForScramble
} from "@/utils";
import ProgressBar from "@/components/progressBar.vue";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Medal,
  ArrowUp,
  ArrowDown,
  DocumentDelete,
  Moon,
  Sunny
} from '@element-plus/icons-vue';
import {SPECIAL_EVENTS} from "@/utils/constants";
import {useDark} from "@vueuse/core";

const isDark = useDark()

const data = await getComp('week')
const ClassifiedTableData = computed(() => classifyTableDataByEvent(data))
const normalizedData = computed(() => {
  const result: any = {}
  for (const event in ClassifiedTableData.value) {
    // normalise time_1 etc to (0, 1)
    let allTime: number[] = []
    for (const x of ClassifiedTableData.value[event]) {
      allTime.push(x.time_1)
      allTime.push(x.time_2)
      allTime.push(x.time_3)
      allTime.push(x.time_4)
      allTime.push(x.time_5)
    }
    const max = Math.max(...allTime.filter(x => x > 0))
    const min = Math.min(...allTime.filter(x => x > 0))

    result[event] = ClassifiedTableData.value[event].map(x => {
      return {
        username: x.username,
        avg: x.avg,
        time_1: x.time_1 > 0 ? (x.time_1 - min) / (max - min) : 0,
        time_2: x.time_2 > 0 ? (x.time_2 - min) / (max - min) : 0,
        time_3: x.time_3 > 0 ? (x.time_3 - min) / (max - min) : 0,
        time_4: x.time_4 > 0 ? (x.time_4 - min) / (max - min) : 0,
        time_5: x.time_5 > 0 ? (x.time_5 - min) / (max - min) : 0,
      }
    })
  }
  return result
})

const integratedData = computed(() => {
  // integrate ClassifiedTableData and normalizedData, make time_1 etc like [12.2, 0.3], where 12.2 is the time, 0.3 is normalized time
  const result: any = {}
  for (const event in ClassifiedTableData.value) {
    result[event] = ClassifiedTableData.value[event].map((x, i) => {
      return {
        username: x.username,
        avg: x.avg,
        time_1: [x.time_1, normalizedData.value[event][i].time_1],
        time_2: [x.time_2, normalizedData.value[event][i].time_2],
        time_3: [x.time_3, normalizedData.value[event][i].time_3],
        time_4: [x.time_4, normalizedData.value[event][i].time_4],
        time_5: [x.time_5, normalizedData.value[event][i].time_5],
      }
    })
  }

  return result
})

const sort_avg_count_in_zero = (obj_a: any, obj_b: any) => {
  let a = obj_a.avg
  let b = obj_b.avg
  if (a == 0) {
    a = Infinity
  }
  if (b == 0) {
    b = Infinity
  }
  return a - b
}

// 排序后的数据
const sortedData = computed(() => {
  const result: any = {}
  for (const event in integratedData.value) {
    result[event] = [...integratedData.value[event]].sort(sort_avg_count_in_zero)
  }
  return result
})

const activeEvent: Ref<apiUsedEventName> = ref<apiUsedEventName>('333')
const events = computed(() => getSortedEventsFromTableData(data))

const avatars: any = {}
for (let i = 0; i < data.result_set.length; i++) {
  const author = data.result_set[i].username
  if (author in avatars) continue
  avatars[data.result_set[i].username] = await get_user_avatar(data.result_set[i].username)
}

// 展开状态管理
const expandedPlayers = ref<string[]>([])

const toggleDetails = (username: string) => {
  const index = expandedPlayers.value.indexOf(username)
  if (index > -1) {
    expandedPlayers.value.splice(index, 1)
  } else {
    expandedPlayers.value.push(username)
  }
}

// 辅助函数
const getMinNormalizedTime = (player: any) => {
  const times = [player.time_1[1], player.time_2[1], player.time_3[1], player.time_4[1], player.time_5[1]]
  return Math.min(...times.filter(x => x > 0))
}

const getMaxNormalizedTime = (player: any) => {
  const times = [player.time_1[1], player.time_2[1], player.time_3[1], player.time_4[1], player.time_5[1]]
  return Math.max(...times.filter(x => x > 0))
}

const getMinTime = (player: any) => {
  const times = [player.time_1[0], player.time_2[0], player.time_3[0], player.time_4[0], player.time_5[0]]
  return Math.min(...times.filter(x => x > 0))
}

const getMaxTime = (player: any) => {
  const times = [player.time_1[0], player.time_2[0], player.time_3[0], player.time_4[0], player.time_5[0]]
  return Math.max(...times.filter(x => x > 0))
}

const getTimeCount = () => {
  return SPECIAL_EVENTS.indexOf(activeEvent.value) > -1 ? 3 : 5
}

const getTimeClass = (player: any, index: number) => {
  const timeKey = `time_${index}`
  const time = player[timeKey][0]
  const allTimes: number[] = []
  for (let i = 1; i <= getTimeCount(); i++) {
    allTimes.push(player[`time_${i}`][0])
  }
  const validTimes = allTimes.filter(t => t > 0)
  if (validTimes.length < 2) return ''
  
  const minTime = Math.min(...validTimes)
  const maxTime = Math.max(...validTimes)
  
  if (time === minTime) return 'fastest'
  if (time === maxTime || time === 0) return 'slowest'
  return ''
}

</script>

<template>
  <div class="weekrank-mobile">
    
    <!-- 头部区域 -->
    <div class="rank-header">
      <div class="header-title">
        <div class="title-icon">
          <el-icon :size="24"><Trophy /></el-icon>
        </div>
        <div class="title-text">
          <h3>周赛排行榜</h3>
          <p class="subtitle">实时更新的竞赛成绩</p>
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
        @click="activeEvent = events[events.indexOf(activeEvent) - 1]"
        :disabled="events.indexOf(activeEvent)==0"
        size="small"
      />
      <el-select v-model="activeEvent" placeholder="项目" class="event-select">
        <el-option
            v-for="event in events"
            :key="event"
            :label="event"
            :value="event"
        >
          <span class="cubing-icon" :class="`event-${translateEventForScramble(event)}`"><span style="margin-left: 5px">{{event}}</span></span>
        </el-option>
      </el-select>
      <el-button 
        circle
        :icon="ArrowRight"
        @click="activeEvent = events[events.indexOf(activeEvent) + 1]"
        :disabled="events.indexOf(activeEvent)==events.length-1"
        size="small"
      />
    </div>

    <!-- 排行榜列表 -->
    <div class="rank-list">
      <div 
        v-for="(player, index) in sortedData[activeEvent]" 
        :key="player.username"
        class="rank-card"
        :class="{'top-rank': index < 3}"
      >
        <!-- 排名标识 -->
        <div class="rank-badge" :class="`rank-${index + 1}`">
          <el-icon v-if="index === 0" :size="24"><Medal /></el-icon>
          <el-icon v-else-if="index === 1" :size="22"><Medal /></el-icon>
          <el-icon v-else-if="index === 2" :size="20"><Medal /></el-icon>
          <span v-else class="rank-number">{{ index + 1 }}</span>
        </div>

        <!-- 用户信息 -->
        <div class="player-info">
          <el-avatar :src="avatars[player.username]" :size="48" />
          <div class="player-details">
            <h4 class="username">{{ player.username }}</h4>
            <div class="avg-score">
              <span class="label">平均</span>
              <span class="value" :class="{'dnf': player.avg === 0}">
                {{ player.avg > 0 ? convert_time_num2str(player.avg) : 'DNF' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 成绩详情 -->
        <div class="score-details">
          <div class="score-header">
            <span>详细成绩</span>
            <el-button 
              text 
              size="small"
              @click="toggleDetails(player.username)"
            >
              <el-icon>
                <component :is="expandedPlayers.includes(player.username) ? ArrowUp : ArrowDown" />
              </el-icon>
            </el-button>
          </div>
          
          <!-- 进度条概览 -->
          <div class="progress-overview">
            <progress-bar
                :min="getMinNormalizedTime(player)"
                :max="getMaxNormalizedTime(player)"
                show-text
                :left-text="convert_time_num2str(getMinTime(player))"
                :right-text="convert_time_num2str(getMaxTime(player))"
            />
          </div>

          <!-- 展开的详细成绩 -->
          <transition name="expand">
            <div v-show="expandedPlayers.includes(player.username)" class="detailed-scores">
              <div 
                v-for="i in getTimeCount()" 
                :key="i"
                class="score-item"
                :class="getTimeClass(player, i)"
              >
                <span class="time-label">第{{ i }}次</span>
                <span class="time-value">
                  {{ player[`time_${i}`][0] > 0 ? convert_time_num2str(player[`time_${i}`][0]) : 'DNF' }}
                </span>
                <div class="time-bar">
                  <div 
                    class="time-bar-fill" 
                    :style="{width: (player[`time_${i}`][1] * 100) + '%'}"
                  ></div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!sortedData[activeEvent] || sortedData[activeEvent].length === 0" class="empty-state">
        <el-icon :size="64"><DocumentDelete /></el-icon>
        <p>还没有人参加此项目</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weekrank-mobile {
  background: var(--yougi-bg-primary);
  padding: 20px 16px;
  /* 优先使用 dvh (动态视口高度)，不支持则回退到自定义变量，最后回退到 vh */
  min-height: calc(100dvh - 60px);
  min-height: calc(var(--viewport-height, 100vh) - 60px);
  overflow: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.weekrank-mobile::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 头部样式 */
.rank-header {
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
  background: linear-gradient(135deg, #FFD700, #FFA500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
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

/* 排行榜列表 */
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 排行卡片 */
.rank-card {
  background: var(--yougi-card-bg);
  border-radius: var(--radius-xl);
  padding: 16px;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--yougi-border);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
  animation-fill-mode: both;
}

.rank-card:nth-child(1) { animation-delay: 0.05s; }
.rank-card:nth-child(2) { animation-delay: 0.1s; }
.rank-card:nth-child(3) { animation-delay: 0.15s; }
.rank-card:nth-child(4) { animation-delay: 0.2s; }
.rank-card:nth-child(5) { animation-delay: 0.25s; }

.rank-card.top-rank {
  border-width: 3px;
}

.rank-card:nth-child(1) {
  border-color: #FFD700;
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.25);
}

.rank-card:nth-child(2) {
  border-color: #C0C0C0;
  box-shadow: 0 6px 20px rgba(192, 192, 192, 0.25);
}

.rank-card:nth-child(3) {
  border-color: #CD7F32;
  box-shadow: 0 6px 20px rgba(205, 127, 50, 0.25);
}

/* 排名标识 */
.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
}

.rank-badge.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.rank-badge.rank-2 {
  background: linear-gradient(135deg, #E8E8E8, #C0C0C0);
  color: #666;
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
}

.rank-badge.rank-3 {
  background: linear-gradient(135deg, #E6A968, #CD7F32);
  color: white;
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
}

.rank-badge .rank-number {
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 18px;
}

/* 用户信息 */
.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--yougi-border);
}

.player-details {
  flex: 1;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: var(--yougi-text-primary);
  margin: 0 0 6px 0;
}

.avg-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avg-score .label {
  font-size: 13px;
  color: var(--yougi-text-secondary);
}

.avg-score .value {
  font-size: 18px;
  font-weight: 700;
  color: var(--yougi-primary);
  font-variant-numeric: tabular-nums;
}

.avg-score .value.dnf {
  color: #F56C6C;
}

/* 成绩详情 */
.score-details {
  margin-top: 12px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--yougi-text-secondary);
}

.progress-overview {
  margin-bottom: 12px;
}

/* 详细成绩 */
.detailed-scores {
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
  padding: 12px;
  margin-top: 12px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--yougi-border);
}

.score-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.time-label {
  font-size: 13px;
  color: var(--yougi-text-secondary);
  min-width: 60px;
}

.time-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--yougi-text-primary);
  min-width: 70px;
  font-variant-numeric: tabular-nums;
}

.score-item.fastest .time-value {
  color: #67C23A;
}

.score-item.slowest .time-value {
  color: #F56C6C;
}

.time-bar {
  flex: 1;
  height: 6px;
  background: var(--yougi-bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.time-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--yougi-primary), var(--yougi-accent));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.score-item.fastest .time-bar-fill {
  background: linear-gradient(90deg, #67C23A, #85CE61);
}

.score-item.slowest .time-bar-fill {
  background: linear-gradient(90deg, #F56C6C, #F78989);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--yougi-text-tertiary);
}

.empty-state p {
  margin-top: 16px;
  font-size: 15px;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
