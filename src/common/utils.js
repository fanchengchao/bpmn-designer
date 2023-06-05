/**
 * 从数组中查找某一项
 * @param {Array} list 要查找的数组
 * @param {String} id 要查找的节点id
 * @param {String} idKey 主键字段名（如果为null则直接比较）
 * @param {Boolean} removeItem 是否从数组中移除查找到的节点
 * @returns {Object} 找到返回节点，没找到返回undefined
 */
export function findItemFromList(list, id, idKey, removeItem = false) {
  if (Array.isArray(list) && list.length > 0 && id != null) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (
        ((idKey == null || idKey === '') && item === id) ||
        (idKey != null && item[idKey] === id)
      ) {
        if (removeItem) list.splice(i, 1)
        return item
      }
    }
  }
  return null
}
/**
 * 通过id从树中获取指定的节点
 * @param {Object} node 根节点
 * @param {String|Nubmer} id 键值
 * @param {Array} list 保存查询路径
 * @param {String} idKey 主键字段名
 * @param {String} childKey 子节点字段名
 */
function findNode(node, id, list, idKey = 'id', childKey = 'children') {
  if (Array.isArray(list)) list.push(node)
  if (node[idKey] === id) {
    return node
  }

  if (node[childKey] != null && Array.isArray(node[childKey])) {
    for (let i = 0; i < node[childKey].length; i++) {
      const tempNode = findNode(node[childKey][i], id, list, idKey, childKey)
      if (tempNode) return tempNode
    }
  }

  if (Array.isArray(list)) list.pop()
}
/**
 * 通过id返回从根节点到指定节点的路径
 * @param {Array} treeRoot 树根节点数组
 * @param {*} id 要查询的节点的id
 * @param {*} idKey 主键字段名
 * @param {*} childKey 子节点字段名
 */
export function findTreeNodeObjectPath(
  treeRoot,
  id,
  idKey = 'id',
  childKey = 'children'
) {
  const tempList = []
  for (let i = 0; i < treeRoot.length; i++) {
    if (findNode(treeRoot[i], id, tempList, idKey, childKey)) {
      return tempList
    }
  }

  return []
}

export function findTreeNodePath(
  treeRoot,
  id,
  idKey = 'id',
  childKey = 'children'
) {
  return (findTreeNodeObjectPath(treeRoot, id, idKey, childKey) || []).map(
    (item) => item[idKey]
  )
}
/**
 * 列表数据转换树形数据
 * @param {Array} data 要转换的列表
 * @param {String} id 主键字段字段名
 * @param {String} pid 父字段字段名
 * @returns {Array} 转换后的树数据
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]].children) {
        temp[data[k][pid]].children = []
      }
      if (!temp[data[k][pid]]._level) {
        temp[data[k][pid]]._level = 1
      }
      data[k]._level = temp[data[k][pid]]._level + 1
      data[k]._parent = data[k][pid]
      temp[data[k][pid]].children.push(data[k])
    } else {
      res.push(data[k])
    }
  }

  return res
}
