<script setup>
import { computed } from 'vue'
const { variant, color } = defineProps({
    variant: { type: String, default: "underline" },
    color: String,
})
const model = defineModel()
const emit = defineEmits(['change'])
const className = computed(() => [
    "whitespace-nowrap cursor-default",
    "disabled:cursor-not-allowed disabled:grayscale-25 disabled:contrast-75",
    color ? `text-${color}` : "",
    variant == "underline" ? "border-b border-current cursor-pointer" : "",
    variant == "outline" ? "rounded-md px-2 py-1 border border-current hover:bg-current/5" : "",
    variant == "solid" ? "rounded-md px-2 py-1 bg-current hover:bg-current/75" : "",
    variant == "ghost" ? "rounded-md px-2 py-1 hover:bg-current/5" : "",
    variant == "toggle" ? "rounded-md hover:bg-current/10 p-1" : "",
    variant == "toggle" && model.value ? "bg-current/10 hover:bg-current/15" : "",
])
function onclick() {
    if (variant != 'toggle') return
    emit('change', model.value = !model.value)
}
</script>
<template>
    <button :class="className" @click="onclick" v-tw-merge>
        <div class="contents" :class="{ 'text-white': variant == 'solid' }">
            <slot></slot>
        </div>
    </button>
</template>
