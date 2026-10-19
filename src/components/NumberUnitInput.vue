<script setup>
import { computed } from 'vue'
import Input from './Input.vue'
import Select from './Select.vue'
defineOptions({ inheritAttrs: false })
const { units, disabled, variant, step } = defineProps({
    units: Object,
    variant: String, disabled: Boolean, step: { type: Number, default: 1 }
})
function getPrecision(num) {
    let s = String(num).replace(/e.*$/, "").replace(".", "").replace(/^0+/, "").replace(/0+$/, "")
    return s.length || 1
}
const model = defineModel()
const unit = defineModel("unit")
const factor = computed(() => units?.[unit.value] ?? 1)
const pf = computed(() => getPrecision(factor.value))
const stp = computed(() => +(step / factor.value).toPrecision(getPrecision(step)))
const value = computed({
    get() { return +(model.value / factor.value).toPrecision(getPrecision(model.value)) },
    set(v) { model.value = +(v * factor.value).toPrecision(getPrecision(v) + pf.value) }
})
</script>
<template>
    <Input type="number" v-model.lazy="value" :step="stp" :disabled :variant v-bind="$attrs" /><Select
        v-if="units && Object.keys(units).length > 0" v-model="unit" :options="Object.keys(units)" :disabled :variant />
</template>
