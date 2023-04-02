<template>
  <div class="competition-results">

  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  comp: string
}>()
</script>

<style scoped>
.competition-results {
  background-color: var(--yougi-projects-section);
  border-radius: 32px;
  padding: 32px 32px 0 32px;
  display: flex;
  flex-direction: column;
  flex: 2;
  height: calc(100vh - 120px);
}
</style>
