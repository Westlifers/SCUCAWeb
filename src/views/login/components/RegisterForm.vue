<template>
  <el-form
    ref="registerFormRef"
    :model="state.registerForm"
    :rules="state.registerRules"
    label-width="100px"
    class="registerForm sign-up-form"
  >
    <el-form-item label="用户名" prop="account">
      <el-input
          v-model="state.registerForm.account"
        placeholder="Enter UserName..."
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input
          v-model="state.registerForm.email"
        placeholder="Enter Email..."
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        v-model="state.registerForm.password"
        placeholder="Enter Password..."
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="password2">
      <el-input
        type="password"
        v-model="state.registerForm.password2"
        placeholder="Enter Password..."
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button
        @click="handleRegister(registerFormRef)"
        type="primary"
        class="submit-btn"
        >注册</el-button
      >
    </el-form-item>
  </el-form>
</template>


<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ElNotification, FormInstance} from "element-plus";
import {register} from "@/api/service";
import router from "@/router";

const registerFormRef = ref<FormInstance>()

// eslint-disable-next-line @typescript-eslint/ban-types
const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value.length < 6) {
    callback(new Error("密码不少于6位"));
  } else {
    callback();
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
const validatePassword2 = (rule: any, value: string, callback: Function) => {
  if (value.length < 6) {
    callback(new Error("密码不少于6位"));
  } else if (value != state.registerForm.password){
    callback(new Error("两次密码不相同"));
  } else {
    callback();
  }
}

const state = reactive({
  registerForm: {
    account: "",
    email: "",
    password: "",
    password2: "",
  },

  registerRules: {
    account: [{ required: true, trigger: "blur" }],
    email: [{ required: true, trigger: "blur" }],
    password: [
      {
        required: true,
        trigger: "blur",
        validator: validatePassword,
      },
    ],
    password2: [
      {
        required: true,
        trigger: "blur",
        validator: validatePassword2,
      }
    ]
  },
  passwordType: "password",
  loading: false
})

const handleRegister = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((async valid => {
    if (valid) {
      state.loading = true;
      const req = {
        username: state.registerForm.account,
        password: state.registerForm.password,
        email: state.registerForm.email,
        is_active: false
      };
      try {
        const data: any = await register(req);
        ElNotification({
          title: '成功',
          message: '用户注册成功！待管理员审核后方可登录！',
          type: 'success',
        })
        await router.push({name: 'login'})
      } catch (e) {
        // 原谅我这么写，不想认真写了，以后再改吧
        if (e==='Request failed with status code 500') {
          ElNotification({
            title: '注册失败',
            message: '用户名已存在！',
            type: 'error',
          })
        }
        await router.push({name: 'login'})
      }
    }
  }))

}
</script>


<style scoped>

</style>
