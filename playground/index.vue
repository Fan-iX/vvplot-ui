<script setup>
import { ref, useTemplateRef } from 'vue'
const min = ref(1), max = ref(1000), num = ref(12)
const text = ref("abc"), color = ref("#FF0000"), flag = ref()
const options = ref(['option1', { value: 3, label: '' }, { title: '123', label: '...' }])
const palette = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'])
const files = ref([])
const value = ref([])
const open = ref(false)
const width = ref(200), height = ref(100)
const menu = useTemplateRef('menu')
async function onrightclick() {
    console.log(await menu.value.show())
}
const dialog = useTemplateRef('dialog')
async function showDialog() {
    console.log(await dialog.value.show())
}
</script>

<template>
    <div class="p-4">
        <div class="grid grid-cols-[repeat(5,auto)_1fr] gap-1 justify-items-start items-center">
            <VVInput v-model="text" disabled />
            <VVInput v-model="text" variant="underline" />
            <VVInput v-model.lazy.number="num" type="number" variant="leftline" />
            <VVInput placeholder="value" readonly />
            <span class="-col-end-1"></span>
            <VVSelect v-model="text" :options="options" disabled />
            <VVSelect v-model="text" :options="options" variant="underline" />
            <VVSelect v-model="num" :options="options" variant="leftline" />
            <VVSelect placeholder="value" />
            <span class="-col-end-1"></span>
            <VVSwitch v-model="text" :options="options" disabled />
            <VVSwitch v-model="text" :options="options" variant="underline" />
            <VVSwitch v-model="num" :options="options" variant="leftline" />
            <span class="-col-end-1"></span>
            <VVSelectInput v-model="text" :options="options" disabled />
            <VVSelectInput v-model="text" :options="options" variant="underline" />
            <VVSelectInput v-model.lazy.number="num" type="number" :options="options" variant="leftline" />
            <VVSelectInput placeholder="value" selectonly />
            <span class="-col-end-1"></span>
            <VVCheckInput v-model="text" disabled>value:</VVCheckInput>
            <VVCheckInput v-model="text" variant="underline">value:</VVCheckInput>
            <VVCheckInput v-model.lazy.number="num" type="number" variant="leftline">value:</VVCheckInput>
            <VVCheckInput placeholder="text" readonly />
            <span class="-col-end-1"></span>
            <VVCheckBox v-model="flag" :coalesce="null" disabled>{{ String(flag) }}</VVCheckBox>
            <VVCheckBox v-model="flag" :coalesce="null">{{ String(flag) }}</VVCheckBox>
            <VVCheckBox v-model="flag">{{ String(flag) }}</VVCheckBox>
            <span class="-col-end-1"></span>
            <div class="flex flex-col">
                <VVRadioGroup v-model="text" :options="options" disabled class="disabled:text-blue-500" />
            </div>
            <div class="flex flex-col">
                <VVRadioGroup v-model="text" :options="options" />
            </div>
            <div class="flex flex-col">
                <VVMultiselect v-model="value" :options="options" disabled />
            </div>
            <div class="flex flex-col">
                <VVMultiselect v-model="value" :options="options" />
            </div>
            <span class="-col-end-1"></span>
            <VVButton variant="toggle" icon="heroicons:heart-solid" v-model="flag" class="text-red-500" disabled>
                {{ flag ? 'on' : 'off' }}
            </VVButton>
            <VVButton variant="toggle" icon="heroicons:heart-solid" v-model="flag" class="text-red-500">
                {{ flag ? 'on' : 'off' }}
            </VVButton>
            <VVIcon variant="toggle" icon="heroicons:heart-solid" v-model="flag" class="text-red-500" inline />
            <span class="-col-end-1"></span>
            <VVPalette v-model="color" :palette="palette" class="w-40" disabled />
            <VVPalette v-model="color" :palette="palette" class="w-40" />
            <span class="-col-end-1"></span>
            <VVColorPicker v-model="color" disabled />
            <VVColorPicker v-model="color" variant="underline" />
            <VVColorPicker v-model="color" variant="leftline" />
            <VVColorPicker v-model="color" variant="colorinput" />
            <span class="-col-end-1"></span>
            <VVColorInput v-model="color" disabled />
            <VVColorInput v-model="color" :palette="palette" />
            <span class="-col-end-1"></span>
            <VVRangeInput v-model:max="max" v-model:min="min" nullable disabled />
            <VVRangeInput v-model:max="max" v-model:min="min" nullable />
            <VVRangeInput v-model:max="max" v-model:min="min" />
            <span class="-col-end-1"></span>
            <VVTextarea v-model="text" autosize class="resize-x p-2 border-5 box-content" disabled />
            <VVTextarea v-model="text" readonly />
            <VVTextarea v-model.lazy="text" autosize class="resize-y p-2 border-5" />
            <span class="-col-end-1"></span>
            <VVFileInput v-model="files" disabled />
            <VVFileInput v-model="files" />
            <VVFileInput v-model="files" multiple />
            <VVFileInput v-model="files" multiple disabled />
        </div>

        <VVHoverMenu side="top" class="p-2">
            <template #trigger>
                <VVIcon icon="lucide:circle-question-mark" @click="pin()" inline />
            </template>
            <template v-slot="{ hide, pin, dismissible }">
                Press <kbd>ctrl</kbd> + <kbd>V</kbd> to paste files from clipboard to the file input above
                <VVIcon icon="lucide:pin" @click="pin()" :class="dismissible ? 'text-gray-500' : 'text-blue-500'"
                    inline />
                <VVIcon icon="lucide:x" @click="hide()" class="text-red-500" inline />
            </template>
        </VVHoverMenu>

        <VVHoverMenu variant="tooltip" side="top">
            <template #trigger>
                <VVPopoverMenu variant="contextmenu" align="center" @hide="console.log">
                    <template #trigger>
                        <VVIcon inline icon="lucide:ellipsis" variant="ghost"
                            class="text-xl cursor-pointer focus:outline-dashed" tabindex="0" />
                    </template>
                    <template v-slot="{ hide }">
                        <VVMenuButton @click="hide('open'); open = true">show floating panel</VVMenuButton>
                    </template>
                </VVPopoverMenu>
            </template>
            More options
        </VVHoverMenu>

        <div class="flex-1 border-dashed border h-20" @contextmenu.prevent="onrightclick">
            context menu area
            <VVContextmenu ref="menu" align="start" v-slot="{ hide }" side="auto-v">
                <VVResizeContainer resize="all" class="border p-2 overflow-clip" @resize="({ width, height } = $event)"
                    :width="width" :height="height">
                    <VVButton variant="solid" class="cursor-pointer" @click="showDialog">show dialog</VVButton>
                </VVResizeContainer>
                <VVMenuButton disabled @click="hide('option1')" class="w-[300px]">option1</VVMenuButton>
                <VVMenuButton @click="hide('option2')">option2</VVMenuButton>
                <VVContextmenuSubmenu label="option3" v-slot="{ pin, dismissible }">
                    <div class="text-right">
                        <VVIcon icon="lucide:pin" @click="pin()"
                            :class="dismissible ? 'text-gray-500' : 'text-blue-500'" inline />
                    </div>
                    <VVMenuButton @click="hide('option3.1')" class="w-[300px]">
                        option3.1
                    </VVMenuButton>
                    <VVMenuButton @click="hide('option3.2')">
                        option3.2
                    </VVMenuButton>
                </VVContextmenuSubmenu>
                <VVContextmenuSubmenu label="option4" mode="click" disabled>
                    <VVMenuButton @click="hide('option4.1')">
                        option4.1
                    </VVMenuButton>
                </VVContextmenuSubmenu>
            </VVContextmenu>
        </div>
        <VVDialog title="title" ref="dialog">
            dialog content
            <template #footer="{ hide }">
                <VVButton variant="underline" @click="hide('cancel')">Cancel</VVButton>
                <VVButton variant="solid" color="primary" @click="hide('confirm')">Confirm</VVButton>
            </template>
        </VVDialog>
        <VVFloatingPanel title="title" ref="panel" v-model:open="open" :top="200" :left="200">
            floating panel content
        </VVFloatingPanel>
    </div>
</template>
