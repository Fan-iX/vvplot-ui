import { twMerge } from 'tailwind-merge'
function mergeClassName(el) {
    if (!el.classList.value) return
    el.classList.value = twMerge(el.classList.value)
}
export default {
    mounted: mergeClassName, updated: mergeClassName
}
