<template>
  <div class="practice-container">
    <div class="practice-side-bar">
      <practice-side-bar :timing-state="timingState" :scramble="scramble" @set-time="setTime" />
    </div>

    <div class="practice-content">
      <div class="practice-header">
        <practice-header
            :event="event"
            :scramble="scramble"
            @set-event="setEvent"
            @set-scramble="setScramble"
            @update-scramble="updateScramble"
        />
      </div>

      <div class="practice-main">
        <div class="practice-time" @click="timingState++">
          {{time===0?'DNF':time_convert(time)}}
        </div>
        <div class="scramble-img">
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

</template>

<script lang="ts" setup>
import PracticeHeader from "@/views/practice/components/practiceHeader.vue";
import PracticeSideBar from "@/views/practice/components/practiceSideBar.vue";
import {randomScrambleForEvent} from "cubing/scramble"
import {ref} from "vue";
import type {Ref} from "vue";
import {time_convert, translateEvent, translateEventForScramble} from "@/utils";
import TwistyPlayer from "@/components/cubingjs/twistyPlayer.vue";
import type {apiUsedEventName} from "@/types";

const event:Ref<apiUsedEventName> = ref<apiUsedEventName>('333')
const scramble:Ref<string> = ref((await randomScrambleForEvent(translateEventForScramble(event.value))).toString())
const imgVisible = ref(true)
const is3d = ref(false)
const timingState = ref(0)
const time = ref(0)

const setEvent = (e) => {
  event.value = e
}
const setScramble = (s) => {
  scramble.value = s
}
const updateScramble = async () => {
  scramble.value = (await randomScrambleForEvent(translateEventForScramble(event.value))).toString()
}
const setTime = async (t) => {
  time.value = t
  await updateScramble()
}

</script>

<style scoped>
.practice-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.practice-side-bar {
  width: 25%;
  height: 100%;
}
.practice-content {
  width: 75%;
  height: 100%;
  max-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.scramble-img {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scramble-img-select {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
}

.practice-main {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.practice-time {
  font-size: 100px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
@media only screen and (max-width: 600px) {
  .practice-time {
    font-size: 50px;
  }

  :deep(.select-bar) {
    flex-direction: column;
  }
}

.practice-header {
  position: absolute;
}
</style>
