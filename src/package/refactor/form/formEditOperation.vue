<template>
  <div
    class="form-single-fragment"
    style="position: relative"
  >
    <el-form
      ref="form"
      :model="formData"
      class="full-width-input"
      :rules="rules"
      style="width: 100%"
      label-width="100px"
      label-position="right"
      @submit.prevent
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item
            label="按钮类型"
            prop="type"
          >
            <el-select
              v-model="formData.type"
              class="input-item"
              :clearable="true"
              placeholder="按钮类型"
              @change="onOperationTypeChange"
            >
              <el-option
                v-for="item in SysFlowTaskOperationType.getList()"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="按钮名称"
            prop="label"
          >
            <el-input
              v-model="formData.label"
              class="input-item"
              :clearable="true"
              placeholder="按钮名称"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-if="formData.type === SysFlowTaskOperationType.MULTI_SIGN"
          :span="24"
        >
          <el-form-item label="会签用户类型">
            <el-select
              v-model="multiSignAssignee.assigneeType"
              placeholder=""
              @change="multiSignAssignee.assigneeList = []"
            >
              <el-option
                label="用户"
                value="USER_GROUP"
              />
              <el-option
                label="角色"
                value="ROLE_GROUP"
              />
              <el-option
                label="部门"
                value="DEPT_GROUP"
              />
              <el-option
                label="岗位"
                value="POST_GROUP"
              />
              <el-option
                label="部门岗位"
                value="DEPT_POST_GROUP"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="formData.type === SysFlowTaskOperationType.MULTI_SIGN"
          :span="24"
        >
          <el-form-item label="会签用户选择">
            <el-select
              v-if="
                multiSignAssignee.assigneeType === 'USER_GROUP' ||
                  multiSignAssignee.assigneeType === 'ROLE_GROUP' ||
                  multiSignAssignee.assigneeType === 'POST_GROUP'
              "
              v-model="multiSignAssignee.assigneeList"
              class="assignee-select"
              placeholder=""
              :multiple="true"
            >
              <el-option
                v-for="item in multiSignGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-cascader
              v-if="multiSignAssignee.assigneeType === 'DEPT_GROUP'"
              key="dept_select"
              v-model="multiSignAssignee.assigneeList"
              :options="multiSignGroupList"
              :props="{
                multiple: true,
                checkStrictly: true,
                value: 'id',
                label: 'name'
              }"
            />
            <el-cascader
              v-if="multiSignAssignee.assigneeType === 'DEPT_POST_GROUP'"
              key="dept_post_select"
              v-model="multiSignAssignee.assigneeList"
              :options="multiSignGroupList"
              :props="{
                multiple: true,
                value: 'id',
                label: 'name'
              }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="显示顺序">
            <el-input-number
              v-model="formData.showOrder"
              class="input-item"
              :clearable="true"
              placeholder="显示顺序"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row
            class="no-scroll flex-box"
            type="flex"
            justify="end"
          >
            <el-button @click="onCancel(false)">
              取消
            </el-button>
            <el-button
              type="primary"
              @click="onSubmit()"
            >
              保存
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  findTreeNodePath
  // treeDataTranslate
} from '../../../common/utils'
import { SysFlowTaskOperationType } from '../../../staticDict/flowStaticDict.js'

