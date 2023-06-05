<template>
  <div class="designer">
    <my-process-designer
      :key='`designer-${reloadIndex}`'
      :options='{
        taskResizingEnabled: true,
        eventResizingEnabled: true,
        minimap: {
          open: true
        }
      }'
      v-model:xml='xmlString'
      v-bind='controlForm'
      keyboard
      ref='processDesigner'
      @element-click='elementClick'
      @element-contextmenu='elementContextmenu'
      @init-finished='initModeler'
    >
    </my-process-designer>
    <my-properties-panel :key="`penal-${reloadIndex}`" :bpmn-modeler="modeler" :prefix="controlForm.prefix" class="process-panel" />
  </div>
</template>
<script>
import { reactive } from 'vue';
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "../src/package/designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "../src/package/designer/plugins/palette";
export default {
  name: 'App',
  provide() {
    return {
      flowEntry: () => this.form,
      formList: () => [],
      allVariableList: () => this.tableData
    }
  },
  data () {
    return {
      previewModelVisible: true,
      xmlString: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="diagram_Process_1662366104655" targetNamespace="http://flowable.org/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="_222_22aa" name="" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="12" />
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`,
      modeler: null,
      reloadIndex: 0,
      form: {
        id: '',
        bindFormType: 0,
        processDefinitionName: '',
        processDefinitionKey: '',
        categoryId: '',
        flowType: '',
        pageId: '',
        status: 0,
        defaultFormId: '',
        defaultRouterName: '',
        bpmnXml: '',
        communityId: ''
      },
      controlForm: {
        processId: '',
        processName: '',
        simulation: true,
        labelEditing: false,
        labelVisible: false,
        prefix: 'flowable',
        headerButtonSize: 'mini',
        events: ['element.click', 'element.contextmenu'],
        // additionalModel: []
        // moddleExtension: { user: UserSql },
        additionalModel: [
          CustomContentPadProvider,
          CustomPaletteProvider,
          // minimapModule,
          {
            __init__: ['autoPlaceSelectionBehavior'],
            // autoPlace: ['type', RewriteAutoPlace]
          }
        ]
      },
    }
  },
  mounted () {
//     this.xmlString = `<?xml version="1.0" encoding="UTF-8"?>
// <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="diagram_Process_1662363606428" targetNamespace="http://flowable.org/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
//   <bpmn2:process id="_7667202209021334784" name="" isExecutable="false">
//     <bpmn2:startEvent id="Event_0z6r3mz">
//       <bpmn2:outgoing>Flow_0xlnja3</bpmn2:outgoing>
//     </bpmn2:startEvent>
//     <bpmn2:endEvent id="Event_0b566id">
//       <bpmn2:incoming>Flow_0xlnja3</bpmn2:incoming>
//     </bpmn2:endEvent>
//     <bpmn2:sequenceFlow id="Flow_0xlnja3" sourceRef="Event_0z6r3mz" targetRef="Event_0b566id" />
//   </bpmn2:process>
//   <bpmndi:BPMNDiagram id="BPMNDiagram_1">
//     <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="">
//       <bpmndi:BPMNEdge id="Flow_0xlnja3_di" bpmnElement="Flow_0xlnja3">
//         <di:waypoint x="200" y="158" />
//         <di:waypoint x="200" y="300" />
//         <di:waypoint x="230" y="300" />
//         <di:waypoint x="230" y="442" />
//       </bpmndi:BPMNEdge>
//       <bpmndi:BPMNShape id="Event_0z6r3mz_di" bpmnElement="Event_0z6r3mz">
//         <dc:Bounds x="182" y="122" width="36" height="36" />
//       </bpmndi:BPMNShape>
//       <bpmndi:BPMNShape id="Event_0b566id_di" bpmnElement="Event_0b566id">
//         <dc:Bounds x="212" y="442" width="36" height="36" />
//       </bpmndi:BPMNShape>
//     </bpmndi:BPMNPlane>
//   </bpmndi:BPMNDiagram>
// </bpmn2:definitions>`
  },
  methods: {
    initModeler(modeler) {
      console.log(111, modeler)
      setTimeout(() => {
        console.log('modeler', modeler)
        // this.modeler = modeler
        this.modeler = reactive(modeler)
      }, 10)
    },
    elementClick(element) {
      // console.log(element)
      this.element = element
    },
    elementContextmenu(element) {
      console.log('elementContextmenu:', element)
    },
  }
}
</script>
<style lang="scss">
.designer {
  position: relative;
  height: 100vh;
}
.process-panel {
  position: absolute;
  top: 45px;
  right: 22px;
  z-index: 999;
}
</style>