<template>
  <div class="record-container">
    <Suspense>
      <data-table />
    </Suspense>
  </div>
</template>

<script lang="ts" setup>

import DataTable from "@/views/record/components/DataTable.vue";</script>

<style scoped>
.record-container {
  width: 100%;
  height: calc(100vh - 60px - 40px); /* 减去导航栏和底部间距 */
  max-height: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
