//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
module.exports = {
  /* 登录 */

  // LOGIN: `${BASE_URL}/login`, // 登录
  ROUTES: `${BASE_URL}/routes`, // 获取menu菜单

  LOGIN: `${BASE_URL}/login/go`, // 登录
  // ROUTES: `${BASE_URL}/home`, // 获取menu菜单
  LOGINVERIFYCODE: `${BASE_URL}/login/verifyCode/image`, // 获取图形验证码
  LOGINSMSCODE: `${BASE_URL}/login/verifyCode/sms`, // 获取手机验证码
  LOGINBYPHONE: `${BASE_URL}/loginByPhone`, // 手机号登录

  /* 报名管理 */
  // 培训
  TRAINTABLEDATA: `${BASE_URL}/enducationJoin/query`, // table查询
  TRAININFOTABLE: `${BASE_URL}/enducationJoin/viewDetail`, // 查看裁判二级table查询
  REFEREEDETAIL: `${BASE_URL}/enducationJoin/refereeViewDetail`, // 查看裁判详细
  REFEREEDELETE: `${BASE_URL}/enducationJoin/refereeDetailDel`, // 删除裁判信息
  REFEREESEXPOTR: `${BASE_URL}/enducationJoin/exportDetail`, // 导出裁判信息

  /* 赛事管理 */
  // 赛事列表
  COMPETITIONTABLEDATA: `${BASE_URL}/games/select`, // table查询
  COMPETITIONADD: `${BASE_URL}/games/add`, // 赛事列表新增
  COMPETITIONDETAIL: `${BASE_URL}/games/detail`, // 修改初始化，返显数据
  COMPETITIONUPDATE: `${BASE_URL}/games/update`, // 修改
  COMPETITIONDELETE: `${BASE_URL}/games/delete`, // 删除
  COMPETITIONUPLOAD: `${BASE_URL}/games/api/file/upload/oss`, // 上传url

  // 邀请码
  CODETABLEDATA: `${BASE_URL}/enducationInvitationCode/query`, // table查询
  CODEADD: `${BASE_URL}/enducationInvitationCode/add`, // 新增
  CODEINITDATA: `${BASE_URL}/enducationInvitationCode/initMod`, // 修改初始化，返显数据
  CODEUPDATE: `${BASE_URL}/enducationInvitationCode/mod`, // 修改
  CODEDELETE: `${BASE_URL}/enducationInvitationCode/delete`, // 删除

  /* 教学管理 */

  ENDUCATIONTABLEDATA: `${BASE_URL}/enducation/query`, // table查询
  ENDUCATIONTYPELIST: `${BASE_URL}/enducation/initAdd`, // 获取列表数据
  ENDUCATIONUPLOAD: `${BASE_URL}/enducation/upload/img`, // 上传图片
  ENDUCATIONADDHOTEL: `${BASE_URL}/enducation/initAddHotel`, // 新增酒店
  ENDUCATIONADD: `${BASE_URL}/enducation/add`, // 新增
  ENDUCATIONINITDATA: `${BASE_URL}/enducation/initMod`, // 修改初始化，返显数据
  ENDUCATIONUPDATE: `${BASE_URL}/enducation/mod`, // 修改数据
  ENDUCATIONDELETE: `${BASE_URL}/enducation/delete`, // 删除数据

  /* 焦点图管理 */
  BANNERTABLEDATA: `${BASE_URL}/focus/query`, // table查询
  BANNERTYPELIST: `${BASE_URL}/focus/initAdd`, // 获取类型列表
  BANNERUPLOAD: `${BASE_URL}/focus/upload/img`, // 上传图片
  BANNERADD: `${BASE_URL}/focus/add`, // 新增
  BANNERINITDATA: `${BASE_URL}/focus/initMod`, // 修改初始化，返显数据
  BANNERUPDATE: `${BASE_URL}/focus/mod`, // 修改数据
  BANNERDELETE: `${BASE_URL}/focus/delete` // 删除数据
};
