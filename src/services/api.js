//跨域代理前缀
// const API_PROXY_PREFIX = "/api";
// const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? process.env.VUE_APP_API_BASE_URL
//     : API_PROXY_PREFIX;
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
module.exports = {
  /* 登录 */

  // LOGIN: `${BASE_URL}/login`, // 登录
  // ROUTES: `${BASE_URL}/routes`, // 获取menu菜单

  LOGIN: `${BASE_URL}/login/go`, // 登录
  ROUTES: `${BASE_URL}/home`, // 获取menu菜单
  LOGINVERIFYCODE: `${BASE_URL}/login/verifyCode/image`, // 获取图形验证码
  LOGINSMSCODE: `${BASE_URL}/login/verifyCode/sms`, // 获取手机验证码
  LOGINBYPHONE: `${BASE_URL}/login/goMobile`, // 手机号登录

  /* 权限设置 */
  // 用户管理
  USERSTABLEDATA: `${BASE_URL}/BSSuser/query`, // table查询
  USERSROLESTREE: `${BASE_URL}/BSSuser/initAdd`, // 新增初始化，获取角色tree
  USERSADD: `${BASE_URL}/BSSuser/add`, // 新增
  USERSINITDATA: `${BASE_URL}/BSSuser/initMod`, // 修改初始化，返显数据
  USERSUPDATE: `${BASE_URL}/BSSuser/mod`, // 修改数据
  USERSCHANGESTATE: `${BASE_URL}/BSSuser/modState`, // 启用 | 停用
  USERSDELETE: `${BASE_URL}/BSSuser/delete`, // 删除数据

  // 角色管理
  ROLETABLEDATA: `${BASE_URL}/BSSRole/query`, // table查询
  ROLETREE: `${BASE_URL}/BSSRole/initAdd`, // 新增初始化，获取角色tree
  ROLEADD: `${BASE_URL}/BSSRole/add`, // 新增
  ROLEINITDATA: `${BASE_URL}/BSSRole/initMod`, // 修改初始化，返显数据
  ROLEUPDATE: `${BASE_URL}/BSSRole/mod`, // 修改数据
  ROLECHANGESTATE: `${BASE_URL}/BSSRole/modState`, // 启用 | 停用
  ROLEDELETE: `${BASE_URL}/BSSRole/delete`, // 删除数据

  /* 报名管理 */
  // 培训
  TRAINTABLEDATA: `${BASE_URL}/enducationJoin/query`, // table查询
  TRAININFOTABLE: `${BASE_URL}/enducationJoin/viewDetail`, // 查看裁判二级table查询
  REFEREEDETAIL: `${BASE_URL}/enducationJoin/refereeViewDetail`, // 查看裁判详细
  REFEREEDELETE: `${BASE_URL}/enducationJoin/refereeDetailDel`, // 删除裁判信息
  REFEREESEXPOTR: `${BASE_URL}/enducationJoin/exportDetail`, // 导出裁判信息

  // 赛事
  TRCPTABLEDATA: `${BASE_URL}/games/select`, // table查询
  TEAMTABLE: `${BASE_URL}/games/join/team/list`, // 球队二级table查询
  TEAMINFODETAIL: `${BASE_URL}/games/join/team/info`, // 球队信息
  TEAMDELETE: `${BASE_URL}/games/join/team/delete`, // 删除
  TEAMEXPOTR: `${BASE_URL}/games/join/export/excel`, // 导出球队报名表
  TEAMEUDIT: `${BASE_URL}/games/join/team/operation`, // 报名球队审核

  /* 赛事管理 */
  // 赛事列表
  COMPETITIONTABLEDATA: `${BASE_URL}/games/select`, // table查询
  COMPETITIONADD: `${BASE_URL}/games/add`, // 赛事列表新增
  COMPETITIONDETAIL: `${BASE_URL}/games/detail`, // 修改初始化，返显数据
  COMPETITIONUPDATE: `${BASE_URL}/games/update`, // 修改
  COMPETITIONDELETE: `${BASE_URL}/games/delete`, // 删除
  COMPETITIONUPLOAD: `${BASE_URL}/games/api/file/upload/oss`, // 上传url

  // 赛事邀请码
  CODETABLEDATA: `${BASE_URL}/enducationInvitationCode/query`, // table查询
  CODEADD: `${BASE_URL}/enducationInvitationCode/add`, // 新增
  CODEINITDATA: `${BASE_URL}/enducationInvitationCode/initMod`, // 修改初始化，返显数据
  CODEUPDATE: `${BASE_URL}/enducationInvitationCode/mod`, // 修改
  CODEDELETE: `${BASE_URL}/enducationInvitationCode/delete`, // 删除

  /* 教学管理 */
  // 教学列表
  EDUCATIONTABLEDATA: `${BASE_URL}/enducation/query`, // table查询
  EDUCATIONTYPELIST: `${BASE_URL}/enducation/initAdd`, // 获取列表数据
  EDUCATIONUPLOAD: `${BASE_URL}/enducation/upload/img`, // 上传图片
  EDUCATIONADDHOTEL: `${BASE_URL}/enducation/initAddHotel`, // 新增酒店
  EDUCATIONADD: `${BASE_URL}/enducation/add`, // 新增
  EDUCATIONINITDATA: `${BASE_URL}/enducation/initMod`, // 修改初始化，返显数据
  EDUCATIONUPDATE: `${BASE_URL}/enducation/mod`, // 修改数据
  EDUCATIONDELETE: `${BASE_URL}/enducation/delete`, // 删除数据

  // 教学邀请码
  EDUCATIONCODETABLEDATA: `${BASE_URL}/enducationInvitationCode/query`, // table查询
  EDUCATIONCODEADD: `${BASE_URL}/enducationInvitationCode/add`, // 新增
  EDUCATIONCODEINITDATA: `${BASE_URL}/enducationInvitationCode/initMod`, // 修改初始化，返显数据
  EDUCATIONCODEUPDATE: `${BASE_URL}/enducationInvitationCode/mod`, // 修改
  EDUCATIONCODEDELETE: `${BASE_URL}/enducationInvitationCode/delete`, // 删除

  /* 焦点图管理 */
  BANNERTABLEDATA: `${BASE_URL}/focus/query`, // table查询
  BANNERTYPELIST: `${BASE_URL}/focus/initAdd`, // 获取类型列表
  BANNERUPLOAD: `${BASE_URL}/focus/upload/img`, // 上传图片
  BANNERADD: `${BASE_URL}/focus/add`, // 新增
  BANNERINITDATA: `${BASE_URL}/focus/initMod`, // 修改初始化，返显数据
  BANNERUPDATE: `${BASE_URL}/focus/mod`, // 修改数据
  BANNERDELETE: `${BASE_URL}/focus/delete`, // 删除数据
};
