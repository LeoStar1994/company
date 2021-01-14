/* 培训 | 赛事 */
import {
  TRCPTABLEDATA,
  TEAMTABLE,
  TEAMINFODETAIL,
  TEAMDELETE,
  TEAMEXPOTR,
  TEAMEUDIT,
  BASEINFOUPDATE,
  OFFICERUPDATE,
  PLAYERUPDATE,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * 赛事table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(TRCPTABLEDATA, METHOD.GET, data);
}

/**
 * 球队table查询
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getInfosTableData(data) {
  return request(TEAMTABLE, METHOD.GET, data);
}

/**
 * 审核是否通过
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function changeCheckStatus(data) {
  return request(TEAMEUDIT, METHOD.POST, data);
}

/**
 * 球队信息
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTeamDetail(data) {
  return request(TEAMINFODETAIL, METHOD.GET, data);
}

/**
 * 球队删除
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function deleteTeam(id) {
  return request(TEAMDELETE, METHOD.DELETE, id);
}

/**
 * 球队导出
 * @param id {int}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function exportTeam(data) {
  return request(TEAMEXPOTR, METHOD.GET, data, "blob");
}

// 基础信息修改
export async function baseInfoUpdate(data) {
  return request(BASEINFOUPDATE, METHOD.POST, data);
}

// 官员信息修改
export async function officerUpdate(data) {
  return request(OFFICERUPDATE, METHOD.POST, data);
}

// 运动员信息修改
export async function playerUpdate(data) {
  return request(PLAYERUPDATE, METHOD.POST, data);
}
