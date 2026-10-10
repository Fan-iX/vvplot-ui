<script setup>
import { computed, ref, watch } from 'vue'
defineOptions({ inheritAttrs: false })
const model = defineModel()
const emit = defineEmits(['change'])
const { class: $class, variant, ...props } = defineProps({
    class: { type: String, default: '' },
    disabled: Boolean,
    variant: { type: String, default: "underline" },
    options: { type: Array, default: () => [] },
    labelAttribute: { default: 'label' },
    valueAttribute: { default: 'value' },
    titleAttribute: { default: 'title' },
})
function get_attr(obj, attr) {
    if (typeof attr == 'function') return attr(obj)
    return obj[attr]
}
const options = computed(() => {
    let result = Array.from(props.options ?? []).map(opt => {
        let value, label, title, disabled = props.disabled
        if (typeof opt != 'object' || opt == null) {
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
            disabled ||= opt.disabled
        }
        return { value, label, title, disabled }
    })
    result.forEach((opt, i) => {
        opt.id = i
        if (opt.label == null) opt.label = String(opt.value)
        if (opt.label == "") opt.label = " "
    })
    return result
})
const id = ref([])
watch([options, model], ([opts, m]) => {
    if (opts.length == 0) return
    id.value = opts.map(opt => m.includes(opt.value))
}, { immediate: true })
function inputchange(e) {
    emit('change', e)
    model.value = options.value.filter((_, i) => id.value[i]).map(v => v.value)
}
const baseClassName = computed(() => [
    $class.split(' ').filter(c => !c.startsWith('selected:') && !c.startsWith('disabled:')),
])
const selectedClassName = computed(() => [
    $class.split(' ').filter(c => c.startsWith('selected:')).map(c => c.replace(/^selected:/, '')),
])
const disabledClassName = computed(() => [
    "cursor-not-allowed opacity-50",
    $class.split(' ').filter(c => c.startsWith('disabled:')).map(c => c.replace(/^disabled:/, '')),
])
</script>
<template>
    <label v-for="opt in options" :title="opt.title"
        :class="[baseClassName, id[opt.id] ? selectedClassName : null, opt.disabled ? disabledClassName : null]"
        v-bind="$attrs" v-tw-merge>
        <input type="checkbox" v-model="id[opt.id]" :disabled="opt.disabled" @change="inputchange" class="disabled:cursor-not-allowed">
        <slot :option="opt">{{ opt.label.replace(/\s/g, "&nbsp;") }}</slot>
    </label>
</template>
