<template>
  <div class="room_container">


    <div class="room_left_bar">

      <div class="room_left_bar__player_list">
        <div class="room_left_bar__player_list__title">
          <p>Players</p>
        </div>
        <div class="room_left_bar__player_list__list">
          <el-scrollbar>
            <div v-for="player in playerList" :key="player" class="room_left_bar__player_list__list__player">
              <p>{{player}}</p>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <el-divider />

      <div class="room_left_bar__chat">
        <div class="room_left_bar__chat__title">
          <p>聊天</p>
        </div>
        <div class="room_left_bar__chat__list">
          <el-scrollbar>
            <div v-for="message in messageList" :key="message" class="room_left_bar__chat__list__message">
              <p>{{message.sender}}: {{message.message}}</p>
            </div>
          </el-scrollbar>
        </div>
        <div class="room_left_bar__chat__input">
          <el-input v-model="message" placeholder="输入消息" @keydown.enter="send_chat_message" />
        </div>
      </div>

    </div>


    <div class="room_header">
      <div class="room_header__left">
        <p>{{roomId}}</p>
        <p>{{event}}</p>
      </div>
      <div class="room_header__right">
        {{scramble}}
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
// There are three types of messages from client to other clients, the server will handle and relay them:
//     1. chat_message: a message from one client
// receive:
// {
//   'type': 'chat_message',
//     'message': 'Hello World!'
// }
// relay:
// {
//   'type': 'chat_message',
//     'message': 'Hello World!',
//     'sender': 'Alice'
// }
// 2. finish: a client finishes his turn
// receive:
// {
//   'type': 'finish',
//     'time': 23.4,
// }
// relay:
// {
//   'type': 'finish',
//     'time': 23.4,
//     'sender': 'Alice'
//
//   And five types of messages from server to client:
//     1. chat_message: a message from server
//   {
//     'type': 'chat_message',
//       'message': 'Hello World!'
//     'sender': 'SERVER'  # fixed, do not change
//   }
//   2. new_round: a new round starts
//   {
//     'type': 'new_round',
//       'scramble': 'ABCD',
//   }
//   3. join: a new player joins the room
//   {
//     'type': 'join',
//       'player': 'Alice',
//   }
//   4. leave: a player leaves the room
//   {
//     'type': 'leave',
//       'player': 'Alice',
//   }
//   5. player_list: the player list, sent when a new player joins the room
//   {
//     'type': 'player_list',
//       'players': ['Alice', 'Bob', 'Carol'],
//   }
import router from "@/router";
import {Ref, ref} from "vue";
import {ElMessage} from "element-plus";

const message: Ref<string> = ref('');
const scramble: Ref<string> = ref('');
const playerList: Ref<string[]> = ref([]);
const messageList: Ref<object[]> = ref([]);

const roomId = router.currentRoute.value.params.roomId;
const event = router.currentRoute.value.params.event;
const baseUrl = "ws://localhost:8000/ws/pk/";
const pkSocket = new WebSocket(baseUrl + roomId + "/" + event + "/");

pkSocket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  switch (message['type']) {
    case 'chat_message':
      messageList.value.push({sender: message['sender'], message: message['message']});
      break;
    case 'new_round':
      scramble.value = message['scramble'];
      break;
    case 'player_list':
      playerList.value = message['players'];
      break;
    default:
      console.error('Unrecognized message type: ' + message['type']);
  }
};
pkSocket.onclose = function(e) {
  console.error('Chat socket closed unexpectedly');
};
const send_chat_message = () => {
  if (message.value === "") {
    ElMessage.error("消息不能为空")
    return;
  }
  pkSocket.send(JSON.stringify({
    'type': 'chat_message',
    'message': message.value
  }));
  message.value = "";
};

setInterval(() => {
  let scroll_bars = document.getElementsByClassName('el-scrollbar__wrap');
  let scroll_bar = scroll_bars[scroll_bars.length - 1];
  if (scroll_bar){
    scroll_bar.scrollTop = scroll_bar.scrollHeight;
  }
}, 1000);
</script>

<style scoped>
.room_container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  width: 100%;
  background-color: var(--yougi-projects-section);
  border-radius: 30px;
  padding: 20px 20px 20px 20px;
}

.room_left_bar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  width: 30%;
}

.room_left_bar__player_list {
  max-height: 20%;
}
.room_left_bar__player_list__list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 80%;
}
.room_left_bar__player_list__title p {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 0;
}
.room_left_bar__chat__title p {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 0;
}

.room_left_bar__chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  height: 70%;
  width: 100%;
}

.room_left_bar__chat__list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 80%;
  text-align: left;
}


.room_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  width: 100%;
}
</style>
