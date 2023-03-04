<template>
  <el-popover
      :visible="visible"
      placement="top"
      :width="300"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <el-button @click="visible=!visible" icon="User" color="#EC4141FF" round/>
    </template>
    <template #default>
      <div class="hello">
        <h3>{{isLoggedIn?'你好，' + userData[0]['username']: '请登录'}}</h3>
        <el-button v-if="isLoggedIn" @click="logout_all" round>登出</el-button>
        <el-button v-if="!isLoggedIn" @click="go_page('login')" round>登陆</el-button>
      </div>
      <el-table :data="userData" v-if="isLoggedIn">
        <el-table-column width="100" property="username" label="用户名" />
        <el-table-column width="150" property="email" label="email" />
      </el-table>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import {CLEAR_USER, store} from "@/store";
import {computed, ref} from "vue";
import {logout} from "@/api/service";
import {go_page} from "@/utils";
import router from "@/router";

const user = computed(() => store.state.user)
const isLoggedIn = computed(() => user.value['username'] != '')
const userData = computed(() => [
  {
    'username': user.value.username,
    'email': user.value.email
  }
])

const visible = ref(false)

const logout_all = async () => {
  await router.push({name: 'overview'})
  await logout()
  store.commit(CLEAR_USER)
}
</script>

<style scoped>
.hello {
  display: flex;
  flex-wrap: nowrap;
}
.hello h3 {
  margin-right: 20px;
}
</style>
