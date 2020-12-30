<!--
 * @Description: 教学管理 / 教学列表.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-29 18:17:42
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
              <!-- 赛事名称 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="赛事名称"
                                   prop="name">
                  <a-input v-model="form.name"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入赛事名称"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 报名状态 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="报名状态"
                                   prop="applyStatus">
                  <a-select style="width: 100%"
                            v-model="form.applyStatus"
                            allowClear
                            placeholder="请选择">
                    <a-select-option v-for="(item,index) in applyStatusList"
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
          <div slot="action"
               slot-scope="{record}">
            <a class="mr-12"
               @click="openAlarm(1, record.id)">修改
            </a>
            <a class="mr-12 text-orange"
               @click="openGameTime(record.id)">赛事日程</a>
            <a class="mr-12 text-green"
               @click="downloadText(record.id)">秩序册</a>
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
                     :treeData="treeData"
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
  rolesTreeList,
  deleteUserInfo,
  initUserDetail
} from "@/services/usersManagement";
import EducationConfig from "./EducationConfig";

// table columns data
const columns = [
  {
    title: "记录ID",
    dataIndex: "sequenceNumber"
  },
  {
    title: "赛事名称",
    dataIndex: "name"
  },
  {
    title: "状态",
    dataIndex: "account"
  },
  {
    title: "报名球队",
    dataIndex: "mobile"
  },
  {
    title: "报名时间",
    dataIndex: "createTime"
  },
  {
    title: "比赛时间",
    dataIndex: "updateTime"
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
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
      treeData: [],
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
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      form: {
        name: undefined,
        applyStatus: undefined
      },
      // 搜索项校验规则
      rules: {
        name: [],
        applyStatus: []
      },
      applyStatusList: [
        { label: "未开始", value: 0 },
        { label: "报名中", value: 1 },
        { label: "已结束", value: 2 }
      ]
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
    }
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色tree list
    getRolesList() {
      rolesTreeList().then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.treeData = result.data.roleModels;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

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
      initUserDetail(id).then(res => {
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
            state: result.data.state.toString()
          };
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 赛事日程
    openGameTime() {},

    //秩序册
    downloadText() {},

    // 删除
    deleteInfo(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteUserInfo(id).then(res => {
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
        pageSize: this.pagination.pageSize
      };
      this.tableLoading = true;
      getUsersTableData(data).then(res => {
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
    }
  },
  // 监听页面离开事件， 清空页面数据
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.reset();
    }
    next();
  }
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>