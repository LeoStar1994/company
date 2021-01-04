<!--
 * @Description: 报名管理 / 培训
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-04 10:48:48
 * @LastEditors: Leo
-->
<template>
  <div class="train-page">
    <a-card :style="`min-height: ${pageMinHeight}px`"
            v-show="!configshow">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 标题 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="标题"
                                   prop="educationName">
                  <a-input v-model="form.educationName"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入标题"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 报名状态 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="报名状态"
                                   prop="enrollStatus">
                  <a-select style="width: 100%"
                            v-model="form.enrollStatus"
                            allowClear
                            placeholder="请选择">
                    <a-select-option v-for="(item,index) in enrollStatusList"
                                     :key="index"
                                     :value="item.value">
                      {{item.label}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 查询、重置、收起 -->
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary"
                      @click="searchTableData()">查询</a-button>
            <a-button style="margin-left: 8px"
                      @click="reset">重置</a-button>
            <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form-model>
      </div>
      <div>
        <!-- table -->
        <standard-table :columns="columns"
                        rowKey="id"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        @change="handleTableChange">
          <div slot="mapEnrollType"
               slot-scope="{text}">
            {{mapEnrollType[text]}}
          </div>
          <div slot="mapEnrollStatus"
               slot-scope="{text}">
            {{mapEnrollStatus[text]}}
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a class="mr-12"
               @click="openInfosTable(record.id)">查看
            </a>
          </div>
        </standard-table>
      </div>
    </a-card>
    <!-- 详情config -->
    <InfosTable ref="infosTable"
                :configshow="configshow"
                @closeConfig="closeConfig"></InfosTable>
    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import { getTrainTableData } from "@/services/train";
import InfosTable from "./InfosTable";

// table columns data
const columns = [
  {
    title: "记录ID",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "educationName",
  },
  {
    title: "类型",
    dataIndex: "enrollType",
    scopedSlots: { customRender: "mapEnrollType" },
  },
  {
    title: "状态",
    dataIndex: "enrollStatus",
    scopedSlots: { customRender: "mapEnrollStatus" },
  },
  {
    title: "报名人数",
    dataIndex: "enrollCount",
  },
  {
    title: "报名时间",
    dataIndex: "enrollTimeStr",
  },
  {
    title: "培训时间",
    dataIndex: "educationTimeStr",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "Train",
  components: { StandardTable, InfosTable },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
      tableLoading: false,
      configshow: false, // 二级table显隐
      columns: columns,
      dataSource: [],
      // infoTableData: [], // 二级table data
      // 分页
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
        pageSizeOptions: ["10", "15", "20"],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      enrollStatusList: [
        { label: "未开始", value: 1 },
        { label: "报名中", value: 2 },
        { label: "已结束", value: 3 },
      ],
      form: {
        educationName: undefined,
        enrollStatus: undefined,
      },
      // 搜索项校验规则
      rules: {
        educationName: [],
        enrollStatus: [],
      },
      mapEnrollType: {
        1: "培训",
        2: "考试",
      },
      mapEnrollStatus: {
        1: "未开始",
        2: "报名者",
        3: "已结束",
      },
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      if (!this.configshow) {
        return this.$t("description");
      } else if (this.$refs.infosTable.detailShow) {
        return this.$t("detailDesc");
      } else {
        return this.$t("configDesc");
      }
    },
  },
  created() {},
  methods: {
    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    /**
     * @description: 打开培训详情table
     * @param : id{int}
     * @return {*}
     * @author: Leo
     */
    async openInfosTable(id) {
      this.$refs.infosTable.setLastSerachData({ ...this.form, id });
      await this.$refs.infosTable.searchTableData();
      this.configshow = true;
    },

    // 查看 | 修改返显数据
    // infosTableDetail(id) {
    //   this.$refs.loading.openLoading("数据查询中，请稍后。。");
    //   getInfosTableData(id)
    //     .then(res => {
    //       this.$refs.loading.closeLoading();
    //       const result = res.data;
    //       if (result.code === 0) {
    //         this.infoTableData = [];
    //       } else {
    //         this.$message.error(result.desc);
    //       }
    //     })
    //     .catch(() => {
    //       this.$refs.loading.closeLoading();
    //     });
    // },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      getTrainTableData(data).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data.records;
          this.pagination.total = result.data.total;
        }
        this.tableLoading = false;
      });
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
      // this.dataSource = [];
      this.resetPagination();
      this.configshow = false;
      this.$refs.infosTable.detailShow = false;
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
};
</script>
