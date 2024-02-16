<template>
  <div class="twisty-player">
    <div ref="container"></div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import {TwistyPlayer} from 'cubing/twisty';

const container = ref<HTMLElement | null>(null);
const player = ref<TwistyPlayer | null>(null);
const playerWithSize = computed(() => {
  const player_ = player.value
  if (player_ && ('style' in player_)) {
    // add css style to player
    player_.style.width = `${props.width}px`;
    player_.style.height = `${props.height}px`;
    player_.style.margin = 'auto'
  }
  return player_
})

const config = computed(() => {
  let config_ = Object.assign({}, props, {
    controlPanel: "none",
  })

  const {width, height, ...rest} = config_;

  return rest;
})

onMounted(async () => {
  if (container.value) {
    player.value = new TwistyPlayer(config.value);
    if ("appendChild" in container.value) {
      container.value.appendChild(playerWithSize.value);
    }
  }
});

watch([() => props.alg, () => props.visualization], () => {
  if (container.value && player.value && "appendChild" in container.value) {
    container.value.removeChild(playerWithSize.value);
    player.value = new TwistyPlayer(config.value);
    container.value.appendChild(playerWithSize.value);
  }
});

const props = defineProps<{
  puzzle: "3x3x3" | "custom" | "2x2x2" | "4x4x4" | "5x5x5" | "6x6x6" | "7x7x7" | "40x40x40" | "megaminx" | "pyraminx" | "square1" | "clock" | "skewb" | "fto" | "gigaminx" | "master_tetraminx" | "kilominx" | "redi_cube" | "melindas2x2x2x2";
  alg?: string;
  visualization?: "2D" | "3D";
  background?: 'transparent';
  width?: string;
  height?: string;
}>();
</script>

<style scoped>

</style>
