<template>
  <el-popover
      placement="top"
      :width="width"
      trigger="hover"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <div class="user-avatar">
        <el-button class="out-btn" @click="visible=!visible;go_page('profile')" round>
          <el-avatar :src="user.avatar" size="default" />
          <p>{{user.username}}</p>
        </el-button>
      </div>
    </template>
    <template #default>
      <div class="hello">
        <h3>{{isLoggedIn?'你好，' + user.username: '请登录'}}</h3>
        <el-button v-if="isLoggedIn" @click="logout_all" round>登出</el-button>
        <el-button v-if="!isLoggedIn" @click="go_page('login')" round>登陆</el-button>
      </div>
      <el-table :data="integratedUserData" v-if="isLoggedIn" style="max-width: 1024px" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
        <el-table-column label="平均">
          <el-table-column prop="dateAvg" label="时间" />
          <el-table-column prop="avg" :formatter="formatter" label="成绩" />
        </el-table-column>

        <el-table-column prop="event" label="项目" />

        <el-table-column label="单次">
          <el-table-column prop="best" :formatter="formatter" label="成绩" />
          <el-table-column prop="dateBest" label="时间" />
        </el-table-column>
      </el-table>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import {LOG_OUT, store} from "@/store";
import {computed, ref} from "vue";
import {logout} from "@/api/service";
import {go_page, time_convert} from "@/utils";
import router from "@/router";
import {getUserPb} from "@/api/fetchData";
import {Record, Result} from "@/types";
import {TableColumnCtx} from "element-plus";

const user = computed(() => store.state.user)
const isLoggedIn = computed(() => user.value['username'] != '')
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

const formatter = (row: Result, column: TableColumnCtx<Result>) => {
  const val = row[column.property]
  return val>0?time_convert(val):'DNF'
}

const visible = ref(false)

const logout_all = async () => {
  await logout()
  store.commit(LOG_OUT)
  await router.push({name: 'login'})
}

// check if device is mobile
const isMobile = computed(() => {
  return window.innerWidth <= 768
})
const width = computed(() => {
  return isMobile.value ? 300 : 600
})
</script>

<style scoped>
.hello {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: 5px;
}
.hello h3 {
  margin-right: 20px;
}

button.out-btn {
  border: none;
  background-color: var(--yougi-bg-color);
  color: var(--yougi-main-color);
}

.user-avatar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.out-btn span p {
  color: var(--yougi-main-color);
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  margin-left: 10px;
}
</style>
