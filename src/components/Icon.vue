<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
const { icon, iconClass, inline, variant, color } = defineProps({
    icon: String,
    iconClass: { type: String, default: '' },
    variant: String, color: String,
    inline: { type: Boolean, default: false },
})
const model = defineModel()
const emit = defineEmits(['change'])
const wrapperClass = computed(() => [
    "relative",
    inline ? "inline-block align-middle" : "p-1 content-center",
    color ? `text-${color}` : "",
    variant == "solid" ? "rounded-md bg-current hover:bg-current/75 p-1" : "",
    variant == "outline" ? "rounded-md border border-current hover:bg-current/5" : "",
    variant == "ghost" ? "rounded-md hover:bg-current/10 p-1" : "",
    variant == "toggle" ? "rounded-md hover:bg-current/10 p-1" : "",
    variant == "toggle" && model.value ? "bg-current/10 hover:bg-current/15" : "",
])
function onclick() {
    if (variant != 'toggle') return
    emit('change', model.value = !model.value)
}
</script>
<template>
    <div :class="wrapperClass" @click="onclick" v-tw-merge>
        <Icon :icon="icon" v-if="icon" :class="[{ 'text-white': variant == 'solid' }, iconClass]" mode="svg"
            v-tw-merge />
        <svg v-else width="1em" height="1em" :class="iconClass"></svg>
        <slot></slot>
    </div>
</template>
