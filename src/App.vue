<template>
  <router-view></router-view>
  <Suspense><login-expire-checker /></Suspense>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import LoginExpireChecker from "@/components/loginExpireChecker.vue";

export default defineComponent({
    name: 'App',
    components: {LoginExpireChecker},
});
</script>

<style>
html {
    height: 100%;

}
* {
    margin: 0;
    padding: 0;
}
#app {
    font-family: "DM Sans", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: var(--yougi-app-container) !important;
}
body {
    background-color: var(--yougi-app-container) !important;
    user-select: none;
}

/**修改全局的滚动条*/
/**滚动条的宽度*/
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-thumb {
    background-color: #eaecf1;
    border-radius: 3px;
}
</style>
