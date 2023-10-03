<template>
  <el-table :data="tableData" style="max-width: 880px" :header-cell-style="{background:'var(--yougi-projects-section)'}"
            height="90%">

    <!--  appear for mobile devices  -->
    <el-table-column type="expand" v-if="isMobile">
      <template #default="props">
        <el-table :data="[{time_1: props.row.time_1, time_2: props.row.time_2, time_3: props.row.time_3, time_4: props.row.time_4, time_5: props.row.time_5}]">
          <el-table-column prop="time_1" label="第一次" :formatter="formatter"/>
          <el-table-column prop="time_2" label="第二次" :formatter="formatter"/>
          <el-table-column prop="time_3" label="第三次" :formatter="formatter"/>
          <el-table-column prop="time_4" label="第四次" :formatter="formatter" v-if="maxScrambleCount===5"/>
          <el-table-column prop="time_5" label="第五次" :formatter="formatter" v-if="maxScrambleCount===5"/>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column prop="username" label="用户名" :width="maxScrambleCount===5 || isMobile?width:3 * width" :fixed="!isMobile">
      <template v-slot:default="scope">
        <div class="username">
          <el-avatar :src="avatars[scope.row.username]" size="small"></el-avatar>
          <p>{{scope.row.username}}</p>
        </div>
      </template>
    </el-table-column>
    <!--  appear for PC  -->
    <el-table-column prop="time_1" label="第一次" :formatter="formatter" :width="width" v-if="!isMobile"/>
    <el-table-column prop="time_2" label="第二次" :formatter="formatter" :width="width" v-if="!isMobile"/>
    <el-table-column prop="time_3" label="第三次" :formatter="formatter" :width="width" v-if="!isMobile"/>
    <el-table-column prop="time_4" label="第四次" :formatter="formatter" v-if="maxScrambleCount===5 && !isMobile" :width="width"/>
    <el-table-column prop="time_5" label="第五次" :formatter="formatter" v-if="maxScrambleCount===5 && !isMobile" :width="width"/>

    <el-table-column prop="avg" label="平均" :width="width" :sortable="true" :sort-method="sort_avg_count_in_zero">
      <template v-slot:default="scope">
        <el-badge value="SCUR" class="item" v-if="scope.row.is_avg_scur">
          <div class="badge-value">
            {{ scope.row.avg > 0 ? convert_time_num2str(scope.row.avg) : 'DNF' }}
          </div>
        </el-badge>
        <div v-else>{{ scope.row.avg > 0 ? convert_time_num2str(scope.row.avg) : 'DNF' }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="best" label="最佳" :width="width" :sortable="true" :sort-method="sort_best_count_in_zero">
      <template v-slot:default="scope">
        <el-badge value="SCUR" class="item" v-if="scope.row.is_best_scur">
          <div class="badge-value">
            {{ convert_time_num2str(scope.row.best) }}
          </div>
        </el-badge>
        <div v-else>{{ convert_time_num2str(scope.row.best) }}</div>
      </template>
    </el-table-column>

  </el-table>
</template>

<script lang="ts" setup>
import type {TableColumnCtx} from "element-plus";
import type {Result} from "@/types";
import {SPECIAL_EVENTS, convert_time_num2str} from "@/utils";
import {computed} from "vue";


const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?convert_time_num2str(val):'DNF'
}

const maxScrambleCount = computed(() => {
  if (SPECIAL_EVENTS.indexOf(props.tableData[0].event) > -1) {
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
  avatars: object
}>()

// check if device is mobile
const isMobile = computed(() => {
  return window.innerWidth < 768
})
const width = computed(() => {
  return isMobile.value ? 75 : 110
})

</script>

<style scoped>
.item {
  margin-top: 10px;
}

.badge-value {
  width: 50px;
}

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

.username {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.username p {
  margin-left: 5px;
  opacity: 0.8;
}

:deep(.cell) {
  opacity: 0.8;
}
</style>
