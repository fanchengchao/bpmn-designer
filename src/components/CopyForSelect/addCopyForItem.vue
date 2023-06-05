<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加抄送人"
    width="30%"
  >
    <div
      class="form-single-fragment"
      style="position: relative"
    >
      <el-form
        ref="form"
        :model="formData"
        class="full-width-input"
        style="width: 100%"
        label-width="130px"
        label-position="right"
        @submit.prevent
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="抄送类型"
              prop="type"
            >
              <el-select
                v-model="formData.type"
                class="input-item"
                placeholder="抄送类型"
                @change="onCopyForTypeChange"
              >
                <el-option
                  v-for="item in SysFlowCopyForType.getList()"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="formData.type === SysFlowCopyForType.USER"
              label="抄送人"
              prop="id"
            >
              <!-- <TagSelect v-model="formData.id">
                <template #append>
                  <el-button
                    class="append-add"
                    type="default"
                    icon="el-icon-plus"
                    @click="onSelectUser"
                  />
                </template>
              </TagSelect> -->
              <data-list
                v-model:list="formData.id"
                key-name="userName"
              />
              <el-button
                type="default"
                :disabled="appointedAssignee || startUser"
                @click="onSelectUser"
              >
                <i class="ri-add-line" />
              </el-button>
              <el-checkbox
                v-model="appointedAssignee"
                @change="switchAppointedAssignee"
              >
                指定审批人
              </el-checkbox>
              <el-checkbox
                v-model="startUser"
                @change="switchStartUser"
              >
                流程发起人
              </el-checkbox>
            </el-form-item>
            <el-form-item
              v-if="formData.type === SysFlowCopyForType.ROLE"
              label="抄送角色"
              prop="id"
            >
              <el-select
                v-model="formData.id"
                placeholder=""
                :multiple="true"
              >
                <el-option
                  v-for="role in roleList"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="formData.type === SysFlowCopyForType.DEPT"
              label="抄送部门"
              prop="id"
            >
              <TagSelect v-model="selectDeptList">
                <template #append>
                  <el-button
                    class="append-add"
                    type="default"
                    icon="el-icon-plus"
                    @click="onSelectDept"
                  />
                </template>
              </TagSelect>
            </el-form-item>
            <el-form-item
              v-if="formData.type === SysFlowCopyForType.POST"
              label="抄送岗位"
              prop="id"
            >
              <data-list
                v-model:list="formData.id"
                key-name="positionName"
              />
              <el-button
                type="default"
                @click="onSelectPosition"
              >
                <i class="ri-add-line" />
              </el-button>
              <!-- <TagSelect v-model="selectDeptList">
                <template #append>
                  <el-button
                    class="append-add"
                    type="default"
                    icon="el-icon-plus"
                    @click="onSelectDept"
                  />
                </template>
              </TagSelect> -->
            </el-form-item>
            <el-form-item
              v-if="
                [
                  SysFlowCopyForType.SELF_DEPT_POST,
                  SysFlowCopyForType.UP_DEPT_POST
                ].indexOf(formData.type) !== -1
              "
              :label="SysFlowCopyForType.getValue(formData.type)"
              prop="id"
            >
              <el-select
                v-model="formData.id"
                placeholder=""
                :multiple="true"
              >
                <el-option
                  v-for="post in postList"
                  :key="post.postId"
                  :label="post.postName"
                  :value="post.postId"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item
              v-if="formData.type === SysFlowCopyForType.DEPT_POST"
              label="抄送部门"
              prop="deptId"
            >
              <el-cascader
                v-model="deptId"
                :clearable="true"
                placeholder=""
                :props="{ value: 'id', label: 'name', checkStrictly: true }"
                :options="deptList"
                @change="onDeptChange"
              />
            </el-form-item> -->
            <el-form-item
              v-if="formData.type === SysFlowCopyForType.DEPT_POST"
              label="抄送岗位"
              prop="id"
            >
              <data-list
                v-model:list="formData.id"
                key-name="positionName"
              />
              <el-button
                type="default"
                @click="onSelectPosition"
              >
                <i class="ri-add-line" />
              </el-button>
              <!-- <el-select
                v-model="formData.id"
                placeholder=""
                :multiple="true"
              >
                <el-option
                  v-for="post in validDeptPostList"
                  :key="post.deptPostId"
                  :label="post.postShowName"
                  :value="post.deptPostId"
                />
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row
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
  </el-dialog>
  <multi-select
    ref="selectUser"
    v-model:list="formData.id"
    v-bind="userConfig"
  />
  <multi-select
    ref="selectDepart"
    v-model:list="formData.id"
    v-bind="selectDepartPramas"
    type="tree"
    @delete="dealTreeData"
  />
  <multi-select
    ref="selectPosition"
    v-bind="selectPositionPramas"
    v-model:list="formData.id"
    :extra-params="{}"
  />
</template>

