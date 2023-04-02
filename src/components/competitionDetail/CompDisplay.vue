<template>
  <el-tabs v-model="activeName" class="demo-tabs" tab-position="left">
    <el-tab-pane v-for="(event, key) in events" :key="key" :name="event" :label="event">
      <DataTable :table-data="ClassifiedTableData[event]"></DataTable>
    </el-tab-pane>
  </el-tabs>
  <div v-if="events.length===0">No data</div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import DataTable from "@/components/competitionDetail/DataTable.vue";
import {getComp} from "@/api/fetchData";
import {classifyTableDataByEvent, getSortedEventsFromTableData} from "@/utils";

const props = defineProps<{
  comp: string
}>()

let tableData

tableData = await getComp(props.comp)

const activeName = ref('')

const ClassifiedTableData = computed(() => classifyTableDataByEvent(tableData))

const events = computed(() => getSortedEventsFromTableData(tableData))

</script>

<style scoped>
.demo-tabs {
  display: flex;
  justify-content: center;
}
.el-tabs {
  display: flex;
  justify-content: left;
}
</style>
