<template>
  <el-table :data="tableData" style="max-width: 850px;">
    <el-table-column type="index" width="50">
      <template v-slot="scope">
        <span>{{(page - 1) * 10 + (scope.$index + 1)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="username" label="用户名" :width="width"/>
    <el-table-column prop="avg" label="平均" v-if="aorb==='avg'" :formatter="formatter" :width="width"/>
    <el-table-column prop="best" label="最佳" v-if="aorb==='best'" :formatter="formatter" :width="width"/>
    <el-table-column prop="compId" label="比赛" :width="width"/>
    <el-table-column prop="date" label="时间" :width="width"/>
  </el-table>
</template>

<script lang="ts" setup>
import type {TableColumnCtx} from "element-plus";
import type {OmittedResultAvgWithCompId, OmittedResultBestWithCompId, Result} from "@/types";
import {convert_time_num2str} from "@/utils";
import {computed} from "vue";
import {isMobile} from "@/utils/constants";

const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?convert_time_num2str(val):'DNF'
}

defineProps<{
  tableData: OmittedResultAvgWithCompId[] | OmittedResultBestWithCompId[]
  aorb: string
  page: number
}>()

const width = computed(() => {
  return isMobile ? 75 : 200
})
</script>

<style scoped>
:deep(.el-table) {
  --el-table-tr-bg-color: var(--yougi-projects-section)
}
/* 去除表格底部边框 */
:deep(.el-table__inner-wrapper::before) {
  height: 0 !important;
}

:deep(.el-table-fixed-column--left) {
  --el-bg-color: var(--yougi-projects-section);
}
/* 表头颜色 */
:deep(.is-group tr th) {
  background-color: var(--yougi-projects-section) !important;
}
</style>
