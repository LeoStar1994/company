/* 教学管理 */
import {
  EDUCATIONTABLEDATA,
  EDUCATIONTYPELIST,
  EDUCATIONUPLOAD,
  EDUCATIONADDHOTEL,
  EDUCATIONADD,
  EDUCATIONINITDATA,
  EDUCATIONUPDATE,
  EDUCATIONDELETE,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(EDUCATIONTABLEDATA, METHOD.POST, data);
}

// 获取新增type list
export async function getTypeList() {
  return request(EDUCATIONTYPELIST, METHOD.GET);
}

// 上传图片
export async function uploadImage(data) {
  return request(EDUCATIONUPLOAD, METHOD.POST, data);
}

// 新增酒店
export async function addHotel(data) {
  return request(EDUCATIONADDHOTEL, METHOD.POST, data);
}

// 新增
export async function addEducation(data) {
  return request(EDUCATIONADD, METHOD.POST, data);
}

// 修改
export async function updateEducation(data) {
  return request(EDUCATIONUPDATE, METHOD.POST, data);
}

// 查看 | 修改返显数据
export async function initEducationData(params) {
  return request(EDUCATIONINITDATA + `/${params}`, METHOD.GET);
}

// 删除
export async function deleteEducation(id) {
  return request(EDUCATIONDELETE, METHOD.DELETE, id);
}
