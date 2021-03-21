<!--
 * @Description: 订单管理 / 订单详情.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-21 16:39:59
 * @LastEditors: Leo
-->
<template>
  <div class="orderDetail-page">
    <a-card :style="`min-height: ${pageMinHeight}px`"
            v-show="!configshow">
      <!-- header content -->
      <ol class="d-flex mb-30">
        <li v-for="(item, index) in headerContentArr"
            :key="index"
            class="content-item">
          <div class="h40 lh-40 d-flex ai-center jc-center">
            <a-icon :type="item.icon"
                    class="fz-20"
                    :style="{color: item.iconColor}" />
            <span class="ml-10">{{item.label}}</span>
          </div>
          <p class="fw-700 fz-16">{{item.value}}</p>
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
            </a-row>
          </div>
          <!-- 查询、重置、收起 -->
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary"
                      @click="searchTableData">查询</a-button>
            <a-button style="margin-left: 8px"
                      @click="reset">重置</a-button>
            <!-- <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->
          </span>
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
          <a-popconfirm title="是否确定退款?"
                        ok-text="确定"
                        v-if="record.isRefund"
                        cancel-text="取消"
                        @confirm="refund(record.id)"
                        @cancel="cancel">
            <a-button size="small"
                      type="danger">退款</a-button>
          </a-popconfirm>
        </div>
      </standard-table>
    </a-card>

    <!-- 详情config -->
    <OrderConfig ref="orderConfig"
                 :configshow="configshow"
                 @closeConfig='closeConfig'
                 @searchTableData='searchTableData'></OrderConfig>

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
import {
  getTableData,
  initData,
  orderRefund,
  orderDetail
} from "@/services/order";

// table columns data
const columns = [
  {
    title: "订单号",
    dataIndex: "outTradeNo"
  },
  {
    title: "订单信息",
    dataIndex: "description"
  },
  {
    title: "业务类型",
    dataIndex: "businessType"
  },
  {
    title: "状态",
    dataIndex: "tradeStateDesc"
    // scopedSlots: { customRender: "action" }
  },
  {
    title: "支付金额",
    dataIndex: "payerTotal"
  },
  {
    title: "下单时间",
    dataIndex: "createTime"
  },
  {
    title: "支付时间",
    dataIndex: "payTime"
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "orderDetail",
  components: { StandardTable, OrderConfig },
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
        showTotal: total => `共 ${total} 条数据`
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 19, offset: 1 },
      form: {
        payOrderStateId: undefined,
        description: undefined
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
          iconColor: "orange"
        },
        {
          label: "月收入",
          value: "",
          icon: "money-collect",
          iconColor: "orange"
        },
        {
          label: "订单总数（月）",
          value: "",
          icon: "shopping-cart",
          iconColor: "red"
        },
        {
          label: "未支付订单（月）",
          value: "",
          icon: "shopping-cart",
          iconColor: "gray"
        },
        {
          label: "年度收入",
          value: "",
          icon: "money-collect",
          iconColor: "red"
        }
      ]
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"])
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
      initData().then(res => {
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
      orderDetail({ id }).then(res => {
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
        pageSize: this.pagination.pageSize
      };
      this.tableLoading = true;
      getTableData(data)
        .then(res => {
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
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      orderRefund({ id })
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
    }
  },
  // 监听页面离开事件， 清空页面数据
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.reset();
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getInitData();
    });
  }
};
</script>

<style lang="less" scoped>
.content-item {
  flex: 1;
  border: 2px solid #d9d9d9;
  border-radius: 6px;
  margin-right: 30px;
  min-height: 100px;
  text-align: center;
}
</style>