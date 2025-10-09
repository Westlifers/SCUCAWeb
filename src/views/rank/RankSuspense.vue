<template>
  <div class="rank-container">
    <Suspense>
      <rank-view></rank-view>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import RankView from "@/views/rank/components/RankView.vue";</script>

<style scoped>
.rank-container {
  width: 100%;
  height: calc(100vh - 60px - 40px); /* 减去导航栏和底部间距 */
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
