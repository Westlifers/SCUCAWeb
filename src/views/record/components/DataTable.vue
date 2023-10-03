<template>
  <div class="record-table">
    <div class="record-header">
      <p>社团记录</p>
    </div>
    <el-table max-height="500" :data="tableData" style="max-width: 1024px" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">

      <el-table-column label="平均">
        <el-table-column prop="dateAvg" label="时间" />
        <el-table-column prop="usernameAvg" label="用户名" />
        <el-table-column prop="avg" :formatter="formatter" label="成绩" />
      </el-table-column>

      <el-table-column prop="event" label="项目" />

      <el-table-column label="单次">
        <el-table-column prop="best" :formatter="formatter" label="成绩" />
        <el-table-column prop="usernameBest" label="用户名" />
        <el-table-column prop="dateBest" label="时间" />
      </el-table-column>

    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type {Record, Result} from "@/types";
import {getScuRecord} from "@/api/fetchData";
import {computed} from "vue";
import type {TableColumnCtx} from "element-plus";
import {ALL_EVENTS, convert_time_num2str} from "@/utils";

const record: Record = await getScuRecord()

const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?convert_time_num2str(val):val===-1?'':'DNF'
}

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
  // before we integrate the data, note that the avg part and best part are not necessarily of the same length
  // one may have some events that the other doesn't have.
  // so we need to add empty data to the corresponding part, this action is mutual,
  // however, we don't need to iterate twice, instead, since both part is sorted by event,
  // we initialize an entirely empty array, and then iterate through both part, and fill the empty array
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
    const j = ALL_EVENTS.indexOf(result_avg.event)
    emptyData[j].usernameAvg = result_avg.username
    emptyData[j].dateAvg = result_avg.date
    emptyData[j].avg = result_avg.avg
  }

  for (const i in record.best) {
    let result_best = record.best[i]
    const j = ALL_EVENTS.indexOf(result_best.event)
    emptyData[j].usernameBest = result_best.username
    emptyData[j].dateBest = result_best.date
    emptyData[j].best = result_best.best
  }

  return emptyData
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

.record-table {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: var(--yougi-projects-section);
  border-radius: 32px;
  padding: 32px 32px 32px 32px;
}

.record-header {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.record-header p {
  font-size: 24px;
  font-weight: 500;
  opacity: 0.8;
  margin-bottom: 32px;
  text-align: left;
  color: var(--yougi-main-color);
}
</style>
