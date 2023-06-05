<template>
  <div class="panel-tab__content">
    <ConyForSelect v-model:list="copyForItemList" />
  </div>
</template>

<script>
import ConyForSelect from '../../../components/CopyForSelect/index.vue'

export default {
  components: {
    ConyForSelect
  },
  inject: ['prefix'],
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      copyForItemList: [],
      copyItemElementList: undefined
    }
  },
  watch: {
    copyForItemList: {
      handler(newValue) {
        this.updateElementExtensions()
      }
    },
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
      this.copyItemElementList =
        elExtensionElements.values.filter(
          (ex) => ex.$type === `${this.prefix}:CopyItemList`
        )?.[0] ||
        window.bpmnInstances.moddle.create(`${this.prefix}:CopyItemList`, {
          copyItemList: []
        })
      this.copyForItemList = this.copyItemElementList.copyItemList
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
        (ex) => ex.$type !== `${this.prefix}:CopyItemList`
      )
      this.copyItemElementList.copyItemList = (this.copyForItemList || []).map(
        (item) => {
          return window.bpmnInstances.moddle.create(`${this.prefix}:CopyItem`, {
            id: item.id,
            type: item.type
          })
        }
      )
      const newElExtensionElements = window.bpmnInstances.moddle.create(
        `bpmn:ExtensionElements`,
        {
          values: otherExtensions.concat(this.copyItemElementList)
        }
      )
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      })
    }
  }
}
</script>
