<template>
  <div class="cubing">

  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  comp: string
}>()
</script>

<style scoped>
.cubing {
  background-color: var(--yougi-projects-section);
  border-radius: 30px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  height: calc(100vh - 120px);
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}
</style>
