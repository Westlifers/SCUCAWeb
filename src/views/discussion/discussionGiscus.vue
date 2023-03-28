<template>
  <div class="giscus-container">
    <giscus-widget
        repo="Westlifers/SCUCAWeb"
        repo-id="R_kgDOJFJMCg"
        category="Announcements"
        categoryId="DIC_kwDOJFJMCs4CVHVx"
        mapping="specific"
        term="SCUCAWeb"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="bottom"
        lang="zh-CN"
        crossorigin="anonymous"
        :theme="theme"
    />
  </div>
</template>

<script lang="ts" setup>
import 'giscus'
import {computed} from "vue";
import {store} from "@/store";

const isDark = computed(() => store.state.isDark)
const dark_theme = 'https://cdn.jsdelivr.net/gh/Westlifers/SCUCAWeb/src/styles/dark/giscus-dark-vars.css'
const theme = computed(() => {
  if (isDark.value) {
    return dark_theme
  } else {
    return 'light'
  }
})

</script>

<style scoped>
.giscus-container {
  display: flex;
  justify-content: center;
  padding-right: 5px;  /* to avoid overflow */
}

giscus-widget {
  width: 70%;
}

</style>
