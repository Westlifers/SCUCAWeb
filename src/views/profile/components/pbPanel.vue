<template>
  <div class="cards-wrapper" style="--delay: 1s">
    <div class="cards-header">
      <div class="cards-view">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M16 2v4M8 2v4M3 10h18"></path>
        </svg>
        个人PB
      </div>
      <div class="cards-button button">
        Keep cubing, and keep moving!
      </div>
    </div>
    <div class="cards card">
      <table class="table">
        <thead>
        <tr>
          <th>项目</th>
          <th>平均</th>
          <th>日期</th>
          <th>最佳</th>
          <th>日期</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="result in integratedUserData" :key="result.event">
            <td>
              <span class="time">{{result.event}}</span>
            </td>
            <td>{{result.avg<=0?'DNF':time_convert(result.avg)}}</td>
            <td>{{result.dateAvg}}</td>
            <td>{{result.best<=0?'DNF':time_convert(result.best)}}</td>
            <td>{{result.dateBest}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";
import {time_convert} from "@/utils";
import {getUserPb} from "@/api/fetchData";
import {Record} from "@/types";

const userData: Record = await getUserPb()

interface IntegratedUserData {
  dateAvg: string,
  dateBest: string,
  avg: number,
  best: number,
  event: string
}

const integratedUserData = computed(() => {
  const intData: IntegratedUserData[] = []
  for (const i in userData.avg) {
    const result_avg = userData.avg[i]
    const result_best = userData.best[i]
    intData.push({
      dateAvg: result_avg.date,
      dateBest: result_best.date,
      avg: result_avg.avg,
      best: result_best.best,
      event: result_best.event
    })
  }
  return intData
})

</script>

<style scoped>
.card {
  overflow: auto;
}
</style>
