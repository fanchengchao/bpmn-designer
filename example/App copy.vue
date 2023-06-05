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
      v-model='xmlString'
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
// 自定义元素选中时的弹出菜单（修改 默认任务 为 用户任务）
import CustomContentPadProvider from "../src/package/designer/plugins/content-pad";
// 自定义左侧菜单（修改 默认任务 为 用户任务）
import CustomPaletteProvider from "../src/package/designer/plugins/palette";
export default {
  name: 'App',
  data () {
    return {
      previewModelVisible: true,
      xmlString: '',
      modeler: null,
      reloadIndex: 0,
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
  methods: {
    initModeler(modeler) {
      setTimeout(() => {
        console.log('modeler', modeler)
        this.modeler = modeler
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