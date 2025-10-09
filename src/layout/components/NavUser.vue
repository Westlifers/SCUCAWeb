<template>
  <el-popover
      placement="bottom-end"
      trigger="hover"
      :width="280"
      popper-class="user-menu-popover"
  >
    <template #reference>
      <div class="user-avatar-wrapper">
        <el-button class="user-btn" @click="go_page('profile')" text>
          <el-avatar :src="avatar" :size="40" class="avatar-image" />
          <span class="username">{{ store.user.username || '游客' }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </el-button>
      </div>
    </template>
    
    <template #default>
      <div class="user-menu">
        <!-- 用户信息头部 -->
        <div class="user-info-header">
          <el-avatar :src="avatar" :size="56" class="large-avatar" />
          <div class="user-details">
            <h3 class="user-name">{{ store.user.username || '游客' }}</h3>
            <p class="user-email" v-if="store.user.email">{{ store.user.email }}</p>
            <p class="user-status" v-else>未登录</p>
          </div>
        </div>

        <!-- 菜单项 -->
        <div class="menu-items">
          <div 
            class="menu-item" 
            @click="go_page('profile')"
            v-if="isLoggedIn"
          >
            <el-icon class="menu-icon"><User /></el-icon>
            <span class="menu-text">个人主页</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>

          <div 
            class="menu-item" 
            @click="handleSettings"
            v-if="isLoggedIn"
          >
            <el-icon class="menu-icon"><Setting /></el-icon>
            <span class="menu-text">账号设置</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>

          <!-- 登出/登录按钮 -->
          <div class="menu-item-action">
            <el-button 
              v-if="isLoggedIn" 
              @click="logout_all" 
              type="danger"
              plain
              round
              class="action-button"
            >
              <el-icon><SwitchButton /></el-icon>
              <span>登出</span>
            </el-button>
            <el-button 
              v-else 
              @click="go_page('login')" 
              type="primary"
              round
              class="action-button"
            >
              <el-icon><User /></el-icon>
              <span>登录</span>
            </el-button>
          </div>
        </div>
      </div>
   </template>
  </el-popover>
</template>

<script lang="ts" setup>
import {localStore} from "@/store";
import {computed} from "vue";
import {logout} from "@/api/service";
import {get_user_avatar, go_page} from "@/utils";
import router from "@/router";
import { ArrowDown, ArrowRight, User, Setting, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const store = localStore()

const avatar = await get_user_avatar(store.user.username)
const isLoggedIn = computed(() => store.user.username !== '')

const logout_all = async () => {
  try {
    await logout()
    await store.logOut()
    ElMessage.success('已成功登出')
    await router.push({name: 'login'})
  } catch (error) {
    ElMessage.error('登出失败，请重试')
  }
}

const handleSettings = () => {
  ElMessage.info('账号设置功能开发中...')
}

</script>

<style scoped>
/* 用户按钮样式 */
.user-avatar-wrapper {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  transition: all var(--transition-base) var(--ease-out);
  background: transparent;
  border: 1px solid transparent;
}

.user-btn:hover {
  background: var(--yougi-bg-secondary, rgba(99, 102, 241, 0.1));
  border-color: var(--yougi-primary);
  transform: translateY(-1px);
}

.avatar-image {
  border: 2px solid var(--yougi-primary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base) var(--ease-out);
}

.user-btn:hover .avatar-image {
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: var(--yougi-text);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  font-size: 14px;
  color: var(--yougi-text-secondary);
  transition: transform var(--transition-base) var(--ease-out);
}

.user-btn:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* 用户菜单内容样式 */
.user-menu {
  padding: 0;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, var(--yougi-primary) 0%, var(--yougi-accent) 100%);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  margin: -12px -12px 0 -12px;
}

.large-avatar {
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-lg);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email,
.user-status {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 菜单项样式 */
.menu-items {
  padding: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast) var(--ease-out);
  color: var(--yougi-text);
}

.menu-item:hover {
  background: var(--yougi-bg-secondary, #f5f7fa);
  transform: translateX(4px);
}

.dark .menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.menu-icon {
  font-size: 18px;
  color: var(--yougi-text-secondary);
  transition: all var(--transition-fast) var(--ease-out);
}

.menu-item:hover .menu-icon {
  color: var(--yougi-primary);
  transform: scale(1.1);
}

.menu-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.arrow-icon {
  font-size: 14px;
  color: var(--yougi-text-secondary);
  opacity: 0;
  transform: translateX(-4px);
  transition: all var(--transition-fast) var(--ease-out);
}

.menu-item:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

/* 操作按钮区域 */
.menu-item-action {
  margin-top: 12px;
  padding: 8px;
}

.action-button {
  width: 100%;
  font-weight: 500;
  transition: all var(--transition-base) var(--ease-out);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .username {
    display: none;
  }
  
  .dropdown-icon {
    display: none;
  }
  
  .user-btn {
    padding: 8px;
  }
}
</style>

<style>
/* 全局 Popover 样式 */
.user-menu-popover {
  padding: 12px !important;
  border-radius: var(--radius-xl) !important;
  box-shadow: var(--shadow-2xl) !important;
  border: 1px solid var(--yougi-border) !important;
  backdrop-filter: blur(10px);
  animation: slideDown 0.3s ease-out;
}

.dark .user-menu-popover {
  background: rgba(30, 41, 59, 0.95) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
