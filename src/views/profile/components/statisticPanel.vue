<script setup lang="ts">
import LineDateTime from "@/views/profile/components/charts/lineDateTime.vue";
import {shallowRef} from "vue";
import {getAllResultOfUser} from "@/api/fetchData";
import PieEvents from "@/views/profile/components/charts/pieEvents.vue";

const result_set = await getAllResultOfUser()
const chart = shallowRef(LineDateTime)
const allCharts = shallowRef([
  {
      'chartComponent': LineDateTime,
      'description': '各项目成绩关于日期折线图'
  },
  {
    'chartComponent': PieEvents,
    'description': '各项目占比饼图'
  }
])

</script>

<template>
  <div class="cards-wrapper" style="--delay: .7s">
    <div class="cards-header">
      <div class="cards-view">
        <el-icon size="40"><DataAnalysis /></el-icon>
        数据分析
      </div>
      <el-select v-model="chart" placeholder="请选择图表">
        <el-option
          v-for="comp in allCharts"
          :key="comp.chartComponent"
          :label="comp.description"
          :value="comp.chartComponent"
        />
      </el-select>
    </div>
    <div class="cards card">
      <component :is="chart as string" :result_set="result_set" />
    </div>
  </div>
</template>

<style scoped>
.cards-header {
    display: flex;
    justify-content: space-between;
}

.cards-view {
    display: flex;
    align-items: center;
}
</style>
