<template>
  <el-table 
    :data="tableData" 
    class="modern-rank-table"
    stripe
  >
    <el-table-column type="index" width="100" align="center" label="排名">
      <template v-slot="scope">
        <div class="rank-badge" :class="getRankClass(scope.$index)">
          <el-icon v-if="shouldShowMedal(scope.$index)" class="medal-icon">
            <Trophy v-if="getRealRank(scope.$index) === 1" />
            <Medal v-if="getRealRank(scope.$index) === 2" />
            <Medal v-if="getRealRank(scope.$index) === 3" />
          </el-icon>
          <span class="rank-number">{{ getRealRank(scope.$index) }}</span>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column prop="username" label="用户名" min-width="150" align="center">
      <template v-slot="scope">
        <div class="username-cell">
          <el-icon class="user-icon"><User /></el-icon>
          <span>{{ scope.row.username }}</span>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column prop="avg" label="平均" v-if="aorb==='avg'" :formatter="formatter" width="150" align="center">
      <template v-slot="scope">
        <div class="score-cell avg-score">
          <el-icon><Timer /></el-icon>
          <span>{{ scope.row.avg > 0 ? convert_time_num2str(scope.row.avg) : 'DNF' }}</span>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column prop="best" label="最佳" v-if="aorb==='best'" :formatter="formatter" width="150" align="center">
      <template v-slot="scope">
        <div class="score-cell best-score">
          <el-icon><Timer /></el-icon>
          <span>{{ scope.row.best > 0 ? convert_time_num2str(scope.row.best) : 'DNF' }}</span>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column prop="compId" label="比赛" min-width="200" align="center">
      <template v-slot="scope">
        <div class="comp-cell">
          <el-icon><TrophyBase /></el-icon>
          <span>{{ scope.row.compId }}</span>
        </div>
      </template>
    </el-table-column>
    
    <el-table-column prop="date" label="时间" width="150" align="center">
      <template v-slot="scope">
        <div class="date-cell">
          <el-icon><Calendar /></el-icon>
          <span>{{ scope.row.date }}</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import type {TableColumnCtx} from "element-plus";
import type {OmittedResultAvgWithCompId, OmittedResultBestWithCompId, Result} from "@/types";
import {convert_time_num2str} from "@/utils";
import { Trophy, Medal, User, Timer, TrophyBase, Calendar } from '@element-plus/icons-vue';

const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?convert_time_num2str(val):'DNF'
}

const props = defineProps<{
  tableData: OmittedResultAvgWithCompId[] | OmittedResultBestWithCompId[]
  aorb: string
  page: number
}>()

// 计算真实排名（考虑分页）
const getRealRank = (index: number) => {
  return (props.page - 1) * 10 + (index + 1)
}

// 判断是否应该显示奖牌（只有真正的前三名才显示）
const shouldShowMedal = (index: number) => {
  const realRank = getRealRank(index)
  return realRank <= 3
}

const getRankClass = (index: number) => {
  const realRank = getRealRank(index)
  if (realRank === 1) return 'rank-first';
  if (realRank === 2) return 'rank-second';
  if (realRank === 3) return 'rank-third';
  return 'rank-normal';
}
</script>

<style scoped>
.modern-rank-table {
  width: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  max-height: 100%;
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

/* 排名徽章样式 */
.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 15px;
  min-width: 50px;
}

.rank-first {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

.rank-second {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
  color: white;
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
}

.rank-third {
  background: linear-gradient(135deg, #CD7F32, #B8860B);
  color: white;
  box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
}

.rank-normal {
  background: var(--yougi-bg-secondary);
  color: var(--yougi-text);
  border: 1px solid var(--yougi-border);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
  }
}

.medal-icon {
  font-size: 18px;
}

.rank-number {
  font-size: 15px;
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

/* 比赛和时间单元格 */
.comp-cell,
.date-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--yougi-text-secondary);
  font-size: 14px;
}

.comp-cell .el-icon,
.date-cell .el-icon {
  font-size: 14px;
  color: var(--yougi-primary);
}

/* 响应式 */
@media screen and (max-width: 768px) {
  .rank-badge {
    padding: 4px 8px;
    font-size: 13px;
    min-width: 40px;
  }
  
  .medal-icon {
    font-size: 14px;
  }
  
  .username-cell,
  .score-cell,
  .comp-cell,
  .date-cell {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>
