<script setup lang="ts">
import {onMounted, onUnmounted, ref, shallowRef, watch} from 'vue';
import * as echarts from 'echarts';
import {convert_time_num2str} from "@/utils";
import {useDark} from "@vueuse/core";
import type {Result} from "@/types";

const chart = ref()
const chartInstance = shallowRef()  // 我tm不知道为什么用shallowRef，否则点击legend会报错，见https://blog.csdn.net/weixin_43272781/article/details/123961543
const isDark = useDark()
const isAvg = ref(true)
const showAvgLine = ref(false)
const isXaxisDate = ref(true)

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
    const dictOfDate2Competition = props.result_set.reduce((acc, cur) => {
        acc[cur.date] = cur.competition
        return acc
    }, {})
    const date = Array.from(new Set(props.result_set.map((item) => item.date))).sort((a, b) => {
        const dateA = new Date(a)
        const dateB = new Date(b)
        return dateA.getTime() - dateB.getTime()
    })
    const competitions = Array.from(new Set(props.result_set.map((item) => item.competition)))

    const seriesData = uniqueEvents.map((event) => {
        const pre_data = date.map(
            (date) => {
                const result = props.result_set.find((item) => item.event === event && item.date === date)
                return result
                    ? (isAvg.value
                            ? [result.avg, result.competition]
                            : [result.best, result.competition]
                    )
                    : [null, dictOfDate2Competition[date]]
            }
        )
        // now pre_data is like [[10.5, '周赛1'], [20, '周赛1'], null, [9.8, '周赛2'], ...], ordered by date

        let data
        if (!isXaxisDate.value) {
            // 此时横轴为competition，而data中competition相同的必然相邻，以此我们将它们按competition合并。注意要按data中的顺序来，否则时间顺序就错乱了
            data = Object.values(pre_data.reduce((acc, cur) => {
                const now_competition = cur[1]
                if (!(now_competition in acc)) {
                    acc[now_competition] = cur[0]
                }
                else if (now_competition in acc && cur[0] !== null) {
                    acc[now_competition] = cur[0]
                }
                return acc
            }, {}))
        }
        else {
            data = pre_data.map((item) => item[0]===null?null:item[0])
        }

        return {
            name: event,
            type: 'line',
            data: data,
            smooth: true,
            connectNulls: true,
            markLine: {
                data: showAvgLine.value?[{ type: 'average', name: 'Avg' }]:null
            }
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
            data: isXaxisDate.value?date:competitions,
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
watch([isAvg, showAvgLine, isXaxisDate], () => {
    updateChart()
})

window.addEventListener('resize', () => chartInstance.value.resize())


</script>

<template>
  <div class="switch-group">
    <el-switch v-model="isAvg" active-text="平均" inactive-text="单次" inactive-color="#13ce66" inline-prompt/>
    <el-switch v-model="isXaxisDate" active-text="按时间" inactive-text="按比赛" inactive-color="#00ce66" inline-prompt/>
    <el-switch v-model="showAvgLine" active-text="显示均值线" inactive-text="隐藏均值线" inline-prompt/>
  </div>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<style scoped>
.switch-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
</style>
