<script setup lang="ts">
import { emojiPicker } from '@/helpers/emojis';
import '../style.css'

const emojiAttributes = {
    id: 'big-emoji',
    class: 'waving'
}

</script>

<template>
    <main>
        <h1>This is the home view :)</h1>
        <span v-bind="emojiAttributes">{{ emojiPicker() }}</span>
    </main>
</template>

<style lang="css" scoped>
#big-emoji {
    font-size: 7rem;
}

.waving {
    animation-name: wave;
    animation-duration: 2s;
    animation-iteration-count: infinite;
}

@keyframes wave {
    0% {
        transform: rotate(-4deg)
    }

    50% {
        transform: rotate(4deg);
    }

    100% {
        transform: rotate(-4deg);
    }
}
</style>