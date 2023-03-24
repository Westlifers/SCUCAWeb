<template>
  <div class="giscus">
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
        theme="light"
        lang="zh-CN"
        crossorigin="anonymous"
    />
  </div>
</template>

<script lang="ts" setup>
import 'giscus'
</script>

<style scoped>
.giscus {
  display: flex;
  justify-content: center;
  padding-right: 1px;  /* to avoid overflow */
}

giscus-widget {
  width: 70%;
}

</style>
