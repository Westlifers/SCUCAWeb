<template>
  <div class="room_container">


    <div class="room_left_bar">

      <div class="room_left_bar__player_list">
        <div class="room_left_bar__player_list__title">
          <el-button type="danger" @click="exit">退出房间</el-button>
          <p>玩家列表</p>
        </div>
        <div class="room_left_bar__player_list__list">
          <el-scrollbar>
            <div v-for="player in playerList" :key="player" class="room_left_bar__player_list__list__player">
              <el-popover
                  placement="right"
                  width="200"
                  trigger="hover"
              >
                <template #reference>
                  <p>{{player}}: {{playerResults[player][round]>0?playerResults[player][round]:(playerResults[player][round]==0?'DNF':'未开始')}}</p>
                </template>
                <div class="room_left_bar__player_list__list__player__popover">
                  <el-scrollbar>
                    <div v-for="result in Object.entries(playerResults[player])" :key="result" class="room_left_bar__player_list__list__player__popover__result">
                      <p>第{{result[0]}}轮: {{ result[1] > 0 ? convert_time_num2str(result[1] as number) : (result[1] == 0? 'DNF': '未开始') }}</p>
                    </div>
                  </el-scrollbar>
                </div>
              </el-popover>
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
          <el-scrollbar ref="scrollbarRef">
            <div ref="innerRef">
              <div v-for="message in messageList" :key="message" class="room_left_bar__chat__list__message">
                <chat-message :sender="message.sender" :avatar="avatars[message.sender]" :message="message.message" />
              </div>
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

        <div class="room_header__left">
          <el-tag type="success" size="large">{{roomId}}</el-tag>
          <el-tag type="warning" size="large">{{event}}</el-tag>
          <el-tag type="danger" size="large">第{{round}}轮</el-tag>
        </div>
      </div>

      <div class="room_main">
        <div class="room_main__time">
          <p>{{ time === 0 ? 'DNF' : convert_time_num2str(time) }}</p>
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
      break;
    case 'player_list':
      playerList.value = message['players'];
      break;
    case 'finish':
      playerResults.value[message['sender']][round.value] = convert_time_num2str(message['time']);
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
    for (let player of newPlayerList) {
        if (!(player in avatars.value)) {
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
.room_left_bar__player_list__title {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
}
.room_left_bar__player_list__title button {
  font-size: 12px;
  margin-bottom: 10px;
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

.room_left_bar__chat__list__message {
    width: 100%;
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
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 20%;
}
.room_header__left p:first-child {
  font-size: 30px;
  font-weight: bold;
  margin-right: 20px;
}
.room_header__left p:nth-child(2) {
  font-size: 20px;
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
