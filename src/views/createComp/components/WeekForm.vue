<template>
  <div class="form">
    <el-button type="primary" @click="newWeekComp">点此直接开始新的周赛！</el-button>
  </div>
</template>

<script lang="ts" setup>
import {createCompetition} from "@/api/service";
import {ElNotification} from "element-plus";

const newWeekComp = async () => {
  await createCompetition('week', null)
  ElNotification({
    title: '新周赛创建成功',
    message: '新周赛已经创建成功，并关闭了上一周的周赛',
    type: 'success'
  })
}
</script>

<style scoped>

</style>
