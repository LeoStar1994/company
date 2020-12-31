<!--
 * @Description: 教学管理 / 教学列表.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-31 10:33:22
 * @LastEditors: Leo
-->
<template>
  <div class="educationList-page">
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
                           :maxLength="20"
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
                      @click="searchTableData">查询</a-button>
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
        <!-- operator -->
        <div class="operator">
          <a-button @click="openAlarm(0)"
                    class="mr-10"
                    type="primary">新增赛事</a-button>
        </div>
        <!-- table -->
        <standard-table :columns="columns"
                        rowKey="sequenceNumber"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        @change="handleTableChange">
          <div slot="mapStatus"
               slot-scope="{text}">
            {{mapStatusObj[text]}}
          </div>
          <div slot="mapType"
               slot-scope="{text}">
            {{mapTypeObj[text]}}
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a class="mr-12"
               @click="openAlarm(1, record.id)">修改
            </a>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteInfo(record.sequenceNumber)"
                          @cancel="deletecancel">
              <a href="#"
                 class="text-red">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
    <!-- 详情config -->
    <EducationConfig ref="educationConfig"
                     :configshow="configshow"
                     @closeConfig='closeConfig'
                     @searchTableData='searchTableData'>
    </EducationConfig>
    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import {
  getUsersTableData,
  deleteUserInfo,
  initUserDetail,
} from "@/services/usersManagement";
import EducationConfig from "./EducationConfig";

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
    scopedSlots: { customRender: "mapType" },
  },
  {
    title: "状态",
    dataIndex: "enrollStatus",
    scopedSlots: { customRender: "mapStatus" },
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
  name: "EducationList",
  components: { StandardTable, EducationConfig },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
      tableLoading: false,
      configshow: false, // 新增config 显隐
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
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      form: {
        educationName: undefined,
        enrollStatus: undefined,
      },
      // 搜索项校验规则
      rules: {
        educationName: [],
        enrollStatus: [],
      },
      enrollStatusList: [
        { label: "未开始", value: 1 },
        { label: "报名中", value: 2 },
        { label: "已结束", value: 3 },
      ],
      mapTypeObj: {
        1: "培训",
        2: "考试",
      },
      mapStatusObj: {
        1: "未开始",
        2: "报名中",
        3: "已结束",
      },
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      if (this.configshow) {
        return this.$t("configDesc");
      } else {
        return this.$t("description");
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
     * @description: 打开详情页
     * @param : status{int} 0: 新增， 1:查看， 2:修改
     * @param : id{int}
     * @return {*}
     * @author: Leo
     */
    async openAlarm(status, id) {
      if (status === 1 || status === 2) {
        await this.userConfigDetail(id);
      }
      this.configshow = true;
      this.$refs.educationConfig.setOpenType(status, id);
    },

    // 查看 | 修改返显数据
    userConfigDetail(id) {
      this.$refs.loading.openLoading("数据查询中，请稍后。。");
      initUserDetail(id).then((res) => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.$refs.userConfig.form = {
            name: result.data.name,
            account: result.data.account,
            mobile: result.data.mobile,
            password: result.data.password,
            remark: result.data.remark,
            roles: result.data.roles,
            state: result.data.state.toString(),
          };
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 删除
    deleteInfo(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteUserInfo(id).then((res) => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.searchTableData();
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    deletecancel() {
      this.$message.warning("删除操作已取消");
    },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      getUsersTableData(data).then((res) => {
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
      this.dataSource = [];
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
};
</script>