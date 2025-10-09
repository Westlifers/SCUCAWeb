<script setup lang="ts">
import {onMounted, onUnmounted, type Ref, ref, shallowRef, watch} from 'vue';
import * as echarts from 'echarts';
import {useDark} from "@vueuse/core";
import type {Result} from "@/types";

const chart = ref()
const chartInstance = shallowRef()
const isDark = useDark()
const year = ref(2024)

const props = defineProps<{
  result_set: Result[]
}>()

const years: Ref<number[]> = ref([])


// 数据处理函数，从props.result_set中针对年份获取数据
const getVirtualData = (year: number) => {
  const count: string[] = []
  // 首先简化数据，只保留date
  for (let result of props.result_set) {
    const thisYear = new Date(result.date).getFullYear()
    // 添加年份到years
    if (!years.value.includes(thisYear)) {
      years.value.push(thisYear)
    }
    // 如果年份不是year，就跳过
    if (thisYear !== year) {
      continue
    }
    count.push(result.date)
  }
  // 然后对count计数，相同元素的个数即为该日期的step count
  const countMap = count.reduce((acc, cur) => {
    if (cur in acc) {
      acc[cur] += 1
    } else {
      acc[cur] = 1
    }
    return acc
  }, {})

  return Object.keys(countMap).map((key) => {
    return [key, countMap[key]]
  })
}


const init = () => {
  // 基于准备好的dom，初始化echarts实例
  chartInstance.value = echarts.init(chart.value as HTMLDivElement, isDark.value ? 'dark' : 'light');

  updateChart()
}

const updateChart = () => {
  const option = {
    title: {
      top: 30,
      left: 'center',
      text: '今年活跃表'
    },
    tooltip: {},
    visualMap: {
      min: 0,
      max: 15,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 65
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: year.value.toString(),
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData(year.value)
    }
  }

  chartInstance.value.setOption(option);
}

onMounted(() => {
  init()
})
onUnmounted(() => {
  if (chart.value) {
    echarts.dispose(chart.value)
  }
})

watch(isDark, () => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  init()
})

watch(year, () => {
  updateChart()
})

window.addEventListener('resize', () => chartInstance.value.resize())


</script>

<template>
  <div class="chart-wrapper">
    <div class="switch-group">
      <span class="switch-label">选择年份：</span>
      <el-select 
        v-model="year" 
        placeholder="请选择年份"
        style="width: 140px"
        size="small"
      >
        <el-option
          v-for="year in years"
          :key="year"
          :label="year"
          :value="year"
        />
      </el-select>
    </div>
    <div ref="chart" class="chart-content"></div>
  </div>
</template>

<style scoped>
.chart-wrapper {
    width: 100%;
}

.switch-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 12px 16px;
    background: var(--yougi-bg-secondary, #f5f7fa);
    border-radius: var(--radius-lg, 8px);
}

.dark .switch-group {
    background: rgba(255, 255, 255, 0.05);
}

.switch-label {
    font-size: 14px;
    color: var(--yougi-text-secondary);
    font-weight: 500;
}

.chart-content {
    width: 100%;
    height: 400px;
}
</style>
