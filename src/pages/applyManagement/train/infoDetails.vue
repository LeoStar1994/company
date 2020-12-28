<!--
 * @Description: 详细信息页
 * @Author: Leo
 * @Date: 2020-12-28 16:56:50
 * @LastEditTime: 2020-12-28 18:01:18
 * @LastEditors: Leo
-->
<template>
  <div class="infoDetails-page"
       v-if="detailShow">
    <a-card :style="`min-height: ${pageMinHeight}px`">
      123
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

// table columns data
const columns = [
  {
    title: "记录ID",
    dataIndex: "id",
  },
  {
    title: "姓名",
    dataIndex: "name",
    scopedSlots: { customRender: "infoName" },
  },
  {
    title: "性别",
    dataIndex: "sex",
  },
  {
    title: "出生日期",
    dataIndex: "birthday",
  },
  {
    title: "手机号",
    dataIndex: "mobile",
  },
  {
    title: "现裁判等级",
    dataIndex: "applyTime",
  },
  {
    title: "工作单位",
    dataIndex: "workplace",
  },
  {
    title: "身份证号",
    dataIndex: "identityCard",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "InfosDetails",
  props: {
    detailShow: {
      type: Boolean,
      default: false,
    },
    infoData: {
      type: Object,
      required: true,
      default: new Object(),
    },
  },
  data() {
    return {
      columns: columns,
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  created() {},
  methods: {
    // 返回上一级页面
    goBack() {
      this.$emit("closeDetail");
    },
  },
};
</script>

<style lang="less" scoped>
.infoDetails-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  margin-top: 24px;
}
</style>