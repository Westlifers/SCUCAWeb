<template>
  <div class="discount card" style="--delay: .4s">
    <div class="title">周赛参与进度</div>
    <div class="discount-wrapper">
      <div class="discount-info">
        <div class="subtitle">已参加项目：{{week_events_finished.length}}个</div>
        <div class="subtitle-count">
          <TransitionGroup name="list" tag="div">
            <p v-for="event in finishedTempArray" :key="event">{{event}}</p>
          </TransitionGroup>
        </div>
        <div class="subtitle">未参加项目：{{week_events_unfinished.length}}个</div>
        <div class="subtitle-count dist">
          <TransitionGroup name="list" tag="div">
            <p v-for="event in unfinishedTempArray" :key="event">{{event}}</p>
          </TransitionGroup>
        </div>
      </div>
      <div class="discount-chart">
        <div class="circle">
          <div class="pie">
            <svg>
              <circle cx="60" cy="60" r="50"
                      :style="{ strokeDasharray: dasharray }"
              ></circle>
            </svg>
          </div>
          <div class="counter">{{(week_events_finished.length/week_events_all.length*100).toFixed(0)}}%</div>
        </div>
      </div>
    </div>
    <div class="discount-profile">
      <span class="by">By:</span>
      <img class="discount-img" :src="adminAvatar" alt="">
      <div class="discount-detail">
        <div class="discount-name">杨荻</div>
        <div class="discount-type">网站管理员</div>
      </div>
    </div>
    <div class="button offer-button">Donate</div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import {store, UPDATE_USER_PARTICIPATION_DATA} from "@/store";
import {get_user_avatar} from "@/utils";

// 获取用户进度
await store.commit(UPDATE_USER_PARTICIPATION_DATA)
const userParticipationData = computed(() => store.state.userParticipation)
// 根据进度，计算相关的项目
const week_events_all = computed(() =>
    userParticipationData.value.week.events_all
)
const week_events_finished = computed(() =>
    userParticipationData.value.week.events_finished
)
const week_events_unfinished = computed(() =>
    week_events_all.value.filter((item) => !week_events_finished.value.includes(item))
)

const ratio = computed(() => week_events_finished.value.length / week_events_all.value.length)
const dasharray = computed(() => `${ratio.value * 314} 314`)

const adminAvatar = await get_user_avatar("杨荻")
const finishedIndex = ref(0)
// 我他妈的也不知道为什么要用新的数组，来不断移除和添加元素，才能实现动画，直接用v-if有些动画不会出现
const finishedTempArray = computed(() => [week_events_finished.value[finishedIndex.value]])
const unfinishedIndex = ref(0)
const unfinishedTempArray = computed(() => [week_events_unfinished.value[unfinishedIndex.value]])
// let Index increase every 3s infinitely, and reset to 0 when it reaches the end
setInterval(() => {
  if (finishedIndex.value < week_events_finished.value.length - 1) {
    finishedIndex.value++
  } else {
    finishedIndex.value = 0
  }
}, 3000)
setInterval(() => {
  if (unfinishedIndex.value < week_events_unfinished.value.length - 1) {
    unfinishedIndex.value++
  } else {
    unfinishedIndex.value = 0
  }
}, 3000)
</script>

<style scoped>
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

/* 这一步是保证div下的p在被删除前，保持在原位置（因为父元素布局有空位，abs布局会出现定位错误） */
.subtitle-count div{
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
