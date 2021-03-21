/* 培训 */
import {
  TRAINTABLEDATA,
  TRAININFOTABLE,
  REFEREEDETAIL,
  REFEREEDELETE,
  REFEREESEXPOTR,
  REFEREEAUDIT,
  REFEREEUPLOAD,
  EXPOTRTTEMPLATE
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * 培训table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTrainTableData(data) {
  return request(TRAINTABLEDATA, METHOD.POST, data);
}

/**
 * 裁判table查询
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getInfosTableData(data) {
  return request(TRAININFOTABLE, METHOD.POST, data);
}

/**
 * 裁判明细
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getRefereeDetail(id) {
  return request(REFEREEDETAIL + `/${id}`, METHOD.GET);
}

/**
 * 审核通过 | 不通过
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function changeCheckStatus(data) {
  return request(REFEREEAUDIT, METHOD.POST, data);
}

/**
 * 上传证书
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function uploadCertificate(data) {
  return request(REFEREEUPLOAD, METHOD.POST, data);
}

/**
 * 裁判删除
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function deleteReferee(id) {
  return request(REFEREEDELETE + `/${id}`, METHOD.GET);
}

/**
 * 裁判导出
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function exportReferee(id) {
  return request(REFEREESEXPOTR + `/${id}`, METHOD.GET, null, "blob");
}

/**
 * 裁判证书模板导出
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function exportTemplate(id) {
  return request(EXPOTRTTEMPLATE + `/${id}`, METHOD.GET, null, "blob");
}
