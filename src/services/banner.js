/* 动捕用户 */
import {
  BANNERTABLEDATA,
  BANNERTYPELIST,
  BANNERUPLOAD,
  BANNERADD,
  BANNERINITDATA,
  BANNERUPDATE,
  BANNERDELETE,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(BANNERTABLEDATA, METHOD.POST, data);
}

// 获取新增type list
export async function getTypeList() {
  return request(BANNERTYPELIST, METHOD.GET);
}

// 上传图片
export async function uploadBannerImage(data) {
  return request(BANNERUPLOAD, METHOD.POST, data);
}

// 新增
export async function addBanner(data) {
  return request(BANNERADD, METHOD.POST, data);
}

// 修改
export async function updateBanner(data) {
  return request(BANNERUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initBannerData(params) {
  return request(BANNERINITDATA + `/${params}`, METHOD.GET);
}

// 删除
export async function deleteBanner(id) {
  return request(BANNERDELETE, METHOD.DELETE, id);
}
