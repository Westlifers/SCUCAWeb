<template>
  <div class="app-container">
    <div class="app-main">
      <el-scrollbar ref="scrollbarRef">
        <div class="chat-wrapper" ref="innerRef">
          <chat-message v-for="message in messageList" :key="message" :sender="message.sender" :self-send="message.sender==store.user.username" :avatar="avatars[message.sender]" :message="message.message" :type="message.type" />
        </div>
      </el-scrollbar>

      <div class="chat-input-wrapper">
        <el-input type="text" @keydown.enter="send_chat_message" v-model="message" placeholder="Enter your message here" @focus="is_typing=true" @blur="is_typing=false" />
        <button class="chat-send-btn" @click="send_chat_message">Send</button>
      </div>
    </div>


    <div class="app-right">
      <div class="chat-list-wrapper">
        <div class="chat-list-header">
          <div class="chat-list-header-left">在线玩家<span class="c-number">{{playerList.length}}</span><el-tag>第{{round}}轮</el-tag></div>
          <div class="chat-list-header-right"><el-button style="font-size: 12px;" type="danger" @click="exit">Exit <el-icon><CloseBold /></el-icon></el-button></div>
        </div>
        <ul class="chat-list active">
          <li class="chat-list-item active" v-for="player in playerList" :key="player">
            <img :src="avatars[player]" :alt="player">
            <span class="chat-list-name">{{player}}：</span>
            <span class="chat-list-name-result">{{playerResults[player][round]>0?(round==0?'已准备':playerResults[player][round]):(playerResults[player][round]==0?'DNF':'未开始')}}</span>
          </li>
        </ul>
      </div>
      <div class="app-profile-box">
        <div class="activity-info-box time">
          <div class="info-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-clock" viewBox="0 0 24 24">
              <defs></defs>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <div class="info-text-wrapper">
            <span class="info-text-upper">{{ time === 0 ? 'DNF' : convert_time_num2str(time) }}</span>
            <span class="info-text-bottom">Time</span>
          </div>
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
                @click="is3d = !is3d"
            >
              {{is3d ? '2D' : '3D'}} 视角
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
//   And four types of messages from server to client:
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
//       'round': 1,
//   }
//   3. player_list: the player list, sent when a new player joins the room
//   {
//     'type': 'player_list',
//       'players': ['Alice', 'Bob', 'Carol'],
//   }
//   4. results_of_this_round: the results of this round, sent when a new player joins the room halfway of a round
//   {
//     'type': 'results_of_this_round',
//       'results': {'Alice': 23.4, 'Bob': 24.5},
//   }
import router from "@/router";
import type {Ref} from "vue";
import {nextTick, ref, watch} from "vue";
import {ElMessage, ElScrollbar} from "element-plus";
import TimingCurtain from "@/components/timingCurtain/timingCurtain.vue";
import {convert_time_num2str, get_user_avatar, translateEvent} from "@/utils";
import TwistyPlayer from "@/components/cubingjs/twistyPlayer.vue";
import type {apiUsedEventName} from "@/types";
import ChatMessage from "@/views/room/components/chatMessage.vue";
import {localStore} from "@/store";

const message: Ref<string> = ref('');
const scramble: Ref<string> = ref('');
const playerList: Ref<string[]> = ref([]);
const playerResults: Ref<object> = ref({});
// playerResults = {
//  'Alice': {
//    '1': 23.4,
//    '2': 24.5,
//    ...
//  }, ...
// }
const messageList: Ref<object[]> = ref([]);
const round: Ref<number> = ref(0);
const time: Ref<number> = ref(0);
const timingState: Ref<number> = ref(0);
const finished: Ref<boolean> = ref(false);
const is_typing: Ref<boolean> = ref(false);  // 焦点在输入框上
const imgVisible: Ref<boolean> = ref(true);
const is3d: Ref<boolean> = ref(false);
const avatars: Ref<object> = ref({})
const store = localStore()

const roomId = router.currentRoute.value.params.roomId;
const event = router.currentRoute.value.params.event as apiUsedEventName  // 此路由只能是项目名

// const baseUrl = "ws://127.0.0.1:8000/ws/pk/";
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
      round.value = message['round'];
      finished.value = false;
      for (let playerResult of Object.entries(playerResults.value)) {
          playerResults.value[playerResult[0]][round.value] = -1;
      }
      if (round.value == 0) {
        messageList.value.push({
            sender: 'SERVER',
            message: `欢迎，按空格随意发送一次成绩即为准备`
        })
      }
      else {
        messageList.value.push({
          sender: 'SERVER',
          message: `第${round.value}轮打乱：${scramble.value}`,
          type: 'new_round'
        })
      }
      break;
    case 'player_list':
      playerList.value = message['players'];
      break;
    case 'finish':
      playerResults.value[message['sender']][round.value] = convert_time_num2str(message['time']);
      messageList.value.push({
          sender: message['sender'],
          message: convert_time_num2str(message['time'])==0?'DNF':convert_time_num2str(message['time']),
          type: round.value==0?'ready':'finish'
      })
      break;
    case 'results_of_this_round':
      playerResults.value = message['results'];
      // 补充其他人的成绩为空
      for (let player of playerList.value) {
        if (!(player in playerResults.value)) {
          playerResults.value[player] = [];
        }
      }
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
watch(playerList, async (newPlayerList, oldPlayerList) => {
    if (newPlayerList.length > oldPlayerList.length) {
        // add player who joined
        for (let player of newPlayerList) {
            if (!(oldPlayerList.indexOf(player) > -1)) {
                console.log(player)
                playerResults.value[player] = [];
            }
        }
    } else {
        // remove player who left
        for (let player of oldPlayerList) {
            if (!(newPlayerList.indexOf(player) > -1)) {
                delete playerResults.value[player];
            }
        }
    }

    // add avatar
    for (let player of ['SERVER'].concat(newPlayerList)) {
        if (player == 'SERVER') {
            avatars.value[player] = 'https://img.yougi.top/default.png'
        }
        else if (!(player in avatars.value)) {
            avatars.value[player] = await get_user_avatar(player);
        }
    }
});

// close the websocket when the user leaves the page
window.onbeforeunload = function() {
  pkSocket.close();
};
const exit = () => {
  pkSocket.close();
  router.push({path: '/pk'});
}



// 滚动条自动滚动到底部
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const innerRef = ref<HTMLDivElement>()
watch(messageList.value, async () => {
    // 需要等待dom更新后才能获取到innerRef的新高度！这很重要，否则总是差一条消息的高度
    await nextTick()
    const maxScrollTop = innerRef.value?.clientHeight as number
    if (scrollbarRef.value) {
        scrollbarRef.value.setScrollTop(maxScrollTop)
    }
})
</script>

<style scoped>
.app-profile-box {
    overflow: hidden;
}

.chat-list-header {
    display: flex;
    justify-content: space-between;
}
.chat-list-header-left {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

.chat-list-name-result {
    font-size: 14px;
}
</style>
