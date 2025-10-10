<template>
  <el-table 
    :data="tableData" 
    style="max-width: 900px" 
    :header-cell-style="{
      background:'var(--yougi-bg-secondary)',
      color: 'var(--yougi-text)',
      fontWeight: 600,
      fontSize: '14px'
    }"
    :row-style="{
      transition: 'all 0.3s ease'
    }"
    height="90%"
    class="modern-table"
  >

    <!--  appear for mobile devices  -->
    <el-table-column type="expand" v-if="isMobile">
      <template #default="props">
        <el-table :data="[{time_1: props.row.time_1, time_2: props.row.time_2, time_3: props.row.time_3, time_4: props.row.time_4, time_5: props.row.time_5}]">
          <el-table-column prop="time_1" label="第一次">
            <template #default="scope">
              <span :class="getTimeClass(props.row, 'time_1')">{{ formatTime(scope.row.time_1) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time_2" label="第二次">
            <template #default="scope">
              <span :class="getTimeClass(props.row, 'time_2')">{{ formatTime(scope.row.time_2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time_3" label="第三次">
            <template #default="scope">
              <span :class="getTimeClass(props.row, 'time_3')">{{ formatTime(scope.row.time_3) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time_4" label="第四次" v-if="maxScrambleCount===5">
            <template #default="scope">
              <span :class="getTimeClass(props.row, 'time_4')">{{ formatTime(scope.row.time_4) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time_5" label="第五次" v-if="maxScrambleCount===5">
            <template #default="scope">
              <span :class="getTimeClass(props.row, 'time_5')">{{ formatTime(scope.row.time_5) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="username" label="用户名" :width="120" :fixed="!isMobile">
      <template v-slot:default="scope">
        <div class="username">
          <el-avatar :src="avatars[scope.row.username]" :size="36" class="user-avatar"></el-avatar>
          <p class="user-name">{{scope.row.username}}</p>
        </div>
      </template>
    </el-table-column>
    <!--  appear for PC  -->
    <el-table-column prop="time_1" label="第一次" :width="width" v-if="!isMobile">
      <template #default="scope">
        <span class="time-number" :class="getTimeClass(scope.row, 'time_1')">{{ formatTime(scope.row.time_1) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="time_2" label="第二次" :width="width" v-if="!isMobile">
      <template #default="scope">
        <span class="time-number" :class="getTimeClass(scope.row, 'time_2')">{{ formatTime(scope.row.time_2) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="time_3" label="第三次" :width="width" v-if="!isMobile">
      <template #default="scope">
        <span class="time-number" :class="getTimeClass(scope.row, 'time_3')">{{ formatTime(scope.row.time_3) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="time_4" label="第四次" v-if="maxScrambleCount===5 && !isMobile" :width="width">
      <template #default="scope">
        <span class="time-number" :class="getTimeClass(scope.row, 'time_4')">{{ formatTime(scope.row.time_4) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="time_5" label="第五次" v-if="maxScrambleCount===5 && !isMobile" :width="width">
      <template #default="scope">
        <span class="time-number" :class="getTimeClass(scope.row, 'time_5')">{{ formatTime(scope.row.time_5) }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="avg" label="平均" :width="width" :sortable="true" :sort-method="sort_avg_count_in_zero">
      <template v-slot:default="scope">
        <el-badge value="SCUR" class="scur-badge" v-if="scope.row.is_avg_scur">
          <div class="badge-value avg-value">
            {{ scope.row.avg > 0 ? convert_time_num2str(scope.row.avg) : 'DNF' }}
          </div>
        </el-badge>
        <div class="avg-value" v-else>{{ scope.row.avg > 0 ? convert_time_num2str(scope.row.avg) : 'DNF' }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="best" label="最佳" :width="width" :sortable="true" :sort-method="sort_best_count_in_zero">
      <template v-slot:default="scope">
        <el-badge value="SCUR" class="scur-badge" v-if="scope.row.is_best_scur">
          <div class="badge-value best-value">
            {{ scope.row.best > 0 ? convert_time_num2str(scope.row.best) : 'DNF' }}
          </div>
        </el-badge>
        <div class="best-value" v-else>{{ scope.row.best > 0 ? convert_time_num2str(scope.row.best) : 'DNF' }}</div>
      </template>
    </el-table-column>

  </el-table>
</template>

<script lang="ts" setup>
import type {Result} from "@/types";
import {convert_time_num2str} from "@/utils";
import {computed} from "vue";
import {isMobile, SPECIAL_EVENTS} from "@/utils/constants";

const props = defineProps<{
  tableData: Result[]
  avatars: object
}>()

const formatTime = (val: number) => {
  return val > 0 ? convert_time_num2str(val) : 'DNF'
}

// 获取某行中的所有成绩(包括DNF)
const getAllTimes = (row: Result) => {
  const times: {value: number, key: string, isDNF: boolean}[] = []
  const maxCount = SPECIAL_EVENTS.indexOf(row.event) > -1 ? 3 : 5
  
  for (let i = 1; i <= maxCount; i++) {
    const key = `time_${i}` as keyof Result
    const val = row[key] as number
    times.push({
      value: val,
      key: `time_${i}`,
      isDNF: val === 0
    })
  }
  
  return times
}

// 获取时间样式类
const getTimeClass = (row: Result, timeKey: string) => {
  const allTimes = getAllTimes(row)
  
  // 统计DNF数量
  const dnfCount = allTimes.filter(t => t.isDNF).length
  
  // 如果有2个或以上DNF,不标记最快最慢
  if (dnfCount >= 2) {
    return ''
  }
  
  // 找到当前时间
  const currentTime = allTimes.find(t => t.key === timeKey)
  if (!currentTime) {
    return ''
  }
  
  // 如果当前是DNF
  if (currentTime.isDNF) {
    // 如果只有1个DNF,标记为最慢
    if (dnfCount === 1) {
      return 'slowest-time'
    }
    return ''
  }
  
  // 分离有效成绩和DNF
  const validTimes = allTimes.filter(t => !t.isDNF)
  
  // 如果有效成绩少于2个,不高亮
  if (validTimes.length < 2) {
    return ''
  }
  
  // 排序有效成绩
  const sortedValidTimes = [...validTimes].sort((a, b) => a.value - b.value)
  const fastest = sortedValidTimes[0]
  
  // 确定最慢的:如果有DNF,DNF是最慢;否则是最大的有效成绩
  let slowest
  if (dnfCount === 1) {
    slowest = allTimes.find(t => t.isDNF)
  } else {
    slowest = sortedValidTimes[sortedValidTimes.length - 1]
  }
  
  if (currentTime.key === fastest.key) {
    return 'fastest-time'
  } else if (slowest && currentTime.key === slowest.key) {
    return 'slowest-time'
  }
  
  return ''
}

const maxScrambleCount = computed(() => {
  if (SPECIAL_EVENTS.indexOf(props.tableData[0].event) > -1) {
    return 3
  } else {
    return 5
  }
})

const sort_avg_count_in_zero = (obj_a, obj_b) => {
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

const sort_best_count_in_zero = (obj_a, obj_b) => {
  let a = obj_a.best
  let b = obj_b.best
  if (a == 0) {
    a = Infinity
  }
  if (b == 0) {
    b = Infinity
  }
  return a - b
}

const width = computed(() => {
  return isMobile ? 75 : 110
})

</script>

<style scoped>
.modern-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Table Styling */
:deep(.el-table) {
  --el-table-tr-bg-color: var(--yougi-card-bg);
  --el-table-bg-color: var(--yougi-card-bg);
  border-radius: var(--radius-lg);
}

:deep(.el-table__body tr) {
  transition: all 0.3s ease;
}

:deep(.el-table__body tr:hover) {
  background: var(--yougi-bg-secondary) !important;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 去除表格底部边框 */
:deep(.el-table__inner-wrapper::before) {
  height: 0 !important;
}

:deep(.el-table-fixed-column--left) {
  --el-bg-color: var(--yougi-card-bg);
}

/* Username Cell */
.username {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  border: 2px solid var(--yougi-primary);
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.15);
  border-color: var(--yougi-accent);
}

.user-name {
  margin: 0;
  font-weight: 600;
  color: var(--yougi-text);
  font-size: 14px;
}

/* Time Number Styles */
.time-number {
  font-weight: 500;
  color: var(--yougi-text-secondary);
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: inline-block;
}

/* 最快时间 - 绿色高亮 */
.fastest-time {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  font-weight: 700;
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

/* 最慢时间 - 红色高亮 */
.slowest-time {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  font-weight: 700;
  border: 1px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

/* 平均成绩样式 */
.avg-value {
  font-weight: 700;
  color: var(--yougi-primary);
  font-size: 15px;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05));
  border-radius: 6px;
  border: 2px solid rgba(99, 102, 241, 0.3);
  display: inline-block;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.avg-value:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
}

/* 最佳成绩样式 */
.best-value {
  font-weight: 700;
  color: #10b981;
  font-size: 15px;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  border-radius: 6px;
  border: 2px solid rgba(16, 185, 129, 0.4);
  display: inline-block;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  transition: all 0.3s ease;
  animation: bestPulse 3s ease-in-out infinite;
}

@keyframes bestPulse {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
  }
  50% {
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
}

.best-value:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
}

/* SCUR Badge */
.scur-badge {
  margin-top: 10px;
}

.scur-badge :deep(.el-badge__content) {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #8b6914;
  font-weight: 700;
  border: none;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.4);
  font-size: 10px;
  padding: 2px 6px;
  animation: shine 2s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.badge-value {
  min-width: 60px;
  text-align: center;
}

/* Cell Styling */
:deep(.cell) {
  padding: 12px 8px;
}

/* Header Styling */
:deep(.el-table__header-wrapper) {
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

:deep(th.el-table__cell) {
  border-bottom: 2px solid var(--yougi-border) !important;
}

/* Sortable Header */
:deep(.el-table__column-filter-trigger) {
  color: var(--yougi-primary);
}

:deep(.caret-wrapper) {
  color: var(--yougi-text-secondary);
}

:deep(.ascending) {
  color: var(--yougi-primary);
}

:deep(.descending) {
  color: var(--yougi-accent);
}
</style>
