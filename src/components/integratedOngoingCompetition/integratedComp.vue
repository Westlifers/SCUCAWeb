<template>
  <div class="ongoing-comp-wrapper">
    <div class="comp-panel">
      <comp-panel :comp="comp" :active-event="activeEvent" @set-event="set_event" />
    </div>

    <div class="cubing-panel">
      <cubing-panel :comp="comp" :active-event="activeEvent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CompPanel from "@/components/integratedOngoingCompetition/compPanel/compPanel.vue";
import CubingPanel from "@/components/integratedOngoingCompetition/cubingPanel/cubingPanel.vue";
import type {Ref} from "vue";
import {ref} from "vue";
import type {apiUsedEventName} from "@/types";

const activeEvent: Ref<apiUsedEventName> = ref<apiUsedEventName>('333')

defineProps<{
  comp: string
}>()

const set_event = (event: apiUsedEventName) => {
  activeEvent.value = event
}
</script>

<style scoped>
.ongoing-comp-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 32px 0 0;
}

@media screen and (max-width: 768px) {
  .ongoing-comp-wrapper {
    padding: 0;
  }
}

.comp-panel {
  width: 65%;
}

.cubing-panel {
  width: 32%;
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}

@media screen and (max-width: 768px) {
  .ongoing-comp-wrapper {
    flex-direction: column;
  }

  .comp-panel {
    width: 100%;
    margin-bottom: 32px;
  }

  .cubing-panel {
    width: 100%;
  }
}
</style>
