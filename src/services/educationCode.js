/* 教学邀请码 */
import {
  EDUCATIONCODETABLEDATA,
  EDUCATIONCODEADD,
  EDUCATIONCODEINITDATA,
  EDUCATIONCODEUPDATE,
  EDUCATIONCODEDELETE,
  EDUCATIONCODINITCODE
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(EDUCATIONCODETABLEDATA, METHOD.POST, data);
}

// 生成邀请码
export async function getCode(data) {
  return request(EDUCATIONCODINITCODE, METHOD.GET, data);
}

// 新增
export async function addCode(data) {
  return request(EDUCATIONCODEADD, METHOD.POST, data);
}

// 修改
export async function updateCode(data) {
  return request(EDUCATIONCODEUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initCodeData(params) {
  return request(EDUCATIONCODEINITDATA + `/${params}`, METHOD.GET);
}

// 删除
export async function deleteCode(id) {
  return request(EDUCATIONCODEDELETE, METHOD.DELETE, id);
}
