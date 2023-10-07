<script setup lang="ts">
import type {lotteryResult} from "@/types";

const imitateFetchData = async (lotteryName: string): Promise<lotteryResult[]> => {
  const data: lotteryResult[] = [
      {
          username: "张三",
          prize: "特等奖",
          node: "ad41"
      },
      {
          username: "李四",
          prize: "一等奖",
          node: "ad42"
      },
      {
          username: "王五",
          prize: "二等奖",
          node: "ad43"
      },
      {
          username: "赵六",
          prize: "三等奖",
          node: "ad44"
      },
      {
          username: "孙七",
          prize: "二等奖",
          node: "ad45"
      },
      {
          username: "周八",
          prize: "三等奖",
          node: "ad46"
      },
      {
          username: "吴九",
          prize: "三等奖",
          node: "ad47"
      },
      {
          username: "郑十",
          prize: "三等奖",
          node: "ad48"
      },
      {
          username: "钱十一",
          prize: "三等奖",
          node: "ad49"
      },
      {
          username: "孙十二",
          prize: "三等奖",
          node: "ad50"
      },
  ]

  return data
}

const validateNode = (node: string): boolean => {
    // node should be 4 characters that are only numbers or letters
    const reg = /^[0-9a-zA-Z]{4}$/
    return reg.test(node)
}
const validateGifts = (gifts: lotteryResult[]): boolean => {
    // gifts should be an array of lotteryResult
    return gifts.every((gift) => {
        return validateNode(gift.node)
    })
}

const userGifts: lotteryResult[] = await imitateFetchData("第一次抽奖")
</script>

<template>

</template>

<style scoped>

</style>
