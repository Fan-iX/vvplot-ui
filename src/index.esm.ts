export * as palettes from '#base/js/palettes.js'

import type { App, Plugin } from 'vue'
import * as components from './components'
import twMergeDirective from './directive/tw-merge.js'
const plugin: Plugin = {
    install(app: App) {
        for (const [name, comp] of Object.entries(components)) {
            app.component(name, comp)
        }
        app.directive('tw-merge', twMergeDirective)
    }
}

export default plugin

import './styles/esm.css'
