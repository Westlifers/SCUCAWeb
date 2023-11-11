<template>
  <div class="app-container">
    <div class="app-main">
      <el-scrollbar ref="scrollbarRef">
        <div class="chat-wrapper" ref="innerRef">
          <div class="message-wrapper reverse">
            <img class="message-pp" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="profile-pic">
            <div class="message-box-wrapper">
              <div class="message-box">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur
              </div>
              <span>9h ago</span>
            </div>
          </div>
          <div class="message-wrapper reverse">
            <img class="message-pp" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="profile-pic">
            <div class="message-box-wrapper">
              <div class="message-box">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </div>
              <span>9h ago</span>
            </div>
          </div>
          <div class="message-wrapper">
            <img class="message-pp" src="https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=934&amp;q=80" alt="profile-pic">
            <div class="message-box-wrapper">
              <div class="message-box">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur
              </div>
              <span>9h ago</span>
            </div>
          </div>
          <div class="message-wrapper">
            <img class="message-pp" src="https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=934&amp;q=80" alt="profile-pic">
            <div class="message-box-wrapper">
              <div class="message-box">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </div>
              <span>9h ago</span>
            </div>
          </div>
          <div class="message-wrapper reverse">
            <img class="message-pp" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="profile-pic">
            <div class="message-box-wrapper">
              <div class="message-box">
                Lorem ipsum dolor sit amet
              </div>
              <span>9h ago</span>
            </div>
          </div>
          <div class="message-wrapper reverse">
            <img class="message-pp" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80" alt="profile-pic">
            <div class="message-box-wrapper">
              <div class="message-box">
                Lorem ipsum dolor
              </div>
              <span>9h ago</span>
            </div>
          </div>
          <div class="message-wrapper">
            <img class="message-pp" src="https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=934&amp;q=80" alt="profile-pic">
            <div class="message-box-wrapper">
              <div class="message-box">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </div>
              <span>9h ago</span>
            </div>
          </div>
          <chat-message v-for="message in messageList" :key="message" :sender="message.sender" :self-send="message.sender==store.user.username" :avatar="avatars[message.sender]" :message="message.message" />
        </div>
      </el-scrollbar>

      <div class="chat-input-wrapper">
        <el-input type="text" @keydown.enter="send_chat_message" v-model="message" placeholder="Enter your message here" @focus="is_typing=true" @blur="is_typing=false" />
        <button class="chat-send-btn" @click="send_chat_message">Send</button>
      </div>
    </div>
    <div class="app-right">
      <div class="chat-list-wrapper">
        <div class="chat-list-header">Active Conversations <span class="c-number">4</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="feather feather-chevron-up" viewBox="0 0 24 24">
            <defs/>
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </div>
        <ul class="chat-list active">
          <li class="chat-list-item active">
            <img src="https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" alt="chat">
            <span class="chat-list-name">Dwight Schrute</span>
          </li>
          <li class="chat-list-item">
            <img src="https://images.unsplash.com/photo-1566465559199-50c6d9c81631?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" alt="chat">
            <span class="chat-list-name">Andy Bernard</span>
          </li>
          <li class="chat-list-item">
            <img src="https://images.unsplash.com/photo-1562788869-4ed32648eb72?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2552&q=80" alt="chat">
            <span class="chat-list-name">Michael Scott</span>
          </li>
          <li class="chat-list-item">
            <img src="https://images.unsplash.com/photo-1604004555489-723a93d6ce74?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=934&q=80" alt="chat">
            <span class="chat-list-name">Holy Flax</span>
          </li>
          <li class="chat-list-item">
            <img src="https://images.unsplash.com/photo-1583864697784-a0efc8379f70?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60" alt="chat">
            <span class="chat-list-name">Jim Halpert</span>
          </li>
        </ul>
      </div>
      <div class="app-profile-box">
        <img src="https://images.unsplash.com/photo-1587080266227-677cc2a4e76e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80" alt="profile">
        <p class="app-profile-box-title name"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Dwight Scrute</p>
        <p class="app-profile-box-title mail"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>dwightscrute@test.com</p>
        <button class="archive-btn">Archive<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-archive" viewBox="0 0 24 24">
          <defs/>
          <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>
        </svg></button>
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
    for (let player of ['SERVER'].concat(newPlayerList)) {
        if (player == 'SERVER') {
            avatars.value[player] = 'http://img.yougi.top/default.png'
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

</style>
