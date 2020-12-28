import Mock from "mockjs";

let arr = [
  {
    title: "国家教练员培训",
    type: "培训",
    status: "报名中",
    applyNumber: "10",
    applyTime: "2020-12-05 至 2020-12-31",
    trainTime: "2021-01-01 至 2021-01-09",
    id: 1,
  },
];

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/apply/query`, "get", () => {
  let result = {};
  result.code = 0;
  result.data = arr;
  result.total = arr.length;
  return result;
});
