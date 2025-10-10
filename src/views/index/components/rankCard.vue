<template>
  <div class="rank-card">
    <div class="rank-header">
      <div class="header-content">
        <el-icon class="header-icon"><Histogram /></el-icon>
        <h2 class="header-title">历史排名</h2>
      </div>
      
      <div class="rank-header-selector">
        <div class="selector-group">
          <el-select v-model="event" placeholder="选择项目" size="small" class="event-select">
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
          <el-select v-model="aorb" placeholder="选择类型" size="small" class="type-select">
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
      <data-table :table-data="paginationData.results" :aorb="aorb" :page="page" height="100%" />
    </div>

    <div class="rank-footer">
      <el-pagination 
        background 
        layout="prev, pager, next" 
        :page-count="total_page" 
        :current-page="page" 
        @current-change="changePage"
        class="modern-pagination"
        small
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
import { Histogram, TrendCharts, Aim } from '@element-plus/icons-vue';

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
.rank-card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 24px;
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.5s ease-out;
  height: calc(100vh - 60px - 40px - 20px);
  min-height: 500px;
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
.rank-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--yougi-border);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: var(--yougi-primary);
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 选择器样式 */
.rank-header-selector {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

:deep(.event-select),
:deep(.type-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background: var(--yougi-bg-secondary);
  border: 2px solid var(--yougi-border);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  box-shadow: none;
}

:deep(.el-select .el-input__wrapper:hover) {
  border-color: var(--yougi-primary);
  box-shadow: 0 0 0 2px rgba(var(--yougi-primary-rgb), 0.1);
}

:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: var(--yougi-primary);
  box-shadow: 0 0 0 2px rgba(var(--yougi-primary-rgb), 0.15);
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
  flex: 1;
  overflow: hidden;
}

:deep(.modern-rank-table) {
  font-size: 13px;
}

:deep(.modern-rank-table .el-table__header) {
  font-size: 13px;
}

:deep(.modern-rank-table .el-table__body) {
  font-size: 13px;
}

/* 分页样式 */
.rank-footer {
  margin-top: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.modern-pagination {
  padding: 6px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
}

:deep(.modern-pagination .el-pager li) {
  background: transparent;
  color: var(--yougi-text);
  font-weight: 500;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: var(--radius-md);
  margin: 0 2px;
  transition: all 0.3s ease;
}

:deep(.modern-pagination .el-pager li:hover) {
  background: var(--yougi-primary);
  color: white;
}

:deep(.modern-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  color: white;
  font-weight: 700;
}

:deep(.modern-pagination .btn-prev),
:deep(.modern-pagination .btn-next) {
  background: transparent;
  color: var(--yougi-text);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

:deep(.modern-pagination .btn-prev:hover),
:deep(.modern-pagination .btn-next:hover) {
  background: var(--yougi-primary);
  color: white;
}

:deep(.modern-pagination .btn-prev:disabled),
:deep(.modern-pagination .btn-next:disabled) {
  background: transparent;
  color: var(--yougi-text-secondary);
  opacity: 0.5;
}
</style>
