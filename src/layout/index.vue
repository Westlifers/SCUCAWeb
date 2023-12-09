<template>

  <el-container id="largest-container">
    <el-header>
      <nav-header />
    </el-header>

    <el-container>
      <nav-side-bar v-if="!isMobile" />
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>

</template>

<script lang="ts">
import NavSideBar from "@/layout/components/NavSideBar.vue";
import NavHeader from "@/layout/components/NavHeader.vue";

import {defineComponent} from 'vue'
import {isMobile} from "@/utils";

export default defineComponent({
  name: 'App',
  computed: {
    isMobile() {
      return isMobile
    }
  },
  components: {NavSideBar, NavHeader}
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

#largest-container {
  height: 100vh;
}

</style>
