<template>
  <Suspense>
    <div class="comp-panel">
      <comp-panel :comp="route.params.compId as string" :active-event="activeEvent" @set-event="set_event" />
    </div>
  </Suspense>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {ref} from "vue";
import CompPanel from "@/components/integratedOngoingCompetition/compPanel/compPanel.vue";

const route = useRoute()
const activeEvent = ref('333')

defineProps<{
  comp: string
}>()

const set_event = (event: string) => {
  activeEvent.value = event
}
</script>

<style scoped>
a {
  text-decoration: none;
}

.comp-panel {
  width: 95%;
}
</style>
