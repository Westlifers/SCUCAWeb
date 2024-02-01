<template>
  <div class="form">


    <el-form
        ref="formRef"
        :model="state.createForm"
        :rules="state.rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
        style="margin-top: 50px; width: 70%"
    >

      <el-form-item label="选择项目" prop="events">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="state.createForm.checkedEvents" @change="handleCheckedEventsChange">
          <el-checkbox v-for="event in ALL_EVENTS" :key="event" :label="event">{{event}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
      </el-form-item>

    </el-form>


  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance} from "element-plus";
import {createCompetition} from "@/api/service";

import {ALL_EVENTS} from "@/utils/constants";

const checkAll = ref(false)
const isIndeterminate = ref(true)

const handleCheckAllChange = (val: boolean) => {
  state.createForm.checkedEvents = val ? ALL_EVENTS : []
  isIndeterminate.value = false
}
const handleCheckedEventsChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === ALL_EVENTS.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < ALL_EVENTS.length
}

const formRef = ref<FormInstance>()

const state = reactive({
  createForm: {
    checkedEvents: ['333']
  },
  rules: {

  }
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      const req = {
        events: state.createForm.checkedEvents
      }
      await createCompetition('week', req)
    }
  })
}
</script>

<style scoped>
.el-checkbox-group {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
}

.form {
  display: flex;
  justify-content: center;
}
</style>
