<script setup lang="ts">
import LineDateTime from "@/views/profile/components/charts/lineDateTime.vue";
import {ref, shallowRef} from "vue";
import {getAllResultOfUser} from "@/api/fetchData";
import PieEvents from "@/views/profile/components/charts/pieEvents.vue";
import HeatMap from "@/views/profile/components/charts/heatMap.vue";

const result_set = await getAllResultOfUser()
const chart = ref('HeatMap')  // el-select似乎不能使用shallowRef/ref包装对象来作为选择结果，所以拐了个弯，用字符串到字典去对应
const allCharts = shallowRef({
    'LineDateTime': {
       'chartComponent': LineDateTime,
       'description': '各项目成绩关于日期折线图'
    },
    'PieEvents': {
        'chartComponent': PieEvents,
        'description': '各项目占比饼图'
    },
    'HeatMap': {
        'chartComponent': HeatMap,
        'description': '活跃热力图'
    }
})

</script>

<template>
  <div class="cards-wrapper" style="--delay: .7s">
    <div class="cards-header">
      <div class="cards-view">
        <el-icon size="40"><DataAnalysis /></el-icon>
        数据分析
      </div>
      <el-select 
        v-model="chart" 
        placeholder="请选择图表"
        style="width: 200px"
        size="default"
      >
        <el-option
          v-for="(val, key) in allCharts"
          :key="key"
          :label="val.description"
          :value="key"
        />
      </el-select>
    </div>
    <div class="cards card chart-container">
      <component :is="allCharts[chart].chartComponent" :result_set="result_set" />
    </div>
  </div>
</template>

<style scoped>
.cards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    background: var(--yougi-card-bg);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    border-bottom: 1px solid var(--yougi-border);
}

.cards-view {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    font-size: 18px;
    color: var(--yougi-text);
}

.chart-container {
    padding: 24px;
    background: var(--yougi-card-bg);
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}
</style>
