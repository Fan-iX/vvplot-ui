<script setup>
import { ref, watch, computed, useTemplateRef, nextTick } from 'vue'
import { useWindowSize, useResizeObserver, useElementHover } from '@vueuse/core'
import Menu from './Menu.vue'
defineOptions({ inheritAttrs: false })
const {
    mode, disabled, align, side, offset,
    triggerClass, teleport,
    delayEnter, delayLeave,
} = defineProps({
    mode: String,
    disabled: Boolean,
    align: { type: null, default: 'center' },
    side: { type: String, default: 'bottom' },
    offset: { type: Number, default: 0 },
    triggerClass: null, teleport: null,
    delayEnter: { type: Number, default: 100 },
    delayLeave: { type: Number, default: 300 },
})
const dismissible = defineModel('dismissible', { type: Boolean, default: true })

const trigger = useTemplateRef('trigger')
const menu = useTemplateRef('menu')
const { width: containerWidth, height: containerHeight } = useWindowSize()
const isOpen = ref(false), style = ref({})
useResizeObserver(menu, () => {
    if (!isOpen.value || menu.value == null) return {}
    let { left, right, top, bottom, width, height } = trigger.value.getBoundingClientRect()
    let aln = { start: 0, center: 0.5, end: 1 }[align] ?? +align
    if (isNaN(aln)) aln = 0.5
    let l, r, t, b, maxw, maxh
    let panelside = side.replace(/!$/, ''), sideforce = true
    let remains = {
        top: top - offset - menu.value.$el.scrollHeight,
        bottom: containerHeight.value - (bottom + offset + menu.value.$el.scrollHeight),
        left: left - offset - menu.value.$el.scrollWidth,
        right: containerWidth.value - (right + offset + menu.value.$el.scrollWidth),
    }
    if (panelside == "auto") {
        panelside = Object.entries(remains).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    } else if (panelside == "auto-v") {
        panelside = remains.top > remains.bottom ? "top" : "bottom"
    } else if (panelside == "auto-h") {
        panelside = remains.left > remains.right ? "left" : "right"
    } else {
        sideforce = side.endsWith('!')
    }
    if (panelside == "top" || panelside == "bottom") {
        let x = left + width * aln
        if (x < menu.value.$el.scrollWidth * aln) {
            l = 0
            maxw = containerWidth.value
        } else if (x + menu.value.$el.scrollWidth * (1 - aln) > containerWidth.value) {
            r = 0
            maxw = containerWidth.value
        } else if (aln <= 0.5) {
            l = x - menu.value.$el.scrollWidth * aln
            maxw = containerWidth.value - l
        } else {
            r = containerWidth.value - x + menu.value.$el.scrollWidth * (1 - aln)
            maxw = containerWidth.value - r
        }
        if (!sideforce) {
            if (remains.top <= 0 && remains.bottom <= 0) {
                panelside = containerHeight.value - bottom > top ? "bottom" : "top"
            } else if (panelside == "top" && remains.top <= 0) {
                panelside = "bottom"
            } else if (panelside == "bottom" && remains.bottom <= 0) {
                panelside = "top"
            }
        }
        if (panelside == "top") {
            b = containerHeight.value - top + offset
        } else if (panelside == "bottom") {
            t = bottom + offset
        }
        maxh = containerHeight.value - (b ?? 0) - (t ?? 0)
    } else if (panelside == "left" || panelside == "right") {
        let y = top + height * aln
        if (y < menu.value.$el.scrollHeight * aln) {
            t = 0
            maxh = containerHeight.value
        } else if (y + menu.value.$el.scrollHeight * (1 - aln) > containerHeight.value) {
            b = 0
            maxh = containerHeight.value
        } else if (aln <= 0.5) {
            t = y - menu.value.$el.scrollHeight * aln
            maxh = containerHeight.value - t
        } else {
            b = containerHeight.value - y + menu.value.$el.scrollHeight * (1 - aln)
            maxh = containerHeight.value - b
        }
        if (!sideforce) {
            if (remains.left <= 0 && remains.right <= 0) {
                panelside = containerWidth.value - right > left ? "right" : "left"
            } else if (panelside == "left" && remains.left <= 0) {
                panelside = "right"
            } else if (panelside == "right" && remains.right <= 0) {
                panelside = "left"
            }
        }
        if (panelside == "left") {
            r = containerWidth.value - left + offset
        } else if (panelside == "right") {
            l = right + offset
        }
        maxw = containerWidth.value - (l ?? 0) - (r ?? 0)
    }
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
function show() {
    isOpen.value = true
}
function hide() {
    isOpen.value = false
}
function toggle(force) {
    if (force == null ? !isOpen.value : !!force) {
        return show()
    } else {
        return hide()
    }
}
function pin(state) {
    if (state == undefined) dismissible.value = !dismissible.value
    else dismissible.value = !state
}
function onpointeroutside(e) {
    if (!dismissible.value) return
    if (trigger.value.contains(e.target)) return
    if (e.type == "pointerdown") isOpen.value = false
}
const className = computed(() => [
    "fixed",
    teleport === "body" ? "z-50" : "z-40",
])
</script>
<template>
    <span ref="trigger" class="inline-block" :class="triggerClass" v-tw-merge>
        <slot name="trigger" v-bind="{ show, hide, toggle, pin, dismissible }"></slot>
    </span>
    <Teleport :to="teleport" :disabled="!teleport">
        <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200">
            <Menu ref="menu" v-if="isOpen" :class="className" v-bind="$attrs" :style="style"
                @pointeroutside="onpointeroutside">
                <slot v-bind="{ show, hide, toggle, pin, dismissible }"></slot>
            </Menu>
        </Transition>
    </Teleport>
</template>
