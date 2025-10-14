<template>
  <div class="notification animate-fade-in-right">
    <div class="notification-header animate-fade-in-down">
      <el-icon class="header-icon"><Notification /></el-icon>
      <p>社团动态</p>
    </div>

    <el-scrollbar class="notification-scrollbar">
      <div class="notification-items">
        <div 
          class="notification-item animate-fade-in-left" 
          v-for="(notification, i) in breakAnnouncements" 
          :key="i"
          :style="{'animation-delay': `${i * 80}ms`}"
        >
          <div class="notification-avatar hover-scale">
            <el-avatar 
              :src="avatars[getUserAndEventAndAorb(notification.content).user]"
              class="avatar-with-ring"
            ></el-avatar>
            <div class="avatar-badge">
              <el-icon class="trophy-icon"><Trophy /></el-icon>
            </div>
          </div>

          <div class="notification-item-content">
            <div class="notification-item-content-title">
              <p class="user-name">{{getUserAndEventAndAorb(notification.content).user}}</p>
              <el-tag size="small" type="success" effect="dark" class="record-tag">
                <el-icon><TrendCharts /></el-icon>
                新纪录
              </el-tag>
            </div>
            <div class="notification-item-content-line">
              <p class="record-detail">
                <span class="detail-highlight">{{getUserAndEventAndAorb(notification.content).user}}</span>
                打破了
                <span class="detail-highlight event-name">{{getUserAndEventAndAorb(notification.content).event}}</span>
                的
                <span class="detail-highlight">{{getUserAndEventAndAorb(notification.content).aorb}}</span>
                纪录，时间
                <span class="detail-highlight time-value">{{getUserAndEventAndAorb(notification.content).time}}</span>
              </p>
            </div>
            <div class="notification-item-date">
              <el-icon><Clock /></el-icon>
              <p>{{(new Date(notification.date)).toLocaleDateString()}}</p>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="6"
        layout="prev, pager, next"
        :total="totalPage * 6"
        @current-change="handlePageChange"
        :hide-on-single-page="false"
        small
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {Announcement} from "@/types";
import {getAnnouncement} from "@/api/fetchData";
import {get_user_avatar, getUserAndEventAndAorb} from "@/utils";
import { Notification, Trophy, TrendCharts, Clock } from '@element-plus/icons-vue';
import { ref, type Ref } from "vue";

// Pagination state
const currentPage = ref(1)
const breakAnnouncements: Ref<Announcement[]> = ref([])
const totalPage = ref(0)
const avatars: Ref<Record<string, string>> = ref({})

// Fetch break announcements
async function fetchBreakAnnouncements() {
  const data = await getAnnouncement('scur break', currentPage.value)
  breakAnnouncements.value = data['announcement']
  totalPage.value = data['page_num']
  
  // Get every avatar of the user who has a new record
  for (const announcement of data['announcement']) {
    const username = getUserAndEventAndAorb(announcement.content).user
    if (username in avatars.value) continue
    avatars.value[username] = await get_user_avatar(username)
  }
}

// Handle page change
function handlePageChange(page: number) {
  currentPage.value = page
  fetchBreakAnnouncements()
}

// Initial fetch
fetchBreakAnnouncements()
</script>

<style scoped>
.notification {
  background: var(--yougi-projects-section);
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-slow) var(--ease-out);
  box-sizing: border-box;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 32px 24px 0 24px;
  color: var(--yougi-main-color);
  flex-shrink: 0;
}

.header-icon {
  font-size: 28px;
  color: var(--yougi-accent);
  animation: pulse 2s var(--ease-in-out) infinite;
}

.notification-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  margin: 0;
}

.notification-scrollbar {
  flex: 1;
  min-height: 0;
  padding-bottom: 32px;
}

.notification-scrollbar :deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

.notification-items {
  padding: 0 24px;
}

.notification-item {
  border-top: 1px solid var(--yougi-message-box-border);
  padding: 20px 16px;
  display: flex;
  align-items: flex-start;
  width: 100%;
  transition: all var(--transition-base) var(--ease-out);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.notification-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--yougi-success), var(--yougi-primary));
  transform: scaleY(0);
  transition: transform var(--transition-base) var(--ease-out);
}

.notification-item:hover {
  background: var(--yougi-message-box-hover);
  padding-left: 20px;
}

.notification-item:hover::before {
  transform: scaleY(1);
}

.notification-avatar {
  position: relative;
  flex-shrink: 0;
}

.avatar-with-ring {
  border: 3px solid var(--yougi-success);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base) var(--ease-out);
}

.notification-item:hover .avatar-with-ring {
  border-color: var(--yougi-primary);
  box-shadow: var(--shadow-lg);
}

.avatar-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--yougi-warning), #fbbf24);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--yougi-projects-section);
  box-shadow: var(--shadow);
}

.trophy-icon {
  font-size: 14px;
  color: white;
  animation: bounce 2s var(--ease-in-out) infinite;
}

.notification-item-content {
  padding-left: 16px;
  width: 100%;
}

.notification-item-content-title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: var(--yougi-main-color);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  margin: 0;
  color: var(--yougi-primary);
  transition: color var(--transition-base) var(--ease-out);
}

.notification-item:hover .user-name {
  color: var(--yougi-accent);
}

.record-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: var(--radius-full);
  font-size: 12px;
  animation: pulse 2s var(--ease-in-out) infinite;
}

.notification-item-content-line p {
  font-size: 14px;
  line-height: 22px;
  margin: 8px 0;
  color: var(--yougi-secondary-color);
  text-align: left;
  width: 100%;
}

.record-detail {
  margin: 0 !important;
}

.detail-highlight {
  font-weight: 600;
  color: var(--yougi-main-color);
  padding: 0 4px;
}

.event-name {
  color: var(--yougi-primary);
}

.time-value {
  color: var(--yougi-success);
  font-family: monospace;
  font-size: 15px;
}

.notification-item-date {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
  color: var(--yougi-secondary-color);
  opacity: 0.7;
}

.notification-item-date p {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
}

.notification-item-date .el-icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .notification-item-content-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.pagination-container {
  margin-top: 16px;
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
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
