<!--
 * @Description: 小程序管理 / 更新小程序.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-20 16:11:01
 * @LastEditors: Leo
-->
<template>
  <div class="appletUpdate-page">
    <a-card :style="`min-height: ${pageMinHeight}px`">
      <!-- table -->
      <standard-table :columns="columns"
                      rowKey="appid"
                      :dataSource="dataSource"
                      :loading="tableLoading">
        <div slot="appletIcon"
             slot-scope="{text}">
          <img :src="text"
               class="w26 h26"
               alt="图标">
        </div>
        <div slot="action"
             slot-scope="{record}">
          <a-popconfirm title="是否升级到最新版本?"
                        ok-text="确定"
                        cancel-text="取消"
                        v-if="isShowButtonUpgrade"
                        @confirm="updateVersion(record.userIdentify)"
                        @cancel="cancel">
            <a-button size="small"
                      type="primary">升级版本</a-button>
          </a-popconfirm>
        </div>
      </standard-table>
    </a-card>
    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import { getTableData, updateAppletVersion } from "@/services/applet";

// table columns data
const columns = [
  {
    title: "图标",
    dataIndex: "headImg",
    scopedSlots: { customRender: "appletIcon" },
  },
  {
    title: "小程序名称",
    dataIndex: "nickName",
  },
  {
    title: "上一个线上版本",
    dataIndex: "lastUserVersion",
  },
  {
    title: "当前版本号",
    dataIndex: "nowUserVersion",
  },
  {
    title: "当前体验版",
    dataIndex: "testerUserVersion",
  },
  {
    title: "可升级的版本号",
    dataIndex: "msgUpdateUserVersion",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "AppletUpdate",
  components: { StandardTable },
  i18n: require("./i18n"),
  data() {
    return {
      tableLoading: false,
      columns: columns,
      dataSource: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      isShowButtonUpgrade: true,
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    ...mapGetters("account", ["user"]),
    // page header desc
    desc() {
      return this.$t("description");
    },
  },
  created() {
    this.searchTableData();
  },
  methods: {
    // 列表查询
    searchTableData() {
      const data = { userIdentify: this.user.userIdentify };
      this.tableLoading = true;
      getTableData(data)
        .then((res) => {
          const result = res.data;
          if (result.code === 0) {
            this.dataSource = [{ ...result.data }];
            this.isShowButtonUpgrade = result.data.isShowButtonUpgrade;
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },

    // 升级版本
    updateVersion(userIdentify) {
      const data = { userIdentify: this.user.userIdentify };
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      updateAppletVersion(data)
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

    cancel() {
      this.$message.warning("操作已取消");
    },
  },
};
</script>

