<!--
 * @Description: 赛事管理 / 赛事列表 / 赛事日程table
 * @Author: Leo
 * @Date: 2020-12-25 11:00:00
 * @LastEditTime: 2021-01-14 11:25:58
 * @LastEditors: Leo
-->
<template>
  <div class="competitionSchedule-page"
       v-if="scheduleShow">
    <a-card v-show="!scoreShow"
            :style="`min-height: ${pageMinHeight}px`">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="scheduleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 竞赛组别 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="竞赛组别"
                                   prop="gameGrade">
                  <a-select style="width: 100%"
                            v-model="form.gameGrade"
                            allowClear
                            placeholder="请选择">
                    <a-select-option v-for="(item,index) in gameGradeList"
                                     :key="index"
                                     :value="item">
                      {{item}}
                    </a-select-option>
                  </a-select>
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
          <a-button @click="goBackTrain"
                    class="mr-10"
                    type="primary">返回上一页</a-button>
          <a-button @click="openAlarm(0)"
                    class="mr-10"
                    type="primary">新增</a-button>
        </div>
        <!-- table -->
        <standard-table :columns="columns"
                        rowKey="id"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        @change="handleTableChange">
          <div slot="infoName"
               slot-scope="{text}">
            <img src="../../../assets/img/logo_icon.jpg"
                 width="40px"
                 alt="">
            <span class="ml-6">{{text}}</span>
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a class="mr-12"
               @click="openAlarm(1, record.id)">修改
            </a>
            <a class="mr-12 text-green"
               @click="uploadVideo(record.id)">上传视频
            </a>
            <a class="mr-12 text-orange"
               @click="scoreAdd(record)">成绩录入
            </a>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteDetails(record.id)"
                          @cancel="deletecancel">
              <a href="#"
                 class="text-red">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>

    <!-- 新增 | 修改赛事日程 -->
    <ScheduleConfig ref="scheduleConfig"
                    @searchTableData="searchTableData"
                    :gameGradeList="gameGradeList"
                    :teamsList="teamsList"></ScheduleConfig>

    <!-- 成绩录入 -->
    <ScoreDetailConfig ref="scoreDetailConfig"
                       :scoreShow="scoreShow"
                       :infoData="infoData"
                       @closeDetail="closeDetail"></ScoreDetailConfig>

    <!-- 上传视频 -->
    <UploadVideoTableModal ref="uploadVideoTableModal"></UploadVideoTableModal>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import ScheduleConfig from "./ScheduleConfig";
import ScoreDetailConfig from "./ScoreDetailConfig";
import UploadVideoTableModal from "./UploadVideoTableModal";
import {
  getScheduleTableData,
  initScheduleData,
  deleteSchedule,
} from "@/services/competitionList";

