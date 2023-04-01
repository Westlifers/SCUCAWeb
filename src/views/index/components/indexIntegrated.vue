<template>
  <div class="index-wrapper">
    <div class="announcement-panel"><announcement-panel /></div>
    <div class="notification-panel"><notification-panel /></div>
  </div>
</template>

<script lang="ts" setup>

import AnnouncementPanel from "@/views/index/components/announcementPanel.vue";
import NotificationPanel from "@/views/index/components/notificationPanel.vue";

</script>

<style scoped>
.index-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 32px 0 0;
}

.announcement-panel {
  width: 65%;
}

.notification-panel {
  width: 30%;
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}

@media screen and (max-width: 768px) {
  .index-wrapper {
    flex-direction: column;
  }

  .announcement-panel {
    width: 100%;
    margin-bottom: 32px;
  }

  .notification-panel {
    width: 100%;
  }
}
</style>
