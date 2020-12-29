<!--
 * @Description: 赛事管理 / 邀请码.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-29 17:13:01
 * @LastEditors: Leo
-->
<template>
  <div class="invitationCode-page">
    <a-card :style="`min-height: ${pageMinHeight}px`">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 邀请码 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="邀请码"
                                   prop="code">
                  <a-input v-model="form.code"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入邀请码"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 球队名称 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="球队名称"
                                   prop="teamName">
                  <a-input v-model="form.teamName"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入球队名称"></a-input>
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
        <!-- operator -->
        <div class="operator">
          <a-button @click="openAlarm(0)"
                    class="mr-10"
                    type="primary">新增邀请码</a-button>
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
            <a class="mr-12"
               @click="openAlarm(1, record.sequenceNumber)">修改</a>
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
    <!-- 新增 | 修改弹框 -->
    <CodeConfig ref="codeConfig"></CodeConfig>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import CodeConfig from "./CodeConfig";

// table columns data
const columns = [
  {
    title: "邀请码ID",
    dataIndex: "sequenceNumber",
  },
  {
    title: "邀请码",
    dataIndex: "name",
  },
  {
    title: "球队名称",
    dataIndex: "createTime",
  },
  {
    title: "联系人",
    dataIndex: "updateTime",
  },
  {
    title: "使用状态",
    dataIndex: "state",
  },
  {
    title: "昵称",
    dataIndex: "state1",
  },
  {
    title: "关联时间",
    dataIndex: "time",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "train",
  components: { StandardTable, CodeConfig },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
      tableLoading: false,
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
        teamName: undefined,
        code: undefined,
      },
      // 搜索项校验规则
      rules: {
        teamName: [],
        code: [],
      },
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      return this.$t("description");
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
     * @param : status{int} 0: 新增， 1:修改
     * @param : id{int}
     * @return {*}
     * @author: Leo
     */
    async openAlarm(status, id) {
      console.log(id);
      if (status === 1 || status === 2) {
        // await this.roleConfigDetail(id);
      }
      this.$refs.codeConfig.setOpenType(status);
    },

    // 查看 | 修改返显数据
    roleConfigDetail(id) {
      console.log(id);
      // this.$refs.loading.openLoading("数据查询中，请稍后。。");
      // initRoleDetail(id).then((res) => {
      //   this.$refs.loading.closeLoading();
      //   const result = res.data;
      //   if (result.code === 0) {
      //     this.$message.success(result.desc);
      //     this.$refs.roleConfig.form = {
      //       name: result.data.name,
      //       remark: result.data.remark,
      //       selectedMenusList: result.data.selectedMenusList,
      //       state: result.data.state.toString(),
      //     };
      //   } else {
      //     this.$message.error(result.desc);
      //   }
      // });
    },

    // 删除
    deleteInfo(id) {
      console.log(id);
      // this.$refs.loading.openLoading("操作进行中，请稍后。。");
      // deleteRoleInfo(id).then((res) => {
      //   this.$refs.loading.closeLoading();
      //   const result = res.data;
      //   if (result.code === 0) {
      //     this.$message.success(result.desc);
      //     this.searchTableData();
      //   } else {
      //     this.$message.error(result.desc);
      //   }
      // });
    },

    deletecancel() {
      this.$message.warning("删除操作已取消");
    },

    // 列表查询
    searchTableData() {
      // const data = {
      //   ...this.form,
      //   pageNo: this.pagination.pageNo,
      //   pageSize: this.pagination.pageSize,
      // };
      // this.tableLoading = true;
      // getTrainTableData(data).then((res) => {
      //   const result = res.data;
      //   if (result.code === 0) {
      //     this.dataSource = result.data.records;
      //     this.pagination.total = result.data.total;
      //   }
      //   this.tableLoading = false;
      // });
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
