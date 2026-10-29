<script setup>
import { ref, useTemplateRef } from 'vue'
import IconLucideX from '~icons/lucide/x'
import Switch from './Switch.vue'

const { disabled, accept, multiple } = defineProps({
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    accept: String,
})
const files = defineModel()

const append = ref(false)
const input = useTemplateRef('input')
function onchange(e) {
    if (multiple && append.value) {
        files.value = Array.from(files.value ?? []).concat(Array.from(e.target.files))
    } else if (e.target.files.length > 0) {
        files.value = Array.from(e.target.files)
    }
}
function onpaste(e) {
    if (e.clipboardData.files.length > 0) {
        if (multiple) {
            if (append.value) {
                files.value = Array.from(files.value ?? []).concat(Array.from(e.clipboardData.files))
            } else {
                files.value = Array.from(e.clipboardData.files)
            }
        } else {
            files.value = [e.clipboardData.files[0]]
        }
    } else if (e.clipboardData.types.includes('text/plain')) {
        const text = e.clipboardData.getData('text/plain')
        let file = new File([text], "clipboard.txt", { type: 'text/plain' })
        file.description = text.slice(0, 100)
        if (multiple && append.value) {
            files.value = Array.from(files.value ?? []).concat([file])
        } else {
            files.value = [file]
        }
    }
}
function onclear() {
    files.value = []
}
function onremove(file) {
    files.value = files.value.filter(f => f !== file)
}
</script>
<template>
    <div v-if="multiple" class="flex flex-col" :class="{ 'opacity-50': disabled }" v-tw-merge>
        <div>
            <button @click="input?.click?.()" class="cursor-pointer border-b border-dashed disabled:cursor-not-allowed"
                :disabled>pick</button>
            or
            <span :tabindex="disabled ? null : 0"
                class="cursor-default focus:outline-dashed focus:outline-black focus:outline-2 italic text-gray-500 focus:text-inherit"
                @paste="onpaste">paste</span>
            to
            <button @click="append = !append" class="cursor-pointer border-b disabled:cursor-not-allowed">
                {{ append ? 'add' : 'replace' }}
            </button>
            files
            <IconLucideX class="cursor-pointer hover:text-red-500" @click="onclear" title="clear"
                v-if="files?.length" />
            <input type="file" @change="onchange" ref="input" :accept multiple hidden>
        </div>
        <div v-for="file in files">
            <span :title="file.description">{{ file.name }}</span>
            <IconLucideX class="cursor-pointer hover:text-red-500" @click="onremove(file)" />
        </div>
    </div>
    <span v-else class="whitespace-nowrap" :class="{ 'opacity-50': disabled }" v-tw-merge>
        <button @click="input?.click?.()" class="cursor-pointer border-b border-dashed disabled:cursor-not-allowed"
            :disabled>pick</button>
        or
        <span :tabindex="disabled ? null : 0"
            class="cursor-default focus:outline-dashed focus:outline-black focus:outline-2 italic text-gray-500 focus:text-inherit"
            @paste="onpaste">paste</span>
        a file<span v-if="files?.length">
            : <span class="italic">{{ files[0].name }}</span>
            <IconLucideX class="cursor-pointer hover:text-red-500" @click="onclear" title="clear" />
        </span>
        <input type="file" @change="onchange" ref="input" :accept hidden>
    </span>
</template>
