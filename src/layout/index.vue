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
import NavFooterMobile from "@/layout/components/NavFooterMobile.vue";
import {isMobile} from "@/utils/constants";

export default defineComponent({
  name: 'App',
  computed: {
    isMobile() {
      return isMobile
    }
  },
  data() {
    return {
      open: true,
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
  /* 优先使用 dvh (动态视口高度)，不支持则回退到自定义变量，最后回退到 vh */
  height: calc(100dvh - 60px);
  height: calc(var(--viewport-height, 100vh) - 60px);
  background-color: var(--yougi-bg-color);
  overflow: auto;
}

/* 移动端隐藏滚动条 */
@media (max-width: 768px) {
  .el-main {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  
  .el-main::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* 确保 el-container 也隐藏滚动条 */
  .el-container {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .el-container::-webkit-scrollbar {
    display: none;
  }
}

:deep(.el-footer) {
  padding: 0;
}

#largest-container {
  height: 100dvh;
  height: var(--viewport-height, 100vh);
  overflow: hidden; /* 防止最外层容器出现滚动条 */
}

</style>
