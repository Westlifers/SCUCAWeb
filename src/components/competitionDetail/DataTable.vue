<template>
  <el-table :data="tableData" style="max-width: 920px" max-height="750" border >
    <el-table-column fixed prop="username" label="用户名" width="200"/>
    <el-table-column prop="time_1" label="第一次" :formatter="formatter" width="120"/>
    <el-table-column prop="time_2" label="第二次" :formatter="formatter" width="120"/>
    <el-table-column prop="time_3" label="第三次" :formatter="formatter" width="120"/>
    <el-table-column prop="time_4" label="第四次" :formatter="formatter" v-if="maxScrambleCount===5" width="120"/>
    <el-table-column prop="time_5" label="第五次" :formatter="formatter" v-if="maxScrambleCount===5" width="120"/>
    <el-table-column prop="avg" label="平均" :formatter="formatter" width="120" :sortable="true" :sort-method="sort_avg_count_in_zero"/>
    <el-table-column prop="best" label="最佳" :formatter="formatter" width="120" :sortable="true" :sort-method="sort_best_count_in_zero"/>
  </el-table>
</template>

<script lang="ts" setup>
import {TableColumnCtx} from "element-plus";
import {Result} from "@/types";
import {time_convert} from "@/utils";
import {computed} from "vue";


const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?time_convert(val):'DNF'
}

const maxScrambleCount = computed(() => {
  const specs: string[] = ['333bld', '444bld', '555bld', '666', '777']
  if (specs.indexOf(props.tableData[0].event) > -1) {
    return 3
  } else {
    return 5
  }
})

const sort_avg_count_in_zero = (obj_a, obj_b) => {
  let a = obj_a.avg
  let b = obj_b.avg
  if (a == 0) {
    a = Infinity
  }
  if (b == 0) {
    b = Infinity
  }
  return a - b
}

const sort_best_count_in_zero = (obj_a, obj_b) => {
  let a = obj_a.best
  let b = obj_b.best
  if (a == 0) {
    a = Infinity
  }
  if (b == 0) {
    b = Infinity
  }
  return a - b
}

const props = defineProps<{
  tableData: Result[]
}>()
</script>

<style scoped>

</style>
