<template>

  <el-space size="large">
    <el-select v-model="event" class="m-2" placeholder="选择项目" size="large">
      <el-option
          v-for="event in ALL_EVENTS"
          :key="event"
          :label="event"
          :value="event"
      />
    </el-select>
    <el-select v-model="aorb" class="m-2" placeholder="选择类型" size="large">
      <el-option label="平均" value="avg" />
      <el-option label="单次" value="best" />
    </el-select>
  </el-space>


  <div class="data-table">
    <data-table :table-data="paginationData.results" :aorb="aorb" />

    <el-pagination background layout="prev, pager, next" :page-count="total_page" :current-page="page" @current-change="changePage"/>
  </div>

</template>

<script lang="ts" setup>
import {getRank} from "@/api/fetchData";
import DataTable from "@/views/rank/components/DataTable.vue";
import {computed, Ref, ref, watch} from "vue";
import {RankPaginationData} from "@/types";
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
.data-table {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 90%;
  padding: 20px 0 0 0;
}
</style>
