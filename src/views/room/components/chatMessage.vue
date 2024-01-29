<script setup lang="ts">
import {ElNotification} from "element-plus";

const prop = defineProps<{
  message: string
  sender: string
  avatar: string
  selfSend: boolean
  type: string
}>()

const copyScrambleToClipboard = () => {
  if (prop.type !== 'new_round') return

  const text = prop.message.split("：")[1]

  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', text)
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, 9999)
  document.execCommand('copy')
  document.body.removeChild(input)

  ElNotification({
    message: '打乱已复制到剪切板',
    type: 'success',
    duration: 2000
  })
}

</script>

<template>
<div class="message-wrapper" :class="{'reverse': selfSend, 'copy': type=='new_round'}">
  <img class="message-pp" :src="avatar" alt="profile-pic">
  <div class="message-box-wrapper">
    <div class="message-box" @click="copyScrambleToClipboard">
      {{message}}
    </div>
    <span><el-button v-if="type=='finish'||type=='ready'" :type="type=='ready'?'primary':'success'" size="small" :icon="type=='ready'?'':'check'" circle></el-button>&nbsp;{{sender}}&nbsp;</span>
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

.message-wrapper.reverse .message-box-wrapper span {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.message-wrapper .message-box-wrapper span {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
}

.copy .message-box-wrapper .message-box{
  cursor: pointer;
}

</style>
