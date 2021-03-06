<!--
 * @Description: 订单管理 / 订单详情.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-03-29 15:08:59
 * @LastEditors: Leo
-->
<template>
  <div class="orderDetail-page">
    <a-card :style="`min-height: ${pageMinHeight}px`"
            v-show="!configshow">
      <!-- header content -->
      <ol class="d-flex flex-wrap mb-30">
        <li v-for="(item, index) in headerContentArr"
            :key="index"
            class="content-item">
          <div class="w30p">
            <div class="icon-wrap d-flex ai-center jc-center"
                 :style="{backgroundColor: item.iconColor}">
              <a-icon :type="item.icon"
                      class="content-icon text-white" />
            </div>
          </div>

          <div class="flex-1 text-right pr-10">
            <p class="fw-700 fz-18">{{item.value}}</p>
            <span class="fz-12 ">{{item.label}}</span>
          </div>
        </li>
      </ol>
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 订单状态 -->
              <a-col :md="12"
                     :sm="24">
                <a-form-model-item label="订单状态"
                                   prop="payOrderStateId">
                  <div class="d-flex pt-4">
                    <a-select style="width: 100%"
                              v-model="form.payOrderStateId"
                              allowClear
                              placeholder="请选择">
                      <a-select-option v-for="(item,index) in payOrderStateList"
                                       :key="index"
                                       :value="item.id">
                        {{item.name}}
                      </a-select-option>
                    </a-select>
                    <a-input v-model="form.description"
                             class="ml-10"
                             allowClear
                             :maxLength="30"
                             placeholder="请输入订单描述"></a-input>
                  </div>
                </a-form-model-item>
              </a-col>
              <!-- 查询、重置、收起 -->
              <span style="float: right; margin-top: 3px;">
                <a-button @click="reset">重置</a-button>
                <a-button type="primary"
                          style="margin-left: 8px"
                          @click="searchTableData">查询</a-button>
                <!-- <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->
              </span>
            </a-row>
          </div>

        </a-form-model>
      </div>
      <!-- table -->
      <standard-table :columns="columns"
                      rowKey="id"
                      :dataSource="dataSource"
                      :loading="tableLoading"
                      :pagination="pagination"
                      @change="handleTableChange">
        <div slot="action"
             slot-scope="{record}">
          <a-button size="small"
                    class="mr-12"
                    @click="openAlarm(record.id, record.isRefund)"
                    type="primary">查看</a-button>
          <a-button size="small"
                    @click="refund(record.id)"
                    v-if="record.isRefund"
                    type="danger">退款</a-button>
        </div>
      </standard-table>
    </a-card>

    <!-- 详情config -->
    <OrderConfig ref="orderConfig"
                 :configshow="configshow"
                 @closeConfig='closeConfig'
                 @searchTableData='searchTableData'></OrderConfig>

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
import { mapState, mapGetters } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import OrderConfig from "./OrderConfig";
import OrderRefundModal from "./OrderRefundModal";
import { getTableData, initData, orderDetail } from "@/services/order";

