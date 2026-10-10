<script setup>
import { ref, computed, useTemplateRef, onMounted, onUnmounted } from 'vue'
const { variant, leaveDelay } = defineProps({
    variant: String,
    leaveDelay: { type: Number, default: 300 },
})
const emit = defineEmits(['hide', 'pointeroutside'])
const data = defineModel('data')
const menu = useTemplateRef('menu')
function outsideHandler(e) {
    if (menu.value && !menu.value.contains(e.target))
        emit("pointeroutside", e)
}
onMounted(() => {
    for (let evt of ["click", "contextmenu", "pointerdown", "pointerup"])
        document.addEventListener(evt, outsideHandler, { capture: true })
})
onUnmounted(() => {
    for (let evt of ["click", "contextmenu", "pointerdown", "pointerup"])
        document.removeEventListener(evt, outsideHandler, { capture: true })
})
const className = computed(() => [
    "fixed overflow-auto max-w-full",
    "bg-white border border-gray-300 rounded-xl",
    variant == "panel" ? "p-4 rounded-xl" : "",
    variant == "contextmenu" ? "flex flex-col p-1" : "",
    variant == "tooltip" ? "px-2 py-1 text-sm text-current/75 font-normal rounded-lg pointer-events-none" : "",
])
</script>
<template>
    <div ref="menu" @pointerenter="onenter" @pointerleave="onleave" :class="className" v-tw-merge>
        <slot></slot>
    </div>
</template>
