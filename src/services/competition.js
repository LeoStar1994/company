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
  BASEINFOINIT,
  OFFICERINIT,
  PLAYERINIT,
  GETYEARTYPELIST,
  GETDICINITDATA,
  GETGAMEGRADEDATA,
  OFFICERDELETE,
  PLAYERDELETE,
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

// 获取字典表所有下拉list data
export async function getAllDicData(data) {
  return request(GETDICINITDATA, METHOD.GET, data);
}
export async function getGameGradeData(data) {
  return request(GETGAMEGRADEDATA, METHOD.GET, data);
}
// 通过赛事id获取球队基础信息年龄组下拉list
export async function getYearTypeList(hockeyGamesId) {
  return request(GETYEARTYPELIST + `/${hockeyGamesId}`, METHOD.GET);
}

// 获取球队基础信息
export async function getBaseData(teamId) {
  return request(BASEINFOINIT + `/${teamId}`, METHOD.GET);
}
// 球队基础信息修改
export async function baseInfoUpdate(data) {
  return request(BASEINFOUPDATE, METHOD.POST, data);
}

// 获取官员信息
export async function getOfficerData(teamId, trainId) {
  return request(OFFICERINIT + `/${teamId}/${trainId}`, METHOD.GET);
}
// 官员信息修改
export async function officerUpdate(data) {
  return request(OFFICERUPDATE, METHOD.POST, data);
}
// 官员信息删除
export async function deleteOfficer(data) {
  return request(OFFICERDELETE, METHOD.POST, data);
}

// 获取运动员信息
export async function getPlayerData(teamId, detailId) {
  return request(PLAYERINIT + `/${teamId}/${detailId}`, METHOD.GET);
}
// 运动员信息修改
export async function playerUpdate(data) {
  return request(PLAYERUPDATE, METHOD.POST, data);
}
// 运动员信息删除
export async function deletePlayer(data) {
  return request(PLAYERDELETE, METHOD.POST, data);
}
