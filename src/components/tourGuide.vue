<script setup lang="ts">
import {ref} from "vue";
import {TOUR_GUIDE_LIST} from "@/utils";

const prop = defineProps<{
  name: string
}>()

const tourGuide = TOUR_GUIDE_LIST[prop.name]

const open = ref(true)

const onClose = () => {

}
const onFinish = () => {
  onClose()
}
</script>

<template>
  <el-tour v-model="open" :mask="false" type="primary" @close="onClose" @finish="onFinish">
    <el-tour-step
        v-for="(step, index) in tourGuide"
        :key="index"
        :target="step.target"
        :title="step.title"
        :description="step.description"
        :placement="step.placement"
    />
  </el-tour>
</template>

<style scoped>

</style>
