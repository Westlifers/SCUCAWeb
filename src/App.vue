<template>
  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'App',
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
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
