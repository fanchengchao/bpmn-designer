<template>
  <div class="panel-tab__content">
    <el-form
      :model="flowConditionForm"
      label-width="90px"
      @submit.prevent
    >
      <el-form-item label="流转类型">
        <el-select
          v-model="flowConditionForm.type"
          @change="updateFlowType"
        >
          <el-option
            label="普通流转路径"
            value="normal"
          />
          <el-option
            label="默认流转路径"
            value="default"
          />
          <el-option
            label="内置按钮"
            value="operation"
          />
          <el-option
            label="条件流转路径"
            value="condition"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="flowConditionForm.type === 'condition'"
        key="condition"
        label="条件格式"
      >
        <el-select v-model="flowConditionForm.conditionType">
          <el-option
            label="表达式"
            value="expression"
          />
          <el-option
            label="脚本"
            value="script"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="flowConditionForm.type === 'operation'"
        key="operation"
        label="按钮类型"
      >
        <el-select
          v-model="flowConditionForm.operationType"
          @change="onOperationTypeChange"
        >
          <el-option
            v-for="item in SysFlowTaskOperationType.getList()"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          flowConditionForm.conditionType &&
            flowConditionForm.conditionType === 'expression'
        "
        key="express"
        label="表达式"
      >
        <el-input
          v-model="flowConditionForm.body"
          clearable
          type="textarea"
          :disabled="flowConditionForm.type === 'operation'"
          @change="updateFlowCondition"
        />
      </el-form-item>
      <template
        v-if="
          flowConditionForm.conditionType &&
            flowConditionForm.conditionType === 'script'
        "
      >
        <el-form-item
          key="language"
          label="脚本语言"
        >
          <el-input
            v-model="flowConditionForm.language"
            clearable
            @change="updateFlowCondition"
          />
        </el-form-item>
        <el-form-item
          key="scriptType"
          label="脚本类型"
        >
          <el-select v-model="flowConditionForm.scriptType">
            <el-option
              label="内联脚本"
              value="inlineScript"
            />
            <el-option
              label="外部脚本"
              value="externalScript"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="flowConditionForm.scriptType === 'inlineScript'"
          key="body"
          label="脚本"
        >
          <el-input
            v-model="flowConditionForm.body"
            type="textarea"
            clearable
            @change="updateFlowCondition"
          />
        </el-form-item>
        <el-form-item
          v-if="flowConditionForm.scriptType === 'externalScript'"
          key="resource"
          label="资源地址"
        >
          <el-input
            v-model="flowConditionForm.resource"
            clearable
            @change="updateFlowCondition"
          />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import { SysFlowTaskOperationType } from '../../../staticDict/flowStaticDict.js'
