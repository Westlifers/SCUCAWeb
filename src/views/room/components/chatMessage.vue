<script setup lang="ts">
defineProps<{
  message: string
  sender: string
  avatar: string
  selfSend: boolean
}>()
</script>

<template>
<div class="message-wrapper" :class="{'reverse': selfSend}">
  <img class="message-pp" :src="avatar" alt="profile-pic">
  <div class="message-box-wrapper">
    <div class="message-box">
      {{message}}
    </div>
    <span>{{sender}}</span>
  </div>
</div>
</template>

<style scoped>
.message-container {
  display: flex;
  margin-bottom: 1rem;
  flex-direction: column;
  width: 100%;
  align-items: start;
}

.message-content {
    width: 100%;
    margin-right: 10px;
}

.message-avatar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  margin-bottom: 5px;
}

</style>
