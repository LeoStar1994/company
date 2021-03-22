<!--
 * @Description: 角色管理详情
 * @Author: Leo
 * @Date: 2020-12-25 11:00:00
 * @LastEditTime: 2021-01-25 17:45:30
 * @LastEditors: Leo
-->
<template>
  <div class="orderConfig-page"
       v-if="configshow">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <div style="width: 400px;">
        <h3 class="pl-10">订单管理 > 订单详情</h3>
        <!-- 内容详情 -->
        <ul class="content my-20">
          <li v-for="(item,index) in contentData"
              :key="index"
              class="h30 lh-30 d-flex">
            <span class="text-right w80 d-block">{{item.label}}：</span>
            <span :class="[(item.value === '已支付' || item.value === '支付成功') ? 'text-blue': '', (item.value === '已退款' || item.label === '订单金额') ? 'text-red': '']">{{item.value}}</span>
          </li>
        </ul>
        <!-- 按钮 -->
        <div class="buttons pl-10">
          <a-popconfirm title="是否确定退款?"
                        ok-text="确定"
                        cancel-text="取消"
                        v-if="isRefund"
                        @confirm="refund"
                        class="mr-10"
                        @cancel="cancel">
            <a-button type="danger">退款</a-button>
          </a-popconfirm>
          <a-button @click="comeBack">返回</a-button>
        </div>
      </div>
    </a-card>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { orderRefund } from "@/services/order";

export default {
  name: "OrderConfig",
  props: {
    configshow: {
      type: Boolean,
      default: false
    }
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
          value: ""
        },
        {
          label: "订单",
          value: ""
        },
        {
          label: "业务类型",
          value: ""
        },
        {
          label: "订单状态",
          value: ""
        },
        {
          label: "订单金额",
          value: ""
        },
        {
          label: "下单时间",
          value: ""
        },
        {
          label: "支付时间",
          value: ""
        },
        {
          label: "姓名",
          value: ""
        },
        {
          label: "身份证号",
          value: ""
        },
        {
          label: "手机号",
          value: ""
        }
      ]
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"])
  },
  created() {},
  methods: {
    setOpenType(id, isRefund) {
      this.id = id;
      this.isRefund = isRefund;
    },

    // 退款
    refund() {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      orderRefund(this.id)
        .then(res => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.searchTableData();
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    cancel() {
      this.$message.warning("操作已取消");
    },

    // 返回
    comeBack() {
      this.$emit("closeConfig");
    }
  }
};
</script>

<style lang="less" scoped>
</style>