// table columns data
const columns = [
  {
    title: "订单号",
    dataIndex: "outTradeNo",
  },
  {
    title: "订单信息",
    dataIndex: "description",
  },
  {
    title: "业务类型",
    dataIndex: "businessType",
  },
  {
    title: "状态",
    dataIndex: "tradeStateDesc",
    // scopedSlots: { customRender: "action" }
  },
  {
    title: "支付金额",
    dataIndex: "payerTotal",
  },
  {
    title: "下单时间",
    dataIndex: "createTime",
  },
  {
    title: "支付时间",
    dataIndex: "payTime",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "orderDetail",
  components: { StandardTable, OrderConfig, OrderRefundModal },
  data() {
    return {
      advanced: true,
      tableLoading: false,
      configshow: false,
      columns: columns,
      dataSource: [],
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
        pageSizeOptions: ["10", "15", "20"],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 19, offset: 1 },
      form: {
        payOrderStateId: undefined,
        description: undefined,
      },
      // 搜索项校验规则
      rules: {},
      payOrderStateList: [],
      dayIncome: "", // 今日收入
      monthIncome: "", // 月收入
      yearIncome: "", // 年收入
      monthIsPayOrderCount: "", // 已支付订单数
      monthNotIsPayOrderCount: "", // 未支付订单数

      headerContentArr: [
        {
          label: "今日收入",
          value: "",
          icon: "pay-circle",
          iconColor: "#00d6b8",
        },
        {
          label: "月收入",
          value: "",
          icon: "money-collect",
          iconColor: "#f9cb00",
        },
        {
          label: "月订单总数",
          value: "",
          icon: "shopping-cart",
          iconColor: "#8e47ff",
        },
        {
          label: "月未支付订单",
          value: "",
          icon: "shopping-cart",
          iconColor: "#ff076a",
        },
        {
          label: "年度收入",
          value: "",
          icon: "fund",
          iconColor: "#0095ff",
        },
      ],
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"]),
  },
  created() {
    // this.getInitData();
  },
  methods: {
    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    // 获取初始化数据
    getInitData() {
      initData().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data.queryData.records;
          this.pagination.total = result.data.queryData.total;
          this.payOrderStateList = result.data.payOrderStateList;
          this.headerContentArr[0].value = result.data.dayIncome;
          this.headerContentArr[1].value = result.data.monthIncome;
          this.headerContentArr[2].value = result.data.monthIsPayOrderCount;
          this.headerContentArr[3].value = result.data.monthNotIsPayOrderCount;
          this.headerContentArr[4].value = result.data.yearIncome;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    /**
     * @description: 打开详情页
     * @param : id{int}
     * @param : isRefund{boolean} 是否允许退款
     * @return {*}
     * @author: Leo
     */
    async openAlarm(id, isRefund) {
      await this.orderConfigDetail(id);
      this.configshow = true;
      this.$refs.orderConfig.setOpenType(id, isRefund);
    },

    // 查看返显数据
    orderConfigDetail(id) {
      this.$refs.loading.openLoading("数据查询中，请稍后。。");
      orderDetail({ id }).then((res) => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$refs.orderConfig.contentData[0].value = result.data.outTradeNo
            ? result.data.outTradeNo
            : ""; // 订单号
          this.$refs.orderConfig.contentData[1].value = result.data.description
            ? result.data.description
            : ""; // 订单
          this.$refs.orderConfig.contentData[2].value = result.data.businessType
            ? result.data.businessType
            : ""; // 业务类型
          this.$refs.orderConfig.contentData[3].value = result.data
            .tradeStateDesc
            ? result.data.tradeStateDesc
            : ""; // 订单状态
          this.$refs.orderConfig.contentData[4].value = result.data.payerTotal
            ? result.data.payerTotal
            : ""; // 订单金额
          this.$refs.orderConfig.contentData[5].value = result.data.createTime
            ? result.data.createTime
            : ""; // 下单时间
          this.$refs.orderConfig.contentData[6].value = result.data.payTime
            ? result.data.payTime
            : ""; // 支付时间
          this.$refs.orderConfig.contentData[7].value = result.data.refereeName
            ? result.data.refereeName
            : ""; // 姓名
          this.$refs.orderConfig.contentData[8].value = result.data.identityCard
            ? result.data.identityCard
            : ""; // 身份证号
          this.$refs.orderConfig.contentData[9].value = result.data.telPhone
            ? result.data.telPhone
            : ""; // 手机号
          if (result.data.wxSerialNumber) {
            this.$refs.orderConfig.contentData[10].value =
              result.data.wxSerialNumber;
            this.$refs.orderConfig.contentData[10].isShow = true;
          } else {
            this.$refs.orderConfig.contentData[10].value = "";
            this.$refs.orderConfig.contentData[10].isShow = false;
          }
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      getTableData(data)
        .then((res) => {
          const result = res.data;
          if (result.code === 0) {
            this.dataSource = result.data.records;
            this.pagination.total = result.data.total;
          } else {
            this.$message.error(result.desc);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },

    // 退款
    refund(id) {
      this.$refs.orderRefundModal.setOpenType(id);
    },

    // 分页
    handleTableChange(pagination) {
      let { current, pageSize } = pagination;
      this.pagination.pageSize = pageSize;
      this.pagination.pageNo = current;
      this.searchTableData();
    },

    // 重置分页数据
    resetPagination() {
      this.pagination.pageSize = 10;
      this.pagination.total = 0;
    },

    // 重置
    reset() {
      this.$refs.ruleForm.resetFields();
      this.resetPagination();
      this.configshow = false;
    },

    // 关闭详情config
    closeConfig() {
      this.configshow = false;
    },
  },
  // 监听页面离开事件， 清空页面数据
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.reset();
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getInitData();
    });
  },
};
</script>

<style lang="less" scoped>
.content-item {
  display: flex;
  width: 18%;
  min-width: 164px;
  border: 2px solid #f4f4f4;
  border-radius: 8px;
  margin-right: 2%;
  min-height: 100px;
  align-items: center;
  padding-left: 10px;
  text-align: center;
  margin-bottom: 10px;
  background-color: #f4f4f4;
  @media screen and (max-width: 1160px) {
    width: 23%;
    margin-right: 2%;
  }
  .icon-wrap {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .content-icon {
    font-size: 26px;
  }
}
</style>