// table columns data
const columns = [
  {
    title: "序号",
    dataIndex: "num",
  },
  {
    title: "主队",
    dataIndex: "homeTeamName",
  },
  {
    title: "客队",
    dataIndex: "awayTeamName",
  },
  {
    title: "场次",
    dataIndex: "gameSessions",
  },
  {
    title: "竞赛组别",
    dataIndex: "gameGrade",
    // scopedSlots: { customRender: "checkStatus" }
  },
  {
    title: "比分",
    dataIndex: "socre",
  },
  {
    title: "比赛时间",
    dataIndex: "gameTime",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

// scoreDetail table columns
const shootRecordColumns = [
  {
    title: "序号",
    dataIndex: "order",
  },
  {
    title: "时间",
    dataIndex: "scoreTime",
  },
  {
    title: "射中",
    dataIndex: "scoreNum",
  },
  {
    title: "一助",
    dataIndex: "firstAssistsNum",
  },
  {
    title: "二助",
    dataIndex: "secondAssistsNum",
  },
  {
    title: "守门员",
    dataIndex: "goalkeeperNum",
  },
  {
    title: "对阵",
    dataIndex: "against",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
const penaltyRecordColumns = [
  {
    title: "序号",
    dataIndex: "order",
  },
  {
    title: "号码",
    dataIndex: "num",
  },
  {
    title: "分钟",
    dataIndex: "min",
  },
  {
    title: "事件时间",
    dataIndex: "actionTime",
  },
  {
    title: "判罚原因",
    dataIndex: "reason",
  },
  {
    title: "判罚时间",
    dataIndex: "penaltyTime",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
  },
  {
    title: "结束结束",
    dataIndex: "endTime",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
const freeKickColumns = [
  {
    title: "序号",
    dataIndex: "order",
  },
  {
    title: "号码",
    dataIndex: "scoreNum",
  },
  {
    title: "对方守门员",
    dataIndex: "keeperNum",
  },
  {
    title: "是否射中",
    dataIndex: "scoreResult",
    scopedSlots: { customRender: "scoreResultMap" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "CompetitionSchedule",
  components: {
    StandardTable,
    ScheduleConfig,
    ScoreDetailConfig,
    UploadVideoTableModal,
  },
  props: {
    scheduleShow: {
      type: Boolean,
      default: false,
    },
    gameGradeList: {
      type: Array,
      default: new Array(),
    },
    teamsList: {
      type: Array,
      default: new Array(),
    },
  },
  data() {
    return {
      // 成绩录入data
      infoData: {
        //赛事数据
        gameList: [],
        refereeInfoList: [],
        homeTeamData: {
          // 射中记录
          shootRecordColumns: shootRecordColumns,
          shootRecordTableData: [],
          // 判罚记录
          penaltyRecordColumns: penaltyRecordColumns,
          penaltyRecordTableData: [],
          // 任意球
          freeKickColumns: freeKickColumns,
          freeKickTableData: [],
        },
        guestTeamData: {
          // 射中记录
          shootRecordColumns: shootRecordColumns,
          shootRecordTableData: [],
          // 判罚记录
          penaltyRecordColumns: penaltyRecordColumns,
          penaltyRecordTableData: [],
          // 任意球
          freeKickColumns: freeKickColumns,
          freeKickTableData: [],
        },
      },
      advanced: true,
      tableLoading: false,
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
      wrapperCol1: { span: 22, offset: 1 },
      form: {
        gameGrade: undefined,
        teamName: undefined,
        hockeyGamesId: null,
      },
      // 搜索项校验规则
      rules: {
        gameGrade: [],
        teamName: [],
      },
      scoreShow: false,
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  created() {},
  methods: {
    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    setLastPageData(hockeyGamesId) {
      this.form.hockeyGamesId = hockeyGamesId;
    },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      getScheduleTableData(data)
        .then((res) => {
          const result = res.data;
          if (result.code === 0) {
            this.dataSource = result.data.list;
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
      this.$refs.scheduleForm.resetFields();
      // this.dataSource = [];
      this.resetPagination();
    },

    // 新增 | 修改竞赛日程
    async openAlarm(type, id) {
      if (type === 1) {
        await this.getScheduleData(id);
      }
      this.$refs.scheduleConfig.setOpenType(type, id, this.form.hockeyGamesId);
      this.$refs.scheduleConfig.placeList = [
        { label: "比赛场地", prop: "place", place: "" },
      ];
    },

    // 修改竞赛日程反显数据
    getScheduleData(id) {
      this.$refs.loading.openLoading("数据查询中，请稍后。。");
      initScheduleData({ id }).then((res) => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$refs.scheduleConfig.scheduleConfigForm = {
            ...result.data,
            place: result.data.place.join(),
          };
          this.$refs.scheduleConfig.placeList = result.data.place.map(
            (item, index) => {
              if (index === 0) {
                return { label: "比赛场地", prop: "place", place: item };
              } else {
                return { label: "", place: item };
              }
            }
          );
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 上传视频
    uploadVideo(id) {
      this.$refs.uploadVideoTableModal.setOpenType(id);
    },

    // 成绩录入
    scoreAdd(data) {
      this.infoData.gameList = [
        {
          label: "场次",
          value: `第${data.num}场`,
          span: 1,
        },
        {
          label: "地点",
          value: data.gameSessions,
          span: 1,
        },
        {
          label: "比赛日期",
          value: data.gameTime,
          span: 1,
        },
        {
          label: "竞赛组别",
          value: data.gameGrade,
          span: 1,
        },
        {
          label: "主队",
          value: data.homeTeamName,
          span: 2,
        },
        {
          label: "客队",
          value: data.awayTeamName,
          span: 2,
        },
      ];
      this.scoreShow = true;
      this.$refs.scoreDetailConfig.setLastPageData(data);
    },

    // 成绩录入关闭
    closeDetail() {
      this.scoreShow = false;
    },

    // 删除
    deleteDetails(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteSchedule(id)
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

    // 返回上一页
    goBackTrain() {
      this.reset();
      this.$emit("closeSchedule");
    },
  },
};
</script>