export default {
  props: {
    rowData: {
      type: Object
    }
  },
  data() {
    return {
      formData: {
        id: undefined,
        type: undefined,
        label: undefined,
        showOrder: 0
      },
      userList: undefined,
      roleList: undefined,
      deptList: undefined,
      postList: undefined,
      deptPostList: undefined,
      multiSignAssignee: {
        assigneeType: 'USER_GROUP',
        value: []
      },
      rules: {
        type: [{ required: true, message: '请选择按钮类型', trigger: 'blur' }],
        label: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }]
      },
      SysFlowTaskOperationType
    }
  },
  computed: {
    multiSignGroupList() {
      switch (this.multiSignAssignee.assigneeType) {
        case 'USER_GROUP':
          return this.userList
        case 'ROLE_GROUP':
          return this.roleList
        case 'DEPT_GROUP':
          return this.deptList
        case 'POST_GROUP':
          return this.postList
        case 'DEPT_POST_GROUP':
          return this.deptPostList
        default:
          return []
      }
    }
  },
  watch: {
    multiSignGroupList: {
      handler(newValue) {
        if (newValue == null)
          this.loadGroupList(this.multiSignAssignee.assigneeType).catch(
            (e) => {}
          )
      },
      immediate: true
    }
  },
  mounted() {
    if (this.rowData) {
      this.formData = {
        ...this.rowData
      }
      if (this.rowData.multiSignAssignee) {
        this.multiSignAssignee = JSON.parse(this.rowData.multiSignAssignee)
        const assigneeValue = this.multiSignAssignee.assigneeList
        this.multiSignAssignee.assigneeList = undefined
        this.loadGroupList(this.multiSignAssignee.assigneeType)
          .then((res) => {
            if (
              this.multiSignAssignee.assigneeType === 'USER_GROUP' ||
              this.multiSignAssignee.assigneeType === 'ROLE_GROUP' ||
              this.multiSignAssignee.assigneeType === 'POST_GROUP'
            ) {
              this.multiSignAssignee.assigneeList = assigneeValue.split(',')
            } else if (
              this.multiSignAssignee.assigneeType === 'DEPT_GROUP' ||
              this.multiSignAssignee.assigneeType === 'DEPT_POST_GROUP'
            ) {
              this.multiSignAssignee.assigneeList = assigneeValue
                .split(',')
                .map((item) => {
                  const nodePath = findTreeNodePath(
                    this.multiSignGroupList,
                    item
                  )
                  return nodePath
                })
            }
          })
          .catch((e) => {})
      }
    }
  },
  methods: {
    onCancel(isSuccess) {
      this.$emit('cancel')
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (
            this.formData.type === this.SysFlowTaskOperationType.MULTI_SIGN &&
            Array.isArray(this.multiSignAssignee.assigneeList) &&
            this.multiSignAssignee.assigneeList.length > 0
          ) {
            let tempValue
            if (
              this.multiSignAssignee.assigneeType === 'USER_GROUP' ||
              this.multiSignAssignee.assigneeType === 'ROLE_GROUP' ||
              this.multiSignAssignee.assigneeType === 'POST_GROUP'
            ) {
              tempValue = this.multiSignAssignee.assigneeList.join(',')
            } else if (
              this.multiSignAssignee.assigneeType === 'DEPT_GROUP' ||
              this.multiSignAssignee.assigneeType === 'DEPT_POST_GROUP'
            ) {
              tempValue = this.multiSignAssignee.assigneeList
                .map((item) => {
                  return item[item.length - 1]
                })
                .join(',')
            }
            this.formData.multiSignAssignee = JSON.stringify({
              assigneeType: this.multiSignAssignee.assigneeType,
              assigneeList: tempValue
            })
          } else {
            this.formData.multiSignAssignee = undefined
          }
          this.$emit('success', this.formData)
          this.$emit('cancel')
        }
      })
    },
    onOperationTypeChange(type) {
      if (type == null || type === '') {
        this.formData.label = undefined
      } else {
        this.formData.label = this.SysFlowTaskOperationType.getValue(type)
      }
    },
    loadGroupList(type) {
      return new Promise((resolve, reject) => {
        if (type === 'USER_GROUP') {
          // SystemController.getUserList(this, {}).then(res => {
          //   this.userList = res.data.dataList.map(item => {
          //     return {
          //       id: item.loginName,
          //       name: item.loginName
          //     }
          //   });
          //   resolve();
          // }).catch(e => {
          //   reject(e);
          // });
        } else if (type === 'ROLE_GROUP') {
          // DictionaryController.dictSysRole(this, {}).then(res => {
          //   this.roleList = res.getList();
          //   resolve();
          // }).catch(e => {
          //   reject(e);
          // });
        } else if (type === 'DEPT_GROUP') {
          // DictionaryController.dictSysDept(this, {}).then(res => {
          //   this.deptList = treeDataTranslate(res.getList());
          //   resolve();
          // }).catch(e => {
          //   reject(e);
          // });
        } else if (type === 'POST_GROUP') {
          // SysPostController.list(this, {}).then(res => {
          //   this.postList = res.data.dataList.map(item => {
          //     return {
          //       id: item.postId,
          //       name: item.postName
          //     }
          //   });
          //   resolve();
          // }).catch(e => {
          //   reject(e);
          // });
        } else if (type === 'DEPT_POST_GROUP') {
          // DictionaryController.dictDeptPost(this, {}).then(res => {
          //   this.deptPostList = treeDataTranslate(res);
          //   let deptMap = new Map();
          //   res.forEach(item => {
          //     let deptItem = deptMap.get(item.deptId);
          //     if (deptItem == null) {
          //       deptItem = {
          //         id: item.deptId,
          //         name: item.deptName,
          //         children: []
          //       }
          //       deptMap.set(item.deptId, deptItem);
          //     }
          //     deptItem.children.push({
          //       id: item.deptPostId,
          //       name: item.postShowName
          //     });
          //   });
          //   this.deptPostList = [];
          //   deptMap.forEach((value) => {
          //     this.deptPostList.push(value);
          //   });
          //   resolve();
          // }).catch(e => {
          //   reject(e);
          // });
        }
      })
    }
  }
}
</script>

<style scoped>
.assignee-select >>> .el-input__inner {
  min-height: 28px !important;
}
</style>
