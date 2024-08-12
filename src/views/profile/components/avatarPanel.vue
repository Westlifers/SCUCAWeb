<template>
  <div class="account-wrapper" style="--delay: .2s">
    <div class="account-profile">
      <img :src="avatar" alt="">
      <div class="blob-wrap">
        <div class="blob"></div>
        <div class="blob"></div>
        <div class="blob"></div>
      </div>
      <div class="account-name">{{store.user.username}}</div>
      <div class="account-title">{{store.user.is_scuer?'SCUer':'OUTSIDER'}}</div>
      <div class="account-qq" v-if="isThereQQBindingRequest">
        QQ号：{{store.user.qq?store.user.qq:'未绑定'}}
        <el-badge is-dot>
          <el-button type="text" size="small" @click="QQDialogVisible = true">改绑</el-button>
        </el-badge>
      </div>
      <div class="account-qq" v-else>
        QQ号：{{store.user.qq?store.user.qq:'未绑定'}}
        <el-button type="text" size="small" @click="QQDialogVisible = true">改绑</el-button>
      </div>
    </div>
    <div class="account card" @click="dialogVisible = true">
      <div class="account-cash">{{store.user.is_superuser?'管理员':'Cuber'}}</div>
      <div class="account-income">{{store.user.email}}</div>
      <div class="account-iban">用户编号: {{store.user.id}}</div>
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

  <el-dialog
      v-model="QQDialogVisible"
      title="修改QQ号"
      width="30%"
      center
      append-to-body
  >
    <QQEditDialog />
  </el-dialog>

</template>

<script lang="ts" setup>

import {localStore} from "@/store";
import {ElMessageBox} from "element-plus";
import {computed, ref} from "vue";
import ProfileEditDialog from "@/views/profile/components/profileEditDialog.vue";
import {get_user_avatar} from "@/utils";
import QQEditDialog from "@/views/profile/components/QQEditDialog.vue";

const store = localStore()
const avatar = await get_user_avatar(store.user.username)

const isThereQQBindingRequest = computed(() => store.QQBindingRequest.qq !== '')

const dialogVisible = ref(false)
const QQDialogVisible = ref(false)
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
