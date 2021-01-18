<!--
 * @Description: 报名管理 / 赛事
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-18 20:22:15
 * @LastEditors: Leo
-->
<template>
  <div class="competition-page">
    <a-card v-show="!configshow"
            :style="`min-height: ${pageMinHeight}px`">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 赛事名称 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="赛事名称"
                                   prop="hockeyGamesName">
                  <a-input v-model="form.hockeyGamesName"
                           allowClear
                           :maxLength="30"
                           placeholder="请输入赛事名称"></a-input>
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
            <!-- <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->
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
          <div slot="status"
               slot-scope="{text}">
            {{enrollStatusMapObj[text]}}
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a-button class="mr-12"
                      type="primary"
                      size="small"
                      @click="openInfosTable(record.id)">查看
            </a-button>
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
import { getTableData } from "@/services/competition";
import InfosTable from "./InfosTable";

// table columns data
const columns = [
  // {
  //   title: "记录ID",
  //   dataIndex: "id"
  // },
  {
    title: "赛事名称",
    dataIndex: "hockeyGamesName",
  },
  {
    title: "状态",
    dataIndex: "enrollStatus",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "报名球队",
    dataIndex: "enrollCount",
  },
  {
    title: "报名时间",
    dataIndex: "enrollStartEndTime",
  },
  {
    title: "比赛时间",
    dataIndex: "gameStartEndTime",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "Competition",
  components: { StandardTable, InfosTable },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
      tableLoading: false,
      configshow: false, // 二级table显隐
      columns: columns,
      dataSource: [],
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
        { label: "未开始", value: 0 },
        { label: "报名中", value: 1 },
        { label: "比赛中", value: 2 },
        { label: "已结束", value: 3 },
      ],
      enrollStatusMapObj: {
        0: "未开始",
        1: "报名中",
        2: "比赛中",
        3: "已结束",
      },
      form: {
        hockeyGamesName: undefined,
        enrollStatus: undefined,
      },
      // 搜索项校验规则
      rules: {
        hockeyGamesName: [],
        enrollStatus: [],
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
     * @description: 打开球队table
     * @param : id{int}
     * @return {*}
     * @author: Leo
     */
    async openInfosTable(id) {
      this.$refs.infosTable.setLastSerachData(id);
      await this.$refs.infosTable.searchTableData();
      this.configshow = true;
    },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      getTableData(data).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data.list;
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.searchTableData();
    });
  },
};
</script>
