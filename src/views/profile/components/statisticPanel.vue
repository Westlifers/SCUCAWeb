<script setup lang="ts">
import {ref, onMounted, onUnmounted, shallowRef} from 'vue';
import * as echarts from 'echarts';
import {getAllResultOfUser} from "@/api/fetchData";
import {time_convert} from "@/utils";

const chart = ref()
const chartInstance = shallowRef()  // 我tm不知道为什么用shallowRef，见https://blog.csdn.net/weixin_43272781/article/details/123961543
const chartType = ref<'avg' | 'best'>('avg')
const result_set = await getAllResultOfUser()


const toggleChartType = () => {
    chartType.value = chartType.value === 'avg' ? 'best' : 'avg'
    updateChart()
}

const init = () => {
    // 基于准备好的dom，初始化echarts实例
    chartInstance.value = echarts.init(chart.value as HTMLDivElement)
    updateChart()
}

const updateChart = () => {
    const uniqueEvents = Array.from(new Set(result_set.map((item) => item.event))); // 获取唯一事件类型
    const date = Array.from(new Set(result_set.map((item) => item.date))).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime()
    }) // 获取唯一日期

    const seriesData = uniqueEvents.map((event) => {
        const data = date.map(
            (date) => {
                const result = result_set.find((item) => item.event === event && item.date === date)
                return result ? (chartType.value === 'avg' ? result.avg : result.best) : null
            }
        )
        return {
            name: event,
            type: 'line',
            data,
            smooth: true,
            connectNulls: true
        };
    });

    // 指定图表的配置项和数据
    const option = {
        title: {
            text: '成绩统计'
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
                        <span style="font-weight: bold">${value===undefined?'-':time_convert(value)}</span>
                    `
                });
                console.log(seriesInfo)
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
            name: chartType.value === 'avg' ? '平均成绩' : '最佳成绩',
            //会自动获取当前所有数据中最大值和最小值来作为y轴的底点和顶点
            min: 'dataMin',
            max: 'dataMax',
            axisLabel: {
                formatter: time_convert
            },
        },
        legend: {
            data: uniqueEvents,
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
</script>

<template>
  <div class="cards-wrapper" style="--delay: .7s">
    <div class="cards-header">
      <div>
        <el-button @click="toggleChartType">切换成绩类型</el-button>
      </div>
    </div>
    <div class="cards card">
      <div ref="chart" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<style scoped>

</style>
