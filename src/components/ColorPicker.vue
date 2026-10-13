<script setup>
import { computed } from 'vue'
import PopoverMenu from './PopoverMenu.vue'
import Palette from './Palette.vue'
import * as palettes from '#base/js/palettes.js'
const model = defineModel()
const { disabled, class: $class, variant, placeholder } = defineProps({
    disabled: Boolean, class: String, placeholder: String,
    variant: { type: String, default: "underline" },
})
const textInputClass = computed(() => [
    "font-mono appearance-none min-w-4 field-sizing-content bg-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:border-none",
    "read-only:bg-current/3",
    placeholder ? 'placeholder-current' : '',
    variant == "outline" ? "border border-gray-300" : "",
    variant == "underline" ? "border-b outline-none" : "",
    variant == "leftline" ? "border-l outline-none" : "",
])
const colorInputClass = computed(() => [
    "align-middle w-6",
    "disabled:cursor-not-allowed",
])
const nullButtonClass = computed(() => [
    "cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "bg-[linear-gradient(to_bottom_right,transparent_calc(50%-1px),red_50%,transparent_calc(50%+1px))]",
    "w-10",
    model.value == null ? "border-1 border-black" : "",
])
</script>
<template>
    <PopoverMenu class="whitespace-nowrap max-h-40" :trigger-class="['inline-block', $class]" variant="panel" :disabled>
        <template #trigger>
            <input type="color" v-model="model" :class="colorInputClass" :disabled v-tw-merge
                v-if="variant == 'colorinput'" @click="$event.handled = true">
            <input type="text" v-model.lazy="model" :class="textInputClass" :style="{ color: model || placeholder }"
                :placeholder="placeholder ?? 'null'" :disabled v-tw-merge />
        </template>
        <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
            <div class="text-gray-500">&lt;null&gt;</div>
            <button @click="model = null" :class="nullButtonClass"></button>
            <template v-for="(pal, name) in palettes" :key="name">
                <div>{{ name }}</div>
                <Palette v-model="model" :palette="pal" class="w-80" />
            </template>
        </div>
    </PopoverMenu>
</template>
