export * as components from './components'
export * as palettes from '#base/js/palettes.js'

import type { App } from 'vue'
import * as components from './components'
import twMergeDirective from './directive/tw-merge.js'
export function install(app: App) {
    for (const [name, comp] of Object.entries(components)) {
        app.component(name, comp)
    }
    app.directive('tw-merge', twMergeDirective)
}

import './styles/global.css'
