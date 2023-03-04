<template>
  <Suspense>
    <comp-display :comp="route.params.compId" />
  </Suspense>
</template>

<script lang="ts" setup>
import CompDisplay from "@/components/competitionDetail/CompDisplay.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
