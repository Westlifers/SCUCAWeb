<template>
  <div class="index-wrapper">
    <div class="first-row">
      <div class="announcement-panel"><announcement-panel /></div>
      <div class="notification-panel"><notification-panel /></div>
    </div>
    <div class="second-row">
      <div class="record-panel">
        <Suspense>
          <record-card />
        </Suspense>
      </div>
      <div class="rank-panel">
        <Suspense>
          <rank-card />
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import AnnouncementPanel from "@/views/index/components/announcementPanel.vue";
import NotificationPanel from "@/views/index/components/notificationPanel.vue";
import RecordCard from "@/views/index/components/recordCard.vue";
import RankCard from "@/views/index/components/rankCard.vue";
import {isMobile} from "@/utils/constants";
import {go_page} from "@/utils";

// 移动端不需要首页，跳转到周赛页面
if (isMobile) go_page('mobileWeek')
</script>

<style scoped>
.index-wrapper {
  display: flex;
  flex-direction: column;
  padding: 20px 32px 20px 0;
  gap: 20px;
  min-height: calc(100vh - 60px);
  box-sizing: border-box;
  overflow-y: auto;
}

.first-row {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  height: calc(100vh - 60px - 40px - 20px - 120px);
  min-height: 500px;
}

.announcement-panel {
  width: 65%;
  min-width: 0;
  height: 100%;
}

.notification-panel {
  width: 35%;
  min-width: 0;
  height: 100%;
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}

.second-row {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
}

.record-panel {
  flex: 1;
  min-width: 0;
}

.rank-panel {
  flex: 1;
  min-width: 0;
}

@media screen and (max-width: 768px) {
  .index-wrapper {
    flex-direction: column;
    padding: 20px;
  }

  .first-row {
    flex-direction: column;
  }

  .announcement-panel {
    width: 100%;
  }

  .notification-panel {
    width: 100%;
  }

  .second-row {
    flex-direction: column;
  }

  .record-panel,
  .rank-panel {
    width: 100%;
  }
}
</style>
