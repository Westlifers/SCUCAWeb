<template>
  <div class="rank-view">
    <div class="rank-view-header">
      <div class="header-content">
        <el-icon class="header-icon"><Histogram /></el-icon>
        <h2 class="header-title">历史排名</h2>
      </div>
      
      <div class="rank-view-header-selector">
        <div class="selector-group">
          <label class="selector-label">
            <el-icon><Grid /></el-icon>
            <span>项目</span>
          </label>
          <el-select v-model="event" placeholder="选择项目" size="default" class="event-select">
            <el-option
                v-for="event in ALL_EVENTS"
                :key="event"
                :label="event"
                :value="event"
            >
              <span class="cubing-icon" :class="`event-${translateEventForScramble(event)}`">
                <span style="margin-left: 5px">{{event}}</span>
              </span>
            </el-option>
          </el-select>
        </div>
        
        <div class="selector-group">
          <label class="selector-label">
            <el-icon><DataAnalysis /></el-icon>
            <span>类型</span>
          </label>
          <el-select v-model="aorb" placeholder="选择类型" size="default" class="type-select">
            <el-option label="平均" value="avg">
              <div class="option-content">
                <el-icon><TrendCharts /></el-icon>
                <span>平均</span>
              </div>
            </el-option>
            <el-option label="单次" value="best">
              <div class="option-content">
                <el-icon><Aim /></el-icon>
                <span>单次</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="data-table">
      <data-table :table-data="paginationData.results" :aorb="aorb" :page="page" />
    </div>

    <div class="rank-view-footer">
      <el-pagination 
        background 
        layout="prev, pager, next, jumper" 
        :page-count="total_page" 
        :current-page="page" 
        @current-change="changePage"
        class="modern-pagination"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getRank} from "@/api/fetchData";
import DataTable from "@/views/rank/components/DataTable.vue";
import type {Ref} from "vue";
import {computed, ref, watch} from "vue";
import type {RankPaginationData} from "@/types";
import {translateEventForScramble} from "@/utils";
import {ALL_EVENTS} from "@/utils/constants";
import { Histogram, Grid, DataAnalysis, TrendCharts, Aim } from '@element-plus/icons-vue';

const paginationData: Ref<RankPaginationData> = ref(await getRank('333', 'avg', 1))

const loadPaginationData = async () => {
  return await getRank(event.value, aorb.value, page.value)
}

const updatePaginationData = async () => {
  paginationData.value = await loadPaginationData()
}

const event = ref('333')

const aorb = ref('avg')

const page = ref(1)

const total_page = computed(() => paginationData.value.count)

watch([event, aorb, page], updatePaginationData)

const changePage = (current_page) => {
  page.value = current_page
}
</script>

<style scoped>
.rank-view {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.5s ease-out;
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
.rank-view-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--yougi-border);
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

/* 选择器样式 */
.rank-view-header-selector {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 150px;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--yougi-text-secondary);
}

.selector-label .el-icon {
  font-size: 16px;
  color: var(--yougi-primary);
}

:deep(.event-select),
:deep(.type-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background: var(--yougi-bg-secondary);
  border: 2px solid var(--yougi-border);
  border-radius: var(--radius-lg);
  padding: 8px 12px;
  transition: all 0.3s ease;
  box-shadow: none;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: var(--yougi-primary);
  box-shadow: 0 0 0 3px rgba(var(--yougi-primary-rgb), 0.1);
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: var(--yougi-primary);
  box-shadow: 0 0 0 3px rgba(var(--yougi-primary-rgb), 0.15);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-content .el-icon {
  color: var(--yougi-primary);
}

/* 表格容器 */
.data-table {
  width: 100%;
}

/* 分页样式 */
.rank-view-footer {
  margin-top: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.modern-pagination {
  padding: 8px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
}

:deep(.modern-pagination .el-pager li) {
  background: transparent;
  color: var(--yougi-text);
  font-weight: 500;
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

:deep(.modern-pagination .el-pager li:hover) {
  background: var(--yougi-primary);
  color: white;
  transform: scale(1.1);
}

:deep(.modern-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  color: white;
  font-weight: 700;
}

:deep(.modern-pagination button) {
  background: transparent;
  color: var(--yougi-text);
  padding: 0 8px;
  height: 36px;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

:deep(.modern-pagination button:hover) {
  background: var(--yougi-primary);
  color: white;
}

:deep(.modern-pagination button:disabled) {
  background: transparent;
  color: var(--yougi-text-disabled);
}

:deep(.el-pagination__jump) {
  color: var(--yougi-text);
  font-weight: 500;
}

/* 响应式 */
@media screen and (max-width: 768px) {
  .rank-view {
    padding: 20px;
  }
  
  .header-title {
    font-size: 22px;
  }
  
  .rank-view-header-selector {
    flex-direction: column;
  }
  
  .selector-group {
    min-width: 100%;
  }
}
</style>
