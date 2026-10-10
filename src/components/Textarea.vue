<script setup>
import { nextTick, watch, computed, useTemplateRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'
const { modelValue, value, variant, autosize, modelModifiers } = defineProps({
    modelValue: null, value: null,
    modelModifiers: { default: () => ({}) },
    variant: { type: String, default: "outline" },
    autosize: Boolean,
})
const emit = defineEmits(['update:modelValue'])
const className = computed(() => [
    "font-mono [line-break:anywhere] resize-none leading-none",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:whitespace-pre",
    "read-only:bg-current/3 read-only:whitespace-pre",
    variant == "outline" ? "border border-gray-300" : "outline-none",
    autosize ? "overflow-y-hidden" : ""
])
const textarea = useTemplateRef('textarea')
function updateSize() {
    if (!autosize) return
    nextTick(() => {
        let ele = textarea.value
        if (!ele) return
        let _height = ele.style.height
        ele.style.minHeight = null
        ele.style.height = "auto"
        let _scrollbarHeight = 0
        let style = getComputedStyle(ele)
        if (ele.scrollWidth > ele.clientWidth) {
            _scrollbarHeight = ele.offsetHeight - ele.clientHeight - (parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth))
        }
        ele.style.height = "1px"
        if (style.boxSizing === "border-box") {
            let _borderHeight = ele.offsetHeight - ele.clientHeight
            ele.style.minHeight = `${ele.scrollHeight + _borderHeight + _scrollbarHeight}px`
        } else {
            let _paddingHeight = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
            ele.style.minHeight = `${ele.scrollHeight - _paddingHeight + _scrollbarHeight}px`
        }
        ele.style.height = _height
    })
}
const model = computed({
    get() { return modelValue ?? value },
    set(v) { emit('update:modelValue', v) }
})
watch([model, () => autosize], updateSize, { immediate: true })
useResizeObserver(textarea, updateSize)
</script>
<template>
    <textarea ref="textarea" v-model.lazy="model" v-if="modelModifiers?.lazy" @input="updateSize" :class="className"
        v-tw-merge></textarea>
    <textarea ref="textarea" v-model="model" @input="updateSize" :class="className" v-tw-merge v-else></textarea>
</template>
