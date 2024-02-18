<script setup lang="ts">
import {getComp} from "@/api/fetchData";
import {apiUsedEventName} from "@/types";
import type {Ref} from "vue";
import {computed, ref} from "vue";
import {classifyTableDataByEvent, convert_time_num2str, get_user_avatar} from "@/utils";
import ProgressBar from "@/components/progressBar.vue";

const data = await getComp('week')
const ClassifiedTableData = computed(() => classifyTableDataByEvent(data))
const normalizedData = computed(() => {
  const result = {}
  for (const event in ClassifiedTableData.value) {
    // normalise time_1 etc to (0, 1)
    let allTime = []
    for (const x of ClassifiedTableData.value[event]) {
      allTime.push(x.time_1)
      allTime.push(x.time_2)
      allTime.push(x.time_3)
      allTime.push(x.time_4)
      allTime.push(x.time_5)
    }
    const max = Math.max(...allTime.filter(x => x > 0))
    const min = Math.min(...allTime.filter(x => x > 0))

    result[event] = ClassifiedTableData.value[event].map(x => {
      return {
        username: x.username,
        avg: x.avg,
        time_1: x.time_1 > 0 ? (x.time_1 - min) / (max - min) : 0,
        time_2: x.time_2 > 0 ? (x.time_2 - min) / (max - min) : 0,
        time_3: x.time_3 > 0 ? (x.time_3 - min) / (max - min) : 0,
        time_4: x.time_4 > 0 ? (x.time_4 - min) / (max - min) : 0,
        time_5: x.time_5 > 0 ? (x.time_5 - min) / (max - min) : 0,
      }
    })
  }
  return result
})
const integratedData = computed(() => {
  // integrate ClassifiedTableData and normalizedData, make time_1 etc like [12.2, 0.3], where 12.2 is the time, 0.3 is normalized time
  const result = {}
  for (const event in ClassifiedTableData.value) {
    result[event] = ClassifiedTableData.value[event].map((x, i) => {
      return {
        username: x.username,
        avg: x.avg,
        time_1: [x.time_1, normalizedData.value[event][i].time_1],
        time_2: [x.time_2, normalizedData.value[event][i].time_2],
        time_3: [x.time_3, normalizedData.value[event][i].time_3],
        time_4: [x.time_4, normalizedData.value[event][i].time_4],
        time_5: [x.time_5, normalizedData.value[event][i].time_5],
      }
    })
  }

  return result
})

const activeEvent: Ref<apiUsedEventName> = ref<apiUsedEventName>('333')

const avatars = {}
for (let i = 0; i < data.result_set.length; i++) {
  const author = data.result_set[i].username
  if (author in avatars) continue
  avatars[data.result_set[i].username] = await get_user_avatar(data.result_set[i].username)
}

</script>

<template>
<el-table :data="integratedData[activeEvent]" style="width: 100%">
  <el-table-column prop="username" label="用户名" width="100">
    <template v-slot:default="scope">
      <div class="username">
        <el-avatar :src="avatars[scope.row.username]" size="small"></el-avatar>
        <p>{{scope.row.username}}</p>
      </div>
    </template>
  </el-table-column>
  <el-table-column prop="avg" label="平均"></el-table-column>
  <el-table-column label="详细成绩" width="200">
    <template v-slot:default="scope">
      <progress-bar
          :min="Math.min(...[scope.row.time_1[1], scope.row.time_2[1], scope.row.time_3[1], scope.row.time_4[1], scope.row.time_5[1]].filter(x => x > 0))"
          :max="Math.max(...[scope.row.time_1[1], scope.row.time_2[1], scope.row.time_3[1], scope.row.time_4[1], scope.row.time_5[1]].filter(x => x > 0))"
          show-text
          :left-text="convert_time_num2str(Math.min(...[scope.row.time_1[0], scope.row.time_2[0], scope.row.time_3[0], scope.row.time_4[0], scope.row.time_5[0]].filter(x => x > 0)))"
          :right-text="convert_time_num2str(Math.max(...[scope.row.time_1[0], scope.row.time_2[0], scope.row.time_3[0], scope.row.time_4[0], scope.row.time_5[0]].filter(x => x > 0)))"
      />
    </template>
  </el-table-column>
</el-table>
</template>

<style scoped>
.username {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

.username p {
    margin-left: 10px;
}
</style>
