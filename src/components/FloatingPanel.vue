<script setup>
import { computed, watch, nextTick, useTemplateRef, inject, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useResizeObserver } from '@vueuse/core'
defineOptions({ inheritAttrs: false })
const { title, contentClass } = defineProps({
    title: String, contentClass: String
})
const open = defineModel('open', { type: Boolean })
const fold = defineModel('fold', { type: Boolean, default: false })
const top = defineModel('top', { type: Number, default: 20 })
const left = defineModel('left', { type: Number, default: 20 })
const width = defineModel('width', { type: Number, default: 200 })
const height = defineModel('height', { type: Number, default: 200 })
const zMax = inject('panel-z-max', ref(0))
const zIndex = ref(zMax?.value ?? 0)
const style = computed(() => ({
    left: left.value != null ? left.value + "px" : null,
    top: top.value != null ? top.value + "px" : null,
    width: width.value != null ? width.value + "px" : null,
    height: !fold.value && height.value != null ? height.value + "px" : null,
    'z-index': zIndex.value,
}))
const panel = useTemplateRef('panel')
function onpointerdown(e) {
    e.preventDefault()
    e.target.setPointerCapture(e.pointerId)
    panel.value?.focus?.()

    e.target.onpointermove = (ev) => {
        panel.value.style.opacity = 0.8
        let l = left.value + ev.movementX, t = top.value + ev.movementY
        l = Math.min(Math.max(l, 40 - width.value), window.innerWidth - 40)
        t = Math.min(Math.max(t, 0), window.innerHeight - 40)
        left.value = l
        top.value = t
    }
    e.target.onpointerup = (ev) => {
        ev.currentTarget.onpointerup = null
        ev.currentTarget.onpointermove = null
        panel.value.style.opacity = null
    }
}
useResizeObserver(panel, (entries) => {
    const entry = entries[0]
    width.value = entry.target.offsetWidth
    if (!fold.value) height.value = entry.target.offsetHeight
})
const emit = defineEmits(['hide'])
function hide() {
    open.value = false
    emit('hide')
}
watch(open, (v) => { if (v) zIndex.value = ++zMax.value })

let cursorMap = {
    l: 'ew-resize', r: 'ew-resize',
    t: 'ns-resize', b: 'ns-resize',
    tl: 'nwse-resize', br: 'nwse-resize',
    tr: 'nesw-resize', bl: 'nesw-resize',
}
const resizeControls = computed(() => {
    const controls = []
    let resizeDir = fold.value ? ['l', 'r'] : ['l', 'r', 't', 'b', 'tl', 'tr', 'bl', 'br']
    for (let dir of resizeDir) {
        controls.push({
            style: {
                top: dir.includes('t') ? 0 : undefined,
                left: dir.includes('l') ? 0 : undefined,
                bottom: dir.includes('b') ? 0 : undefined,
                right: dir.includes('r') ? 0 : undefined,
                width: dir.includes('l') || dir.includes('r') ? '8px' : "100%",
                height: dir.includes('t') || dir.includes('b') ? '8px' : "100%",
                cursor: cursorMap[dir],
            },
            onPointerdown(e) {
                let movementX = 0, movementY = 0, l = left.value, t = top.value,
                    w = panel.value.clientWidth, h = panel.value.clientHeight
                e.target.setPointerCapture(e.pointerId)
                e.target.onpointermove = (ev) => {
                    movementX += ev.movementX
                    movementY += ev.movementY
                    if (dir.includes('l')) {
                        let dx = Math.max(Math.min(movementX, w - 40), -l)
                        width.value = w - dx
                        left.value = l + dx
                    } else if (dir.includes('r')) {
                        let dx = Math.max(Math.min(movementX, window.innerWidth - l - w), -w + 40)
                        width.value = w + dx
                    }
                    if (dir.includes('t')) {
                        let dy = Math.max(Math.min(movementY, h - 40), -t)
                        height.value = h - dy
                        top.value = t + dy
                    } else if (dir.includes('b')) {
                        let dy = Math.max(Math.min(movementY, window.innerHeight - t - h), -h + 40)
                        height.value = h + dy
                    }
                }
                e.target.onpointerup = (ev) => {
                    ev.currentTarget.onpointerup = null
                    ev.currentTarget.onpointermove = null
                }
            }
        })
    }
    return controls
})
</script>
<template>
    <Teleport to="body" v-if="open">
        <div class="fixed bg-white rounded-lg z-30 border border-gray-300 shadow-lg flex flex-col overflow-hidden outline-none min-w-30 min-h-min"
            v-bind="$attrs" :style ref="panel" @focus="zIndex = ++zMax" tabindex="-1" v-tw-merge>
            <div ref="header" class="px-2 py-1 cursor-move border-b border-gray-400 shrink-0"
                @pointerdown="onpointerdown">
                <slot name="caption">
                    <div class="grid grid-cols-[1fr_auto_auto] *:first:min-w-0 gap-x-2 items-center">
                        <slot name="title">
                            <h3 class="font-semibold whitespace-nowrap truncate">{{ title }}</h3>
                        </slot>
                        <Icon icon="lucide:minus" @click="fold = !fold" @pointerdown.stop
                            class="text-xl hover:bg-gray-200 rounded-md cursor-default" />
                        <Icon icon="lucide:x" @click="hide" @pointerdown.stop
                            class="text-xl hover:bg-gray-200 rounded-md cursor-default" />
                    </div>
                </slot>
            </div>
            <div class="flex-1 overflow-auto" :class="contentClass" v-show="!fold" v-tw-merge>
                <slot></slot>
            </div>
            <div class="absolute" v-bind="c" v-for="c in resizeControls"></div>
        </div>
    </Teleport>
</template>
