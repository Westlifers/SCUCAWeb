<template>
  <div class="form" v-if="isSuperUser">
    <el-form
        ref="formRef"
        :model="state.announcementForm"
        label-width="auto"
        :rules="state.announcementRules"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="state.announcementForm.title" class="w-50 m-2" placeholder="输入标题" />
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select v-model="state.announcementForm.type" placeholder="请选择">
          <el-option label="公告" value="announcement"></el-option>
          <el-option label="更新" value="update"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <div id="editor">
          <v-md-editor v-model="state.announcementForm.content" height="440px"></v-md-editor>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit(formRef)" style="margin-left: 50px">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-else>
    <h3>您没有权限发布公告</h3>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import type {FormInstance} from "element-plus";
import {localStore} from "@/store";
import {postAnnouncement} from "@/api/service";

const store = localStore()
const isSuperUser = computed(() => store.user.is_superuser)

const formRef = ref<FormInstance>()

const state = reactive({
  announcementForm: {
    title: '',
    content: '',
    type: ''
  },
  announcementRules: {
    title: [{required: true, message: '请输入标题', trigger: 'blur'}],
    type: [{required: true, message: '请选择类型', trigger: 'blur'}]
  }
})

const handleSubmit =  (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      const req = {
        title: state.announcementForm.title,
        content: state.announcementForm.content,
        type: state.announcementForm.type
      }
      try {
        const res = await postAnnouncement(req)
        ElNotification({
          title: '成功',
          message: '提交成功！',
          type: 'success',
        })
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
</script>

<style scoped>
#editor {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

#editor h3 {
  margin: 20px 0;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.el-form {
  width: 80%;
}
</style>
