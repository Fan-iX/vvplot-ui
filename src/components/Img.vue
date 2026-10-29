<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import IconLucideLoaderCircle from '~icons/lucide/loader-circle'
defineOptions({ inheritAttrs: false })
const { src, file, loading, placeholderClass } = defineProps({
    src: String, file: File,
    loading: { type: String, default: "lazy" },
    placeholderClass: String,
})
const emit = defineEmits(['load', 'error'])
const filesrc = ref(null)
const isLoading = ref(false)
watch(() => file, (f) => {
    isLoading.value = true
    if (filesrc.value) URL.revokeObjectURL(filesrc.value)
    filesrc.value = f ? URL.createObjectURL(f) : null
})
watch(() => src, () => {
    isLoading.value = true
})
function onLoad(e) {
    isLoading.value = false
    emit('load', e)
}
function onError(e) {
    isLoading.value = false
    emit('error', e)
}
onMounted(() => {
    isLoading.value = true
    if (file) filesrc.value = URL.createObjectURL(file)
})
onUnmounted(() => {
    if (filesrc.value) URL.revokeObjectURL(filesrc.value)
})
</script>
<template>
    <slot name="loading" v-if="(filesrc ?? src) != null && isLoading">
        <span :class="placeholderClass">
            <IconLucideLoaderCircle class="animate-spin" inline /> Loading ...
        </span>
    </slot>
    <img :src="filesrc ?? src" :loading @load="onLoad" @error="onError" v-bind="$attrs" :key="filesrc ?? src" />
</template>
