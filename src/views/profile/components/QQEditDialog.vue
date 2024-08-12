<script setup lang="ts">
import {localStore} from "@/store";
import {onMounted, reactive, ref} from "vue";
import {ElNotification, type FormInstance} from "element-plus";
import {postProfile} from "@/api/service";

const formRef = ref<FormInstance>()
const store = localStore()
const state = reactive({
  qqForm: {
    qq: store.QQBindingRequest.qq,
  },
  qqRules: {
    qq: [
      {required: true, message: '请输入QQ号', trigger: 'blur'},
    ],
  }
})
onMounted(async () => {
  await store.updateQQBindingRequest()
  state.qqForm.qq = store.QQBindingRequest.qq
})

const submitQQForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const req = {
          qq: state.qqForm.qq,
        }
        const res = await postProfile(req)
        ElNotification({
          title: '成功',
          message: '绑定申请成功！请复制以下密钥到QQ群：' + res.data.key,
          type: 'success',
        })
      }
      catch (e) {
        ElNotification({
          title: '失败',
          message: '绑定申请失败！',
          type: 'error',
        })
      }
    }
  })
}
</script>

<template>
  <el-form
      ref="formRef"
      :model="state.qqForm"
      label-width="auto"
      size="default"
      :rules="state.qqRules"
  >

    <el-form-item label="QQ号" prop="qq">
      <el-input v-model="state.qqForm.qq" placeholder="请输入QQ号"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitQQForm(formRef)">提交</el-button>
    </el-form-item>

  </el-form>
</template>

<style scoped>

</style>