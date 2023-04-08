<template>
  <div class="account-wrapper" style="--delay: .8s">
    <div class="account-profile">
      <img :src="avatar" alt="">
      <div class="blob-wrap">
        <div class="blob"></div>
        <div class="blob"></div>
        <div class="blob"></div>
      </div>
      <div class="account-name">{{store.state.user.username}}</div>
      <div class="account-title">{{store.state.user.is_scuer?'SCUer':'OUTSIDER'}}</div>
    </div>
    <div class="account card" @click="dialogVisible = true">
      <div class="account-cash">{{store.state.user.is_superuser?'管理员':'Cuber'}}</div>
      <div class="account-income">{{store.state.user.email}}</div>
      <div class="account-iban">用户编号: {{store.state.user.id}}</div>
    </div>
  </div>

  <el-dialog
      v-model="dialogVisible"
      title="修改档案"
      width="80%"
      :before-close="handleClose"
      center
      append-to-body
  >
  <!--  don't know why but I have to append it to body to make it work properly  -->
    <profile-edit-dialog />
    <template #footer>
      <span class="dialog-footer" id="profile-edit-dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

import {store} from "@/store";
import {ElMessageBox} from "element-plus";
import {ref} from "vue";
import ProfileEditDialog from "@/views/profile/components/profileEditDialog.vue";
import {get_user_avatar} from "@/utils";

const avatar = await get_user_avatar(store.state.user.username)

const dialogVisible = ref(false)
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('档案修改还未提交，是否要返回？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<style>

</style>
