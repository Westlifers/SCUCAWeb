<template>
  <el-tabs v-model="activeName" class="demo-tabs" type="card">
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

const props = defineProps<{
  comp: string
}>()

let tableData

tableData = await getComp(props.comp)

const activeName = ref('')

const ClassifiedTableData = computed(() => {
  const classifiedData = {}
  const eventsGot: string[] = []
  for (const result of tableData.result_set) {
    if (eventsGot.indexOf(result.event) > -1) {
      classifiedData[result.event].push(result)
    } else {
      classifiedData[result.event] = [result]
      eventsGot.push(result.event)
    }
  }

  return classifiedData
})

const events = computed(() => {
  const events:string[] = ['333', '222', '444', '555', '666', '777', '333bld', '333oh', 'clock', 'minx', 'pyra', 'skewb', 'sq1', '444bld', '555bld']
  const eventsGot: string[] = []
  for (const result of tableData.result_set) {
    if (!(eventsGot.indexOf(result.event) > -1)) {
      eventsGot.push(result.event)
    }
  }

  // 排序
  const sorted_events:string[] = []
  for (const event of events) {
    if (eventsGot.indexOf(event) > -1) {
      sorted_events.push(event)
    }
  }

  return sorted_events
})

</script>

<style scoped>
.demo-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.el-tabs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
