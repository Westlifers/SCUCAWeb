<script setup lang="ts">
import type {lotteryResult} from "@/types";

const imitateFetchData = async (lotteryName: string): Promise<lotteryResult[]> => {
  const data: lotteryResult[] = [
      {
          username: "张三",
          prize: "特等奖",
      },
      {
          username: "李四",
          prize: "一等奖",
      },
      {
          username: "王五",
          prize: "三等奖",
      },
      {
          username: "赵六",
          prize: "二等奖",
      },
      {
          username: "孙七",
          prize: "二等奖",
      },
      {
          username: "周八",
          prize: "三等奖",
      },
      {
          username: "吴九",
          prize: "三等奖",
      },
      {
          username: "郑十",
          prize: "三等奖",
      },
      {
          username: "钱十一",
          prize: "三等奖",
      },
      {
          username: "马十二",
          prize: "三等奖",
      },
  ]
}
const userGifts = await imitateFetchData("第一次抽奖")
</script>

<template>

</template>

<style scoped>

</style>
