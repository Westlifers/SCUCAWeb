<template>
  <div class="twisty-player">
    <div :id="uniqueId" ref="container"></div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import {TwistyPlayer} from 'cubing/twisty';

const uniqueId = 'twisty-player-' + (new Date()).getTime().toString();

const container = ref<HTMLElement | null>(null);
const player = ref<TwistyPlayer | null>(null);

const config = computed(() => Object.assign({}, props, {
    controlPanel: "none",
}))

onMounted(() => {
  if (container.value) {
    player.value = new TwistyPlayer(config.value);
      if ("appendChild" in container.value) {
          container.value.appendChild(player.value);
      }
  }
});

watch([() => props.alg, () => props.visualization], () => {
  if (container.value && player.value && "appendChild" in container.value) {
    container.value.removeChild(player.value);
    player.value = new TwistyPlayer(config.value);
    container.value.appendChild(player.value);
  }
});

const props = defineProps<{
  puzzle: "3x3x3" | "custom" | "2x2x2" | "4x4x4" | "5x5x5" | "6x6x6" | "7x7x7" | "40x40x40" | "megaminx" | "pyraminx" | "square1" | "clock" | "skewb" | "fto" | "gigaminx" | "master_tetraminx" | "kilominx" | "redi_cube" | "melindas2x2x2x2" | undefined;
  alg: string;
  visualization?: "2D" | "3D";
  hintFacelets?: any
  backView?: any;
  background?: any;
}>();
</script>

<style scoped>

</style>
