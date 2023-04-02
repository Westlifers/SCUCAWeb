<template>
  <div class="cubing">
    <div class="cubing-header">
      <p>参加比赛</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  comp: string
  activeEvent: string
}>()
</script>

<style scoped>
.cubing {
  background-color: var(--yougi-projects-section);
  border-radius: 30px;
  padding: 32px 32px 0 32px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: calc(100vh - 120px);
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
}

.cubing-header {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 24px;
}

.cubing-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  opacity: 0.9;
}
</style>
