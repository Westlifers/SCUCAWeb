<template>
  <el-form
      ref="loginFormRef"
      :model="state.loginForm"
      :rules="state.loginRules"
      label-width="100px"
      class="loginForm sign-in-form"
  >
    <el-form-item label="账号" prop="account">
      <el-input
          v-model="state.loginForm.account"
          placeholder="Enter Username..."
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
          v-model="state.loginForm.password"
          type="password"
          placeholder="Enter Password..."
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button
          @click="handleLogin(loginFormRef)"
          type="primary"
          class="submit-btn"
      >登录</el-button
      >
    </el-form-item>

    <!-- 找回密码 -->
    <div class="tiparea">
      <p>忘记密码？ <a>立即找回</a></p>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {User} from "@/types";
import {SET_USER, store} from "@/store";
import {ElNotification, FormInstance} from "element-plus";
import {login} from "@/api/service";
import router from "@/router";

const loginFormRef = ref<FormInstance>()

// eslint-disable-next-line @typescript-eslint/ban-types
const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value.length < 6) {
    callback(new Error("密码不少于6位"));
  } else {
    callback();
  }
};

const state = reactive({
  loginForm: {
    account: "",
    password: "",
  },

  loginRules: {
    account: [{ required: true, trigger: "blur" }],
    password: [
      {
        required: true,
        trigger: "blur",
        validator: validatePassword,
      },
    ],
  },
  passwordType: "password",
  loading: false
})


const handleLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate((async valid => {
    if (valid) {
      state.loading = true;
      const req = {
        username: state.loginForm.account,
        password: state.loginForm.password,
      };
      try {
        const data: any = await login(req);
        const user: User = {
          id: data.id,
          username: data.username,
          email: data.email,
          is_active: data.is_active,
          is_superuser: data.is_superuser
        };

        store.commit(SET_USER, {
          user,
        });
        window.localStorage.setItem("userInfo", JSON.stringify(user))
        ElNotification({
          title: '成功',
          message: '用户登录成功！',
          type: 'success',
        })
        await router.push({name: 'overview'})
      } catch (e) {
        await router.push({name: 'login'})
      }
    }
  }))

}

</script>
<style scoped>
/* form */
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit-btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>
