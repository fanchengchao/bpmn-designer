<template>
  <div class="panel-tab__content">
    <el-form
      label-width="90px"
      @submit.prevent
    >
      <el-form-item label="任务变量">
        <el-select
          v-model="taskVariableList"
          clearable
          multiple
          collapse-tags
          placeholder="选择任务节点使用的变量"
          filterable
          default-first-option
          @change="onSelectVariableChange"
        >
          <el-option
            v-for="item in allVariableList()"
            :key="item.id"
            :value="item.id"
            :label="item.showName"
          >
            <el-row
              type="flex"
              justify="space-between"
            >
              <span>{{ item.showName }}</span>
              <span>{{ item.variableName }}</span>
            </el-row>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FormVariable',
  inject: ['flowEntry', 'allVariableList', 'prefix'],
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      variableList: undefined,
      taskVariableList: [],
      otherExtensions: []
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.$nextTick(() => {
            this.resetFormVariable()
          })
        }
      }
    }
  },
  methods: {
    resetFormVariable() {
      this.bpmnELement = window.bpmnInstances.bpmnElement

      const elExtensionElements =
        this.bpmnELement.businessObject.get('extensionElements') ||
        window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
          values: []
        })
      this.variableList =
        elExtensionElements.values.filter(
          (ex) => ex.$type === `${this.prefix}:VariableList`
        )?.[0] ||
        window.bpmnInstances.moddle.create(`${this.prefix}:VariableList`, {
          variableList: []
        })
      this.taskVariableList = this.variableList.variableList || []
      this.taskVariableList = this.taskVariableList.map((item) =>
        Number(item.id)
      )
      this.updateElementExtensions()
    },
    updateElementExtensions() {
      // 更新回扩展元素
      const elExtensionElements =
        this.bpmnELement.businessObject.get('extensionElements') ||
        window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
          values: []
        })
      const otherExtensions = elExtensionElements.values.filter(
        (ex) => ex.$type !== `${this.prefix}:VariableList`
      )
      this.variableList.variableList = this.taskVariableList.map((item) => {
        return window.bpmnInstances.moddle.create(
          `${this.prefix}:FormVariable`,
          {
            id: item
          }
        )
      })
      const newElExtensionElements = window.bpmnInstances.moddle.create(
        `bpmn:ExtensionElements`,
        {
          values: otherExtensions.concat(this.variableList)
        }
      )
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      })
    },
    onSelectVariableChange(values) {
      this.updateElementExtensions()
    }
  }
}
</script>

<style scoped>
.full-line-btn {
  width: 100%;
  margin-top: 10px;
  border: 1px dashed #ebeef5;
}
</style>
