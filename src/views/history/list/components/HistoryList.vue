<template>
  <div class="history-list">
    <el-table :row-class-name="rowClassName" :data="tableData" style="max-width: 920px" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
      <el-table-column prop="compId" label="比赛名">
        <template v-slot="scope">
          <router-link :to="{path: '/history/detail/' + scope.row.compId}">{{scope.row.compId}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="is_normal" label="是否是周赛" :formatter="formatter"/>
      <el-table-column prop="user_count" label="参赛人数"/>
      <el-table-column prop="event_count" label="开设项目数"/>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import {getCompetitionList} from "@/api/fetchData";
import {Result} from "@/types";
import {TableColumnCtx} from "element-plus";

const tableData = await getCompetitionList()

const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val?'是':'否'
}

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
}

a {
  text-decoration: none;
  color: var(--yougi-link-color);
}

.router-link-active {
  text-decoration: none;
  color: var(--yougi-link-color);
}
::v-deep .hideRow {
  display: none;
}
</style>
