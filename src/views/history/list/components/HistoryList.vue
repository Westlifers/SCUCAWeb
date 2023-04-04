<template>
  <div class="history-list">
    <div class="history-list-header">
      <p>历史赛事</p>
    </div>
    <el-table :row-class-name="rowClassName" :data="tableData" style="max-width: 920px" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
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
:deep(.hideRow) {
  display: none;
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
/* 表头颜色 */
:deep(.is-group tr th) {
  background-color: var(--yougi-projects-section) !important;
}

.history-list {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: var(--yougi-projects-section);
  border-radius: 32px;
  padding: 32px 32px 32px 32px;
}

.history-list-header {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.history-list-header p {
  font-size: 24px;
  font-weight: 500;
  opacity: 0.8;
  margin-bottom: 32px;
  text-align: left;
  color: var(--yougi-main-color);
}
</style>
