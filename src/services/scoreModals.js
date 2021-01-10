/* 赛事列表 => 赛事日程 => 成绩录入 所有modal api*/
import {
  GAMESRESULTADD,
  GAMESRESULT,
  REFEREEADDORUPDATE,
  REFEREEDATA,
  FREEKICKADD,
  FREEKICKDATA,
  FREEKICKUPDATE,
  PENALTYADD,
  PENALTYDATA,
  PENALTYUPDATE,
  SCOREADD,
  SCOREDATA,
  SCOREUPDATE
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

// 比赛结果新增 | 修改
export async function gamesResultSave(data) {
  return request(GAMESRESULTADD, METHOD.POST, data);
}
// 获取比赛结果
export async function getGamesResult(schedulesId) {
  return request(GAMESRESULT + `/${schedulesId}`, METHOD.GET);
}

// 裁判信息新增 | 修改
export async function refereeInfoSave(data) {
  return request(REFEREEADDORUPDATE, METHOD.POST, data);
}
// 获取裁判信息
export async function getRefereeInfo(schedulesId) {
  return request(REFEREEDATA + `/${schedulesId}`, METHOD.GET);
}

// 任意球新增
export async function freekickAdd(data) {
  return request(FREEKICKADD, METHOD.POST, data);
}
// 任意球修改
export async function freekickUpdate(data) {
  return request(FREEKICKUPDATE, METHOD.POST, data);
}
// 获取任意球记录
export async function getFreekickData(schedulesId, teamId) {
  return request(FREEKICKDATA + `/${schedulesId}/${teamId}`, METHOD.GET);
}

// 判罚记录新增
export async function penaltyAdd(data) {
  return request(PENALTYADD, METHOD.POST, data);
}
// 判罚记录修改
export async function penaltyUpdate(data) {
  return request(PENALTYUPDATE, METHOD.POST, data);
}
// 获取判罚记录
export async function getPenaltyData(schedulesId, teamId) {
  return request(PENALTYDATA + `/${schedulesId}/${teamId}`, METHOD.GET);
}

// 射中记录新增
export async function scoreAdd(data) {
  return request(SCOREADD, METHOD.POST, data);
}
// 射中记录修改
export async function scoreUpdate(data) {
  return request(SCOREUPDATE, METHOD.POST, data);
}
// 获取射中记录
export async function getScoreData(schedulesId, teamId) {
  return request(SCOREDATA + `/${schedulesId}/${teamId}`, METHOD.GET);
}
