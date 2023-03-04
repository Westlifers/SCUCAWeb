<template>
  <div class="cubing">
    <cubing-form :comp="comp" v-if="is_form" />
    <cubing-timer :comp="comp" v-if="!is_form" />
    <el-switch
        v-model="is_form"
        class="mb-2"
        active-text="表单模式"
        inactive-text="计时器模式"
    />
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import CubingForm from "@/components/cubing/form/CubingForm.vue";
import CubingTimer from "@/components/cubing/timer/CubingTimer.vue";

const is_form = ref(true)

defineProps<{
  comp: string
}>()
</script>

<style scoped>
.cubing {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.el-switch {
  display: flex;
  justify-content: center;
}
</style>
