<script setup lang="ts">
import {localStore} from "@/store";
import {onMounted, reactive, ref, watch} from "vue";
import {ElNotification, type FormInstance} from "element-plus";
import {bindQQ} from "@/api/fetchData";

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
watch(() => store.QQBindingRequest, async () => {
  state.qqForm.qq = store.QQBindingRequest.qq
})

const copySecretKeyToClipboard = () => {
  const text = store.QQBindingRequest.secretKey

  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', text)
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, 9999)
  document.execCommand('copy')
  document.body.removeChild(input)

  ElNotification({
    message: '密钥已复制到剪切板',
    type: 'success',
    duration: 2000
  })
}

const submitQQForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const res = await bindQQ(state.qqForm.qq)
        ElNotification({
          title: '成功',
          dangerouslyUseHTMLString: true,
          message: `
            绑定申请成功！请将密钥复制到社团QQ群：
            <span style="background-color: #409EFF;color: #fff;padding: 2px 5px;border-radius: 5px;" @click="copySecretKeyToClipboard">${res.secretKey}</span>
          `,
          type: 'success',
        })
        await store.updateQQBindingRequest()
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

    <el-check-tag type="success" v-if="store.QQBindingRequest.secretKey">你已提交QQ绑定申请，如要更正QQ号码，请重新提交</el-check-tag>
    <el-check-tag type="success" @click="copySecretKeyToClipboard" checked v-if="store.QQBindingRequest.secretKey">点击复制密钥：{{store.QQBindingRequest.secretKey}}</el-check-tag>

  </el-form>
</template>

<style scoped>

</style>