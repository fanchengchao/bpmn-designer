const getListUrl = '/gateway/form/flowModelInfo/pageList'
const getFlowCategoryListUrl = '/gateway/form/flowCategory/pageList'
const addFlowUrl = '/gateway/form/flowModelInfo/add'
const updateFlowUrl = '/gateway/form/flowModelInfo/update'
const deleteFlowUrl = '/gateway/form/flowModelInfo/delete'
const getDetailUrl = '/gateway/form/flowModelInfo/detail'
const searchFormUrl = '/gateway/form/formInfo/formCommSelect2'

const getUserListUrl = '/gateway/form/admin/upms/sysUser/list'

const getFlowVariableUrl = '/gateway/form/flowInfoVariable/list'

const addFlowVariableUrl = '/gateway/form/flowInfoVariable/add'

const deleteFlowVariableUrl = '/gateway/form/flowInfoVariable/delete'
const updateFlowVariableUrl = '/gateway/form/flowInfoVariable/update'
const getFormFieldUrl = '/gateway/form/formField/listFormBusinessField'
const getSysUserInfoUrl = '/gateway/base/sysUserInfo/pageList?bizType=tenant'
const publishFlowUrl = '/gateway/form/flowModelInfo/publish'
// 获取自定义表单设计内容
const getFormJsonURL = '/gateway/form/formInfo/getFormJson'
const getTaskInfoUrl = '/gateway/form/flowOperation/viewInitialTaskInfo'
const startFlowUrl = '/gateway/form/flowFormOperation/startAndTakeUserTask/'
const startFlowOnlyUrl = '/gateway/form/flowOperation/startOnly'
const getObjectNameInfoUrl = '/gateway/form/flowModelInfo/getObjectNameInfo'
const getDepartTreeListUrl =
  '/gateway/base/sysDepartment/treeList?bizType=tenant'
const getSysPositionUrl =
  '/gateway/base/service/sysPosition/pageList?bizType=tenant'
const sysUserInfoSelect2Url = '/gateway/base/sysUserInfo/select2'

export {
  getListUrl,
  getFlowCategoryListUrl,
  addFlowUrl,
  updateFlowUrl,
  deleteFlowUrl,
  getDetailUrl,
  searchFormUrl,
  getUserListUrl,
  getFlowVariableUrl,
  addFlowVariableUrl,
  deleteFlowVariableUrl,
  updateFlowVariableUrl,
  getFormFieldUrl,
  getSysUserInfoUrl,
  publishFlowUrl,
  getFormJsonURL,
  getTaskInfoUrl,
  startFlowUrl,
  startFlowOnlyUrl,
  getObjectNameInfoUrl,
  getDepartTreeListUrl,
  getSysPositionUrl,
  sysUserInfoSelect2Url
}
