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
        <el-checkbox-group v-model="state.createForm.checkedEvents" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="event in events" :key="event" :label="event">{{event}}</el-checkbox>
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
import {FormInstance} from "element-plus";
import {createCompetition} from "@/api/service";

const checkAll = ref(false)
const isIndeterminate = ref(true)
const events= [
  '222',
  '333',
  '444',
  '555',
  '666',
  '777',
  'skewb',
  'pyra',
  'sq1',
  'minx',
  'clock',
  '333oh',
  '333bld',
  '444bld',
  '555bld',
]

const handleCheckAllChange = (val: boolean) => {
  state.createForm.checkedEvents = val ? events : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === events.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < events.length
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
