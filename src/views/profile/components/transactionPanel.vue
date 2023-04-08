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
            <v-md-preview :text="helpText"/>
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

  <el-dialog title="积分榜" v-model="dialogVisible"  width="30%" append-to-body>
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
import {Score} from "@/types";
import {ref} from "vue";

const dialogVisible = ref(false)

const scoreRank: Score[] = await getScoreRank()
// get all usernames
const users: object[] = []
for (let i = 0; i < scoreRank.length; i++) {
  const profile = await getProfile(scoreRank[i].username)
  users.push({
    profile: profile,
    username: scoreRank[i].username,
    score: scoreRank[i].score,
  })
}

const helpText = '$$ \\text{积分规则(beta测试): 按每项目平均成绩对应的NR倒序排名进行累加，结果除以100，保留两位小数。其中NR数据只取前95\\%} ' +
    '\\\\ Score = \\frac{1}{100} \\sum_\\text{e for event} NR_{0.95}^{-}(e) \\\\ ' +
    '\\text{超出NR95\\%范围，分数不再增加或减少} $$'

</script>

<style scoped>
.dialog-score-wrapper .credit-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.head.is-wait {
  cursor: pointer;
}

.credit-wrapper:nth-child(1) .credit-money {
  color: #FFD700;
}
.credit-wrapper:nth-child(2) .credit-money {
  color: #C0C0C0;
}
.credit-wrapper:nth-child(3) .credit-money {
  color: #CD7F32;
}
.transection .credit-wrapper:nth-child(2) .credit-money {
  color: #FFD700;
}
.transection .credit-wrapper:nth-child(3) .credit-money {
  color: #C0C0C0;
}
.transection .credit-wrapper:nth-child(4) .credit-money {
  color: #CD7F32;
}
</style>
