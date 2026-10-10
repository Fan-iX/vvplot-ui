<script setup>
import { ref, watch, computed, useTemplateRef, nextTick } from 'vue'
import { useWindowSize, useElementHover } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import Menu from './Menu.vue'
defineOptions({ inheritAttrs: false })
const {
    disabled, align, side, offset, triggerClass, label,
    delayEnter, delayLeave,
} = defineProps({
    disabled: { type: Boolean, default: false },
    align: { type: null, default: 'start' },
    side: { type: String, default: 'right' },
    offset: { type: Number, default: 0 },
    label: String,
    triggerClass: String,
    delayEnter: { type: Number, default: 100 },
    delayLeave: { type: Number, default: 100 },
})
const dismissible = defineModel('dismissible', { type: Boolean, default: true })
const emit = defineEmits(['hide'])

const trigger = useTemplateRef('trigger')
const menu = useTemplateRef('menu')
const { width: containerWidth, height: containerHeight } = useWindowSize()
const isOpen = ref(false), style = ref({})
watch(isOpen, async (open) => {
    if (!open) return
    await nextTick()
    dismissing?.resolve?.('override')
    dismissing = Promise.withResolvers()
    let { left, right, top, bottom, width, height } = trigger.value.getBoundingClientRect()
    let aln = { start: 0, center: 0.5, end: 1 }[align] ?? +align
    if (isNaN(aln)) aln = 0.5
    let l, r, t, b
    let panelside = side
    if (panelside == "top" || panelside == "bottom") {
        if (align == "end") {
            let x = left + width
            if (x - menu.value.$el.scrollWidth < 0) l = 0
            else r = x
        } else {
            let x = left
            if (x + menu.value.$el.scrollWidth > containerWidth.value) r = 0
            else l = x
        }
        let topAvailable = top - offset - menu.value.$el.scrollHeight > 0
        let bottomAvailable = bottom + offset + menu.value.$el.scrollHeight < containerHeight.value
        if (!topAvailable && !bottomAvailable) {
            panelside = containerHeight.value - bottom > top ? "bottom" : "top"
        } else if (panelside == "top" && !topAvailable) {
            panelside = "bottom"
        } else if (panelside == "bottom" && !bottomAvailable) {
            panelside = "top"
        }
        if (panelside == "top") {
            b = containerHeight.value - top + offset
        } else if (panelside == "bottom") {
            t = bottom + offset
        }
    } else if (panelside == "left" || panelside == "right") {
        if (align == "end") {
            let y = top + height
            if (y - menu.value.$el.scrollHeight < 0) t = 0
            else b = y
        } else {
            let y = top
            if (y + menu.value.$el.scrollHeight > containerHeight.value) b = 0
            else t = y
        }
        let leftAvailable = left - offset - menu.value.$el.scrollWidth > 0
        let rightAvailable = right + offset + menu.value.$el.scrollWidth < containerWidth.value
        if (!leftAvailable && !rightAvailable) {
            panelside = containerWidth.value - right > left ? "right" : "left"
        } else if (panelside == "left" && !leftAvailable) {
            panelside = "right"
        } else if (panelside == "right" && !rightAvailable) {
            panelside = "left"
        }
        if (panelside == "left") {
            r = containerWidth.value - left + offset
        } else {
            l = right + offset
        }
    }
    let maxw = containerWidth.value - (l ?? 0) - (r ?? 0),
        maxh = containerHeight.value - (t ?? 0) - (b ?? 0)
    style.value = {
        left: l != null ? l + "px" : null,
        right: r != null ? r + "px" : null,
        top: t != null ? t + "px" : null,
        bottom: b != null ? b + "px" : null,
        'max-width': maxw != null ? maxw + "px" : null,
        'max-height': maxh != null ? maxh + "px" : null,
    }
})

const isTriggerHovered = useElementHover(trigger, { delayEnter, delayLeave })
const isMenuHovered = useElementHover(menu, { delayEnter: 0, delayLeave })
watch([isTriggerHovered, isMenuHovered], ([triggerHovered, menuHovered]) => {
    if (triggerHovered && !disabled) isOpen.value = true
    if (!triggerHovered && !menuHovered && dismissible.value) isOpen.value = false
})
const data = ref()
let dismissing
async function show(payload) {
    data.value = payload
    isOpen.value = true
    dismissing?.resolve?.('override')
    dismissing = Promise.withResolvers()
    return dismissing.promise
}
async function hide(message) {
    isOpen.value = false
    if (dismissing) dismissing.resolve(message)
    emit('hide', message)
    dismissing = null
}
async function toggle(force, payloadOrMessage) {
    if (force == null ? !isOpen.value : !!force) {
        return show(payloadOrMessage)
    } else {
        return hide(payloadOrMessage ?? "toggleoff")
    }
}
defineExpose({ show, hide, toggle })

function pin(state) {
    if (state == null) dismissible.value = !dismissible.value
    else dismissible.value = !state
}

const btnClassName = computed(() => [
    "block whitespace-nowrap cursor-default px-2 py-1 text-left relative",
    disabled ? "text-gray-400" : "hover:bg-gray-100",
    triggerClass
])
</script>
<template>
    <button ref="trigger" @mouseenter="ontriggerenter" @mouseleave="onleave" @click="ontriggerclick"
        :class="btnClassName" v-tw-merge>
        <slot name="trigger" v-bind="{ show, hide, toggle, pin, dismissible, isOpen, data }">
            {{ label }}
        </slot>
        <div class="absolute right-1 top-0 bottom-0 flex items-center">
            <Icon icon="lucide:chevron-right" />
        </div>
    </button>
    <transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200">
        <Menu ref="menu" variant="contextmenu" v-if="isOpen" class="max-w-full z-40" v-bind="$attrs" :style="style"
            v-tw-merge>
            <slot v-bind="{ show, hide, toggle, pin, dismissible, data }"></slot>
        </Menu>
    </transition>
</template>
