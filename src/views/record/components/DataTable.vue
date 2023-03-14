<template>
  <div class="record-table">
    <el-table :data="tableData" style="max-width: 1024px" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>

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
import {Record, Result} from "@/types";
import {getScuRecord} from "@/api/fetchData";
import {computed} from "vue";
import {TableColumnCtx} from "element-plus";
import {time_convert} from "@/utils";

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
  const tableData: integratedData[] = []
  for (const i in record.avg) {
    let result_avg = record.avg[i]
    let result_best = record.best[i]
    let intData: integratedData = {
      usernameAvg: result_avg.username,
      dateAvg: result_avg.date,
      usernameBest: result_best.username,
      dateBest: result_best.date,
      avg: result_avg.avg,
      best: result_best.best,
      event: result_best.event
    }
    tableData.push(intData)
  }

  return tableData
})
</script>

<style scoped>
.record-table {
  display: flex;
  justify-content: center;
}
</style>
