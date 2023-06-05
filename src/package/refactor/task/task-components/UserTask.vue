<template>
  <div style="margin-top: 16px">
    <el-form-item label="候选类型">
      <el-select
        v-model="formData.groupType"
        placeholder="请选择分组类型"
        @change="onGroupTypeChange"
      >
        <el-option
          label="处理用户"
          value="ASSIGNEE"
        />
        <el-option
          label="候选用户组"
          value="USERS"
        />
        <!-- <el-option
          label="角色"
          value="ROLE"
        /> -->
        <el-option
          label="部门"
          value="DEPT"
        />
        <el-option
          label="岗位"
          value="POST"
        />
        <!-- <el-option
          label="流程发起人部门领导"
          value="DEPT_POST_LEADER"
        />
        <el-option
          label="流程发起人上级部门领导"
          value="UP_DEPT_POST_LEADER"
        /> -->
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="formData.groupType === 'ASSIGNEE'"
      label="处理用户"
    >
      <ts-select2
        v-model="userTaskForm.assignee"
        :disabled="appointedAssignee || startUser"
        v-bind="userSelectConfig"
      />
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
      v-if="formData.groupType === 'USERS'"
      label="候选用户"
    >
      <data-list
        v-model:list="userTaskForm.candidateUsers"
        key-name="userName"
      />
      <el-button
        class="append-add"
        type="default"
        :disabled="appointedAssignee || startUser"
        @click="onSelectCandidateUsers"
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
      v-if="formData.groupType === 'ROLE'"
      label="候选角色"
    >
      <el-select
        v-model="candidateGroupIds"
        placeholder=""
        :multiple="true"
        @change="onSelectRoleChange"
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
      v-if="formData.groupType == 'DEPT' || formData.groupType == 'POST'"
      :label="formData.groupType === 'DEPT' ? '候选部门' : '候选岗位'"
    >
      <data-list
        v-model:list="candidateGroupIds"
        :key-name="
          formData.groupType === 'DEPT' ? 'departName' : 'positionName'
        "
      />
      <el-button
        class="append-add"
        type="default"
        @click="onSelectCandidatGroups"
      >
        <i class="ri-add-line" />
      </el-button>
      <!-- <TagSelect v-model="candidateGroupIds">
        <template #append>
          <el-button
            class="append-add"
            type="default"
            icon="el-icon-plus"
            @click="onSelectCandidatGroups(true)"
          />
        </template>
      </TagSelect> -->
    </el-form-item>
    <el-form-item label="到期时间">
      <el-input
        v-model="userTaskForm.dueDate"
        clearable
        @change="updateElementTask('dueDate')"
      />
    </el-form-item>
    <el-form-item label="跟踪时间">
      <el-input
        v-model="userTaskForm.followUpDate"
        clearable
        @change="updateElementTask('followUpDate')"
      />
    </el-form-item>
    <el-form-item label="优先级">
      <el-input
        v-model="userTaskForm.priority"
        clearable
        @change="updateElementTask('priority')"
      />
    </el-form-item>
    <multi-select
      ref="selectUser"
      v-model:list="userTaskForm.candidateUsers"
      v-bind="userConfig"
    />
    <multi-select
      ref="selectDepart"
      v-model:list="candidateGroupIds"
      v-bind="selectDepartPramas"
      type="tree"
      @delete="dealTreeData"
    />
    <multi-select
      ref="selectPosition"
      v-bind="selectPositionPramas"
      v-model:list="candidateGroupIds"
    />
  </div>
</template>

<script>
import {
  getSysUserInfoUrl,
  getObjectNameInfoUrl,
  getDepartTreeListUrl,
  getSysPositionUrl,
  sysUserInfoSelect2Url
} from '../../../../common/api.js'
import TaskUserSelect from '../../../../components/TaskUserSelect.vue'