export default {
  name: 'FlowCondition',
  inject: ['prefix'],
  props: {
    businessObject: Object,
    type: String
  },
  data() {
    return {
      SysFlowTaskOperationType,
      select: '1',
      flowConditionForm: {}
    }
  },
  watch: {
    businessObject: {
      immediate: true,
      handler() {
        this.$nextTick(() => this.resetFlowCondition())
      }
    }
  },
  beforeUnmount() {
    this.bpmnElement = null
    this.bpmnElementSource = null
    this.bpmnElementSourceRef = null
  },
  methods: {
    resetFlowCondition() {
      this.bpmnElement = window.bpmnInstances.bpmnElement
      this.bpmnElementSource = this.bpmnElement.source
      this.bpmnElementSourceRef = this.bpmnElement.businessObject.sourceRef
      if (
        this.bpmnElementSourceRef &&
        this.bpmnElementSourceRef.default &&
        this.bpmnElementSourceRef.default.id === this.bpmnElement.id
      ) {
        // 默认
        this.flowConditionForm = { type: 'default' }
      } else if (!this.bpmnElement.businessObject.conditionExpression) {
        // 普通
        this.flowConditionForm = { type: 'normal' }
      } else {
        // 带条件
        const conditionExpression =
          this.bpmnElement.businessObject.conditionExpression
        const extensionElements =
          this.bpmnElement.businessObject.get('extensionElements') ||
          window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
            values: []
          })
        const customCondition = (extensionElements.values || []).filter(
          (ex) => ex.$type === `${this.prefix}:CustomCondition`
        )[0]
        if (customCondition && customCondition.type === 'operation') {
          this.flowConditionForm = {
            ...conditionExpression,
            type: customCondition.type
          }
          this.flowConditionForm.operationType = customCondition.parallelRefuse
            ? this.SysFlowTaskOperationType.PARALLEL_REFUSE
            : customCondition.operationType
        } else {
          this.flowConditionForm = { ...conditionExpression, type: 'condition' }
        }
        // resource 可直接标识 是否是外部资源脚本
        if (this.flowConditionForm.resource) {
          this.flowConditionForm.conditionType = 'script'
          this.flowConditionForm.scriptType = 'externalScript'
          // this.$set(this.flowConditionForm, 'conditionType', 'script')
          // this.$set(this.flowConditionForm, 'scriptType', 'externalScript')
          return
        }
        if (conditionExpression.language) {
          this.flowConditionForm.conditionType = 'script'
          this.flowConditionForm.scriptType = 'inlineScript'
          // this.$set(this.flowConditionForm, 'conditionType', 'script')
          // this.$set(this.flowConditionForm, 'scriptType', 'inlineScript')
          return
        }
        this.flowConditionForm.conditionType = 'expression'
        // this.$set(this.flowConditionForm, 'conditionType', 'expression')
      }
    },
    onOperationTypeChange(value) {
      if (value == null || value === '') {
        this.flowConditionForm.body = undefined
      } else if (value === this.SysFlowTaskOperationType.PARALLEL_REFUSE) {
        // 并行网关拒绝
        this.flowConditionForm.body = `\${parallelRefuse == true}`
      } else {
        this.flowConditionForm.body = "${operationType == '" + value + "'}"
      }
      this.updateFlowCondition()
    },
    updateFlowType(flowType) {
      // 正常条件类
      if (flowType === 'condition' || flowType === 'operation') {
        // 内置按钮
        let extensionElements = null
        if (flowType === 'operation') {
          extensionElements = window.bpmnInstances.moddle.create(
            'bpmn:ExtensionElements',
            {
              values: [
                window.bpmnInstances.moddle.create(
                  `${this.prefix}:CustomCondition`,
                  {
                    type: flowType
                  }
                )
              ]
            }
          )
        }
        this.flowConditionRef = window.bpmnInstances.moddle.create(
          'bpmn:FormalExpression'
        )
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          conditionExpression: this.flowConditionRef,
          extensionElements: extensionElements
        })
        return
      }
      // 默认路径
      if (flowType === 'default') {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          conditionExpression: null
        })
        window.bpmnInstances.modeling.updateProperties(this.bpmnElementSource, {
          default: this.bpmnElement
        })
        return
      }
      // 正常路径，如果来源节点的默认路径是当前连线时，清除父元素的默认路径配置
      if (
        this.bpmnElementSourceRef.default &&
        this.bpmnElementSourceRef.default.id === this.bpmnElement.id
      ) {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElementSource, {
          default: null
        })
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        conditionExpression: null
      })
    },
    updateFlowCondition() {
      const { conditionType, scriptType, body, resource, language } =
        this.flowConditionForm
      let condition
      let extensionElements
      if (conditionType === 'expression') {
        condition = window.bpmnInstances.moddle.create(
          'bpmn:FormalExpression',
          {
            body
          }
        )
        // 内置按钮
        if (this.flowConditionForm.type === 'operation') {
          extensionElements = window.bpmnInstances.moddle.create(
            'bpmn:ExtensionElements',
            {
              values: [
                window.bpmnInstances.moddle.create(
                  `${this.prefix}:CustomCondition`,
                  {
                    type: this.flowConditionForm.type,
                    operationType:
                      this.flowConditionForm.operationType ===
                      this.SysFlowTaskOperationType.PARALLEL_REFUSE
                        ? undefined
                        : this.flowConditionForm.operationType,
                    parallelRefuse:
                      this.flowConditionForm.operationType ===
                      this.SysFlowTaskOperationType.PARALLEL_REFUSE
                  }
                )
              ]
            }
          )
        }
      } else {
        if (scriptType === 'inlineScript') {
          condition = window.bpmnInstances.moddle.create(
            'bpmn:FormalExpression',
            { body, language }
          )
          this.$set(this.flowConditionForm, 'resource', '')
        } else {
          this.$set(this.flowConditionForm, 'body', '')
          condition = window.bpmnInstances.moddle.create(
            'bpmn:FormalExpression',
            { resource, language }
          )
        }
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        conditionExpression: condition,
        extensionElements
      })
    }
  }
}
</script>
