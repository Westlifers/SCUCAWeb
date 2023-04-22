<template>
  <div class="room_container">


    <div class="room_left_bar">

      <div class="room_left_bar__player_list">
        <div class="room_left_bar__player_list__title">
          <p>玩家列表</p>
        </div>
        <div class="room_left_bar__player_list__list">
          <el-scrollbar>
            <div v-for="player in playerList.slice(0, playerList.length-1)" :key="player" class="room_left_bar__player_list__list__player">
              <p>{{player}}: {{playerResults[player]}}</p>
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
          <el-input v-model="message" placeholder="输入消息" @keydown.enter="send_chat_message" @focus="is_typing=true" @blur="is_typing=false" />
        </div>
      </div>

    </div>

    <el-divider direction="vertical" style="height: 100%" />

    <div class="room_right_container">
      <div class="room_header">
        <div class="room_header__right">
          <p>{{scramble}}</p>
        </div>
        <el-divider direction="vertical"/>
        <div class="room_header__left">
          <p>{{roomId}}</p>
          <p>{{event}}</p>
        </div>
      </div>

      <div class="room_main">
        <div class="room_main__time">
          <p>{{time===0?'DNF':time_convert(time)}}</p>
        </div>
        <div class="room_main__scramble_img">
          <twisty-player
              v-if="imgVisible"
              :puzzle="translateEvent(event)"
              :alg="scramble"
              :visualization="is3d? '3D' : '2D'"
          />
          <div class="scramble-img-select">
            <el-button
                type="primary"
                @click="imgVisible = !imgVisible"
            >
              {{imgVisible ? 'Hide' : 'Show'}} Scramble
            </el-button>
            <el-button
                type="primary"
                @click="is3d = !is3d"
            >
              {{is3d ? '2D' : '3D'}} Visualization
            </el-button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <timing-curtain :state="timingState" @timing-over="set_time" v-if="!finished && !is_typing" />
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
import {Ref, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import TimingCurtain from "@/components/timingCurtain/timingCurtain.vue";
import {time_convert, translateEvent} from "@/utils";
import TwistyPlayer from "@/components/cubingjs/twistyPlayer.vue";

const message: Ref<string> = ref('');
const scramble: Ref<string> = ref('');
const playerList: Ref<string[]> = ref([]);
const playerResults: Ref<object> = ref({});
const messageList: Ref<object[]> = ref([]);
const time: Ref<number> = ref(0);
const timingState: Ref<number> = ref(0);
const finished: Ref<boolean> = ref(false);
const is_typing: Ref<boolean> = ref(false);  // 焦点在输入框上
const imgVisible: Ref<boolean> = ref(true);
const is3d: Ref<boolean> = ref(false);

const roomId = router.currentRoute.value.params.roomId;
const event = router.currentRoute.value.params.event;
//const baseUrl = "ws://127.0.0.1:8000/ws/pk/";
const baseUrl = "wss://yougi.top/ws/pk/";
const pkSocket = new WebSocket(baseUrl + roomId + "/" + event + "/");

const set_time = (t) => {
  time.value = t.punishment===-1?0:t.time;
  send_finish();
  finished.value = true;
};

pkSocket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  switch (message['type']) {
    case 'chat_message':
      messageList.value.push({sender: message['sender'], message: message['message']});
      break;
    case 'new_round':
      scramble.value = message['scramble'];
      finished.value = false;
      break;
    case 'player_list':
      playerList.value = message['players'];
      break;
    case 'finish':
      playerResults.value[message['sender']].push(time_convert(message['time']));
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
const send_finish = () => {
  pkSocket.send(JSON.stringify({
    'type': 'finish',
    'time': time.value
  }));
};
watch(playerList, (newPlayerList) => {
  for (let player of newPlayerList) {
    if (!(player in playerResults.value)) {
      playerResults.value[player] = [];
    }
  }
  // remove players who left
  for (let player in playerResults.value) {
    if (!newPlayerList.includes(player)) {
      delete playerResults.value[player];
    }
  }
});



// 滚动条自动滚动到底部
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


.room_right_container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  width: 70%;
}


.room_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 10%;
  width: 100%;
}

.room_header__left {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 20%;
}
.room_header__left p:first-child {
  font-size: 30px;
  font-weight: bold;
  margin-right: 20px;
}
.room_header__left p:last-child {
  font-size: 20px;
  font-weight: bold;
  margin-right: 20px;
}

.room_header__right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 80%;
}
.room_header__right p {
  font-size: 20px;
  font-weight: bold;
  margin-right: 20px;
}


.room_main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 80%;
  width: 100%;
}
.room_main__time {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.room_main__time p {
  font-size: 100px;
  font-weight: bold;
  margin-bottom: 100px;
}
.room_main__scramble_img {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.scramble-img-select {
  display: flex;
  justify-content: flex-end;
}
</style>
