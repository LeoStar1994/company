/* 邀请码 */
import {
  CODETABLEDATA,
  CODEADD,
  CODEINITDATA,
  CODEUPDATE,
  CODEDELETE
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(CODETABLEDATA, METHOD.POST, data);
}

// 新增
export async function addCode(data) {
  return request(CODEADD, METHOD.POST, data);
}

// 修改
export async function updateCode(data) {
  return request(CODEUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initCodeData(params) {
  return request(CODEINITDATA + `/${params}`, METHOD.GET);
}

// 删除
export async function deleteCode(id) {
  return request(CODEDELETE, METHOD.DELETE, id);
}
