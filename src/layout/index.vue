<template>

  <el-container id="largest-container">
    <el-header v-if="!isMobile">
      <nav-header />
    </el-header>

    <el-container>

      <nav-side-bar v-if="!isMobile" />

      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>

      <el-footer v-if="isMobile"><Suspense><nav-footer-mobile /></Suspense></el-footer>

    </el-container>
  </el-container>

</template>

<script lang="ts">
import NavSideBar from "@/layout/components/NavSideBar.vue";
import NavHeader from "@/layout/components/NavHeader.vue";

import {defineComponent} from 'vue'
import {isMobile} from "@/utils";
import NavFooterMobile from "@/layout/components/NavFooterMobile.vue";

export default defineComponent({
  name: 'App',
  computed: {
    isMobile() {
      return isMobile
    }
  },
  components: {NavFooterMobile, NavSideBar, NavHeader}
});
</script>

<style scoped>
.el-header {
  padding: 0;
}

.el-main {
  padding: 0;
  height: calc(100vh - 60px);
  background-color: var(--yougi-bg-color);
}

:deep(.el-footer) {
  padding: 0;
}

#largest-container {
  height: 100vh;
}

</style>
