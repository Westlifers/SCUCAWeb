<template>
  <el-popover
      placement="left"
      trigger="hover"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <div class="user-avatar">
        <el-button class="out-btn" @click="visible=!visible;go_page('profile')" round>
          <el-avatar :src="avatar" size="default" />
          <p>{{store.user.username}}</p>
        </el-button>
      </div>
    </template>
    <template #default>
      <div class="hello">
        <el-button v-if="isLoggedIn" @click="logout_all" round>登出</el-button>
        <el-button v-if="!isLoggedIn" @click="go_page('login')" round>登陆</el-button>
      </div>
   </template>
  </el-popover>
</template>

<script lang="ts" setup>
import {localStore} from "@/store";
import {computed, ref} from "vue";
import {logout} from "@/api/service";
import {get_user_avatar, go_page} from "@/utils";
import router from "@/router";

const store = localStore()

const avatar = await get_user_avatar(store.user.username)
const isLoggedIn = computed(() => store.user.username !== '')

const visible = ref(false)

const logout_all = async () => {
  await logout()
  await store.logOut()
  await router.push({name: 'login'})
}

</script>

<style scoped>
.hello {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: 5px;
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
