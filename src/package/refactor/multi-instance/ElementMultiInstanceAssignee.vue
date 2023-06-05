<template>
  <div class="panel-tab__content">
    <el-form
      label-width="90px"
      @submit.prevent
    >
      <el-form-item label="集合类型">
        <el-select
          key="collectionType"
          v-model="collectionType"
          placeholder=""
        >
          <el-option
            label="候选用户"
            value="assignee"
          />
          <el-option
            label="候选分组"
            value="group"
            :disabled="true"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="候选用户">
        <TagSelect v-model="assigneeList">
          <template #append>
            <el-button
              class="append-add"
              type="default"
              icon="el-icon-plus"
              @click="onSelectAssigneeList()"
            />
          </template>
        </TagSelect>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TagSelect from 'implement/workflow/components/TagSelect.vue'
import TaskUserSelect from '../../../components/TaskUserSelect.vue'
import { findItemFromList } from 'common/utils/utils'

export default {
  name: 'ElementMultiInstanceAssignee',
  components: {
    TagSelect
  },
  inject: ['prefix'],
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      collectionType: 'assignee',
      assigneeList: [],
      elementAssigneeList: []
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.$nextTick(() => {
            this.resetMultiInstanceAssignee()
          })
        }
      }
    },
    assigneeList: {
      handler() {
        this.updateElementExtensions()
      }
    }
  },
  methods: {
    resetMultiInstanceAssignee() {
      this.bpmnELement = window.bpmnInstances.bpmnElement
      const elExtensionElements =
        this.bpmnELement.businessObject.get('extensionElements') ||
        window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
          values: []
        })
      this.elementAssigneeList =
        elExtensionElements.values.filter(
          (ex) => ex.$type === `${this.prefix}:AssigneeList`
        )?.[0] ||
        window.bpmnInstances.moddle.create(`${this.prefix}:AssigneeList`, {
          assigneeList: [],
          type: 'assignee'
        })
      this.collectionType = this.elementAssigneeList.type || 'assignee'
      this.assigneeList = (this.elementAssigneeList.assigneeList || []).map(
        (item) => {
          return {
            id: item.id,
            name: item.id
          }
        }
      )
      this.updateElementExtensions()
    },
    updateElementExtensions() {
      const elExtensionElements =
        this.bpmnELement.businessObject.get('extensionElements') ||
        window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
          values: []
        })
      const otherExtensions = elExtensionElements.values.filter(
        (ex) => ex.$type !== `${this.prefix}:AssigneeList`
      )
      const element = window.bpmnInstances.moddle.create(
        `${this.prefix}:AssigneeList`,
        {
          assigneeList: (this.assigneeList || []).map((item) => {
            return window.bpmnInstances.moddle.create(
              `${this.prefix}:Assignee`,
              {
                id: item.id
              }
            )
          }),
          type: this.collectionType
        }
      )
      const newElExtensionElements = window.bpmnInstances.moddle.create(
        `bpmn:ExtensionElements`,
        {
          values: [...otherExtensions, element]
        }
      )
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      })
    },
    onSelectAssigneeList() {
      this.$dialog
        .show(
          '选择候选用户',
          TaskUserSelect,
          {
            area: ['1000px', '600px']
          },
          {
            multiple: true,
            usedUserIdList: Array.isArray(this.assigneeList)
              ? (this.assigneeList || []).map((item) => item.id)
              : []
          }
        )
        .then((res) => {
          if (!Array.isArray(this.assigneeList)) this.assigneeList = []
          if (Array.isArray(res)) {
            res.forEach((item) => {
              const temp = findItemFromList(
                this.assigneeList,
                item.loginName,
                'id'
              )
              if (temp == null) {
                this.assigneeList.push({
                  id: item.loginName,
                  name: item.loginName
                })
              }
            })
          } else {
            if (res && res.loginName !== '') {
              const temp = findItemFromList(
                this.assigneeList,
                res.loginName,
                'id'
              )
              if (temp == null) {
                this.assigneeList.push({
                  id: res.loginName,
                  name: res.loginName
                })
              }
            }
          }
          this.assigneeList = [...this.assigneeList]
          this.updateElementExtensions()
        })
    }
  }
}
</script>

<style scoped>
.append-add {
  background: #f5f7fa;
  border: none;
  border-left: 1px solid #dcdfe6;
  border-radius: 0;
}
</style>
