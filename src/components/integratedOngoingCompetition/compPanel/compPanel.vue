<template>
  <div class="competition-results">
    <div class="results-header">
      <p>本周成绩</p>
      <div class="selector">
        <el-button icon="ArrowLeft" size="small" round :disabled="events.indexOf(activeEvent) <= 0"
                   @click="activeEvent=events[events.indexOf(activeEvent) - 1]" />
        <span>{{activeEvent}}</span>
        <el-button icon="ArrowRight" size="small" round :disabled="events.indexOf(activeEvent) >= events.length - 1"
                   @click="activeEvent=events[events.indexOf(activeEvent) + 1]"/>
      </div>
    </div>

    <div class="results-table">
      <DataTable :table-data="ClassifiedTableData[activeEvent]"></DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getComp} from "@/api/fetchData";
import {computed, ref} from "vue";
import {classifyTableDataByEvent, getSortedEventsFromTableData} from "@/utils";
import DataTable from "@/components/competitionDetail/DataTable.vue";

const props = defineProps<{
  comp: string
}>()

let tableData

tableData = await getComp(props.comp)

const activeEvent = ref('333')

const ClassifiedTableData = computed(() => classifyTableDataByEvent(tableData))

const events = computed(() => getSortedEventsFromTableData(tableData))
</script>

<style scoped>
.competition-results {
  background-color: var(--yougi-projects-section);
  border-radius: 32px;
  padding: 32px 32px 0 32px;
  display: flex;
  flex-direction: column;
  flex: 2;
  height: calc(100vh - 120px);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  opacity: 0.9;
}

.selector {
  display: flex;
  justify-content: space-between;
}

.selector span {
  margin-left: 10px;
  margin-right: 10px;
  width: 50px;
}

.results-table {
  margin-bottom: 24px;
  height: 85%;
  display: flex;
  justify-content: center;
}
</style>
