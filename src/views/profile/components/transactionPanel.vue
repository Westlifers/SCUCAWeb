<template>
  <div class="card transection" style="--delay: 1.2s">
    <div class="transection-header">
      <div class="head">
        本周积分榜
        <el-tooltip
            class="box-item"
            effect="dark"
            placement="top-start"
        >
          <el-icon><QuestionFilled /></el-icon>
          <template #content>
            积分功能尚处于测试阶段，具体算法见首页公告
          </template>
        </el-tooltip>
      </div>
      <div class="head is-wait" @click="dialogVisible=true">View All</div>
    </div>
    <div class="credit-wrapper" v-for="user in users.length>=4?users.slice(0, 4):users" :key="user.username">
      <el-avatar :src="!user.profile.avatar?'http://img.yougi.top/default.png':user.profile.avatar"
                 size="default"
                 style="margin-right: 10px"
      />
      <div class="credit-name">
        <div class="credit-type">{{user.profile.username}}</div>
        <div class="credit-status">
          {{user.profile.description===undefined?'暂无简介':user.profile.description}}
        </div>
      </div>
      <div class="credit-money is-active">{{user.score.toFixed(2)}}</div>
    </div>
  </div>

  <el-dialog title="积分榜" v-model="dialogVisible" :width="is_mobile?'80%':'30%'" append-to-body>
    <div class="dialog-score-wrapper">
      <div class="credit-wrapper" v-for="user in users" :key="user.username">
        <el-avatar :src="!user.profile.avatar?'http://img.yougi.top/default.png':user.profile.avatar"
                   size="default"
                   style="margin-right: 10px"
        />
        <div class="credit-name">
          <div class="credit-type">{{user.profile.username}}</div>
        </div>
        <div class="credit-money is-active">
          {{user.score.toFixed(2)}}
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {getProfile, getScoreRank} from "@/api/fetchData";
import type {Score} from "@/types";
import {computed, ref} from "vue";

const dialogVisible = ref(false)
const is_mobile = computed(() => {
  return window.innerWidth <= 768
})

const scoreRank: Score[] = await getScoreRank()
// get all usernames

const users: {profile, username, score}[] = []
for (let i = 0; i < scoreRank.length; i++) {
  const profile = await getProfile(scoreRank[i].username)
  users.push({
    profile: profile,
    username: scoreRank[i].username,
    score: scoreRank[i].score,
  })
}

</script>

<style scoped>
.dialog-score-wrapper .credit-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.credit-type {
  text-align: left;
}

.head.is-wait {
  cursor: pointer;
}

.credit-wrapper:nth-child(1) .credit-money {
  color: #e1cc5b;
  font-size: 20px;
}
.credit-wrapper:nth-child(2) .credit-money {
  color: #C0C0C0;
  font-size: 18px;
}
.credit-wrapper:nth-child(3) .credit-money {
  color: #CD7F32;
  font-size: 16px;
}
.transection .credit-wrapper:nth-child(2) .credit-money {
  color: #e1cc5b;
  font-size: 20px;
}
.transection .credit-wrapper:nth-child(3) .credit-money {
  color: #C0C0C0;
  font-size: 18px;
}
.transection .credit-wrapper:nth-child(4) .credit-money {
  color: #CD7F32;
  font-size: 16px;
}

</style>
