import ProcessDesigner from './package/process-designer/ProcessDesigner.vue'
import PropertiesPanel from './package/refactor/PropertiesPanel.vue'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import './package/theme/index.scss'
import 'remixicon/fonts/remixicon.css'
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";
import "bpmn-js-token-simulation/assets/css/font-awesome.min.css";
ProcessDesigner.install = (app) => {
  app.component(ProcessDesigner.name, ProcessDesigner)
}
PropertiesPanel.install = (app) => {
  app.component(PropertiesPanel.name, PropertiesPanel)
}

const components = [
  ProcessDesigner,
  PropertiesPanel
]

const install = (app) => {
  components.forEach(component => app.component(component.name, component))
}

export {
  install,
  ProcessDesigner,
  PropertiesPanel
}

export default {
  install,
  ProcessDesigner,
  PropertiesPanel
}
