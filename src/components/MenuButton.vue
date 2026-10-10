<script setup>
import { computed } from 'vue'
const { label, disabled } = defineProps({
    label: String,
    disabled: { type: Boolean, default: false }
})
const className = computed(() => [
    "block whitespace-nowrap cursor-default px-2 py-1 text-left",
    disabled ? "text-gray-400" : "hover:bg-current/5",
])
</script>
<template>
    <button :class="className" :disabled v-tw-merge>
        <slot>{{ label }}</slot>
    </button>
</template>
