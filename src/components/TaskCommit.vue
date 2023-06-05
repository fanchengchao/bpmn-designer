<template>
  <div
    class="form-single-fragment"
    style="position: relative"
  >
    <el-form
      ref="formTaskCommit"
      :model="formData"
      class="full-width-input"
      :rules="rules"
      style="width: 100%"
      label-width="100px"
      label-position="right"
      @submit.prevent
    >
      <el-row :gutter="20">
        <el-col
          v-if="
            operation.type !== SysFlowTaskOperationType.CO_SIGN &&
              operation.type !== SysFlowTaskOperationType.MULTI_SIGN
          "
          :span="24"
        >
          <el-form-item
            label="审批意见："
            prop="message"
          >
            <el-input
              v-model="formData.message"
              clearable
              placeholder="请输入审批意见"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="showAssignSelect"
          :span="24"
        >
          <el-form-item
            label="指派用户："
            prop="assignee"
          >
            <TagSelect v-model="formData.assignee">
              <template #append>
                <el-button
                  class="append-add"
                  type="default"
                  icon="el-icon-plus"
                  @click="onSelectAssignee"
                />
              </template>
            </TagSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row
            class="no-scroll flex-box"
            type="flex"
            justify="end"
          >
            <el-button
              type="primary"
              :plain="true"
              @click="onCancel(false)"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              @click="onSubmitClick()"
            >
              提交
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TagSelect from 'implement/workflow/components/TagSelect.vue'
import TaskUserSelect from '../../../components/TaskUserSelect.vue'

export default {
  name: 'FormTaskCommit',
  components: {
    TagSelect
  },
  props: {
    operation: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        message: undefined,
        assignee: undefined
      },
      rules: {
        message: [
          { required: true, message: '审批意见不能为空', trigger: 'blur' }
        ],
        assignee: [
          { required: true, message: '指派用户不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showAssignSelect() {
      let showAssignSelect = false
      // 如果是会签操作，判断是否在流程内设置了会签人
      if (this.operation.type === this.SysFlowTaskOperationType.MULTI_SIGN) {
        showAssignSelect =
          !this.operation.multiSignAssignee ||
          !Array.isArray(this.operation.multiSignAssignee.assigneeList) ||
          this.operation.multiSignAssignee.assigneeList.length <= 0
      }
      return (
        [
          this.SysFlowTaskOperationType.TRANSFER,
          this.SysFlowTaskOperationType.CO_SIGN,
          this.SysFlowTaskOperationType.SET_ASSIGNEE
        ].indexOf(this.operation.type) !== -1 || showAssignSelect
      )
    },
    multiSelect() {
      return (
        this.operation.type === this.SysFlowTaskOperationType.CO_SIGN ||
        this.operation.type === this.SysFlowTaskOperationType.MULTI_SIGN
      )
    }
  },
  methods: {
    onCancel(isSuccess, data) {
      if (this.observer != null) {
        this.observer.cancel(isSuccess, data)
      }
    },
    onSubmitClick() {
      this.$refs.formTaskCommit.validate((valid) => {
        if (!valid) return
        this.onCancel(true, this.formData)
      })
    },
    onSelectAssignee() {
      this.$dialog
        .show(
          '选择用户',
          TaskUserSelect,
          {
            area: ['1000px', '600px']
          },
          {
            showAssignee: false,
            multiple: this.multiSelect
          }
        )
        .then((res) => {
          let assignee = null
          if (Array.isArray(res)) {
            assignee = res.map((item) => item.loginName).join(',')
          } else {
            assignee = (res || {}).loginName
          }
          this.formData.assignee = assignee
        })
        .catch((e) => {})
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
