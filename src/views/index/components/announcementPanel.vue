<template>
  <div class="announcements animate-fade-in">
    <div class="announcement-header animate-fade-in-down">
      <div class="header-title">
        <el-icon class="header-icon"><Bell /></el-icon>
        <p>更新与公告</p>
      </div>
    </div>

    <div class="announcement-statistics animate-fade-in-up animate-delay-100">
      <div class="stat-card stat-card-competition hover-lift">
        <div class="stat-icon-wrapper">
          <el-icon class="stat-icon competition-icon"><Trophy /></el-icon>
          <div class="icon-glow"></div>
        </div>
        <div class="stat-content">
          <p class="stat-label">当前周赛</p>
          <p class="stat-value">{{ weekCompName }}</p>
        </div>
      </div>
      <div class="stat-card stat-card-date hover-lift">
        <div class="stat-icon-wrapper">
          <el-icon class="stat-icon date-icon"><Calendar /></el-icon>
          <div class="icon-glow"></div>
        </div>
        <div class="stat-content">
          <p class="stat-label">今天</p>
          <p class="stat-value">{{ currentDate }}</p>
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

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="6"
        layout="prev, pager, next"
        :total="totalPages * 6"
        @current-change="handlePageChange"
        :hide-on-single-page="false"
        small
      />
    </div>

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
import {getAnnouncement, getComp} from "@/api/fetchData";
import type {Ref} from "vue";
import {computed, ref} from "vue";
import {get_user_avatar} from "@/utils";
import {isMobile} from "@/utils/constants";
import { Bell, Document, Trophy, Calendar, Clock, MoreFilled } from '@element-plus/icons-vue';
import type { Announcement } from '@/types';

// Pagination state
const currentPage = ref(1)
const totalPages = ref(10)
const posts: Ref<Announcement[]> = ref([])
const drawer: Ref<boolean[]> = ref([])

// Week competition name
const weekCompName = ref('加载中...')

// Current date
const currentDate = computed(() => {
  const now = new Date()
  return `${now.getMonth() + 1}月${now.getDate()}日`
})

// Change drawer direction and size by isMobile
const drawerDirection = computed(() => isMobile ? 'btt' : 'rtl')
const drawerSize = computed(() => isMobile ? '60%' : '50%')

// calculate every author's avatar, so that we don't need to fetch it every time
const avatars: Ref<Record<string, string>> = ref({})

// Fetch week competition name
async function fetchWeekComp() {
  try {
    const comp = await getComp('week')
    weekCompName.value = comp.compId
  } catch (error) {
    weekCompName.value = '暂无周赛'
  }
}

// Fetch posts data
async function fetchPosts() {
  const data = await getAnnouncement('ua', currentPage.value)
  posts.value = data['announcement']
  totalPages.value = data['page_num']
  
  // Reset drawer state
  drawer.value = new Array(data['announcement'].length).fill(false)
  
  // Fetch avatars for new posts
  for (let i = 0; i < data['announcement'].length; i++) {
    const author = data['announcement'][i].author
    if (author in avatars.value) continue
    avatars.value[author] = await get_user_avatar(author)
  }
}

// Handle page change
function handlePageChange(page: number) {
  currentPage.value = page
  fetchPosts()
}

// Initial fetch
fetchWeekComp()
fetchPosts()
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
  border-radius: var(--radius-xl);
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base) var(--ease-out);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity var(--transition-base) var(--ease-out);
  z-index: 0;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-page::before {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.stat-card-competition {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card-competition::before {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
}

.stat-card-date {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card-date::before {
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
}

.stat-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-2xl);
}

.stat-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  z-index: 1;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  filter: blur(15px);
  animation: glow-pulse 2s var(--ease-in-out) infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.stat-icon {
  font-size: 32px;
  color: white;
  z-index: 2;
  position: relative;
}

.page-icon {
  animation: float 3s var(--ease-in-out) infinite;
}

.competition-icon {
  animation: rotate-slow 4s linear infinite;
}

.date-icon {
  animation: pulse-scale 2s var(--ease-in-out) infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.stat-content {
  color: white;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;
}

.stat-label {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.stat-value {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.stat-card-competition .stat-value {
  font-size: 20px;
  line-height: 1.2;
}

@media screen and (max-width: 768px) {
  .announcement-statistics {
    flex-direction: column;
  }
  
  .stat-card {
    width: 100%;
  }
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.pagination-container :deep(.el-pagination) {
  gap: 8px;
}

.pagination-container :deep(.el-pager li) {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: var(--radius-md);
  transition: all var(--transition-base) var(--ease-out);
}

.pagination-container :deep(.el-pager li:hover) {
  transform: translateY(-2px);
}

.pagination-container :deep(.el-pager li.is-active) {
  background: var(--yougi-main-color);
  color: white;
}
</style>
