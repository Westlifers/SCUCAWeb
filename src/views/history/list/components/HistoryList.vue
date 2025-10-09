<template>
  <div class="history-list">
    <div class="history-list-header">
      <div class="header-content">
        <el-icon class="header-icon"><Calendar /></el-icon>
        <h2 class="header-title">历史赛事</h2>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-value">{{ tableData.length }}</span>
          <span class="stat-label">场赛事</span>
        </div>
      </div>
    </div>
    
    <el-table 
      :row-class-name="rowClassName" 
      :data="tableData" 
      class="modern-table"
      height="100%"
      stripe
    >
      <el-table-column prop="compId" label="比赛名称" min-width="200" align="left" header-align="left">
        <template v-slot="scope">
          <router-link :to="{path: '/history/detail/' + scope.row.compId}" class="comp-link">
            <el-icon class="link-icon"><Trophy /></el-icon>
            <span class="comp-name">{{ scope.row.compId }}</span>
          </router-link>
        </template>
      </el-table-column>
      
      <el-table-column prop="is_normal" label="赛事类型" width="140" align="center" header-align="center">
        <template v-slot="scope">
          <el-tag 
            :type="scope.row.is_normal ? 'success' : 'info'" 
            effect="light"
            round
          >
            {{ scope.row.is_normal ? '周赛' : '特殊赛' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="user_count" label="参赛人数" width="140" align="center" header-align="center">
        <template v-slot="scope">
          <div class="stat-cell">
            <el-icon class="stat-icon"><User /></el-icon>
            <span class="stat-number">{{ scope.row.user_count }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="event_count" label="开设项目" width="140" align="center" header-align="center">
        <template v-slot="scope">
          <div class="stat-cell">
            <el-icon class="stat-icon"><Grid /></el-icon>
            <span class="stat-number">{{ scope.row.event_count }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {getCompetitionList} from "@/api/fetchData";
import { Calendar, Trophy, User, Grid } from '@element-plus/icons-vue';

const tableData = await getCompetitionList()

const rowClassName = ({ row }) => {
  if (!row.ongoing) {
    return;
  } else {
    return "hideRow";
  }
}

</script>

<style scoped>
.history-list {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.5s ease-out;
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
.history-list-header {
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

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--yougi-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--yougi-text-secondary);
  margin-top: 2px;
}

/* 表格样式 */
.modern-table {
  width: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  flex: 1;
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

:deep(.hideRow) {
  display: none;
}

/* 比赛链接样式 */
.comp-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--yougi-primary);
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.comp-link:hover {
  background: var(--yougi-bg-secondary);
  transform: translateX(4px);
}

.link-icon {
  font-size: 18px;
  color: var(--yougi-accent);
}

.comp-name {
  font-size: 15px;
}

/* 统计单元格样式 */
.stat-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-md);
}

.stat-icon {
  font-size: 16px;
  color: var(--yougi-primary);
}

.stat-number {
  font-weight: 600;
  color: var(--yougi-text);
}

/* Tag 样式增强 */
:deep(.el-tag) {
  font-weight: 500;
  padding: 6px 14px;
  border: none;
}

/* 响应式 */
@media screen and (max-width: 768px) {
  .history-list {
    padding: 20px;
  }
  
  .header-title {
    font-size: 22px;
  }
  
  .header-stats {
    display: none;
  }
  
  .modern-table {
    font-size: 13px;
  }
}
</style>
