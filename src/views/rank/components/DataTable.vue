<template>
  <el-table :data="tableData" style="max-width: 920px;" border >
    <el-table-column type="index">
      <template v-slot="scope">
        <span>{{(page - 1) * 10 + (scope.$index + 1)}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="username" label="用户名" width="320"/>
    <el-table-column prop="avg" label="平均" v-if="aorb==='avg'" :formatter="formatter" width="200"/>
    <el-table-column prop="best" label="最佳" v-if="aorb==='best'" :formatter="formatter" width="200"/>
    <el-table-column prop="compId" label="比赛" width="200"/>
    <el-table-column prop="date" label="时间" width="200"/>
  </el-table>
</template>

<script lang="ts" setup>
import {TableColumnCtx} from "element-plus";
import {OmittedResultAvgWithCompId, OmittedResultBestWithCompId, Result} from "@/types";
import {time_convert} from "@/utils";

const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?time_convert(val):'DNF'
}

defineProps<{
  tableData: OmittedResultAvgWithCompId[] | OmittedResultBestWithCompId[]
  aorb: string
  page: number
}>()
</script>

<style scoped>

</style>
