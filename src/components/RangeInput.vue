<script setup>
import { computed, ref, unref, watch } from 'vue'
const { nullable, disabled } = defineProps({
    nullable: { type: Boolean, default: false },
    disabled: Boolean,
})
const min = defineModel("min", { type: Number })
const max = defineModel("max", { type: Number })
const emit = defineEmits(['change'])
const min_val = ref(unref(min) ?? 0)
const max_val = ref(unref(max) ?? 1)
const step = computed(() => 10 ** (Math.floor(Math.log10(max_val.value - min_val.value)) - 2) || 1)
watch(min, (v) => min_val.value = round(v ?? 0, unref(step)), { immediate: true })
watch(max, (v) => max_val.value = round(v ?? 1, unref(step)), { immediate: true })
function min_change(e) {
    min_val.value = round(+e.target.value, step.value)
    emit('change', { min: min_val.value, max: max.value }, { min: min.value, max: max.value })
    min.value = min_val.value
}
function max_change(e) {
    max_val.value = round(+e.target.value, step.value)
    emit('change', { min: min.value, max: max_val.value }, { min: min.value, max: max.value })
    max.value = max_val.value
}
function round(x, delta) {
    return +x.toFixed(Math.min(Math.max(0, 2 - Math.floor(Math.log10(delta))), 10))
}
const className = computed(() => [
    disabled ? "opacity-50 cursor-not-allowed" : "",
])
</script>
<template>
    <span class="inline-flex flex-row items-baseline" :class="className" v-tw-merge>
        <input v-if="nullable" type="checkbox" @change="min = $event.target.checked ? min_val : null"
            class="disabled:cursor-not-allowed" :checked="min != null" :disabled>
        <input class="appearance-none min-w-4 field-sizing-content disabled:cursor-not-allowed bg-transparent"
            :disabled="disabled || min == null" :step="step" @change="min_change" type="number" :value="min_val"
            :max="max" />
        ~
        <input v-if="nullable" type="checkbox" class="disabled:cursor-not-allowed"
            @change="max = $event.target.checked ? max_val : null" :checked="max != null" :disabled>
        <input class="appearance-none min-w-4 field-sizing-content disabled:cursor-not-allowed bg-transparent"
            :disabled="disabled || max == null" :step="step" @change="max_change" type="number" :value="max_val"
            :min="min" />
    </span>
</template>
