<script setup>
import { ref, useTemplateRef, computed } from 'vue'
import { reactiveComputed } from '@vueuse/core'
const { resize, size, minWidth, minHeight } = defineProps({
    resize: null, size: { type: Number, default: 8 },
    width: Number, height: Number,
    minWidth: { type: Number, default: 10 }, minHeight: { type: Number, default: 10 },
})
const emit = defineEmits(["resize"])
const container = useTemplateRef('container')
const width = defineModel('width', { type: Number })
const height = defineModel('height', { type: Number })
const resizeDir = reactiveComputed(() => {
    let dirMap = {
        left: 'l', right: 'r', top: 't', bottom: 'b',
        "top-left": 'tl', "top-right": 'tr', "bottom-left": 'bl', "bottom-right": 'br',
    }
    let result = {
        l: false, r: false, t: false, b: false,
        tl: false, tr: false, bl: false, br: false
    }
    let preset = resize
    if (typeof preset === 'string') preset = [preset]
    if (Array.isArray(preset)) {
        for (let p of preset) {
            if (p == "all") result.l = result.r = result.t = result.b = result.tl = result.tr = result.bl = result.br = true
            if (p == "side") result.l = result.r = result.t = result.b = true
            if (p == "corner") result.tl = result.tr = result.bl = result.br = true
            if (p == "horizontal") result.l = result.r = true
            if (p == "vertical") result.t = result.b = true
            if (p in result) result[p] = true
            if (p in dirMap) result[dirMap[p]] = true
        }
    } else if (typeof preset === "object") {
        for (let key in dirMap) {
            let k = dirMap[key]
            result[k] = Boolean(preset[key] || preset[k])
        }
    } else if (resize == null || resize) {
        return {
            l: true, r: true, t: true, b: true,
            tl: true, tr: true, bl: true, br: true
        }
    }
    return result
})

let cursorMap = {
    l: 'ew-resize', r: 'ew-resize',
    t: 'ns-resize', b: 'ns-resize',
    tl: 'nwse-resize', br: 'nwse-resize',
    tr: 'nesw-resize', bl: 'nesw-resize',
}

const resizeControls = computed(() => {
    const controls = []
    for (let dir in resizeDir) {
        if (!resizeDir[dir]) continue
        controls.push({
            style: {
                top: !dir.includes('b') ? 0 : undefined,
                left: !dir.includes('r') ? 0 : undefined,
                bottom: dir.includes('b') ? 0 : undefined,
                right: dir.includes('r') ? 0 : undefined,
                width: (dir.includes('l') || dir.includes('r')) ? `${size}px` : "100%",
                height: (dir.includes('t') || dir.includes('b')) ? `${size}px` : "100%",
                cursor: cursorMap[dir],
            },
            onPointerdown(e) {
                let movementX = 0, movementY = 0, w = container.value.clientWidth, h = container.value.clientHeight
                e.target.setPointerCapture(e.pointerId)
                e.target.onpointermove = (ev) => {
                    movementX += ev.movementX
                    movementY += ev.movementY
                    let dw = dir.includes('l') ? -movementX : dir.includes('r') ? movementX : 0
                    let dh = dir.includes('t') ? -movementY : dir.includes('b') ? movementY : 0
                    let nw = Math.max(w + dw, minWidth), nh = Math.max(h + dh, minHeight)
                    width.value = nw
                    height.value = nh
                    emit("resize", {
                        width: nw, height: nh, dw, dh,
                        dx: dir.includes('l') ? movementX : 0,
                        dy: dir.includes('t') ? movementY : 0,
                    })
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
const style = computed(() => ({
    width: isNaN(width.value) ? undefined : `${+width.value}px`,
    height: isNaN(height.value) ? undefined : `${+height.value}px`,
    minHeight: isNaN(minHeight) ? undefined : `${+minHeight}px`,
    minWidth: isNaN(minWidth) ? undefined : `${+minWidth}px`,
}))
</script>

<template>
    <div ref="container" class="relative" :style="style">
        <slot></slot>
        <div class="absolute" v-bind="c" v-for="c in resizeControls"></div>
    </div>
</template>
