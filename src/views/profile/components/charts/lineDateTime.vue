<script setup lang="ts">
import {ref, onMounted, onUnmounted, shallowRef, watch} from 'vue';
import * as echarts from 'echarts';
import {convert_time_num2str} from "@/utils";
import {useDark} from "@vueuse/core";
import type {Result} from "@/types";

const chart = ref()
const chartInstance = shallowRef()  // 我tm不知道为什么用shallowRef，否则点击legend会报错，见https://blog.csdn.net/weixin_43272781/article/details/123961543
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
    const date = Array.from(new Set(props.result_set.map((item) => item.date))).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime()
    }) // 获取唯一日期

    const seriesData = uniqueEvents.map((event) => {
        const data = date.map(
            (date) => {
                const result = props.result_set.find((item) => item.event === event && item.date === date)
                return result ? (isAvg.value ? result.avg : result.best) : null
            }
        )
        return {
            name: event,
            type: 'line',
            data: data,
            smooth: true,
            connectNulls: true
        };
    });

    // 指定图表的配置项和数据
    const option = {
        backgroundColor: '',
        title: {
            text: '成绩统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis', // 设置触发方式为坐标轴
            formatter: function (params) {
                const date = params[0].name;
                const seriesInfo = params.map((param) => {
                    const marker = param.marker;
                    const event = param.seriesName;
                    const value = param.value;
                    return `
                        <span>${marker}</span>
                        <span>${event}</span>
                        <span style="font-weight: bold">${value===undefined?'-':convert_time_num2str(value)}</span>
                    `
                });
                return `
                    ${date}<br/>
                    <div style="display: grid; grid-template-columns: 30px 30px 100px">
                    ${seriesInfo.join('')}
                    </div>
                `
            },
        },
        xAxis: {
            type: 'category',
            data: date
        },
        yAxis: {
            type: 'value',
            name: isAvg.value ? '平均成绩' : '最佳成绩',
            //会自动获取当前所有数据中最大值和最小值来作为y轴的底点和顶点
            min: 'dataMin',
            max: 'dataMax',
            axisLabel: {
                formatter: convert_time_num2str
            },
        },
        legend: {
            data: uniqueEvents,
            left: 'right',
            orient: 'vertical'
        },
        series: seriesData
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
  <el-switch v-model="isAvg" active-text="平均" inactive-text="单次" inactive-color="#13ce66" inline-prompt/>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<style scoped>

</style>
