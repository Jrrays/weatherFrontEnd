<script setup lang="ts">
import { emojiPicker } from '@/helpers/emojis';

const emojiAttributes = {
    id: 'big_emoji',
    class: 'waving'
}

</script>

<template>
    <span v-bind="emojiAttributes">{{ emojiPicker() }}</span>
    <h1>This is the home view :)</h1>
</template>

<style lang="css" scoped>
#big_emoji {
    font-size: 7rem;
}

.waving {
    display: block;
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