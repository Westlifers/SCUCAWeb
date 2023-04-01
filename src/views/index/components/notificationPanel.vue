<template>
  <div class="notification">

    <div class="notification-header">
      <p>Activities</p>
    </div>


    <el-scrollbar max-height="600">
      <div class="notification-items">
        <div class="notification-item" v-for="(notification, i) in breakAnnouncements" :key="i">

          <div class="notification-avatar">
            <el-avatar :src="avatars[getUserAndEventAndAorb(notification.content).user]"></el-avatar>
          </div>

          <div class="notification-item-content">
            <div class="notification-item-content-title">
              <p>{{getUserAndEventAndAorb(notification.content).user}}</p>
            </div>
            <div class="notification-item-content-line">
              <p>{{notification.content}}</p>
            </div>
            <div class="notification-item-date">
              <p>{{(new Date(notification.date)).toLocaleDateString()}}</p>
            </div>
          </div>

        </div>
      </div>
    </el-scrollbar>

  </div>
</template>

<script lang="ts" setup>
import {Announcement} from "@/types";
import {getAnnouncement} from "@/api/fetchData";
import {get_user_avatar, getUserAndEventAndAorb} from "@/utils";

const breakAnnouncements: Announcement[] = await getAnnouncement('scur break')
// get every avatar of the user who has a new record, so that we don't need to fetch the avatar every time
const avatars = {}
for (const announcement of breakAnnouncements) {
  const username = getUserAndEventAndAorb(announcement.content).user
  if (username in avatars) continue
  avatars[username] = await get_user_avatar(username)
}
</script>

<style scoped>
.notification {
  background-color: var(--yougi-projects-section);
  border-radius: 30px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  height: calc(100vh - 120px);
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}

.notification-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
  padding: 32px 24px 0 24px;
  color: var(--yougi-main-color);
}

.notification-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  opacity: 0.9;
  margin: 0;
}

.notification-item {
  border-top: 1px solid var(--yougi-message-box-border);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  width: 90%;
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
  margin-bottom: 5px;
  display: flex;
  justify-content: left;
}

.notification-item-content-line p,
.notification-item-date p{
  font-size: 14px;
  line-height: 20px;
  margin: 8px 0;
  color: var(--yougi-secondary-color);
  opacity: 0.7;
  display: flex;
  text-align: left;
  width: 100%;
}

.notification-item-date p {
  flex-direction: row-reverse;
}
</style>
