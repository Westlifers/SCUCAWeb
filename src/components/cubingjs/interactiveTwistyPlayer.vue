<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {TwistyPlayer} from 'cubing/twisty';
import {debugKeyboardConnect, MoveEvent, KeyboardPuzzle} from 'cubing/bluetooth';

const container = ref<HTMLElement | null>(null);
const player = ref<TwistyPlayer | null>(null);
const config = computed(() => Object.assign({}, {
    puzzle: props.puzzle,
    visualization: "3D",
    hintFacelets: "none",
    backView: 'none',
    background: 'transparent',
    tempoScale: 6,
    experimentalMovePressInput: "basic",
    controlPanel: "none",
}))

onMounted(async () => {
    if (container.value) {
        player.value = new TwistyPlayer(config.value);
        if ("appendChild" in container.value) {
            container.value.appendChild(player.value);
        }
    }

    const inputPuzzle: KeyboardPuzzle = await debugKeyboardConnect();
    inputPuzzle.addAlgLeafListener((e: MoveEvent) => {
        player.value.experimentalAddAlgLeaf(e.latestAlgLeaf);
    });

})

const props = defineProps<{
    puzzle: "3x3x3" | "custom" | "2x2x2" | "4x4x4" | "5x5x5" | "6x6x6" | "7x7x7" | "40x40x40" | "megaminx" | "pyraminx" | "square1" | "clock" | "skewb" | "fto" | "gigaminx" | "master_tetraminx" | "kilominx" | "redi_cube" | "melindas2x2x2x2";
    initAlg?: string;
}>()
</script>

<template>
    <div class="interactive-twisty-player">
        <div ref="container"></div>
    </div>
</template>

<style scoped>

</style>
