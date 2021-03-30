<!--
 * @Description: 角色管理详情
 * @Author: Leo
 * @Date: 2020-12-25 11:00:00
 * @LastEditTime: 2021-03-29 19:03:07
 * @LastEditors: Leo
-->
<template>
  <div class="orderConfig-page"
       v-if="configshow">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <div>
        <h3 class="pl-10">订单管理 > 订单详情</h3>
        <!-- 内容详情 -->
        <ul class="content my-20">
          <li v-for="(item,index) in contentData"
              v-show="item.isShow"
              :key="index"
              class="h30 lh-30 d-flex">
            <span class="text-right w90 d-block">{{item.label}}：</span>
            <span :class="[(item.value === '已支付' || item.value === '支付成功') ? 'text-blue': '', (item.value === '已退款' || item.label === '订单金额' || item.label === '退款流水号') ? 'text-red': '']">{{item.value}}</span>
          </li>
        </ul>
        <!-- 按钮 -->
        <div class="buttons pl-10">
          <a-button @click="refund"
                    class="mr-10"
                    v-if="isRefund"
                    type="danger">退款</a-button>
          <a-button @click="comeBack">返回</a-button>
        </div>
      </div>
    </a-card>

    <!-- 退款弹框 -->
    <OrderRefundModal ref="orderRefundModal"
                      @searchTableData='searchTableData'></OrderRefundModal>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OrderRefundModal from "./OrderRefundModal";

export default {
  name: "OrderConfig",
  props: {
    configshow: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    OrderRefundModal,
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      id: null,
      isRefund: false,
      contentData: [
        {
          label: "订单号",
          value: "",
          isShow: true,
        },
        {
          label: "订单",
          value: "",
          isShow: true,
        },
        {
          label: "业务类型",
          value: "",
          isShow: true,
        },
        {
          label: "订单状态",
          value: "",
        },
        {
          label: "订单金额",
          value: "",
          isShow: true,
        },
        {
          label: "下单时间",
          value: "",
          isShow: true,
        },
        {
          label: "支付时间",
          value: "",
          isShow: true,
        },
        {
          label: "姓名",
          value: "",
          isShow: true,
        },
        {
          label: "身份证号",
          value: "",
          isShow: true,
        },
        {
          label: "手机号",
          value: "",
          isShow: true,
        },
        {
          label: "退款流水号",
          value: "",
          isShow: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  created() {},
  methods: {
    setOpenType(id, isRefund) {
      this.id = id;
      this.isRefund = isRefund;
    },

    // 退款
    refund() {
      this.$refs.orderRefundModal.setOpenType(this.id);
    },

    searchTableData() {
      this.$emit("closeConfig");
      this.$emit("searchTableData");
    },

    // 返回
    comeBack() {
      this.$emit("closeConfig");
    },
  },
};
</script>
