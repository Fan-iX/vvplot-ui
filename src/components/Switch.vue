<script setup>
import { computed, ref, watch } from 'vue'
const {
    modelValue, value, variant, placeholder, ...props
} = defineProps({
    modelValue: null, value: null,
    placeholder: String,
    variant: { type: String, default: "underline" },
    options: { type: Array, default: () => [] },
    labelAttribute: { default: 'label' },
    valueAttribute: { default: 'value' },
    titleAttribute: { default: 'title' },
})
const emit = defineEmits(['update:modelValue'])
const model = computed({
    get() { return modelValue ?? value },
    set() { }
})
function get_attr(obj, attr) {
    if (typeof attr == 'function') return attr(obj)
    return obj[attr]
}
const options = computed(() => {
    let result = Array.from(props.options ?? []).map(opt => {
        let value, label, title
        if (typeof opt != 'object') {
            value = opt
            if (typeof props.labelAttribute == 'function') {
                label = props.labelAttribute(opt)
            } else {
                label = String(opt)
            }
            if (typeof props.titleAttribute == 'function') {
                title = props.titleAttribute(opt)
            }
        } else {
            if (props.valueAttribute == null) {
                value = opt
            } else {
                value = get_attr(opt, props.valueAttribute)
            }
            label = get_attr(opt, props.labelAttribute)
            title = get_attr(opt, props.titleAttribute)
        }
        return { value, label, title }
    })
    if (result.every(opt => opt.value != model.value)) {
        result.push({ disabled: true, value: model.value, label: String(model.value ?? " ") })
    }
    result.forEach((opt, i) => {
        opt.id = i
        if (opt.label == null) opt.label = String(opt.value)
        if (opt.label == "") opt.label = " "
    })
    return result
})
const item = computed(() => options.value.find(opt => opt.value == model.value))
function onswitch() {
    let idx = options.value.findIndex(opt => opt.value == model.value) + 1
    if (idx >= options.value.length) idx = 0
    emit('update:modelValue', options.value[idx].value)
}
const className = computed(() => [
    "appearance-none min-w-4 field-sizing-content cursor-pointer",
    "disabled:opacity-50 disabled:border-none disabled:cursor-not-allowed",
    variant == "underline" ? "border-b" : "",
    variant == "leftline" ? "border-l" : "",
])
</script>
<template>
    <button :class="className" @click="onswitch" :title="item.title" v-tw-merge>{{
        item.label.replace(/ /g, "&nbsp;")
    }}</button>
</template>
