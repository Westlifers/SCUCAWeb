<template>
  <div class="history-container">
    <Suspense>
      <HistoryList />
    </Suspense>
  </div>
</template>

<script lang="ts" setup>

import HistoryList from "@/views/history/list/components/HistoryList.vue";</script>

<style scoped>
.history-container {
  width: 100%;
  min-height: calc(100vh - 60px - 40px); /* 减去导航栏和底部间距 */
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
