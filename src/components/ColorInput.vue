<script setup>
import { computed } from 'vue'
const model = defineModel()
const { disabled } = defineProps({
    disabled: Boolean,
})
const textInputClass = computed(() => [
    "appearance-none min-w-4 field-sizing-content bg-transparent font-mono",
    "disabled:cursor-not-allowed",
])
const colorInputClass = computed(() => [
    "align-middle w-6",
    "disabled:cursor-not-allowed",
])
</script>
<template>
    <span class="whitespace-nowrap">
        <input type="color" v-model="model" :class="colorInputClass" :disabled v-tw-merge>
        <input type="text" v-model.lazy="model" :class="textInputClass" :style="{ color: model }" :disabled v-tw-merge>
    </span>
</template>
