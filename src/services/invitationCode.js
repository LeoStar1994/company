/* 赛事邀请码 */
import { CODETABLEDATA, CODEADD, CODEUPDATE, CODEDELETE } from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(CODETABLEDATA, METHOD.GET, data);
}

// 新增
export async function addCode(data) {
  return request(CODEADD, METHOD.POST, data);
}

// 修改
export async function updateCode(data) {
  return request(CODEUPDATE, METHOD.POST, data);
}

// 删除
export async function deleteCode(id) {
  return request(CODEDELETE, METHOD.DELETE, id);
}
