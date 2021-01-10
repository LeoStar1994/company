<!--
 * @Description: 赛事管理 / 赛事列表.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-05 12:17:03
 * @LastEditors: Leo
-->
<template>
  <div class="competition-page">
    <a-card :style="`min-height: ${pageMinHeight}px`"
            v-show="!configshow && !scheduleShow">
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
                           :maxLength="10"
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
            <a class="mr-12"
               @click="openAlarm(1, record.id)">修改
            </a>
            <a class="mr-12 text-orange"
               @click="openSchedule(record.id)">赛事日程</a>
            <a class="mr-12 text-green"
               @click="downloadText(record.id)">秩序册</a>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteInfo(record.id)"
                          @cancel="deletecancel">
              <a href="#"
                 class="text-red">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
    <!-- 新增 | 修改详情config -->
    <CompetitionConfig ref="competitionConfig"
                       :configshow="configshow"
                       :treeData="treeData"
                       @closeConfig='closeConfig'
                       @searchTableData='searchTableData'></CompetitionConfig>

    <!-- 赛事日程page -->
    <CompetitionSchedule ref="competitionSchedule"
                         :scheduleShow="scheduleShow"
                         :gameGradeList="gameGradeList"
                         :teamsList="teamsList"
                         @closeSchedule="closeSchedule"></CompetitionSchedule>

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
  getTableData,
  initGameData,
  deleteGame,
  exportGameWord,
  gameGradeList,
  gameTeamsList
} from "@/services/competitionList";
import CompetitionConfig from "./CompetitionConfig";
import CompetitionSchedule from "./CompetitionSchedule";
import { downloadFile } from "@/utils/util";

// table columns data
const columns = [
  {
    title: "记录ID",
    dataIndex: "id"
  },
  {
    title: "赛事名称",
    dataIndex: "hockeyGamesName"
  },
  {
    title: "状态",
    dataIndex: "enrollStatus",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "报名球队",
    dataIndex: "enrollCount"
  },
  {
    title: "报名时间",
    dataIndex: "enrollStartEndTime"
  },
  {
    title: "比赛时间",
    dataIndex: "gameStartEndTime"
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "CompetitionList",
  components: { StandardTable, CompetitionConfig, CompetitionSchedule },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
      tableLoading: false,
      configshow: false, // 新增config 显隐
      scheduleShow: false, // 赛事日程显隐
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
        enrollStatus: undefined,
        hockeyGamesName: undefined
      },
      // 搜索项校验规则
      rules: {
        enrollStatus: [],
        hockeyGamesName: []
      },
      enrollStatusList: [
        { label: "未开始", value: 0 },
        { label: "报名中", value: 1 },
        { label: "比赛中", value: 2 },
        { label: "已结束", value: 3 }
      ],
      enrollStatusMapObj: {
        0: "未开始",
        1: "报名中",
        2: "比赛中",
        3: "已结束"
      },
      gameGradeList: [],
      teamsList: []
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      if (this.configshow) {
        return this.$t("configDesc");
      } else if (this.scheduleShow) {
        return this.$t("scheduleDesc");
      } else {
        return this.$t("description");
      }
    }
  },
  created() {},
  methods: {
    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    /**
     * @description: 打开详情页
     * @param : status{int} 0: 新增， 1: 修改
     * @param : id{int}
     * @return {*}
     * @author: Leo
     */
    async openAlarm(status, id) {
      if (status === 1) {
        await this.competitionConfig(id);
      }
      this.configshow = true;
      this.$refs.competitionConfig.setOpenType(status, id);
    },

    // 查看 | 修改返显数据
    competitionConfig(id) {
      this.$refs.loading.openLoading("数据查询中，请稍后。。");
      initGameData({ id }).then(res => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.$refs.competitionConfig.form = {
            ...result.data,
            gameGrade: result.data.gameGradeList,
            gameRuleName: result.data.gameRuleVoList.map(
              item => item.gameRuleName
            ),
            gameRulePath: result.data.gameRuleVoList.map(
              item => item.gameRulePath
            )
          };
          this.$refs.competitionConfig.gameRulefileList = result.data.gameRuleVoList.map(
            item => {
              return {
                uid: Math.random(),
                status: "done",
                name: item.gameRuleName
              };
            }
          ); // 竞赛规程file list
          this.$refs.competitionConfig.coverPictureList = [
            {
              uid: Math.random(),
              name: "image.png",
              status: "done",
              url: result.data.imageUrl
            }
          ];
          this.$refs.competitionConfig.sharePictureList = [
            {
              uid: Math.random(),
              name: "image1.png",
              status: "done",
              url: result.data.shareImageUrl
            }
          ];
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 赛事日程
    async openSchedule(hockeyGamesId) {
      await this.getGameGradeList(hockeyGamesId);
      await this.getTeamsList(hockeyGamesId);
      this.scheduleShow = true;
      this.$refs.competitionSchedule.setLastPageData(hockeyGamesId);
      this.$refs.competitionSchedule.searchTableData();
    },

    // 获取赛事日程 => 赛事组别list
    getGameGradeList(hockeyGamesId) {
      gameGradeList({ hockeyGamesId }).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.gameGradeList = result.data;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 获取赛事日程 => 参赛队伍list
    getTeamsList(hockeyGamesId) {
      gameTeamsList({ hockeyGamesId }).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.teamsList = result.data;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    //秩序册
    downloadText(hockeyGameId) {
      const data = { hockeyGameId };
      exportGameWord(data).then(res => {
        if (res.status === 200 && res.data) {
          let filename = "";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, "");
              console.log();
            }
          }
          downloadFile(res.data, filename);
        }
      });
    },

    // 删除
    deleteInfo(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteGame(id).then(res => {
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
      getTableData(data).then(res => {
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
      this.dataSource = [];
      this.resetPagination();
      this.configshow = false;
      this.scheduleShow = false;
      if (this.configshow) {
        this.$refs.competitionConfig.resetForm();
      }
    },

    // 关闭详情config
    closeConfig() {
      this.configshow = false;
    },

    // 关闭赛事 page
    closeSchedule() {
      this.scheduleShow = false;
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

