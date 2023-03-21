<template>
  <el-form
      ref="formRef"
      :model="state.resultForm"
      label-width="auto"
      size="default"
      v-if="event"
      :rules="state.resultRules"
  >
    <el-form-item label="第一次" prop="time_1">
      <el-input
          v-model="state.resultForm.time_1"
          class="w-50 m-2"
          placeholder="Type your result"
        />
    </el-form-item>

    <el-form-item label="第二次" prop="time_2">
      <el-input
          v-model="state.resultForm.time_2"
          class="w-50 m-2"
          placeholder="Type your result"
      />
    </el-form-item>

    <el-form-item label="第三次" prop="time_3">
      <el-input
          v-model="state.resultForm.time_3"
          class="w-50 m-2"
          placeholder="Type your result"
      />
    </el-form-item>

    <el-form-item label="第四次" v-if="count===5" prop="time_4">
      <el-input
          v-model="state.resultForm.time_4"
          class="w-50 m-2"
          placeholder="Type your result"
      />
    </el-form-item>

    <el-form-item label="第五次" v-if="count===5" prop="time_5">
      <el-input
          v-model="state.resultForm.time_5"
          class="w-50 m-2"
          placeholder="Type your result"
      />
    </el-form-item>

    <el-form-item>
      <el-space size="large">
        <el-button type="primary" @click="handleSubmit(formRef)">提交</el-button>
      </el-space>
    </el-form-item>

    <div class="tip">
      <v-md-preview text="> 如DNF请直接输入DNF, dnf, 或0"></v-md-preview>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue'
import {ElNotification, FormInstance} from "element-plus";
import {postResult} from "@/api/service";
import {convert_time, SPECIAL_EVENTS} from "@/utils";
import {store, UPDATE_USER_PARTICIPATION_DATA} from "@/store";
import router from "@/router";

const formRef = ref<FormInstance>()

// eslint-disable-next-line @typescript-eslint/ban-types
const resultValidator = (rule: any, value: string, callback: Function) => {
  if (value == 'DNF' || value == 'dnf') {
    callback()
  } else {
    const pattern = /^\s*\d+(\.\d+)?(:\d+(\.\d+)?)?\s*$/
    if (pattern.test(value)) {
      callback()
    }
    else {
      callback(new Error('成绩格式错误'))
    }
  }
}

const state = reactive({
  resultForm: {
    time_1: '',
    time_2: '',
    time_3: '',
    time_4: '',
    time_5: '',
  },
  resultRules: {
    time_1: [{
      required: true,
      trigger: "blur",
      validator: resultValidator
    }],
    time_2: [{
      required: true,
      trigger: "blur",
      validator: resultValidator
    }],
    time_3: [{
      required: true,
      trigger: "blur",
      validator: resultValidator
    }],
    time_4: [{
      trigger: "blur",
      validator: resultValidator
    }],
    time_5: [{
      trigger: "blur",
      validator: resultValidator
    }],
  }
})

const handleSubmit =  (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      const req = {
        competition: props.compId,
        event: props.event,
        time_1: convert_time(state.resultForm.time_1),
        time_2: convert_time(state.resultForm.time_2),
        time_3: convert_time(state.resultForm.time_3),
        time_4: convert_time(state.resultForm.time_4),
        time_5: convert_time(state.resultForm.time_5),
      }
      try {
        const data = await postResult(req)
        ElNotification({
          title: '成功',
          message: '提交成功！',
          type: 'success',
        })
        store.commit(UPDATE_USER_PARTICIPATION_DATA)
        if (props.is_normal) {
          await router.push({name: 'overview'})
        }
        else {
          await router.push({name: 'special'})
        }
      }
      catch (e) {
        ElNotification({
          title: '失败',
          message: '提交成绩失败！',
          type: 'warning',
        })
      }
    }
  })
}

const count = computed(() => {
  if (SPECIAL_EVENTS.indexOf(props.event) > -1) {
    return 3
  } else {
    return 5
  }
})

const props = defineProps<{
  event: string
  compId: string
  is_normal: boolean
}>()
</script>

<style scoped>

</style>
