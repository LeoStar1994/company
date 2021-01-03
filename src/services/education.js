/* 教学管理 */
import {
  ENDUCATIONTABLEDATA,
  ENDUCATIONTYPELIST,
  ENDUCATIONUPLOAD,
  ENDUCATIONADDHOTEL,
  ENDUCATIONADD,
  ENDUCATIONINITDATA,
  ENDUCATIONUPDATE,
  ENDUCATIONDELETE
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(ENDUCATIONTABLEDATA, METHOD.POST, data);
}

// 获取新增type list
export async function getTypeList() {
  return request(ENDUCATIONTYPELIST, METHOD.GET);
}

// 上传图片
export async function uploadImage(data) {
  return request(ENDUCATIONUPLOAD, METHOD.POST, data);
}

// 新增酒店
export async function addHotel(data) {
  return request(ENDUCATIONADDHOTEL, METHOD.POST, data);
}

// 新增
export async function addEducation(data) {
  return request(ENDUCATIONADD, METHOD.POST, data);
}

// 修改
export async function updateEducation(data) {
  return request(ENDUCATIONUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initEducationData(params) {
  return request(ENDUCATIONINITDATA + `/${params}`, METHOD.GET);
}

// 删除
export async function deleteEducation(id) {
  return request(ENDUCATIONDELETE, METHOD.DELETE, id);
}
