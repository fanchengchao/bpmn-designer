<template>
  <div class="copy-select">
    <el-table
      :data="tableDataList"
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
            @click="onDeleteCopyItem(scope.row)"
          >
            <i class="ri-delete-bin-line" />
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="抄送类型"
        width="150px"
      >
        <template #default="scope">
          <span>{{ SysFlowCopyForType.getValue(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抄送对象">
        <template #default="scope">
          <el-tag
            v-for="item in scope.row.showNameList"
            :key="item.id"
            type="primary"
            effect="dark"
            closable
            @close="onCloseSubItem(scope.row, item)"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      class="full-line-btn"
      icon="el-icon-plus"
      @click="onEditCopyForItem()"
    >
      添加抄送人
    </el-button>
    <add-copy-for-item
      ref="addCopyForItem"
      @submit="onSubmitCopyForItem"
    />
  </div>
</template>

<script>
// import { treeDataTranslate } from 'common/utils/utils';
// import { SysPostController, DictionaryController } from '@/api';
import { SysFlowCopyForType } from '../../staticDict/flowStaticDict.js'
import addCopyForItem from './addCopyForItem.vue'
import { getObjectNameInfoUrl } from '../../common/api.js'

export default {
  name: 'CopyForSelect',
  components: {
    addCopyForItem
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['input'],
  data() {
    return {
      dialogVisible: false,
      SysFlowCopyForType,
      isInit: true,
      roleList: [],
      roleMap: new Map(),
      deptList: [],
      deptMap: new Map(),
      postList: [],
      postMap: new Map(),
      deptPostList: [],
      deptPostMap: new Map(),
      tableDataList: []
    }
  },
  watch: {
    list: {
      async handler(data) {
        if (this.isInit && Array.isArray(data)) {
          const result = []
          for (let i = 0; i < data.length; i++) {
            const temp = await this.formatData(data[i])
            result.push(temp)
          }
          this.tableDataList = result
        } else {
          this.tableDataList = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  beforeUnmount() {
    this.roleMap = null
    this.deptMap = null
    this.postMap = null
    this.deptPostMap = null
  },
  methods: {
    async getObjectName(params) {
      const { status, data } = await this.$axios.post(
        getObjectNameInfoUrl,
        params
      )
      if (status !== '0') return
      return data
    },
    async formatData(item) {
      let showNameList = (item.id || '').split(',')
      let params = {}
      if (item.type === this.SysFlowCopyForType.USER) {
        params = {
          userIds: showNameList
        }
      } else if (item.type === this.SysFlowCopyForType.ROLE) {
        params = {
          roleIds: showNameList
        }
      } else if (item.type === this.SysFlowCopyForType.DEPT) {
        params = {
          departmentIds: showNameList
        }
      } else if (item.type === this.SysFlowCopyForType.DEPT_POST) {
        params = {
          positionIds: showNameList
        }
      }
      const { data } = await this.$axios.post(getObjectNameInfoUrl, params)
      switch (item.type) {
        case this.SysFlowCopyForType.USER:
          if (showNameList[0] === '${appointedAssignee}') {
            showNameList = [
              {
                id: '${appointedAssignee}',
                name: '指定审批人'
              }
            ]
          } else if (showNameList[0] === '${startUserName}') {
            showNameList = [
              {
                id: '${startUserName}',
                name: '流程发起人'
              }
            ]
          } else {
            showNameList = data.users
          }
          break
        case this.SysFlowCopyForType.ROLE:
          showNameList = data.roles
          break
        case this.SysFlowCopyForType.DEPT:
          showNameList = data.departments
          break
        case this.SysFlowCopyForType.SELF_DEPT_LEADER:
        case this.SysFlowCopyForType.UP_DEPT_LEADER:
          showNameList = []
          break
        case this.SysFlowCopyForType.POST:
        case this.SysFlowCopyForType.SELF_DEPT_POST:
        case this.SysFlowCopyForType.UP_DEPT_POST:
          showNameList = showNameList
            .map((id) => {
              const post = this.postMap.get(id)
              return post
                ? {
                    id: id,
                    name: post.postName
                  }
                : undefined
            })
            .filter((item) => item != null)
          break
        case this.SysFlowCopyForType.DEPT_POST:
          showNameList = data.positions
          break
      }
      return {
        ...item,
        showNameList
      }
    },
    onDeleteCopyItem(row) {
      this.$confirm('是否删除此抄送人？')
        .then((res) => {
          const temp = (this.list || []).filter((item) => {
            return row.type !== item.type
          })
          this.$emit('update:list', temp)
        })
        .catch((e) => {})
    },
    onCloseSubItem(row, item) {
      this.$confirm('是否移除此抄送人？')
        .then((res) => {
          const temp = (this.list || []).filter((copyItem) => {
            if (row.type === copyItem.type) {
              if (copyItem.id == null || copyItem.id === '') return false
              let tempIdList = (copyItem.id || '').split(',')
              tempIdList = tempIdList.filter((subItemId) => {
                return subItemId !== item.id
              })
              if (tempIdList.length <= 0) {
                return false
              } else {
                copyItem.id = tempIdList.join(',')
                return true
              }
            } else {
              return true
            }
          })
          this.$emit('update:list', temp)
        })
        .catch((e) => {})
    },
    onEditCopyForItem() {
      this.$refs.addCopyForItem.open()
      // this.$dialog
      //   .show(
      //     '添加抄送人',
      //     addCopyForItem,
      //     {
      //       area: '600px'
      //     },
      //     {
      //       roleList: this.roleList,
      //       deptList: this.deptList,
      //       postList: this.postList,
      //       deptPostList: this.deptPostList
      //     }
      //   )
      //   .then((res) => {
      //     const copyForType = res.type
      //     let bFind = false
      //     // 按照抄送类型更新
      //     const temp = (this.list || []).map((copyItem) => {
      //       if (copyItem.type === copyForType) {
      //         bFind = true
      //         const oldIdList = (copyItem.id || '').split(',')
      //         const newIdList = (res.id || '').split(',')
      //         // 合并新旧选项
      //         const idList = oldIdList
      //         newIdList.forEach((id) => {
      //           if (idList.indexOf(id) === -1) idList.push(id)
      //         })
      //         return {
      //           ...copyItem,
      //           id: idList.join(',')
      //         }
      //       } else {
      //         return {
      //           ...copyItem
      //         }
      //       }
      //     })
      //     if (!bFind) {
      //       temp.push({
      //         ...res
      //       })
      //     }
      //     this.$emit('update:list', temp)
      //   })
      //   .catch((e) => {})
    },
    onSubmitCopyForItem(res) {
      const copyForType = res.type
      let bFind = false
      // 按照抄送类型更新
      const temp = (this.list || []).map((copyItem) => {
        if (copyItem.type === copyForType) {
          bFind = true
          const oldIdList = (copyItem.id || '').split(',')
          const newIdList = (res.id || '').split(',')
          // 合并新旧选项
          const idList = oldIdList
          newIdList.forEach((id) => {
            if (idList.indexOf(id) === -1) idList.push(id)
          })
          return {
            ...copyItem,
            id: idList.join(',')
          }
        } else {
          return {
            ...copyItem
          }
        }
      })
      if (!bFind) {
        temp.push({
          ...res
        })
      }
      this.$emit('update:list', temp)
    }
  }
}
</script>

<style scoped>
.full-line-btn {
  width: 100%;
  margin: 10px 0;
  border: 1px dashed #ebeef5;
}

.copy-select >>> .el-tag {
  margin-right: 10px;
}
</style>
