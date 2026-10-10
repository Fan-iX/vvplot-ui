<script setup>
import { computed, ref, watch } from 'vue'
defineOptions({ inheritAttrs: false })
const {
    modelValue, variant, coalesce, modelModifiers,
    type, disabled, placeholder, step, min, max, checkboxClass,
} = defineProps({
    modelValue: null, value: null, coalesce: null, default: null,
    modelModifiers: { default: () => ({}) },
    variant: { type: String, default: "underline" },
    type: String, disabled: Boolean, placeholder: null,
    step: null, min: null, max: null,
    checkboxClass: null,
})
const emit = defineEmits(['change', 'update:modelValue'])
const checkValue = ref(modelValue != null)
const inputValue = ref(modelValue ?? coalesce ?? null)
let lastValue = placeholder
watch(() => modelValue, v => {
    if (v != null) inputValue.value = v
    checkValue.value = v != null
})
function oncheckchange(e) {
    emit('change', e)
    if (checkValue.value) {
        let val = modelModifiers.placeholder ? inputValue.value : modelModifiers.hold ? lastValue : placeholder
        if (modelModifiers.int || modelModifiers.number || type == "number") val = Number(val)
        if (Number.isNaN(val)) val = 0
        emit('update:modelValue', val)
    } else {
        if (modelModifiers.hold) lastValue = inputValue.value
        if (!modelModifiers.placeholder) inputValue.value = null
        emit('update:modelValue', coalesce)
    }
}
function onchange(e) {
    emit('change', e)
    if (!modelModifiers.lazy) return
    let val = e.target.value
    if (val === "") val = coalesce
    else if (modelModifiers.int || modelModifiers.number || type == "number") val = Number(val)
    if (Number.isNaN(val)) val = coalesce
    emit('update:modelValue', val)
}
function oninput(e) {
    if (modelModifiers.lazy) return
    let val = e.target.value
    if (val === "") val = coalesce
    else if (modelModifiers.int || modelModifiers.number || type == "number") val = Number(val)
    if (Number.isNaN(val)) val = coalesce
    emit('update:modelValue', val)
}
function onwheel(e) {
    if (checkValue.value && step) {
        e.preventDefault()
        let val = modelValue ?? +(placeholder ?? 0)
        val += step * -Math.sign(e.deltaY)
        if (modelModifiers.int) val = Math.round(val)
        if (val < min) val = min
        if (val > max) val = max
        if (!isNaN(val)) emit('update:modelValue', val)
    }
}
const className = computed(() => [
    "whitespace-nowrap",
    variant == "leftline" ? "border-l outline-none" : "",
])
const inputClassName = computed(() => [
    "appearance-none min-w-4 field-sizing-content bg-transparent",
    "disabled:opacity-50 disabled:border-none disabled:cursor-not-allowed",
    "read-only:bg-current/3",
    variant == "underline" ? "border-b outline-none" : "",
])
const checkboxClassName = computed(() => [
    "disabled:opacity-50 disabled:cursor-not-allowed",
    checkboxClass
])
</script>
<template>
    <span :class="className" v-tw-merge>
        <label>
            <input type="checkbox" v-model="checkValue" :class="checkboxClassName" :disabled="disabled"
                @change="oncheckchange" v-tw-merge>
            <slot></slot>
        </label>
        <input :type v-model="inputValue" :disabled="disabled || !checkValue" :placeholder="placeholder" :step="step"
            :min="min" :max="max" :class="inputClassName" @input="oninput" @change="onchange" @wheel="onwheel"
            v-bind="$attrs" v-tw-merge />
    </span>
</template>
