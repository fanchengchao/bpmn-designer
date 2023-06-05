<template>
  <div class="panel-tab__content">
    <el-form
      ref="form"
      label-width="80px"
      :model="formData"
      :rules="rules"
      @submit.prevent
    >
      <el-form-item
        v-if="flowEntry().bindFormType === 1"
        label="表单路由"
        prop="routerName"
      >
        <el-input
          v-model="formData.routerName"
          clearable
          @change="updateElementFormKey"
        />
      </el-form-item>
      <el-form-item
        v-if="flowEntry().bindFormType === 0 && !simple"
        label="在线表单"
        prop="formId"
      >
        <ts-select2
          v-model="formData.formId"
          v-bind="formConfig"
          @change="updateElementFormKey"
        />
      </el-form-item>
      <el-form-item label="允许编辑">
        <el-switch
          v-model="formData.editable"
          @change="updateElementFormKey"
        />
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-divider>按钮设置</el-divider>
        </el-col>
        <el-col
          :span="24"
          style="border-top: 1px solid #ebeef5"
        >
          <el-table
            :data="formOperationList"
            :show-header="false"
          >
            <el-table-column
              label="操作"
              width="45px"
            >
              <template #default="scope">
                <el-button
                  class="table-btn delete"
                  type="text"
                  @click="onDeleteOperation(scope.row)"
                >
                  <i class="ri-delete-bin-line" />
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="按钮名称"
              min-width="100px"
            >
              <template #default="scope">
                <el-button
                  class="table-btn"
                  type="text"
                  style="text-decoration: underline"
                  @click="onEditOperation(scope.row)"
                >
                  {{ scope.row.label }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="按钮类型"
              min-width="100px"
            >
              <template #default="scope">
                <el-tag effect="dark">
                  {{ SysFlowTaskOperationType.getValue(scope.row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="显示顺序"
              prop="showOrder"
              width="60px"
            />
          </el-table>
          <el-button
            class="full-line-btn"
            @click="onEditOperation(null)"
          >
            <i class="ri-add-line" /> 添加按钮
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      v-if="visible"
      v-model="visible"
      :title="title"
    >
      <edit-operation
        :row-data="currentOperation"
        @cancel="cancelSelect"
        @success="submitOperate"
      />
    </el-dialog>
  </div>
</template>

<script>
import { SysFlowTaskOperationType } from '../../../staticDict/flowStaticDict.js'
import EditOperation from './formEditOperation.vue'

export default {
  name: 'FlowFormConfig',
  components: {
    EditOperation
  },
  inject: ['flowEntry', 'formList', 'prefix'],
  props: {
    id: String,
    type: String,
    simple: Boolean
  },
  data() {
    return {
      visible: false,
      SysFlowTaskOperationType,
      formConfig: {
        searchUrl: '/gateway/form/formInfo/formCommSelect2',
        extraParams: {
          communityId: this.flowEntry().communityId
        },
        responseValueKey: 'formId'
      },
      formData: {
        formId: this.flowEntry().defaultFormId,
        routerName: this.flowEntry().defaultRouterName,
        editable: false
      },
      operationList: undefined,
      formOperationList: [],
      rules: {
        formId: [
          { required: true, message: '请选择在线表单！', trigger: 'change' }
        ],
        routerName: [
          { required: true, message: '表单路由不能为空！', trigger: 'blur' }
        ]
      },
      currentOperation: {},
      title: ''
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.$nextTick(() => {
            this.resetFormList()
          })
        }
      }
    }
  },
  methods: {
    resetFormList() {
      this.bpmnELement = window.bpmnInstances.bpmnElement
      const formData = this.bpmnELement.businessObject.formKey
      const formObj = formData ? JSON.parse(formData) : undefined
      if (formObj) {
        this.formData = {
          formId: formObj.formId,
          routerName: formObj.routerName,
          editable: !formObj.readOnly,
          groupType: formObj.groupType || 'ASSIGNEE'
        }
      }
      const elExtensionElements =
        this.bpmnELement.businessObject.get('extensionElements') ||
        window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
          values: []
        })
      this.operationList =
        elExtensionElements.values.filter(
          (ex) => ex.$type === `${this.prefix}:OperationList`
        )?.[0] ||
        window.bpmnInstances.moddle.create(`${this.prefix}:OperationList`, {
          operationList: []
        })
      this.formOperationList = this.operationList.operationList || []
      this.formOperationList.forEach((item) => {
        item.showOrder = Number.parseInt(item.showOrder)
      })
      // 更新元素扩展属性，避免后续报错
      this.updateElementFormKey()
      this.updateElementExtensions()
    },
    updateElementFormKey() {
      this.$nextTick(() => {
        this.$refs.form.validate((valid) => {
          if (!valid) return
          const formKeyString = JSON.stringify({
            formId:
              this.flowEntry().bindFormType === 0
                ? this.formData.formId
                : undefined,
            routerName:
              this.flowEntry().bindFormType === 0
                ? undefined
                : this.formData.routerName,
            readOnly: !this.formData.editable,
            groupType: this.formData.groupType || 'ASSIGNEE'
          })
          // debugger
          window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
            formKey: formKeyString
          })
        })
      })
    },
    updateElementExtensions() {
      // 更新回扩展元素
      const elExtensionElements =
        this.bpmnELement.businessObject.get('extensionElements') ||
        window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
          values: []
        })
      const otherExtensions = elExtensionElements.values.filter(
        (ex) => ex.$type !== `${this.prefix}:OperationList`
      )
      const newElExtensionElements = window.bpmnInstances.moddle.create(
        `bpmn:ExtensionElements`,
        {
          values: otherExtensions.concat(this.operationList)
        }
      )
      this.operationList.operationList = this.formOperationList.map((item) => {
        return window.bpmnInstances.moddle.create(
          `${this.prefix}:FormOperation`,
          {
            id: item.id,
            label: item.label,
            type: item.type,
            showOrder: item.showOrder,
            multiSignAssignee: item.multiSignAssignee
          }
        )
      })
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      })
    },
    onEditOperation(operation) {
      this.visible = true
      if (operation) {
        this.title = '编辑按钮'
        this.currentOperation = operation
      } else {
        this.title = '添加按钮'
      }
    },
    cancelSelect() {
      this.visible = false
    },
    submitOperate(res) {
      if (res.id == null) {
        res.id = Date.now()
        this.formOperationList.push(res)
      } else {
        this.formOperationList.forEach((item) => {
          if (item.id === res.id) {
            item.label = res.label
            item.type = res.type
            item.showOrder = res.showOrder
            item.multiSignAssignee = res.multiSignAssignee
          }
        })
      }
      this.formOperationList.sort((value1, value2) => {
        return value1.showOrder - value2.showOrder
      })
      this.updateElementExtensions()
      this.currentOperation = null
    },
    onDeleteOperation(operation) {
      this.$confirm('是否删除此按钮？')
        .then((res) => {
          this.formOperationList = this.formOperationList.filter((item) => {
            return item.id !== operation.id
          })
          this.updateElementExtensions()
        })
        .catch((e) => {})
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
