/* 赛事列表 */
import {
  COMPETITIONTABLEDATA,
  COMPETITIONADD,
  COMPETITIONDETAIL,
  COMPETITIONUPDATE,
  COMPETITIONDELETE,
  COMPETITIONUPLOAD,
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
