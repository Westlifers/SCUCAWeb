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
import {TableColumnCtx} from "element-plus";
import {OmittedResultAvgWithCompId, OmittedResultBestWithCompId, Result} from "@/types";
import {time_convert} from "@/utils";
import {computed} from "vue";

const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?time_convert(val):'DNF'
}

defineProps<{
  tableData: OmittedResultAvgWithCompId[] | OmittedResultBestWithCompId[]
  aorb: string
  page: number
}>()

// check if device is mobile
const isMobile = computed(() => {
  return window.innerWidth <= 768
})
const width = computed(() => {
  return isMobile.value ? 75 : 200
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
