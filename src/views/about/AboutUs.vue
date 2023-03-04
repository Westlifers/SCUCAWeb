<template>
  <div class="about">
    <span>四川大学魔方协会 SCUCAComp v{{version}}</span>
    <span>本项目已开源至GitHub: <el-link type="primary" :underline="true" href="https://github.com/Westlifers/SCUCAWeb" target="_blank">https://github.com/Westlifers/SCUCAWeb</el-link></span>

    <el-divider>
      <el-icon><star-filled /></el-icon>
    </el-divider>

    <div class="power">
      <el-space size="large">Powered By:
        <div class="icons">
          <span><el-icon><ElementPlus /></el-icon> Element-Plus</span>
          <span><svg style="width: 16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M356.9 64.3H280l-56 88.6-48-88.6H0L224 448 448 64.3h-91.1zm-301.2 32h53.8L224 294.5 338.4 96.3h53.8L224 384.5 55.7 96.3z"/></svg> Vue.js</span>
        </div>
      </el-space>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = ref(require("../../../package.json").version)
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding-top: 50px;
}

.text {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  text-align: left;
  text-indent:2em
}

.power {
  display: flex;
  justify-content: center;
}

.icons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 40px;
}

</style>
