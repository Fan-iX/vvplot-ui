<script setup>
import { ref } from 'vue'
import IconLucideX from '~icons/lucide/x'
import Button from './Button.vue'
defineOptions({ inheritAttrs: false })
const { title, dismissible } = defineProps({
    title: String,
    dismissible: { type: Boolean, default: true },
})
const isOpen = ref(false)
const data = ref()
const emit = defineEmits(['hide'])
let dismissing
function show(payload) {
    isOpen.value = true
    data.value = payload
    dismissing?.resolve?.('override')
    dismissing = Promise.withResolvers()
    return dismissing.promise
}
function hide(message) {
    isOpen.value = false
    if (dismissing) dismissing.resolve(message)
    emit('hide', message)
    dismissing = null
}
async function toggle(force, val) {
    if (force == null ? !isOpen.value : !!force) {
        return show(val)
    } else {
        return hide(val)
    }
}
defineExpose({ toggle, show, hide, isOpen })
function onmaskclick(e) {
    if (e.target === e.currentTarget) {
        if (dismissible) hide('dismiss')
    }
}
</script>
<template>
    <Teleport to="body" v-if="isOpen">
        <div class="fixed inset-0 bg-black/20 z-40 flex items-center justify-center" @click="onmaskclick">
            <div class="min-w-96 p-4 flex flex-col bg-white rounded-xl" v-bind="$attrs" v-tw-merge>
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold">{{ title }}</h3>
                    <IconLucideX @click="hide('dismiss')" class="text-xl hover:bg-gray-200 rounded-sm cursor-default" />
                </div>
                <slot v-bind="{ toggle, show, hide, isOpen, data }"></slot>
                <div class="flex gap-2 flex-row-reverse">
                    <slot name="footer" v-bind="{ toggle, show, hide, isOpen, data }">
                        <Button variant="solid" color="primary" @click="hide('submit')">submit</Button>
                    </slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>
