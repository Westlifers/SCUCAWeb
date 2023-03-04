<template>
  <el-tabs v-model="activeName" class="demo-tabs" type="card" v-if="isAdmin">
    <el-tab-pane name="week" label="周赛">
      <week-form />
    </el-tab-pane>
    <el-tab-pane name="special" label="正赛">
      <special-form />
    </el-tab-pane>
  </el-tabs>
  <div v-if="!isAdmin">抱歉，此页面仅管理员可访问</div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import SpecialForm from "@/views/createComp/components/SpecialForm.vue";
import WeekForm from "@/views/createComp/components/WeekForm.vue";
import {store} from "@/store";

const isAdmin = computed(() => store.state.user.is_superuser)
const activeName = ref('week')
</script>

<style scoped>

</style>
