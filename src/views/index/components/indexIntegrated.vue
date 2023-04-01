<template>
  <el-row>
    <el-col :span="col">
      <announcement-panel />
    </el-col>

    <el-col :span="1" v-if="!isMobile" />

    <el-col :span="col_p">
      <notification-panel />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>

import AnnouncementPanel from "@/views/index/components/announcementPanel.vue";
import {computed} from "vue";
import NotificationPanel from "@/views/index/components/notificationPanel.vue";

// check if device is mobile
const isMobile = computed(() => window.innerWidth <= 768)
const col = computed(() => isMobile.value?23:16)
const col_p = computed(() => isMobile.value?23:7)
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .announcements {
    margin-bottom: 20px;
  }
}

.el-row {
  margin-right: 10px;
}
</style>
