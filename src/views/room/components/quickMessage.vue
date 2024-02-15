<script setup lang="ts">

import {isMobile, QUICK_MESSAGES} from "@/utils/constants";
import {ref, unref} from "vue";

const popoverRef = ref()
const buttonRef = ref()

const onSendQuickMessage = () => {
  // close popover
  unref(popoverRef).hide()
}

const emit = defineEmits<{
  (event: 'send_message', message: string): void
}>()
</script>

<template>
<el-button type="primary" size="default" ref="buttonRef">{{isMobile?'快捷':'快捷消息'}}</el-button>

<el-popover placement="top" width="200" trigger="click" ref="popoverRef" virtual-triggering :virtual-ref="buttonRef">
  <div class="quick-message-wrapper">
    <div class="quick-message-item" v-for="message in QUICK_MESSAGES" :key="message" @click="emit('send_message', message);onSendQuickMessage()">{{message}}</div>
  </div>
</el-popover>
</template>

<style scoped>
.quick-message-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.quick-message-item {
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 20px;
    transition: all 0.5s ease;
}

.quick-message-item:hover {
    background-color: var(--profile-quote-bg-color);
    color: var(--profile-quote-color);
    transition: all 0.5s ease;
}

.el-popper {
    padding: 0 !important;
}
:deep(.el-popper) {
    padding: 0 !important;
}
</style>
