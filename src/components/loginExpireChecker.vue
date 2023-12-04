<script setup lang="ts">
import {version} from "../../package.json"

// check if login expired everytime
import {ElNotification} from "element-plus";
import router from "@/router";
import {getAnnouncement} from "@/api/fetchData";

if (window.localStorage.getItem('expire') as number <= new Date().getTime()) {
    localStorage.removeItem('userInfo');
    ElNotification({
        message: '登录信息过期，请重新登录',
        type: 'error',
        duration: 1.5 * 1000
    })
    await router.push({name: 'login'})
}

// 获取最新的一个更新公告
const posts = await getAnnouncement('update')
const latestUpdate = posts[0]
const latestVersion = latestUpdate.title.split('更新日志')[1]
const currentVersion = version
const hasNewVersion = latestVersion !== currentVersion
if (hasNewVersion) {
    ElNotification({
        title: '发现新版本',
        dangerouslyUseHTMLString: true,
        message: `
          当前版本：
          <span style="background-color: #409EFF;color: #fff;padding: 0 5px;border-radius: 5px;">${currentVersion}</span>
          最新版本：
          <span style="background-color: #8bea5a;color: #fff;padding: 0 5px;border-radius: 5px;">${latestVersion}</span>
          <br/>
          请刷新页面以获取更新
        `,
        type: 'info',
        duration: 0
    })
}
</script>

<template>

</template>

<style scoped>

</style>
