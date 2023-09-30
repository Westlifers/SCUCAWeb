<template>
  <div class="main-container">
    <div class="user-box first-box">
      <other-profile-panel />

      <participation-panel />

      <card-panel />

      <avatar-panel />
    </div>

    <div class="user-box second-box">
      <pb-panel />

      <transaction-panel />
    </div>

    <div class="user-box third-box">
      <statistic-panel />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AvatarPanel from "@/views/profile/components/avatarPanel.vue";
import OtherProfilePanel from "@/views/profile/components/otherProfilePanel.vue";
import ParticipationPanel from "@/views/profile/components/participationPanel.vue";
import PbPanel from "@/views/profile/components/pbPanel.vue";
import CardPanel from "@/views/profile/components/cardPanel.vue";
import TransactionPanel from "@/views/profile/components/transactionPanel.vue";
import {useDark, useToggle} from "@vueuse/core";
import StatisticPanel from "@/views/profile/components/statisticPanel.vue";

// 强制切换夜间模式
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style>
@import url('@/styles/style-of-profile.css');
</style>
