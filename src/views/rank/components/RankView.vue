<template>

  <el-space size="large">
    <el-select v-model="event" class="m-2" placeholder="选择项目" size="large">
      <el-option
          v-for="item in options"
          :key="item.event"
          :label="item.label"
          :value="item.event"
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

const options = [
  {
    event: '222',
    label: '222',
  },
  {
    event: '333',
    label: '333',
  },
  {
    event: '444',
    label: '444',
  },
  {
    event: '555',
    label: '555',
  },
  {
    event: '666',
    label: '666',
  },
  {
    event: '777',
    label: '777',
  },
  {
    event: 'minx',
    label: 'minx',
  },
  {
    event: 'pyra',
    label: 'pyra',
  },
  {
    event: 'sq1',
    label: 'sq1',
  },
  {
    event: 'skewb',
    label: 'skewb',
  },
  {
    event: 'clock',
    label: 'clock',
  },
  {
    event: '333oh',
    label: '333oh',
  },
  {
    event: '333bld',
    label: '333bld',
  },
  {
    event: '444bld',
    label: '444bld',
  },
  {
    event: '555bld',
    label: '555bld',
  },
]
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
