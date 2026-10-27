const emojis = [
    "🐱", //cat
    "🐶", //dog
    "🐺", //wolf
    "🐯", //tiger
    "🐻", //bear
    "🦝", //raccoon
] as const;

export function emojiPicker() {
    return emojis[Math.floor(Math.random() * emojis.length)]
}