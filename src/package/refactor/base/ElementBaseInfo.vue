<template>
  <div class="panel-tab__content">
    <el-form
      label-width="90px"
      @submit.prevent
    >
      <el-form-item label="ID">
        <el-input
          v-model="elementBaseInfo.id"
          :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'"
          clearable
          @change="updateBaseInfo('id')"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input
          v-model="elementBaseInfo.name"
          :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'"
          clearable
          @change="updateBaseInfo('name')"
        />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="可执行">
          <el-switch
            v-model="elementBaseInfo.isExecutable"
            active-text="是"
            inactive-text="否"
            @change="updateBaseInfo('isExecutable')"
          />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'ElementBaseInfo',
  inject: ['flowEntry'],
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      elementBaseInfo: {}
    }
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo())
        }
      }
    }
  },
  beforeUnmount() {
    this.bpmnElement = null
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement
      this.elementBaseInfo = this.bpmnElement.businessObject
      if (this.elementBaseInfo.$type === 'bpmn:Process') {
        this.elementBaseInfo.id = this.flowEntry().processDefinitionKey
        this.elementBaseInfo.name = this.flowEntry().processDefinitionName
      }
    },
    updateBaseInfo(key) {
      const attrObj = Object.create(null)
      attrObj[key] = this.elementBaseInfo[key]
      if (key === 'id') {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` }
        })
      } else {
        window.bpmnInstances.modeling.updateProperties(
          this.bpmnElement,
          attrObj
        )
      }
    }
  }
}
</script>
