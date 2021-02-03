/* 赛事管理 | 赛事列表 */
import {
  COMPETITIONTABLEDATA,
  COMPETITIONADD,
  COMPETITIONDETAIL,
  COMPETITIONUPDATE,
  COMPETITIONDELETE,
  COMPETITIONEXPORT,
  SCHEDULEGRADELIST,
  SCHEDULETEAMSLIST,
  SCHEDULETABLEDATA,
  SCHEDULEADD,
  SCHEDULEUPDATE,
  SCHEDULEINITDATA,
  SCHEDULEDELETE,
  SCHEDULEVIDEOADD,
  SCHEDULEVIDEODELETE,
  SCHEDULEVIDEOTABLEDATA,
  COVERIMAGE,
  SHAREIMAGE,
  GAMERULE,
  VIDEO,
  VIDEOIMAGE,
  OFFICERIMAGE,
  OFFICERCARD,
  TEAMLOGO,
  TEAMIMAGE,
  PLAYERIMAGE,
  PLAYERCARD,
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
/******   上传图片   ********/
// 宣传封面
export async function uploadImageCover(data) {
  return request(COVERIMAGE, METHOD.POST, data);
}
// 竞赛规程
export async function uploadGameRule(data) {
  return request(GAMERULE, METHOD.POST, data);
}
// 分享图片
export async function uploadImageShare(data) {
  return request(SHAREIMAGE, METHOD.POST, data);
}
// 上传视频
export async function uploadVideo(data) {
  return request(VIDEO, METHOD.POST, data);
}
// 上传视频封面图
export async function uploadVideoImage(data) {
  return request(VIDEOIMAGE, METHOD.POST, data);
}
// 上传官员照片
export async function uploadOfficerImage(data) {
  return request(OFFICERIMAGE, METHOD.POST, data);
}
// 上传官员身份证
export async function uploadOfficerCard(data) {
  return request(OFFICERCARD, METHOD.POST, data);
}
// 上传球队logo
export async function uploadTeamLogo(data) {
  return request(TEAMLOGO, METHOD.POST, data);
}
// 上传球队集体照
export async function uploadTeamImage(data) {
  return request(TEAMIMAGE, METHOD.POST, data);
}
// 上传运动员照片
export async function uploadPlayerImage(data) {
  return request(PLAYERIMAGE, METHOD.POST, data);
}
// 上传运动员身份证
export async function uploadPlayerCard(data) {
  return request(PLAYERCARD, METHOD.POST, data);
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

// 导出秩序册
export async function exportGameWord(data) {
  return request(COMPETITIONEXPORT, METHOD.GET, data, "blob", 1200000);
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

// 视频table
export async function getVideoTableData(data) {
  return request(SCHEDULEVIDEOTABLEDATA + `/${data}`, METHOD.GET);
}

// 视频保存
export async function videoSave(data) {
  return request(SCHEDULEVIDEOADD, METHOD.POST, data);
}

// 视频删除
export async function videodelete(data) {
  return request(SCHEDULEVIDEODELETE, METHOD.DELETE, data);
}
