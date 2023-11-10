<script setup lang="ts">
// check if login expired everytime
import {ElNotification} from "element-plus";
import router from "@/router";

if (window.localStorage.getItem('expire') as number <= new Date().getTime()) {
    localStorage.removeItem('userInfo');
    ElNotification({
        message: '登录信息过期，请重新登录',
        type: 'error',
        duration: 1.5 * 1000
    })
    await router.push({name: 'login'})
}
</script>

<template>

</template>

<style scoped>

</style>
