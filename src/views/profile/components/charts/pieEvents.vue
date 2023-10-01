<script setup lang="ts">
import {onMounted, onUnmounted, ref, shallowRef, watch} from 'vue';
import * as echarts from 'echarts';
import {useDark} from "@vueuse/core";
import type {Result} from "@/types";

const chart = ref()
const chartInstance = shallowRef()
const isDark = useDark()
const isAvg = ref(true)

const props = defineProps<{
    result_set: Result[]
}>()


const init = () => {
    // 基于准备好的dom，初始化echarts实例
    chartInstance.value = echarts.init(chart.value as HTMLDivElement, isDark.value ? 'dark' : 'light');
    updateChart()
}

const updateChart = () => {
    const uniqueEvents = Array.from(new Set(props.result_set.map((item) => item.event))); // 获取唯一事件类型

    const seriesData = uniqueEvents.map((event) => {
        const data = props.result_set.filter((item) => item.event === event)
        return {
            name: event,
            value: data.length
        };
    });

    // 指定图表的配置项和数据
    const option = {
        backgroundColor: '',
        title: {
            text: '各项目占比',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
        },
        series: [{
            name: '成绩',
            type: 'pie',
            data: seriesData
        }],
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        radius: '50%',
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
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
watch(isAvg, () => {
    updateChart()
})

window.addEventListener('resize', () => chartInstance.value.resize())
</script>

<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<style scoped>

</style>
