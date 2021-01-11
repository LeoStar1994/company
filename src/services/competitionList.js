/* 赛事管理 | 赛事列表 */
import {
  COMPETITIONTABLEDATA,
  COMPETITIONADD,
  COMPETITIONDETAIL,
  COMPETITIONUPDATE,
  COMPETITIONDELETE,
  COMPETITIONUPLOAD,
  COMPETITIONEXPORT,
  SCHEDULEGRADELIST,
  SCHEDULETEAMSLIST,
  SCHEDULETABLEDATA,
  SCHEDULEADD,
  SCHEDULEUPDATE,
  SCHEDULEINITDATA,
  SCHEDULEDELETE,
  SCHEDULEVIDEO,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(COMPETITIONTABLEDATA, METHOD.GET, data);
}

// 上传图片
export async function uploadImage(data) {
  return request(COMPETITIONUPLOAD, METHOD.POST, data);
}

// 新增
export async function addGame(data) {
  return request(COMPETITIONADD, METHOD.POST, data);
}

// 修改
export async function updateGame(data) {
  return request(COMPETITIONUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initGameData(params) {
  return request(COMPETITIONDETAIL, METHOD.GET, params);
}

// 删除
export async function deleteGame(id) {
  return request(COMPETITIONDELETE, METHOD.DELETE, id);
}

// 导出
export async function exportGameWord(data) {
  return request(COMPETITIONEXPORT, METHOD.GET, data, "blob");
}

/************************** 赛事日程  **************************/

// 获取赛事日程 =>  赛事组别list
export async function gameGradeList(data) {
  return request(SCHEDULEGRADELIST, METHOD.GET, data);
}

// 获取赛事日程 =>  参赛队伍list
export async function gameTeamsList(data) {
  return request(SCHEDULETEAMSLIST, METHOD.GET, data);
}

// 赛事日程table查询
export async function getScheduleTableData(data) {
  return request(SCHEDULETABLEDATA, METHOD.GET, data);
}

// 赛事日程新增
export async function addSchedule(data) {
  return request(SCHEDULEADD, METHOD.POST, data);
}

// 赛事日程修改
export async function updateSchedule(data) {
  return request(SCHEDULEUPDATE, METHOD.POST, data);
}

// 赛事日程修改反显
export async function initScheduleData(data) {
  return request(SCHEDULEINITDATA, METHOD.GET, data);
}

// 删除
export async function deleteSchedule(data) {
  return request(SCHEDULEDELETE, METHOD.DELETE, data);
}

// 视频保存
export async function videoSave(data) {
  return request(SCHEDULEVIDEO, METHOD.POST, data);
}
