import { createApp } from 'vue'
import element from 'element-plus'
import App from './App.vue'
import 'element-plus/dist/index.css'
// import DesignForm from 'vue-form-create'
import { ProcessDesigner, PropertiesPanel } from '../src/index.js'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import '../src/package/theme/index.scss'
import 'remixicon/fonts/remixicon.css'
console.log('ProcessDesigner', ProcessDesigner)
createApp(App).use(element).use(ProcessDesigner).use(PropertiesPanel).use(hljsVuePlugin).mount('#app')
