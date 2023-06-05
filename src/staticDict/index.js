/**
 * 常量字典数据
 */

class DictionaryBase extends Map {
  constructor(name, dataList, keyId = 'id', symbolId = 'symbol') {
    super()
    this.showName = name
    this.setList(dataList, keyId, symbolId)
  }

  setList(dataList, keyId = 'id', symbolId = 'symbol') {
    this.clear()
    if (Array.isArray(dataList)) {
      dataList.forEach((item) => {
        this.set(item[keyId], item)
        if (item[symbolId] != null) {
          Object.defineProperty(this, item[symbolId], {
            get: function () {
              return item[keyId]
            }
          })
        }
      })
    }
  }

  getList(valueId = 'name', parentIdKey = 'parentId', filter) {
    const temp = []
    this.forEach((value, key) => {
      const obj = {
        id: key,
        name: typeof value === 'string' ? value : value[valueId],
        parentId: value[parentIdKey]
      }
      if (typeof filter !== 'function' || filter(obj)) {
        temp.push(obj)
      }
    })

    return temp
  }

  getValue(id, valueId = 'name') {
    // 如果id为boolean类型，则自动转换为0和1
    if (typeof id === 'boolean') {
      id = id ? 1 : 0
    }
    return (this.get(id) || {})[valueId]
  }
}

const SysUserStatus = new DictionaryBase('用户状态', [
  {
    id: 0,
    name: '正常状态',
    symbol: 'NORMAL'
  },
  {
    id: 1,
    name: '锁定状态',
    symbol: 'LOCKED'
  }
])

const SysUserType = new DictionaryBase('用户类型', [
  {
    id: 0,
    name: '管理员',
    symbol: 'ADMIN'
  },
  {
    id: 1,
    name: '系统操作员',
    symbol: 'SYSTEM'
  },
  {
    id: 2,
    name: '普通操作员',
    symbol: 'OPERATOR'
  }
])

const SysPermModuleType = new DictionaryBase('权限分组类型', [
  {
    id: 0,
    name: '分组模块',
    symbol: 'GROUP'
  },
  {
    id: 1,
    name: '接口模块',
    symbol: 'CONTROLLER'
  }
])

const SysPermCodeType = new DictionaryBase('权限字类型', [
  {
    id: 0,
    name: '表单',
    symbol: 'FORM'
  },
  {
    id: 1,
    name: '片段',
    symbol: 'FRAGMENT'
  },
  {
    id: 2,
    name: '操作',
    symbol: 'OPERATION'
  }
])

const SysMenuType = new DictionaryBase('菜单类型', [
  {
    id: 0,
    name: '目录',
    symbol: 'DIRECTORY'
  },
  {
    id: 1,
    name: '表单',
    symbol: 'MENU'
  },
  {
    id: 2,
    name: '片段',
    symbol: 'FRAGMENT'
  },
  {
    id: 3,
    name: '按钮',
    symbol: 'BUTTON'
  }
])

const SysMenuBindType = new DictionaryBase('菜单绑定类型', [
  {
    id: 0,
    name: '路由菜单',
    symbol: 'ROUTER'
  },
  {
    id: 1,
    name: '在线表单',
    symbol: 'ONLINE_FORM'
  },
  {
    id: 2,
    name: '工单列表',
    symbol: 'WORK_ORDER'
  }
])

const SysDataPermType = new DictionaryBase('数据权限类型', [
  {
    id: 0,
    name: '查看全部',
    symbol: 'ALL'
  },
  {
    id: 1,
    name: '仅看自己',
    symbol: 'ONLY_USER'
  },
  {
    id: 2,
    name: '仅看所在部门',
    symbol: 'ONLY_DEPT'
  },
  {
    id: 3,
    name: '仅看所在部门及子部门',
    symbol: 'ONLY_DEPT_AND_CHILD'
  },
  {
    id: 4,
    name: '自选部门及子部门',
    symbol: 'CUSTOM_DEPT_AND_CHILD'
  },
  {
    id: 5,
    name: '仅自选部门',
    symbol: 'CUSTOM_DEPT'
  }
])

export {
  DictionaryBase,
  SysUserStatus,
  SysUserType,
  SysDataPermType,
  SysPermModuleType,
  SysPermCodeType,
  SysMenuBindType,
  SysMenuType
}
