<template>
  <div class="profile-container">
    <el-table :data="[profile]" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="avatar" label="头像">
        <template #default="{ row }">
          <el-image :src="row.avatar" class="avatar" v-if="row.avatar" />
          <el-image src="http://img.yougi.top/default.png" alt="图片加载失败" fit="scale-down" v-else />
        </template>
      </el-table-column>
    </el-table>

    <el-form
        ref="formRef"
        :model="state.profileForm"
        label-width="auto"
        size="default"
        :rules="state.profileRules"
    >

      <el-form-item label="邮箱" prop="time_1">
        <el-input
            v-model="state.profileForm.email"
            class="w-50 m-2"
            placeholder="输入电子邮箱"
        />
      </el-form-item>

      <el-form-item label="头像" prop="time_2">
        <el-upload
            action="http://upload-z2.qiniup.com"
            :data="postData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <el-image fit="scale-down" v-if="state.profileForm.avatar" :src="state.profileForm.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-space size="large">
          <el-button type="primary" @click="handleSubmit(formRef)">提交</el-button>
        </el-space>
      </el-form-item>

      <div class="tip">
        <v-md-preview text="> 图片格式仅支持`jpg`、`jpeg`或`png`，图片大小不能超过2MB"></v-md-preview>
      </div>

    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {getAvatarToken, getProfile} from "@/api/fetchData";
import {computed, reactive, ref} from "vue";
import {store} from "@/store";
import {ElMessage, ElNotification, FormInstance, UploadProps} from "element-plus";
import {postProfile} from "@/api/service";
import {go_page} from "@/utils";

const username = computed(() => store.state.user.username)
const profile = await getProfile(username.value)

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  state.profileForm.avatar = 'http://img.yougi.top/' + response.key
}

const key = `avatars/${username.value}`
const postData = {
  token: await getAvatarToken(key),
  key: key
}

const formRef = ref<FormInstance>()
const state = reactive({
  profileForm: {
    email: profile.email,
    avatar: profile.avatar
  },
  profileRules: {
    email: [
      {required: true, message: '请输入邮箱', trigger: 'blur'},
    ],
    avatar: [
      {required: true, message: '请输入头像链接', trigger: 'blur'},
    ]
  }
})

const handleSubmit =  (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {
      const req = {
        email: state.profileForm.email,
        avatar: state.profileForm.avatar
      }
      try {
        const res = await postProfile(req)
        ElNotification({
          title: '成功',
          message: '提交修改成功！',
          type: 'success',
        })
        go_page('index')
      }
      catch (e) {
        ElNotification({
          title: '失败',
          message: '提交修改失败！',
          type: 'error',
        })
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  margin: auto;
}

.el-form {
  margin-top: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px solid var(--yougi-main-color);
}

</style>
