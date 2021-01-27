<!--
 * @Description: 焦点图管理 / 焦点图列表.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-25 14:21:14
 * @LastEditors: Leo
-->
<template>
  <div class="bannerList-page">
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
              <!-- 名称 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="名称"
                                   prop="focusTitle">
                  <a-input v-model="form.focusTitle"
                           allowClear
                           :maxLength="30"
                           placeholder="请输入名称"></a-input>
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
        <!-- operator -->
        <div class="operator">
          <a-button @click="openAlarm(0)"
                    class="mr-10"
                    type="primary">新增图片</a-button>
        </div>
        <!-- table -->
        <standard-table :columns="columns"
                        rowKey="id"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        @change="handleTableChange">
          <div slot="imageUrl"
               slot-scope="{text}">
            <img :src="text"
                 width="200"
                 alt="图片">
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a-button class="mr-12"
                      size="small"
                      type="primary"
                      @click="openAlarm(1, record.id)">修改</a-button>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteInfo(record.id)"
                          @cancel="deletecancel">
              <a-button size="small"
                        type="danger">删除</a-button>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
    <!-- 详情config -->
    <BannerConfig ref="BannerConfig"
                  @searchTableData="searchTableData"></BannerConfig>
    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import { getTableData, initBannerData, deleteBanner } from "@/services/banner";
import BannerConfig from "./BannerConfig";

// table columns data
const columns = [
  // {
  //   title: "图片ID",
  //   dataIndex: "id"
  // },
  {
    title: "名称",
    dataIndex: "focusTitle",
  },
  {
    title: "图片",
    dataIndex: "imageUrl",
    scopedSlots: { customRender: "imageUrl" },
  },
  {
    title: "有效期",
    dataIndex: "periodOfValidity",
  },
  {
    title: "顺序",
    dataIndex: "sortNum",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "BannerList",
  components: { StandardTable, BannerConfig },
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
        focusTitle: undefined,
      },
      // 搜索项校验规则
      rules: {
        focusTitle: [],
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
      if (status === 1) {
        await this.bannerDetails(id);
      }
      this.$refs.BannerConfig.setOpenType(status, id);
    },

    // 修改返显数据
    bannerDetails(id) {
      this.$refs.loading.openLoading("数据查询中，请稍后。。");
      initBannerData(id)
        .then((res) => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.$refs.BannerConfig.form = {
              focusTitle: result.data.focusTitle,
              imagePath: result.data.imagePath,
              linkUrl: result.data.linkUrl,
              action: result.data.action,
              appid: result.data.appid,
              pageKey: result.data.pageKey,
              sortNum: result.data.sortNum,
              startTime: result.data.startTime,
              endTime: result.data.endTime,
              id: result.data.id,
            };
            this.$refs.BannerConfig.pictureList = [
              {
                uid: Math.random(),
                name: "image.png",
                status: "done",
                url: result.data.imagePath,
              },
            ];
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    // 删除
    deleteInfo(id) {
      console.log(id);
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteBanner(id)
        .then((res) => {
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
      getTableData(data)
        .then((res) => {
          const result = res.data;
          if (result.code === 0) {
            this.dataSource = result.data.records;
            this.pagination.total = result.data.total;
          }
          this.tableLoading = false;
        })
        .catch(() => {
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

