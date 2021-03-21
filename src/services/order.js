/* 订单列表 */
import {
  ORDERTABLEDATA,
  ORDERINITDATA,
  ORDERREFUND,
  ORDERDETAIL
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @param data {Object}
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(ORDERTABLEDATA, METHOD.GET, data);
}

// 查看详情
export async function orderDetail(data) {
  return request(ORDERDETAIL, METHOD.GET, data);
}

// 初始化
export async function initData(data) {
  return request(ORDERINITDATA, METHOD.GET, data);
}

// 退款
export async function orderRefund(data) {
  return request(ORDERREFUND, METHOD.GET, data);
}