export default {
  name: 'UserTask',
  inject: ['flowEntry', 'prefix'],
  props: {
    id: String,
    type: String
  },
  data() {
    return {
      candidateGroupIds: [],
      defaultTaskForm: {
        assignee: '',
        candidateUsers: '',
        candidateGroups: '',
        dueDate: '',
        followUpDate: '',
        priority: ''
      },
      formData: {
        groupType: 'ASSIGNEE'
      },
      roleList: undefined,
      groupList: undefined,
      groupMap: new Map(),
      postList: [],
      deptPostList: [],
      postMap: new Map(),
      deptPostMap: new Map(),
      appointedAssignee: false,
      startUser: false,
      userTaskForm: {
        assignee: '',
        candidateUsers: '',
        candidateGroups: '',
        dueDate: '',
        followUpDate: '',
        priority: ''
      },
      userSelectConfig: {
        searchUrl: sysUserInfoSelect2Url,
        responseNameKey: 'userName',
        extraParams: {
          changeUserType: 1,
          sourceIds: this.flowEntry().communityId,
          searchCommunityTenant: 1,
          showTreeSeperate: 1
        }
      },
      userConfig: {
        name: '用户',
        keyName: 'userName',
        otherKeyName: 'mobileNum',
        searchParams: 'userName',
        searchUrl: getSysUserInfoUrl,
        extraParams: {
          userSubType: 'community',
          userSource: this.flowEntry().communityId,
          searchCommunityTenant: 1,
          showTreeSeperate: 1,
          status: 1
        }
      },
      selectDepartPramas: {
        name: '归属部门',
        type: 'custom',
        keyName: 'departName',
        otherKeyName: 'applySourceName',
        searchParams: 'departName',
        treeLabelName: 'departName',
        treeChildName: 'childDepart',
        searchUrl: getDepartTreeListUrl,
        checkStrictly: true,
        extraParams: {
          applyLevel: 'community',
          applySource: this.flowEntry().communityId,
          searchCommunityTenant: 1,
          systemModule: this.$route.query.systemModule,
          showTreeSeperate: 1
        }
      },
      selectPositionPramas: {
        name: '职位',
        keyName: 'positionName',
        otherKeyName: 'departName',
        searchParams: 'positionName',
        searchUrl: getSysPositionUrl,
        extraParams: {
          positionType: 'community',
          positionSource: this.flowEntry().communityId,
          searchCommunityTenant: 1,
          systemModule: this.$route.query.systemModule,
          showTreeSeperate: 1
        }
      }
    }
  },
  computed: {
    positionExtraParams() {
      return {
        departIdList: this.userTaskForm.departList
          ? this.userTaskForm.departList.map((item) => item.id).join(',')
          : []
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(newValue) {
        this.bpmnElement = window.bpmnInstances.bpmnElement
        this.$nextTick(() => this.resetTaskForm())
      }
    },
    'userTaskForm.assignee': {
      handler() {
        this.updateElementTask('assignee')
      }
    },
    'userTaskForm.candidateUsers': {
      handler() {
        this.updateElementTask('candidateUsers')
      }
    },
    candidateGroupIds: {
      handler() {
        if (this.formData.groupType === 'ROLE') {
          this.userTaskForm.candidateGroups = Array.isArray(
            this.candidateGroupIds
          )
            ? this.candidateGroupIds.join(',')
            : ''
        } else if (this.formData.groupType === 'POST') {
          this.updateDeptPost()
        } else {
          this.userTaskForm.candidateGroups = this.candidateGroupIds
        }
      }
    },
    'userTaskForm.candidateGroups': {
      handler() {
        this.updateElementTask('candidateGroups')
      }
    }
  },
  beforeUnmount() {
    this.bpmnElement = null
    this.groupMap = null
    this.postMap = null
    this.deptPostMap = null
  },
  methods: {
    async getObjectName(params) {
      const { data } = await this.$axios.post(getObjectNameInfoUrl, params)
      return data
    },
    async getTreeList() {
      const params = {
        departSource: this.flowEntry().communityId,
        departType: 'community'
      }
      const { status, data } = await this.$axios.get(getDepartTreeListUrl, {
        params
      })
      if (status === '0') {
        this.treeData = data
      }
    },
    dealTreeData() {
      const dealData = (list) => {
        for (let i = 0; i < list.length; i++) {
          if (list[i].childDepart.length) {
            dealData(list[i].childDepart)
            list[i].childDepart = this.$refs.selectDepart.initData(
              list[i].childDepart
            )
          }
        }
      }
      dealData(this.treeData)
      this.treeData = this.$refs.selectDepart.initData(this.treeData)
    },
    onSelectAssignee(multiple = false) {
      this.$dialog
        .show(
          '选择用户',
          TaskUserSelect,
          {
            area: ['1000px', '600px']
          },
          {
            multiple: multiple
          }
        )
        .then((res) => {
          let assignee = null
          if (Array.isArray(res)) {
            assignee = res.map((item) => item.loginName).join(',')
          } else {
            assignee = (res || {}).loginName
          }
          this.userTaskForm.assignee = assignee
        })
        .catch((e) => {})
    },
    switchAppointedAssignee(val) {
      this.startUser = false
      if (this.formData.groupType === 'ASSIGNEE') {
        if (val) {
          this.userTaskForm.assignee = '${appointedAssignee}'
        } else {
          this.userTaskForm.assignee = ''
        }
      } else if (this.formData.groupType === 'USERS') {
        if (val) {
          this.userTaskForm.candidateUsers = [
            {
              id: '${appointedAssignee}',
              userName: '指定审批人'
            }
          ]
        } else {
          this.userTaskForm.candidateUsers = []
        }
      }
    },
    switchStartUser(val) {
      this.appointedAssignee = false
      if (this.formData.groupType === 'ASSIGNEE') {
        if (val) {
          this.userTaskForm.assignee = '${startUserName}'
        } else {
          this.userTaskForm.assignee = ''
        }
      } else if (this.formData.groupType === 'USERS') {
        if (val) {
          this.userTaskForm.candidateUsers = [
            {
              id: '${startUserName}',
              userName: '流程发起人'
            }
          ]
        } else {
          this.userTaskForm.candidateUsers = []
        }
      }
    },
    onSelectCandidateUsers() {
      this.$refs.selectUser.open()
    },
    loadSysRoleList() {
      return new Promise((resolve, reject) => {
        // DictionaryController.dictSysRole(this, {}).then(res => {
        //   this.roleList = res.getList();
        //   resolve();
        // }).catch(e => {
        //   reject(e);
        // });
        this.roleList = []
        resolve()
      })
    },
    loadDeptWidgetDropdownList() {
      return new Promise((resolve, reject) => {
        // DictionaryController.dictSysDept(this, {}).then(res => {
        //   res.getList().forEach(item => {
        //     this.groupMap.set(item.id, item);
        //   });
        //   this.groupList = treeDataTranslate(res.getList());
        //   resolve();
        // }).catch(e => {
        //   reject(e);
        // });
        this.groupList = []
        resolve()
      })
    },
    handlerDeptChange() {
      this.$refs.selectDepart.open()
    },
    handlerPostChange() {
      this.$refs.selectPosition.open()
    },
    getDeptPostItem(item) {
      let deptName
      switch (item.deptType) {
        case 'allDeptPost':
          deptName = '全部'
          break
        case 'selfDeptPost':
          deptName = '本部门'
          break
        case 'upDeptPost':
          deptName = '上级部门'
          break
        case 'deptPost':
          deptName =
            (this.deptPostMap.get(item.deptPostId) || {}).deptName || '未知岗位'
          break
      }
      const postName =
        item.deptType === 'deptPost'
          ? (this.deptPostMap.get(item.deptPostId) || {}).postShowName ||
            '未知岗位'
          : (this.postMap.get(item.postId) || {}).postName || '未知岗位'

      return {
        deptName,
        postName
      }
    },
    onSelectCandidatGroups() {
      if (this.formData.groupType === 'DEPT') {
        this.handlerDeptChange()
      } else {
        this.handlerPostChange()
      }
    },
    onSelectRoleChange(value) {
      this.$nextTick(() => {
        this.userTaskForm.candidateGroups = Array.isArray(value)
          ? value.join(',')
          : ''
      })
    },
    async resetTaskForm() {
      this.userTaskForm = {
        assignee: '',
        candidateUsers: '',
        candidateGroups: '',
        dueDate: '',
        followUpDate: '',
        priority: ''
      }
      this.appointedAssignee = false
      this.startUser = false
      this.candidateGroupIds = []
      const formData =
        window.bpmnInstances.bpmnElement &&
        window.bpmnInstances.bpmnElement.businessObject
          ? window.bpmnInstances.bpmnElement.businessObject.formKey
          : ''
      const formObj = formData ? JSON.parse(formData) : {}
      if (formObj) {
        this.formData = {
          formId: formObj.formId,
          routerName: formObj.routerName,
          editable: !formObj.readOnly,
          groupType: formObj.groupType || 'ASSIGNEE'
        }
      } else {
        this.formData = {
          groupType: 'ASSIGNEE'
        }
      }
      for (const key in this.defaultTaskForm) {
        let value

        if (key === 'assignee') {
          value =
            (window.bpmnInstances.bpmnElement || {}).businessObject[key] ||
            this.defaultTaskForm[key]
          if (value === '${appointedAssignee}') {
            this.appointedAssignee = true
          } else if (value === '${startUserName}') {
            this.startUser = true
          }
        }
        if (key === 'candidateUsers' || key === 'candidateGroups') {
          value =
            (window.bpmnInstances.bpmnElement || {}).businessObject[key] ||
            this.defaultTaskForm[key]
          console.log(value)
          if (value && key === 'candidateUsers') {
            if (value === '${appointedAssignee}') {
              this.appointedAssignee = true
              value = [
                {
                  id: '${appointedAssignee}',
                  userName: '指定审批人'
                }
              ]
            } else if (value === '${startUserName}') {
              this.startUser = true
              value = [
                {
                  id: '${startUserName}',
                  userName: '流程发起人'
                }
              ]
            } else {
              const { users } = await this.getObjectName({
                userIds:
                  Object.prototype.toString.call(value) === '[object Array]'
                    ? value
                    : value.split(',')
              })
              value = users.length
                ? users.map((item) => {
                    return {
                      id: item.id,
                      userName: item.name
                    }
                  })
                : []
            }
          }
          if (key === 'candidateGroups' && value) {
            if (
              Array.isArray(this.candidateGroupIds) &&
              this.formData.groupType === 'DEPT'
            ) {
              const { departments } = await this.getObjectName({
                departmentIds: value.split(',')
              })
              value = departments.map((item) => {
                return {
                  id: item.id,
                  departName: item.name
                }
              })
              this.candidateGroupIds = value
            }
          }
        } else {
          value =
            (window.bpmnInstances.bpmnElement || {}).businessObject[key] ||
            this.defaultTaskForm[key]
        }
        this.userTaskForm[key] = value
        // this.$set(this.userTaskForm, key, value);
      }
      // 岗位
      if (this.formData.groupType === 'POST') {
        const elExtensionElements =
          window.bpmnInstances.bpmnElement.businessObject.get(
            'extensionElements'
          ) ||
          window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
            values: []
          })
        this.deptPostListElement =
          elExtensionElements.values.filter(
            (ex) => ex.$type === `${this.prefix}:DeptPostList`
          )?.[0] ||
          window.bpmnInstances.moddle.create(`${this.prefix}:DeptPostList`, {
            deptPostList: []
          })
        this.candidateGroupIds = this.deptPostListElement.deptPostList.map(
          (item) => {
            item.deptType = 'deptPost'
            item.type = undefined
            return {
              ...item,
              id: Number(item.id),
              positionName: item.postId
            }
          }
        )
      }
    },
    updateFormKey() {
      if (this.formData == null) return
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
      window.bpmnInstances.modeling.updateProperties(
        window.bpmnInstances.bpmnElement,
        { formKey: formKeyString }
      )
    },
    onGroupTypeChange() {
      this.userTaskForm.assignee = undefined
      this.userTaskForm.candidateUsers = undefined
      this.appointedAssignee = false
      this.startUser = false
      this.candidateGroupIds = []
      this.userTaskForm.candidateGroups = ''
      this.updateFormKey()
    },
    updateDeptPost() {
      // 岗位
      if (this.formData.groupType === 'POST') {
        const elExtensionElements =
          window.bpmnInstances.bpmnElement.businessObject.get(
            'extensionElements'
          ) ||
          window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
            values: []
          })
        const otherExtensions = elExtensionElements.values.filter(
          (ex) => ex.$type !== `${this.prefix}:DeptPostList`
        )
        if (this.deptPostListElement == null) {
          this.deptPostListElement = window.bpmnInstances.moddle.create(
            `${this.prefix}:DeptPostList`,
            { deptPostList: [] }
          )
        }
        this.deptPostListElement.deptPostList = this.candidateGroupIds.map(
          (item) => {
            return window.bpmnInstances.moddle.create(
              `${this.prefix}:DeptPost`,
              {
                id: item.id,
                type: 'deptPost',
                postId: item.positionName,
                deptPostId: item.id,
                positionName: item.positionName
              }
            )
          }
        )
        const newElExtensionElements = window.bpmnInstances.moddle.create(
          `bpmn:ExtensionElements`,
          {
            values: otherExtensions.concat(this.deptPostListElement)
          }
        )
        // 更新到元素上
        window.bpmnInstances.modeling.updateProperties(
          window.bpmnInstances.bpmnElement,
          {
            extensionElements: newElExtensionElements
          }
        )
      }
    },
    updateElementTask(key) {
      const taskAttr = Object.create(null)
      if (key === 'candidateUsers' || key === 'candidateGroups') {
        const ids = []
        this.userTaskForm[key] &&
          this.userTaskForm[key].forEach((item) => {
            ids.push(item.id)
          })
        taskAttr[key] = ids.join(',')
        const type =
          key === 'candidateUsers' ? 'USERS' : this.formData.groupType
        this.updateUserCandidateGroups(type, taskAttr[key])
      } else {
        taskAttr[key] = this.userTaskForm[key] || null
      }
      window.bpmnInstances.modeling.updateProperties(
        window.bpmnInstances.bpmnElement,
        taskAttr
      )
    },
    updateUserCandidateGroups(type, value) {
      const elExtensionElements =
        window.bpmnInstances.bpmnElement.businessObject.get(
          'extensionElements'
        ) ||
        window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
          values: []
        })
      const otherExtensions = elExtensionElements.values.filter(
        (ex) => ex.$type !== `${this.prefix}:UserCandidateGroups`
      )
      const userCandidateGroupsElement = window.bpmnInstances.moddle.create(
        `${this.prefix}:UserCandidateGroups`,
        {
          type: type,
          value: value
        }
      )
      if (type !== 'POST' && value != null && value !== '')
        otherExtensions.push(userCandidateGroupsElement)
      const newElExtensionElements = window.bpmnInstances.moddle.create(
        `bpmn:ExtensionElements`,
        {
          values: otherExtensions
        }
      )
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(
        window.bpmnInstances.bpmnElement,
        {
          extensionElements: newElExtensionElements
        }
      )
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
