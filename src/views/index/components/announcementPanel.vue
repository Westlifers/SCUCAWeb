<template>
  <div class="announcements animate-fade-in">
    <div class="announcement-header animate-fade-in-down">
      <div class="header-title">
        <el-icon class="header-icon"><Bell /></el-icon>
        <p>更新与公告</p>
      </div>
      <p class="header-date">{{(new Date()).toDateString()}}</p>
    </div>

    <div class="announcement-statistics animate-fade-in-up animate-delay-100">
      <div class="stat-card hover-lift">
        <el-icon class="stat-icon update-icon"><Promotion /></el-icon>
        <div class="stat-content">
          <el-statistic title="Updates" :value="update_count" />
        </div>
      </div>
      <div class="stat-card hover-lift">
        <el-icon class="stat-icon announce-icon"><ChatDotRound /></el-icon>
        <div class="stat-content">
          <el-statistic title="Announcements" :value="announcement_count" />
        </div>
      </div>
    </div>

    <el-scrollbar class="announcement-scrollbar">
      <div class="announcement-body">
        <div 
          v-for="(post, index) in posts" 
          :key="post.title" 
          class="announcement-card animate-scale-in"
          :style="{'animation-delay': `${index * 50}ms`}"
        >
          <el-card 
            class="box-card card-hover" 
            shadow="hover" 
            :class="post.type==='update' ? 'update-card' : 'announce-card'"
          >
            <template #header>
              <div class="card-header">
                <div class="card-header-date">
                  <el-badge 
                    :value="post.type==='update'?'更新':'公告'" 
                    class="item badge-modern" 
                    :type="post.type==='update'?'success':'primary'"
                  >
                    <span class="date-text">
                      <el-icon><Calendar /></el-icon>
                      {{ (new Date(Date.parse(post.date))).toLocaleDateString() }}
                    </span>
                  </el-badge>
                  <el-button 
                    type="primary" 
                    circle
                    class="detail-btn hover-scale"
                    @click="drawer[index] = true"
                  >
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                </div>
                <div class="el-header-title">
                  <p class="title-text">{{ post.title }}</p>
                </div>
              </div>
            </template>

            <div class="card-body">
              <p class="content-preview">{{ post.content.substring(0, 30) + '...' }}</p>
            </div>

            <el-divider />

            <div class="card-footer">
              <div class="card-footer-info">
                <div class="info-author hover-scale">
                  <el-avatar :src="avatars[post.author]" size="small" class="author-avatar" />
                  <p class="author-name">{{ post.author }}</p>
                </div>
                <div class="info-time">
                  <el-icon><Clock /></el-icon>&nbsp;
                  <span>{{ (new Date(Date.parse(post.date))).toLocaleTimeString() }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>

    <el-drawer 
      v-for="(post, index) in posts" 
      :key="`drawer-${index}`"
      v-model="drawer[index]" 
      :direction="drawerDirection" 
      :size="drawerSize" 
      class="modern-drawer"
      append-to-body
      destroy-on-close
    >
      <template #header>
        <h3 class="drawer-title text-gradient">{{ post.title }}</h3>
      </template>
      <v-md-preview :text="post.content" />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import {getAnnouncement} from "@/api/fetchData";
import type {Ref} from "vue";
import {computed, ref} from "vue";
import {get_user_avatar} from "@/utils";
import {isMobile} from "@/utils/constants";
import { Bell, Promotion, ChatDotRound, Calendar, Clock, MoreFilled } from '@element-plus/icons-vue';

const posts = await getAnnouncement('ua')
// add a list of boolean values to control the drawer
const drawer: Ref<boolean[]> = ref([])
for (let i = 0; i < posts.length; i++) {
  drawer.value.push(false)
}

// Change drawer direction and size by isMobile
const drawerDirection = computed(() => isMobile ? 'btt' : 'rtl')
const drawerSize = computed(() => isMobile ? '60%' : '50%')

// calculate every author's avatar, so that we don't need to fetch it every time
const avatars = {}
for (let i = 0; i < posts.length; i++) {
  const author = posts[i].author
  if (author in avatars) continue
  avatars[posts[i].author] = await get_user_avatar(posts[i].author)
}

// 下面的代码只是为了展示动画效果
const update_count = ref(0)
const announcement_count = ref(0)
const interval1 = setInterval(() => {
  if (update_count.value >= posts.filter(post=>post.type==='update').length) {
    clearInterval(interval1)
    return;
  }
  update_count.value+=posts.filter(post=>post.type==='update').length/10;
}, 100);
const interval2 = setInterval(() => {
  if (announcement_count.value >= posts.filter(post=>post.type==='announcement').length) {
    clearInterval(interval2)
    return
  }
  announcement_count.value+=posts.filter(post=>post.type==='announcement').length/10;
}, 100)
</script>

<style scoped>
.announcements {
  background: var(--yougi-projects-section);
  border-radius: var(--radius-2xl);
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base) var(--ease-out);
  box-sizing: border-box;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: var(--yougi-main-color);
  flex-shrink: 0;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
  color: var(--yougi-primary);
  animation: pulse 2s var(--ease-in-out) infinite;
}

