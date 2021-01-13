/* 更新小程序 */
import { APPLETTABLEDATA, APPLETUPDATEVERSION } from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(APPLETTABLEDATA, METHOD.GET, data);
}

// 更新小程序最新版本
export async function updateAppletVersion(data) {
  return request(APPLETUPDATEVERSION, METHOD.POST, data);
}
