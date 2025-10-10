<template>
  <div class="competition-results">
    <div class="results-header">
      <div class="header-content">
        <div class="header-icon">
          <el-icon :size="32"><Trophy /></el-icon>
        </div>
        <div class="header-text">
          <h2>本周成绩</h2>
          <p class="subtitle">实时更新的魔方竞赛排行榜</p>
        </div>
      </div>
      <div class="selector">
        <el-select v-model="activeEvent" size="large" :suffix-icon="Coin">
          <el-option
              v-for="event in events"
              :key="event"
              :label="event"
              :value="event"
          >
            <span class="cubing-icon" :class="`event-${translateEventForScramble(event)}`"><span style="margin-left: 5px">{{event}}</span></span>
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="results-table" v-if="ClassifiedTableData[activeEvent]!==undefined">
      <DataTable :table-data="ClassifiedTableData[activeEvent]" :avatars="avatars"></DataTable>
    </div>
    <div class="results-table empty-state" v-else>
      <div class="empty-icon">
        <el-icon :size="64"><DocumentDelete /></el-icon>
      </div>
      <p>还没有人参加此项目~</p>
      <p class="empty-hint">成为第一个挑战者吧！</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getComp} from "@/api/fetchData";
import type {Ref} from "vue";
import {computed, ref, watch} from "vue";
import {
    classifyTableDataByEvent,
    get_user_avatar,
    getSortedEventsFromTableData,
    translateEventForScramble
} from "@/utils";
import DataTable from "@/components/competitionDetail/DataTable.vue";
import type {apiUsedEventName, DetailedCompetition} from "@/types";
import { Trophy, Coin, DocumentDelete } from '@element-plus/icons-vue'

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
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 40px;
  display: flex;
  flex-direction: column;
  flex: 2;
  height: calc(100vh - 120px);
  box-shadow: var(--shadow-xl);
  border: 2px solid var(--yougi-border);
  position: relative;
  overflow: hidden;
  animation: fadeInLeft 0.6s ease-out;
}

.competition-results::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--yougi-primary), var(--yougi-accent), var(--yougi-primary));
  background-size: 200% 100%;
  animation: gradientSlide 3s ease infinite;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes gradientSlide {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
}

/* Header Styles */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-lg);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
}

.header-text h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.header-text .subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--yougi-text-secondary);
  font-weight: 500;
}

.selector {
  display: flex;
  align-items: center;
}

.selector :deep(.el-select) {
  min-width: 150px;
}

.selector :deep(.el-input__wrapper) {
  border-radius: var(--radius-lg);
  border: 2px solid var(--yougi-border);
  background: var(--yougi-bg-secondary);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.selector :deep(.el-input__wrapper:hover) {
  border-color: var(--yougi-primary);
  background: var(--yougi-card-bg);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.selector :deep(.el-input__wrapper.is-focus) {
  border-color: var(--yougi-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Table Styles */
.results-table {
  margin-bottom: 24px;
  height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Empty State */
.empty-state {
  flex-direction: column;
  gap: 16px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--yougi-primary);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-state p {
  font-size: 18px;
  font-weight: 600;
  color: var(--yougi-text);
  margin: 0;
}

.empty-hint {
  font-size: 14px !important;
  color: var(--yougi-text-secondary) !important;
  font-weight: 400 !important;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .competition-results {
    padding: 24px;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-text h2 {
    font-size: 24px;
  }

  .selector {
    width: 100%;
  }

  .selector :deep(.el-select) {
    width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .header-icon {
    width: 48px;
    height: 48px;
  }

  .header-text h2 {
    font-size: 20px;
  }
}
</style>
