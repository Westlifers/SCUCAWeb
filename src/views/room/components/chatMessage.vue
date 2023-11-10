<script setup lang="ts">
const props = defineProps<{
  message: string
  sender: string
  avatar: string
}>()
</script>

<template>
<div class="message-container">
  <div class="message-avatar">
    <el-avatar :src="avatar" size="small" v-if="sender!=='SERVER'" />
    <div class="message-sender">
      <el-tag :type="sender=='SERVER'?'danger':'warning'">{{ props.sender }}</el-tag>
    </div>
  </div>
  <div class="message-content">
    <el-card>
      {{ props.message }}
    </el-card>
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
