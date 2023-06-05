<template>
  <div
    class="process-panel__container"
    :style="{ width: `${width}px` }"
  >
    <el-collapse
      v-model="activeTab"
      accordion
    >
      <el-collapse-item name="base">
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-info" />常规
        </template>
        <element-base-info
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'Process'"
        key="message"
        name="message"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-comment" />消息与信号
        </template>
        <signal-and-massage />
      </el-collapse-item>
      <el-collapse-item
        v-if="conditionFormVisible"
        key="condition"
        name="condition"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-promotion" />流转条件
        </template>
        <flow-condition
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="formVisible"
        key="form"
        name="form"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-order" />任务表单
        </template>
        <element-form
          :id="elementId"
          :type="elementType"
          :simple="simple"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="formVisible"
        key="variable"
        name="variable"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-data" />任务变量
        </template>
        <form-variable
          :id="elementId"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="
          elementType &&
            (elementType.indexOf('Task') !== -1 || elementType === 'SubProcess')
        "
        key="task"
        name="task"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-claim" />任务设置
        </template>
        <element-task
          :id="elementId"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="formVisible"
        key="copyFor"
        name="copyFor"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-custom" />抄送设置
        </template>
        <CopyForSelect
          :id="elementId"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="
          elementType &&
            (elementType.indexOf('Task') !== -1 ||
              elementType === 'SubProcess') &&
            !simple
        "
        key="multiInstance"
        name="multiInstance"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-help" />多实例
        </template>
        <element-multi-instance
          :business-object="elementBusinessObject"
          :type="elementType"
        />
      </el-collapse-item>
      <!--
      <el-collapse-item name="multiInstanceAssignee" v-if="elementType === 'StartEvent' || elementType === 'UserTask'" key="multiInstanceAssignee">
        <template #title class="panel-tab__title"><i class="el-icon-s-help"></i>多实例集合设置</div>
        <element-multi-instance-assignee :business-object="elementBusinessObject" :id="elementId" :type="elementType" />
      </el-collapse-item>
      -->
      <el-collapse-item
        v-if="elementType && !simple"
        key="listeners"
        name="listeners"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-message-solid" />执行监听器
        </template>
        <element-listeners
          :id="elementId"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType === 'UserTask' && !simple"
        key="taskListeners"
        name="taskListeners"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-message-solid" />任务监听器
        </template>
        <user-task-listeners
          :id="elementId"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType && !simple"
        key="extensions"
        name="extensions"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-circle-plus" />扩展属性
        </template>
        <element-properties
          :id="elementId"
          :type="elementType"
        />
      </el-collapse-item>
      <el-collapse-item
        v-if="elementType && !simple"
        key="other"
        name="other"
      >
        <template
          #title
          class="panel-tab__title"
        >
          <i class="el-icon-s-promotion" />其他
        </template>
        <element-other-config :id="elementId" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import ElementBaseInfo from './base/ElementBaseInfo'
import ElementOtherConfig from './other/ElementOtherConfig'
import ElementTask from './task/ElementTask'
import ElementMultiInstance from './multi-instance/ElementMultiInstance'
import FlowCondition from './flow-condition/FlowCondition'
import SignalAndMassage from './signal-message/SignalAndMessage'
import ElementListeners from './listeners/ElementListeners'
import ElementProperties from './properties/ElementProperties'
// import ElementForm from "./form/ElementForm";
import ElementForm from './form/flowFormConfig'
import FormVariable from './form-variable/index.vue'
import CopyForSelect from './copy-for/index.vue'
import UserTaskListeners from './listeners/UserTaskListeners'
// import ElementMultiInstanceAssignee from './multi-instance/ElementMultiInstanceAssignee.vue';

/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
  name: 'MyPropertiesPanel',
  components: {
    UserTaskListeners,
    ElementForm,
    FormVariable,
    ElementProperties,
    ElementListeners,
    SignalAndMassage,
    FlowCondition,
    ElementMultiInstance,
    ElementTask,
    ElementOtherConfig,
    ElementBaseInfo,
    CopyForSelect
    // ElementMultiInstanceAssignee
  },
  componentName: 'MyPropertiesPanel',
  provide() {
    return {
      prefix: this.prefix,
      width: this.width
    }
  },
  props: {
    bpmnModeler: Object,
    prefix: {
      type: String,
      default: 'camunda'
    },
    width: {
      type: Number,
      default: 480
    },
    simple: {
      type: Boolean,
      default: false
    },
    idEditDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: ['base', 'form'],
      elementId: '',
      elementType: '',
      elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
      conditionFormVisible: false, // 流转条件设置
      formVisible: false // 表单配置
    }
  },
  watch: {
    elementId: {
      handler() {
        this.activeTab = ['base', 'form']
      }
    }
  },
  created() {
    this.initModels()
  },
  methods: {
    initModels() {
      // 初始化 modeler 以及其他 moddle
      if (!this.bpmnModeler) {
        // 避免加载时 流程图 并未加载完成
        this.timer = setTimeout(() => this.initModels(), 10)
        return
      }
      if (this.timer) clearTimeout(this.timer)
      window.bpmnInstances = {
        modeler: this.bpmnModeler,
        modeling: this.bpmnModeler.get('modeling'),
        moddle: this.bpmnModeler.get('moddle'),
        eventBus: this.bpmnModeler.get('eventBus'),
        bpmnFactory: this.bpmnModeler.get('bpmnFactory'),
        elementRegistry: this.bpmnModeler.get('elementRegistry'),
        replace: this.bpmnModeler.get('replace'),
        selection: this.bpmnModeler.get('selection')
      }
      this.getActiveElement()
    },
    getActiveElement() {
      // 初始第一个选中元素 bpmn:Process
      this.initFormOnChanged(null)
      this.bpmnModeler.on('import.done', (e) => {
        this.initFormOnChanged(null)
      })
      // 监听选择事件，修改当前激活的元素以及表单
      this.bpmnModeler.on('selection.changed', ({ newSelection }) => {
        this.initFormOnChanged(newSelection[0] || null)
      })
      this.bpmnModeler.on('element.changed', ({ element }) => {
        // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
        if (element && element.id === this.elementId) {
          this.initFormOnChanged(element)
        }
      })
    },
    // 初始化数据
    initFormOnChanged(element) {
      let activatedElement = element
      if (!activatedElement) {
        activatedElement =
          window.bpmnInstances.elementRegistry.find(
            (el) => el.type === 'bpmn:Process'
          ) ??
          window.bpmnInstances.elementRegistry.find(
            (el) => el.type === 'bpmn:Collaboration'
          )
      }
      if (!activatedElement) return

      window.bpmnInstances.bpmnElement = activatedElement
      this.bpmnElement = activatedElement
      this.elementId = activatedElement.id
      this.elementType = activatedElement.type.split(':')[1]
      this.elementBusinessObject = JSON.parse(
        JSON.stringify(activatedElement.businessObject)
      )
      this.conditionFormVisible = !!(
        this.elementType === 'SequenceFlow' &&
        activatedElement.source &&
        activatedElement.source.type.indexOf('StartEvent') === -1
      )
      this.formVisible = this.elementType === 'UserTask'
    },
    beforeUnmount() {
      window.bpmnInstances = null
    }
  }
}
</script>
