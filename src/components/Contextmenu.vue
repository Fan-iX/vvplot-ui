<script setup>
import { ref, watch, useTemplateRef, nextTick } from 'vue'
import { useMouse, useWindowSize } from '@vueuse/core'
import Menu from './Menu.vue'
defineOptions({ inheritAttrs: false })
const { teleport, align, side, offset } = defineProps({
    teleport: { default: "body" },
    side: { type: String, default: 'right' },
    align: { type: String, default: 'start' },
    offset: { type: Number, default: 1 },
})
const dismissible = defineModel('dismissible', { type: Boolean, default: true })
const emit = defineEmits(['hide'])

const menu = useTemplateRef('menu')
const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })
const isOpen = ref(false), style = ref({})
watch(isOpen, async (open) => {
    if (!open) return
    await nextTick()
    let left = mouseX.value, top = mouseY.value
    let l, r, t, b
    let panelside = side.replace(/!$/, ''), sideforce = true
    let remains = {
        top: top.value - offset - menu.value.scrollHeight,
        bottom: containerHeight.value - (top.value + offset + menu.value.scrollHeight),
        left: left.value - offset - menu.value.scrollWidth,
        right: containerWidth.value - (left.value + offset + menu.value.scrollWidth),
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
        let x = left
        if (align == "end") {
            if (x - menu.value.$el.scrollWidth < 0) l = 0
            else r = x
        } else {
            if (x + menu.value.$el.scrollWidth > containerWidth.value) r = 0
            else l = x
        }
        let topAvailable = top - offset - menu.value.$el.scrollHeight > 0
        let bottomAvailable = top + offset + menu.value.$el.scrollHeight < containerHeight.value
        if (!topAvailable && !bottomAvailable) {
            panelside = containerHeight.value - top > top ? "bottom" : "top"
        } else if (panelside == "top" && !topAvailable) {
            panelside = "bottom"
        } else if (panelside == "bottom" && !bottomAvailable) {
            panelside = "top"
        }
        if (panelside == "top") {
            b = containerHeight.value - top + offset
        } else if (panelside == "bottom") {
            t = top + offset
        }
    } else if (panelside == "left" || panelside == "right") {
        let y = top
        if (align == "end") {
            if (y - menu.value.$el.scrollHeight < 0) t = 0
            else b = y
        } else {
            if (y + menu.value.$el.scrollHeight > containerHeight.value) b = 0
            else t = y
        }
        let leftAvailable = left - offset - menu.value.$el.scrollWidth > 0
        let rightAvailable = left + offset + menu.value.$el.scrollWidth < containerWidth.value
        if (!leftAvailable && !rightAvailable) {
            panelside = containerWidth.value - left > left ? "right" : "left"
        } else if (panelside == "left" && !leftAvailable) {
            panelside = "right"
        } else if (panelside == "right" && !rightAvailable) {
            panelside = "left"
        }
        if (panelside == "left") {
            r = containerWidth.value - left + offset
        } else if (panelside == "right") {
            l = left + offset
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

let dismissing
const data = ref()
async function show(payload) {
    data.value = payload
    isOpen.value = true
    console.log("open", isOpen.value)
    dismissing?.resolve?.('override')
    dismissing = Promise.withResolvers()
    return dismissing.promise
}
async function hide(message) {
    isOpen.value = false
    console.log("close", isOpen.value)
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
function pin(state) {
    if (state == null) dismissible.value = !dismissible.value
    else dismissible.value = !state
}

function onpointeroutside(e) {
    console.log(e)
    if (!dismissible.value || e.handled) return
    if (e.type == "click" || e.type == "contextmenu") hide("dismiss")
}
const { width: containerWidth, height: containerHeight } = useWindowSize()

defineExpose({ toggle, show, hide, pin, data })
</script>
<template>
    <Teleport :to="teleport" :disabled="!teleport">
        <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200">
            <Menu ref="menu" variant="contextmenu" v-if="isOpen" :data="data" :style="style" v-bind="$attrs"
                @pointeroutside="onpointeroutside" v-tw-merge>
                <slot v-bind="{ toggle, show, hide, pin, data }"></slot>
            </Menu>
        </Transition>
    </Teleport>
</template>
