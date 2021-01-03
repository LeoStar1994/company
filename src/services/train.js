/* 培训 */
import {
  TRAINTABLEDATA,
  TRAININFOTABLE,
  REFEREEDETAIL,
  REFEREEDELETE,
  REFEREESEXPOTR
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
  return request(REFEREESEXPOTR + `/${id}`, METHOD.GET);
}