.header-date {
  font-size: 14px;
  color: var(--yougi-secondary-color);
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .announcement-header .header-date {
    width: 100%;
    text-align: right;
  }
}

.announcement-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  margin: 0;
}

.announcement-statistics {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.stat-card {
  flex: 1;
  background: linear-gradient(135deg, var(--yougi-primary-light), var(--yougi-primary));
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base) var(--ease-out);
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.stat-icon {
  font-size: 36px;
  color: white;
  opacity: 0.9;
}

.update-icon {
  animation: bounce 2s var(--ease-in-out) infinite;
}

.announce-icon {
  animation: pulse 2s var(--ease-in-out) infinite;
}

.stat-content {
  color: white;
}

.stat-content :deep(.el-statistic__head) {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.stat-content :deep(.el-statistic__content) {
  color: white;
  font-size: 28px;
  font-weight: 700;
}

.announcement-scrollbar {
  flex: 1;
  min-height: 0;
}

.announcement-scrollbar :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

.announcement-body {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-bottom: 16px;
}

.announcement-card {
  width: calc(33.333% - 12px);
  text-align: left;
  transition: all var(--transition-base) var(--ease-out);
}

@media screen and (max-width: 1300px) {
  .announcement-card {
    width: calc(50% - 8px);
  }
}

@media screen and (max-width: 1100px) {
  .announcement-card {
    width: 100%;
  }
}

.box-card {
  border-radius: var(--radius-xl) !important;
  border: none !important;
  overflow: hidden;
  transition: all var(--transition-base) var(--ease-out);
  position: relative;
}

.box-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--yougi-primary), var(--yougi-accent));
  opacity: 0;
  transition: opacity var(--transition-base) var(--ease-out);
}

.box-card:hover::before {
  opacity: 1;
}

.update-card {
  background: linear-gradient(135deg, #e9e7fd 0%, #f5f4ff 100%) !important;
}

.dark .update-card {
  background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%) !important;
}

.announce-card {
  background: linear-gradient(135deg, #fee4cb 0%, #fff5e6 100%) !important;
}

.dark .announce-card {
  background: linear-gradient(135deg, #78350f 0%, #451a03 100%) !important;
}

.card-header {
  color: var(--yougi-secondary-color);
  font-size: 14px;
  line-height: 16px;
}

.card-header-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.date-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.badge-modern :deep(.el-badge__content) {
  border-radius: var(--radius-full);
  font-weight: 600;
}

.detail-btn {
  transition: all var(--transition-base) var(--ease-out) !important;
}

.detail-btn:hover {
  transform: rotate(90deg) scale(1.1);
}

.el-header-title {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  margin-bottom: 5px;
}

.title-text {
  color: var(--yougi-main-color);
  margin: 0;
  transition: color var(--transition-base) var(--ease-out);
}

.box-card:hover .title-text {
  color: var(--yougi-primary);
}

.card-body {
  color: var(--yougi-secondary-color);
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
}

.content-preview {
  margin: 0;
  opacity: 0.8;
}

.card-footer-info {
  color: var(--yougi-secondary-color);
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-author {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base) var(--ease-out);
}

.author-avatar {
  box-shadow: var(--shadow);
  transition: all var(--transition-base) var(--ease-out);
}

.info-author:hover .author-avatar {
  box-shadow: var(--shadow-lg);
}

.author-name {
  margin: 0;
  color: var(--yougi-main-color);
}

.info-time {
  display: flex;
  align-items: center;
  opacity: 0.6;
  font-size: 13px;
}

.el-divider {
  width: 100%;
  margin: 16px 0;
}

.modern-drawer :deep(.el-drawer__header) {
  padding: 24px;
  border-bottom: 1px solid var(--yougi-message-box-border);
  margin-bottom: 0;
}

.drawer-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.modern-drawer :deep(.el-drawer__body) {
  padding: 24px;
}
</style>
