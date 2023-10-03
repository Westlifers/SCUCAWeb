<template>
  <div class="competition-results">
    <div class="results-header">
      <p>本周成绩</p>
      <div class="selector">
        <el-button icon="ArrowLeft" size="small" round :disabled="events.indexOf(activeEvent) <= 0"
                   @click="emits('setEvent', events[events.indexOf(activeEvent) - 1])" />
        <p>
          <el-select v-model="activeEvent">
            <el-option
                v-for="event in events"
                :key="event"
                :label="event"
                :value="event"
            />
          </el-select>
        </p>
        <el-button icon="ArrowRight" size="small" round :disabled="events.indexOf(activeEvent) >= events.length - 1"
                   @click="emits('setEvent', events[events.indexOf(activeEvent) + 1])"/>
      </div>
    </div>

    <div class="results-table" v-if="ClassifiedTableData[activeEvent]!==undefined">
      <DataTable :table-data="ClassifiedTableData[activeEvent]" :avatars="avatars"></DataTable>
    </div>
    <div class="results-table" v-else>
      <p>还没有人参加此项目~</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getComp} from "@/api/fetchData";
import type {Ref} from "vue";
import {computed, ref, watch} from "vue";
import {classifyTableDataByEvent, get_user_avatar, getSortedEventsFromTableData} from "@/utils";
import DataTable from "@/components/competitionDetail/DataTable.vue";
import type {apiUsedEventName, DetailedCompetition} from "@/types";

const props = defineProps<{
  comp: string
  activeEvent: apiUsedEventName
}>()
const activeEvent: Ref<apiUsedEventName> = ref<apiUsedEventName>(props.activeEvent)
watch(activeEvent, (newVal) => {
  emits('setEvent', newVal)
})
watch(() => props.activeEvent, (newVal) => {
  activeEvent.value = newVal
})

let tableData: DetailedCompetition

tableData = await getComp(props.comp)

const ClassifiedTableData = computed(() => classifyTableDataByEvent(tableData))

const events = computed(() => getSortedEventsFromTableData(tableData))

const emits = defineEmits<{
  (e: 'setEvent', event: apiUsedEventName): void
}>()

// calculate every author's avatar, so that we don't need to fetch it every time
const avatars = {}
for (let i = 0; i < tableData.result_set.length; i++) {
  const author = tableData.result_set[i].username
  if (author in avatars) continue
  avatars[tableData.result_set[i].username] = await get_user_avatar(tableData.result_set[i].username)
}

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
  align-items: center;
}

.selector p {
  margin-left: 10px;
  margin-right: 10px;
  width: 100px;
}

@media screen and (max-width: 600px) {
  .results-header {
    flex-direction: column;
  }

  .results-header p {
    margin-bottom: 16px;
  }
}

.results-table {
  margin-bottom: 24px;
  height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-table p {
  font-size: 18px;
  line-height: 32px;
  font-weight: 400;
  opacity: 0.8;
}
</style>
