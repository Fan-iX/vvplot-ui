<script setup>
import { computed, watch } from 'vue'
import Select from './Select.vue'
const { data, variant } = defineProps({
    data: Object, default: () => ({}),
    variant: String
})
const model = defineModel({ type: Array, default: () => [] })
function hasChildren(obj) {
    return obj && typeof obj == "object" && Object.keys(obj).length > 0
}
const options = computed(() => {
    let opts = model.value.map((_, i, a) => a.slice(0, i).reduce((o, k) => o?.[k], data) ?? {})
    let obj = model.value.reduce((o, k) => o?.[k], data)
    if (hasChildren(obj)) opts.push(obj)
    return opts
})
watch(() => data, update, { deep: true })
function update() {
    let i = model.value.findIndex((v, i, a) => !hasChildren(a.slice(0, i).reduce((o, k) => o?.[k], data)))
    if (i > 0) model.value = model.value.slice(0, i)
}
</script>
<template>
    <span>
        <template v-for="obj, i in options" :object="obj">
            <template v-if="Array.isArray(obj)">[</template><template v-else>.</template><Select
                :options="Object.keys(obj)" v-model="model[i]" @change="update" :variant /><template
                v-if="Array.isArray(obj)">]</template>
        </template>
    </span>
</template>
