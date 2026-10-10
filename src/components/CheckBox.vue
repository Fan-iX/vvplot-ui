<script setup>
import { computed, ref, watch } from 'vue'
const { modelValue, coalesce, disabled } = defineProps({
    modelValue: null, coalesce: { default: false },
    disabled: Boolean,
})
const emit = defineEmits(['change', 'update:modelValue'])
const model = ref()
watch([() => modelValue, () => coalesce], () => {
    model.value = modelValue ?? (coalesce == null ? null : Boolean(coalesce))
}, { immediate: true })
function ondblclick() {
    if (coalesce == null) emit('update:modelValue', model.value = null)
}
function onchange(e) {
    emit('change', e)
    emit('update:modelValue', e.target.checked)
}
const className = computed(() => [
    disabled ? "cursor-not-allowed opacity-50" : "",
])
</script>
<template>
    <label @dblclick="ondblclick" :class="className" v-tw-merge>
        <input type="checkbox" v-model="model" :indeterminate="coalesce == null && model == null"
            class="disabled:cursor-not-allowed" @change="onchange" :disabled />
        <slot></slot>
    </label>
</template>
