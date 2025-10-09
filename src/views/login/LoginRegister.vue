<template>
  <div class="container animate-fade-in" :class="{ 'sign-up-mode': signUpMode }">
    <!-- 动态背景 -->
    <div class="bg-animation">
      <div class="floating-cube"></div>
      <div class="floating-cube"></div>
      <div class="floating-cube"></div>
      <div class="floating-cube"></div>
    </div>
    
    <!-- form表单容器 -->
    <div class="forms-container">
      <div class="signin-signup">
        <!-- 登录 -->
        <div class="form-wrapper login-form animate-scale-in">
          <LoginForm />
        </div>

        <!-- 注册 -->
        <div class="form-wrapper register-form animate-scale-in">
          <RegisterForm />
        </div>
      </div>
    </div>
    
    <!-- 左右切换动画 -->
    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <div class="icon-wrapper">
            <el-icon class="panel-icon"><Lock /></el-icon>
          </div>
          <h3 class="animate-fade-in-up">当我把杂乱不堪变得整齐划一</h3>
          <br />
          <h4 class="animate-fade-in-up animate-delay-100">当我试着左手牵你往未来的方向</h4>
          <p class="animate-fade-in-up animate-delay-200">我想，我可以真正遇见你了</p>
          <button @click="signUpMode = !signUpMode" class="btn transparent modern-btn">
            <el-icon><UserFilled /></el-icon>
            <span>注册</span>
          </button>
        </div>
        <img src="@/assets/img/log.svg" class="image hover-float" alt="" />
      </div>

      <div class="panel right-panel">
        <div class="content">
          <div class="icon-wrapper">
            <el-icon class="panel-icon"><Avatar /></el-icon>
          </div>
          <h3 class="animate-fade-in-up">我可以解开四千三百亿亿种变化</h3>
          <p class="animate-fade-in-up animate-delay-100">也想解开你的心</p>
          <button @click="signUpMode = !signUpMode" class="btn transparent modern-btn">
            <el-icon><Key /></el-icon>
            <span>登录</span>
          </button>
        </div>
        <img src="@/assets/img/register.svg" class="image hover-float" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import LoginForm from "@/views/login/components/LoginForm.vue";
import RegisterForm from "@/views/login/components/RegisterForm.vue";
import {localStore} from "@/store";
import router from "@/router";
import { Lock, UserFilled, Avatar, Key } from '@element-plus/icons-vue';

const signUpMode = ref(false)
const store = localStore()

// redirect to home page if user is already logged in
const isLoggedIn = computed(() => store.user.username !== '')
if (isLoggedIn.value) {
  console.log('已登录，重定向')
  router.push({name: 'index'})
}
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  height: 100vh;
  overflow: hidden;
}

/* 动态背景 */
.bg-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.floating-cube {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(5px);
  animation: float 20s infinite ease-in-out;
}

.floating-cube:nth-child(1) {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 15s;
}

.floating-cube:nth-child(2) {
  top: 60%;
  left: 80%;
  animation-delay: 3s;
  animation-duration: 18s;
}

.floating-cube:nth-child(3) {
  top: 80%;
  left: 20%;
  animation-delay: 6s;
  animation-duration: 20s;
}

.floating-cube:nth-child(4) {
  top: 30%;
  left: 70%;
  animation-delay: 9s;
  animation-duration: 22s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-50px) rotate(180deg);
  }
}

.hover-float {
  animation: bounce 3s ease-in-out infinite;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 44%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
  pointer-events: auto;
  overflow: hidden;
}

.form-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: var(--shadow-2xl);
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  transition: all 0.6s 0.7s ease-in-out;
}

.form-wrapper.login-form {
  z-index: 2;
  opacity: 1;
}

.form-wrapper.register-form {
  z-index: 1;
  opacity: 0;
}

.dark .form-wrapper {
  background: rgba(30, 41, 59, 0.95);
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: var(--yougi-primary);
  border-radius: var(--radius-full);
  border: 2px solid var(--yougi-primary);
  text-decoration: none;
  font-size: 1.1rem;
  transition: all var(--transition-base) var(--ease-out);
}

.social-icon:hover {
  color: white;
  background: var(--yougi-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.btn {
  width: 150px;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  border: none;
  outline: none;
  height: 49px;
  border-radius: var(--radius-full);
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 10;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
}

.btn:active {
  transform: translateY(-1px);
}

.modern-btn {
  font-size: 0.9rem;
  padding: 0 24px;
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  z-index: 10;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  position: relative;
  z-index: 10;
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background: linear-gradient(-45deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 5;
  box-shadow: var(--shadow-2xl);
  pointer-events: none;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 10;
}

.left-panel {
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
  position: relative;
  z-index: 10;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
  position: relative;
  z-index: 10;
}

.panel-icon {
  font-size: 40px;
  color: white;
}

.panel h3 {
  font-weight: 700;
  line-height: 1.4;
  font-size: 1.6rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

.panel h4 {
  font-weight: 600;
  font-size: 1.2rem;
  opacity: 0.95;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

.panel p {
  font-size: 1rem;
  padding: 0.7rem 0;
  opacity: 0.9;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 10;
}

.btn.transparent {
  margin: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.8);
  width: 150px;
  height: 49px;
  font-weight: 600;
  font-size: 0.9rem;
  position: relative;
  z-index: 10;
}

.btn.transparent:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(1200px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-1200px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode .form-wrapper.login-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .form-wrapper.register-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

.left-panel {
  pointer-events: all;
}

.right-panel {
  pointer-events: none;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  
  .floating-cube {
    width: 60px;
    height: 60px;
  }
  
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>

