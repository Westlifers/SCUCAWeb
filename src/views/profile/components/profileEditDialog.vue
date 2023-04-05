<template>
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

    <el-form-item label="个人简介" prop="description">
      <el-input
          v-model="state.profileForm.description"
          class="w-50 m-2"
          placeholder="输入个人简介"
          type="textarea"
      />
    </el-form-item>

    <el-form-item label="头像" prop="time_2">
      <el-upload
          :ref="uploadRef"
          action="//upload-z2.qiniup.com"
          :data="postData"
          list-type="picture-card"
          :file-list="fileList"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
          :limit="1"
      >
        <el-icon><Plus /></el-icon>

      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>

    <el-form-item>
      <el-space size="large">
        <teleport to="#profile-edit-dialog-footer" >
          <el-button type="primary" @click="handleSubmit(formRef)">提交修改</el-button>
        </teleport>
      </el-space>
    </el-form-item>

    <div class="tip">
      <v-md-preview text="> 图片格式仅支持`jpg`、`jpeg`或`png`，图片大小请不要超过2MB，上传头像后可能会有较长的CDN缓存延迟，如头像长时间未更新，请尝试重新登录或刷新浏览器缓存"></v-md-preview>
    </div>

  </el-form>
</template>

<script lang="ts" setup>
import {getAvatarToken, getProfile} from "@/api/fetchData";
import {computed, reactive, ref} from "vue";
import {store, UPDATE_USER_PROFILE} from "@/store";
import {ElMessage, ElNotification, FormInstance, UploadInstance, UploadProps, UploadUserFile} from "element-plus";
import {postProfile} from "@/api/service";

const username = computed(() => store.state.user.username)
const profile = await getProfile(username.value)
const fileList = ref<UploadUserFile[]>()
const uploadRef = ref<UploadInstance>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg') {
    ElMessage.error('头像应为jpg、jpeg或png格式！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小超过2MB！')
    return false
  }
  return true
}
const handleAvatarSuccess: UploadProps['onSuccess'] = async (
    response,
    uploadFile
) => {
  state.profileForm.avatar = 'http://img.yougi.top/' + response.key + `?t=${(new Date()).getTime()}`
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
    avatar: profile.avatar,
    description: profile.description
  },
  profileRules: {
    email: [
      {required: true, message: '请输入邮箱', trigger: 'blur'},
    ],
    avatar: [
      {required: true, message: '请输入头像链接', trigger: 'blur'},
    ],
    description: [
      {required: true, message: '请输入个人简介', trigger: 'blur'},
      {max: 50, message: '个人简介最多50个字符'}
    ],
  }
})
const handleSubmit =  (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const req = {
          email: state.profileForm.email,
          avatar: state.profileForm.avatar===store.state.user.avatar?
              store.state.user.avatar:
              `http://img.yougi.top/avatars/${store.state.user.username}` + `?t=${(new Date()).getTime()}`
          ,  // 如果state中的头像链接和本地储存的链接不一样，说明用户上传了新头像，那么就使用新头像链接，否则仍使用本地储存的头像链接
          description: state.profileForm.description
        }
        const res = await postProfile(req)
        ElNotification({
          title: '成功',
          message: '提交修改成功！',
          type: 'success',
        })
        // update the store and local storage of user profile
        window.location.reload()
        store.commit(UPDATE_USER_PROFILE)
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

</style>