<script>
import {
  getSysUserInfoUrl,
  getDepartTreeListUrl,
  getSysPositionUrl
} from '../../common/api.js'
import { SysFlowCopyForType } from '../../staticDict/flowStaticDict.js'
// import { findItemFromList } from 'common/utils/utils'
// import TagSelect from 'implement/workflow/components/TagSelect.vue'
// import TaskUserSelect from '../../../components/TaskUserSelect.vue'
// import TaskGroupSelect from 'implement/workflow/components/TaskGroupSelect.vue'

export default {
  // components: {
  //   TagSelect
  // },
  inject: ['flowEntry'],
  props: {
    deptList: {
      type: Array,
      required: true
    },
    postList: {
      type: Array,
      required: true
    },
    deptPostList: {
      type: Array,
      required: true
    },
    roleList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      SysFlowCopyForType,
      deptId: undefined,
      selectDeptList: [],
      appointedAssignee: false,
      startUser: false,
      formData: {
        type: SysFlowCopyForType.USER,
        id: undefined
      },
      userConfig: {
        name: '用户',
        keyName: 'userName',
        otherKeyName: 'mobileNum',
        searchParams: 'userName',
        extraParams: {
          userSubType: 'community',
          userSource: this.flowEntry().communityId,
          searchCommunityTenant: 1
        },
        searchUrl: getSysUserInfoUrl
      },
      selectDepartPramas: {
        name: '归属部门',
        type: 'custom',
        keyName: 'departName',
        searchParams: 'departName',
        treeLabelName: 'departName',
        treeChildName: 'childDepart',
        searchUrl: getDepartTreeListUrl,
        checkStrictly: true,
        extraParams: {
          departType: 'community',
          departSource: this.flowEntry().communityId,
          searchCommunityTenant: 1
        }
      },
      selectPositionPramas: {
        name: '职位',
        keyName: 'positionName',
        otherKeyName: 'departName',
        searchParams: 'positionName',
        searchUrl: getSysPositionUrl,
        extraParams: {
          departType: 'community',
          departSource: this.flowEntry().communityId,
          searchCommunityTenant: 1
        }
      }
    }
  },
  computed: {
    positionExtraParams() {
      return {
        departIdList: []
      }
    },
    validDeptPostList() {
      const id = Array.isArray(this.deptId)
        ? this.deptId[this.deptId.length - 1]
        : undefined
      if (id == null) return []
      return this.deptPostList.filter((item) => {
        return item.deptId === id
      })
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    onCancel(isSuccess, data) {
      this.dialogVisible = false
    },
    switchAppointedAssignee(val) {
      if (val) {
        this.formData.id = [
          {
            id: '${appointedAssignee}',
            userName: '指定审批人'
          }
        ]
      } else {
        this.formData.id = []
      }
    },
    switchStartUser(val) {
      if (val) {
        this.formData.id = [
          {
            id: '${startUserName}',
            userName: '流程发起人'
          }
        ]
      } else {
        this.formData.id = []
      }
    },
    onSubmit() {
      // if (
      //   this.formData.type === this.SysFlowCopyForType.DEPT_POST &&
      //   (this.deptId == null || this.deptId === '')
      // ) {
      //   this.$message.warning('请选择抄送部门')
      //   return
      // }
      if (
        (this.formData.id == null || this.formData.id === '') &&
        this.formData.type === this.SysFlowCopyForType.DEPT_POST &&
        this.formData.type !== this.SysFlowCopyForType.SELF_DEPT_LEADER &&
        this.formData.type !== this.SysFlowCopyForType.UP_DEPT_LEADER
      ) {
        this.$message.warning(
          '请选择' + this.SysFlowCopyForType.getValue(this.formData.type)
        )
        return
      }
      let tempId = null
      switch (this.formData.type) {
        case this.SysFlowCopyForType.ROLE:
          tempId = this.formData.id.join(',')
          break
        case this.SysFlowCopyForType.USER:
        case this.SysFlowCopyForType.DEPT:
        case this.SysFlowCopyForType.DEPT_POST:
          tempId = this.formData.id
          break
        case this.SysFlowCopyForType.POST:
        case this.SysFlowCopyForType.SELF_DEPT_POST:
        case this.SysFlowCopyForType.UP_DEPT_POST:
          tempId = this.formData.id.join(',')
          break
        default:
          tempId = ''
          break
      }
      const ids = []
      tempId.forEach((item) => {
        ids.push(item.id)
      })
      this.$emit('submit', {
        type: this.formData.type,
        id: ids.join(',')
      })
      this.dialogVisible = false
    },
    onDeptChange(val) {
      this.formData.id = undefined
    },
    onCopyForTypeChange(val) {
      this.formData.id = undefined
      this.deptId = undefined
      this.selectDeptList = []
    },
    onSelectUser() {
      this.$refs.selectUser.open()
    },
    onSelectDept() {
      this.$refs.selectDepart.open()
    },
    onSelectPosition() {
      this.$refs.selectPosition.open()
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
