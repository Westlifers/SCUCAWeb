<template>
  <div class="rank-view">
    <div class="rank-view-header">
      <div class="rank-view-header-title">
        <p>历史排名</p>
      </div>
      <div class="rank-view-header-selector">
        <el-select v-model="event" placeholder="选择项目" size="small">
          <el-option
              v-for="event in ALL_EVENTS"
              :key="event"
              :label="event"
              :value="event"
          />
        </el-select>
        <el-select v-model="aorb" placeholder="选择类型" size="small">
          <el-option label="平均" value="avg" />
          <el-option label="单次" value="best" />
        </el-select>
      </div>
    </div>

    <div class="data-table">
      <data-table :table-data="paginationData.results" :aorb="aorb" :page="page" />
    </div>

    <div class="rank-view-footer">
      <el-pagination background layout="prev, pager, next" :page-count="total_page" :current-page="page" @current-change="changePage"/>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {getRank} from "@/api/fetchData";
import DataTable from "@/views/rank/components/DataTable.vue";
import type {Ref} from "vue";
import {computed, ref, watch} from "vue";
import type {RankPaginationData} from "@/types";
import {ALL_EVENTS} from "@/utils";

// contributed by ChatGPT, cheers for AI!

const paginationData: Ref<RankPaginationData> = ref(await getRank('333', 'avg', 1))

const loadPaginationData = async () => {
  return await getRank(event.value, aorb.value, page.value)
}

const updatePaginationData = async () => {
  paginationData.value = await loadPaginationData()
}

const event = ref('333')

const aorb = ref('avg')

const page = ref(1)

const total_page = computed(() => paginationData.value.count)

watch([event, aorb, page], updatePaginationData)

const changePage = (current_page) => {
  page.value = current_page
}
</script>

<style scoped>
.rank-view {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: var(--yougi-projects-section);
  border-radius: 32px;
  padding: 32px 32px 32px 32px;
}

.rank-view-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rank-view-header-title {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
.rank-view-header-title p {
  font-size: 24px;
  font-weight: 600;
  opacity: 0.8;
  margin-bottom: 32px;
  text-align: left;
  color: var(--yougi-main-color);
}

.rank-view-header-selector {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

:deep(.el-select) {
  width: 100px;
}

.rank-view-footer {
  margin-top: 20px;
}
</style>
