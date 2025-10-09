<template>
  <div class="record-table">
    <div class="record-header">
      <div class="header-content">
        <el-icon class="header-icon"><Trophy /></el-icon>
        <h2 class="header-title">社团记录</h2>
      </div>
      <div class="header-badge">
        <el-icon><Medal /></el-icon>
        <span>最佳成绩榜</span>
      </div>
    </div>
    
    <el-table 
      :data="tableData" 
      class="modern-record-table"
      height="100%"
      stripe
    >
      <el-table-column label="平均" align="center" header-align="center">
        <el-table-column prop="avg" label="成绩" align="center">
          <template v-slot="scope">
            <div class="score-cell avg-score" v-if="scope.row.avg > 0">
              <el-icon><Timer /></el-icon>
              <span>{{ convert_time_num2str(scope.row.avg) }}</span>
            </div>
            <span v-else-if="scope.row.avg === -1" class="empty-cell">—</span>
            <span v-else class="dnf-cell">DNF</span>
          </template>
        </el-table-column>
        <el-table-column prop="usernameAvg" label="用户名" align="center">
          <template v-slot="scope">
            <div class="username-cell" v-if="scope.row.usernameAvg">
              <el-icon class="user-icon"><User /></el-icon>
              <span>{{ scope.row.usernameAvg }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dateAvg" label="时间" align="center">
          <template v-slot="scope">
            <div class="date-cell" v-if="scope.row.dateAvg">
              <el-icon><Calendar /></el-icon>
              <span>{{ scope.row.dateAvg }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column prop="event" label="项目" width="100" align="center">
        <template v-slot="scope">
          <div class="event-cell">
            <span class="event-name">{{ scope.row.event }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="单次" align="center" header-align="center">
        <el-table-column prop="dateBest" label="时间" align="center">
          <template v-slot="scope">
            <div class="date-cell" v-if="scope.row.dateBest">
              <el-icon><Calendar /></el-icon>
              <span>{{ scope.row.dateBest }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="usernameBest" label="用户名" align="center">
          <template v-slot="scope">
            <div class="username-cell" v-if="scope.row.usernameBest">
              <el-icon class="user-icon"><User /></el-icon>
              <span>{{ scope.row.usernameBest }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="best" label="成绩" align="center">
          <template v-slot="scope">
            <div class="score-cell best-score" v-if="scope.row.best > 0">
              <el-icon><Timer /></el-icon>
              <span>{{ convert_time_num2str(scope.row.best) }}</span>
            </div>
            <span v-else-if="scope.row.best === -1" class="empty-cell">—</span>
            <span v-else class="dnf-cell">DNF</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type {Record} from "@/types";
import {getScuRecord} from "@/api/fetchData";
import {computed} from "vue";
import {convert_time_num2str} from "@/utils";
import {ALL_EVENTS} from "@/utils/constants";
import { Trophy, Medal, User, Timer, Calendar } from '@element-plus/icons-vue';

const record: Record = await getScuRecord()

interface integratedData {
  usernameAvg: string
  dateAvg: string
  usernameBest: string
  dateBest: string
  avg: number
  best: number
  event: string
}

const tableData = computed(() => {
  const emptyData: integratedData[] = []
  for (const i in ALL_EVENTS) {
    emptyData.push({
      usernameAvg: '',
      dateAvg: '',
      usernameBest: '',
      dateBest: '',
      avg: -1,
      best: -1,
      event: ALL_EVENTS[i]
    })
  }

  for (const i in record.avg) {
    let result_avg = record.avg[i]
    const j = ALL_EVENTS.indexOf(result_avg.event as any)
    emptyData[j].usernameAvg = result_avg.username
    emptyData[j].dateAvg = result_avg.date
    emptyData[j].avg = result_avg.avg
  }

  for (const i in record.best) {
    let result_best = record.best[i]
    const j = ALL_EVENTS.indexOf(result_best.event as any)
    emptyData[j].usernameBest = result_best.username
    emptyData[j].dateBest = result_best.date
    emptyData[j].best = result_best.best
  }

  return emptyData
})
</script>

<style scoped>
.record-table {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.5s ease-out;
  width: 95%;
  max-width: 1200px;
  height: calc(100vh - 60px - 40px - 40px);
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表头样式 */
.record-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--yougi-border);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
  color: var(--yougi-primary);
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  color: white;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 14px;
}

.header-badge .el-icon {
  font-size: 18px;
}

/* 表格样式 */
.modern-record-table {
  width: 100%;
  border-radius: var(--radius-xl);
  flex: 1;
  overflow: hidden;
}

:deep(.el-table) {
  --el-table-tr-bg-color: var(--yougi-card-bg);
  --el-table-row-hover-bg-color: var(--yougi-bg-secondary);
  background-color: var(--yougi-card-bg);
  border-radius: var(--radius-xl);
}

:deep(.el-table__inner-wrapper::before) {
  height: 0 !important;
}

:deep(.el-table__row) {
  transition: background-color 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: var(--yougi-bg-secondary);
}

/* 分组表头样式 */
:deep(.is-group tr th) {
  background: linear-gradient(to bottom, var(--yougi-bg-secondary), var(--yougi-card-bg)) !important;
  font-weight: 700;
  font-size: 15px;
  color: var(--yougi-primary);
}

:deep(.section-avg .cell) {
  color: var(--yougi-accent);
}

:deep(.section-best .cell) {
  color: var(--yougi-success);
}

/* 项目列样式 */
.event-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}

.event-name {
  font-weight: 700;
  font-size: 15px;
  padding: 6px 14px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-md);
  border: 2px solid var(--yougi-primary);
  color: var(--yougi-primary);
}

/* 用户名样式 */
.username-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-md);
  font-weight: 500;
}

.user-icon {
  font-size: 14px;
  color: var(--yougi-primary);
}

/* 成绩样式 */
.score-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 15px;
}

.avg-score {
  background: linear-gradient(135deg, rgba(var(--yougi-accent-rgb), 0.1), rgba(var(--yougi-accent-rgb), 0.2));
  border: 1px solid var(--yougi-accent);
  color: var(--yougi-accent);
}

.best-score {
  background: linear-gradient(135deg, rgba(var(--yougi-success-rgb), 0.1), rgba(var(--yougi-success-rgb), 0.2));
  border: 1px solid var(--yougi-success);
  color: var(--yougi-success);
}

.score-cell .el-icon {
  font-size: 16px;
}

/* 日期单元格样式 */
.date-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--yougi-text-secondary);
  font-size: 14px;
}

.date-cell .el-icon {
  font-size: 14px;
  color: var(--yougi-primary);
}

/* 空值和DNF样式 */
.empty-cell {
  color: var(--yougi-text-disabled);
  font-size: 18px;
}

.dnf-cell {
  color: var(--yougi-danger);
  font-weight: 600;
}

/* 响应式 */
@media screen and (max-width: 768px) {
  .record-table {
    padding: 20px;
  }
  
  .header-title {
    font-size: 22px;
  }
  
  .header-badge {
    display: none;
  }
  
  .modern-record-table {
    font-size: 13px;
  }
  
  .event-name,
  .score-cell {
    font-size: 13px;
  }
}
</style>
