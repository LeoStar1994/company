<!--
 * @Description: 赛事管理 / 赛事列表 / 赛事日程 / 成绩录入
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-11 17:26:34
 * @LastEditors: Leo
-->
<template>
  <div class="scoreDetails-page"
       v-if="scoreShow">
    <a-card :style="`min-height: ${pageMinHeight}px`">
      <!-- operator -->
      <div class="operator">
        <a-button @click="goBackScheduleTable"
                  class="mr-10"
                  type="primary">返回上一页</a-button>
      </div>
      <!-- 赛事数据 -->
      <a-descriptions title="赛事数据"
                      :column="4"
                      bordered>
        <a-descriptions-item v-for="(item, index) in infoData.gameList"
                             :key="index"
                             :label="item.label"
                             :span="item.span">
          <span>{{item.value}}</span>
        </a-descriptions-item>
      </a-descriptions>
      <!-- 比赛结果 -->
      <div class="game-result">
        <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">比赛结果</h4>
        <a-button type="primary"
                  class="mb-20 ml-20"
                  @click="openGameResultModal">添加/修改</a-button>
        <ul class="d-flex ai-center jc-center text-center">
          <li class="pt-30">
            <p>总比分</p>
            <p>第一节</p>
            <p>第二节</p>
            <p>第三节</p>
            <p>加时赛</p>
            <p>射门比赛</p>
          </li>
          <li class="w140 fw-700">
            <h3>{{homeTeamName}}</h3>
            <p>{{gameResultForm.allHome}}</p>
            <p>{{gameResultForm.firstSectionHome}}</p>
            <p>{{gameResultForm.secondSectionHome}}</p>
            <p>{{gameResultForm.thirdSectionHome}}</p>
            <p>{{gameResultForm.extraTimeHome}}</p>
            <p>{{gameResultForm.shootMatchHome}}</p>
          </li>
          <li class="pt-30 fw-700">
            <p>:</p>
            <p>:</p>
            <p>:</p>
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </li>
          <li class="w140 fw-700">
            <h3>{{guestTeamName}}</h3>
            <p>{{gameResultForm.allAway}}</p>
            <p>{{gameResultForm.firstSectionAway}}</p>
            <p>{{gameResultForm.secondSectionAway}}</p>
            <p>{{gameResultForm.thirdSectionAway}}</p>
            <p>{{gameResultForm.extraTimeAway}}</p>
            <p>{{gameResultForm.shootMatchAway}}</p>
          </li>

        </ul>
      </div>
      <!-- 裁判信息 -->
      <div class="referee-info">
        <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">裁判信息</h4>
        <a-button type="primary"
                  class="mb-20 ml-20"
                  @click="openRefereeModal">添加/修改</a-button>
        <a-descriptions :column="3"
                        bordered>
          <a-descriptions-item v-for="(item, index) in infoData.refereeInfoList"
                               :key="index"
                               :label="item.label"
                               :span="item.span">
            <span>{{item.value}}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <!-- 主队 -->
      <div class="home-team">
        <h2 class="ant-descriptions-title mt-40">主队：{{homeTeamName}}</h2>
        <!-- 射中记录 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">射中记录</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openShootRecordModal(0, 0)">添加记录</a-button>
          <standard-table :columns="infoData.homeTeamData.shootRecordColumns"
                          rowKey="id"
                          :pagination="false"
                          :dataSource="infoData.homeTeamData.shootRecordTableData"
                          bordered>
            <div slot="action"
                 slot-scope="{record}">
              <a class="mr-12"
                 @click="openShootRecordModal(1, 0, record)">修改
              </a>
            </div>
          </standard-table>
        </div>
        <!-- 判罚记录 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">判罚记录</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openPenaltyRecordModal(0, 0)">添加记录</a-button>
          <standard-table :columns="infoData.homeTeamData.penaltyRecordColumns"
                          rowKey="id"
                          :pagination="false"
                          :dataSource="infoData.homeTeamData.penaltyRecordTableData"
                          bordered>
            <div slot="action"
                 slot-scope="{record}">
              <a class="mr-12"
                 @click="openPenaltyRecordModal(1, 0, record)">修改
              </a>
            </div>
          </standard-table>
        </div>
        <!-- 任意球 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">任意球</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openFreeKickModal(0, 0)">添加记录</a-button>
          <standard-table :columns="infoData.homeTeamData.freeKickColumns"
                          rowKey="id"
                          :pagination="false"
                          bordered
                          :dataSource="infoData.homeTeamData.freeKickTableData">
            <div slot="scoreResultMap"
                 slot-scope="{text}">
              {{text === 0 ? '√' : '×'}}
            </div>
            <div slot="action"
                 slot-scope="{record}">
              <a class="mr-12"
                 @click="openFreeKickModal(1, 0, record)">修改
              </a>
            </div>
          </standard-table>
        </div>
      </div>

      <!-- 客队 -->
      <div class="guest-team">
        <h2 class="ant-descriptions-title mt-40">客队：{{guestTeamName}}</h2>
        <!-- 射中记录 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">射中记录</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openShootRecordModal(0, 1)">添加记录</a-button>
          <standard-table :columns="infoData.guestTeamData.shootRecordColumns"
                          rowKey="id"
                          :pagination="false"
                          :data-source="infoData.guestTeamData.shootRecordTableData"
                          bordered>
            <div slot="action"
                 slot-scope="{record}">
              <a class="mr-12"
                 @click="openShootRecordModal(1, 1, record)">修改
              </a>
            </div>
          </standard-table>
        </div>
        <!-- 判罚记录 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">判罚记录</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openPenaltyRecordModal(0, 1)">添加记录</a-button>
          <a-table :columns="infoData.guestTeamData.penaltyRecordColumns"
                   rowKey="id"
                   :pagination="false"
                   :data-source="infoData.guestTeamData.penaltyRecordTableData"
                   bordered>
            <div slot="action"
                 slot-scope="{record}">
              <a class="mr-12"
                 @click="openPenaltyRecordModal(1, 1, record)">修改
              </a>
            </div>
          </a-table>
        </div>
        <!-- 任意球 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">任意球</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openFreeKickModal(0, 1)">添加记录</a-button>
          <standard-table :columns="infoData.guestTeamData.freeKickColumns"
                          rowKey="id"
                          bordered
                          :pagination="false"
                          :dataSource="infoData.guestTeamData.freeKickTableData">
            <div slot="scoreResultMap"
                 slot-scope="{text}">
              {{text === 0 ? '√' : '×'}}
            </div>
            <div slot="action"
                 slot-scope="{record}">
              <a class="mr-12"
                 @click="openFreeKickModal(1, 1, record)">修改
              </a>
            </div>
          </standard-table>
        </div>
      </div>
    </a-card>

    <!-- 比赛结果modal -->
    <GameResultModal ref="gameResultModal"
                     :homeTeamName="homeTeamName"
                     :guestTeamName="guestTeamName"
                     @getGamesResultData="getGamesResultData"></GameResultModal>

    <!-- 裁判信息modal -->
    <RefereeInfoModal ref="refereeInfoModal"
                      @getRefereeInfoData="getRefereeInfoData"></RefereeInfoModal>

    <!-- 射中记录modal -->
    <ShootRecordModal ref="shootRecordModal"
                      :homeTeamName="homeTeamName"
                      :guestTeamName="guestTeamName"
                      :awayTeamId="awayTeamId"
                      :homeTeamId="homeTeamId"
                      :schedulesId="schedulesId"
                      @searchShootRecordTableData="searchShootRecordTableData"></ShootRecordModal>

    <!-- 判罚记录modal -->
    <PenaltyRecordModal ref="penaltyRecordModal"
                        :homeTeamName="homeTeamName"
                        :guestTeamName="guestTeamName"
                        :awayTeamId="awayTeamId"
                        :homeTeamId="homeTeamId"
                        :schedulesId="schedulesId"
                        @searchPenaltyRecordTableData="searchPenaltyRecordTableData"></PenaltyRecordModal>

    <!-- 任意球modal -->
    <FreeKickModal ref="freeKickModal"
                   :homeTeamName="homeTeamName"
                   :guestTeamName="guestTeamName"
                   :awayTeamId="awayTeamId"
                   :homeTeamId="homeTeamId"
                   :schedulesId="schedulesId"
                   @searchFreeKickRecordTableData="searchFreeKickRecordTableData"></FreeKickModal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import GameResultModal from "./GameResultModal";
import ShootRecordModal from "./ShootRecordModal";
import PenaltyRecordModal from "./PenaltyRecordModal";
import FreeKickModal from "./FreeKickModal";
import RefereeInfoModal from "./RefereeInfoModal";
import StandardTable from "@/components/table/StandardTable";
import {
  getGamesResult,
  getScoreData,
  getPenaltyData,
  getFreekickData,
  getRefereeInfo
} from "@/services/scoreModals";

const refereeInfoList = [
  {
    label: "主裁判",
    field: "referee",
    value: ``,
    span: 1
  },
  {
    label: "边裁",
    field: "sideReferee",
    value: ``,
    span: 1
  },
  {
    label: "计时",
    field: "timeMan",
    value: ``,
    span: 1
  },
  {
    label: "宣告",
    field: "declareMan",
    value: ``,
    span: 1
  },
  {
    label: "记罚",
    field: "penaltyMan",
    value: `leo`,
    span: 1
  },
  {
    label: "记录",
    field: "recordMan",
    value: ``,
    span: 1
  },
  {
    label: "裁判监督",
    field: "refereeSupervision",
    value: ``,
    span: 1
  },
  {
    label: "比赛监督",
    field: "matchSupervise",
    value: ``,
    span: 1
  },
  {
    label: "助理",
    field: "assistant",
    value: ``,
    span: 1
  }
];

export default {
  name: "InfosDetails",
  components: {
    GameResultModal,
    ShootRecordModal,
    PenaltyRecordModal,
    FreeKickModal,
    RefereeInfoModal,
    StandardTable
  },
  props: {
    scoreShow: {
      type: Boolean,
      default: false
    },
    infoData: {
      type: Object,
      required: true,
      default: new Object()
    }
  },
  data() {
    return {
      homeTeamName: "",
      guestTeamName: "",
      awayTeamId: null, // 客队id
      homeTeamId: null, // 主队id
      schedulesId: null, // 日程id
      gameResultForm: {}
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"])
  },
  mounted() {},
  methods: {
    // 返回上一级页面
    goBackScheduleTable() {
      this.$emit("closeDetail");
    },

    setLastPageData(data) {
      const { awayTeamName, homeTeamName, id, awayTeamId, homeTeamId } = data;
      this.homeTeamName = homeTeamName;
      this.guestTeamName = awayTeamName;
      this.awayTeamId = awayTeamId;
      this.homeTeamId = homeTeamId;
      this.schedulesId = id;
      this.getGamesResultData();
      this.getRefereeInfoData();
      this.searchShootRecordTableData(homeTeamId, 0);
      this.searchShootRecordTableData(awayTeamId, 1);
      this.searchPenaltyRecordTableData(homeTeamId, 0);
      this.searchPenaltyRecordTableData(awayTeamId, 1);
      this.searchFreeKickRecordTableData(homeTeamId, 0);
      this.searchFreeKickRecordTableData(awayTeamId, 1);
    },

    // 比赛结果modal
    async openGameResultModal() {
      await this.getGamesResultData();
      this.$refs.gameResultModal.setOpenType();
    },

    getGamesResultData() {
      getGamesResult(this.schedulesId).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.$refs.gameResultModal.form = { ...result.data };
          this.gameResultForm = { ...result.data };
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 裁判信息modal
    async openRefereeModal() {
      await this.getRefereeInfoData();
      this.$refs.refereeInfoModal.setOpenType();
    },
    // 获取裁判信息
    getRefereeInfoData() {
      getRefereeInfo(this.schedulesId).then(res => {
        const result = res.data;
        if (result.code === 0) {
          console.log(result);
          this.$refs.refereeInfoModal.form = {
            schedulesId: result.data.schedulesId,
            timeMan: result.data.timeMan.join(), // 计时
            recordMan: result.data.recordMan.join(), // 记录
            declareMan: result.data.declareMan.join(), // 宣告
            referee1: result.data.referee[0] ? result.data.referee[0] : "", // 主裁
            referee2: result.data.referee[1] ? result.data.referee[1] : "",
            sideReferee1: result.data.sideReferee[0]
              ? result.data.sideReferee[0]
              : "", // 边裁
            sideReferee2: result.data.sideReferee[1]
              ? result.data.sideReferee[1]
              : "",
            refereeSupervision1: result.data.refereeSupervision[0]
              ? result.data.refereeSupervision[0]
              : "", // 裁判监督
            refereeSupervision2: result.data.refereeSupervision[1]
              ? result.data.refereeSupervision[1]
              : "",
            matchSupervise1: result.data.matchSupervise[0]
              ? result.data.matchSupervise[0]
              : "", // 比赛监督
            matchSupervise2: result.data.matchSupervise[1]
              ? result.data.matchSupervise[1]
              : "",
            penaltyMan1: result.data.penaltyMan[0]
              ? result.data.penaltyMan[0]
              : "", // 记罚
            penaltyMan2: result.data.penaltyMan[1]
              ? result.data.penaltyMan[1]
              : "",
            assistant1: result.data.assistant[0]
              ? result.data.assistant[0]
              : "", // 助理
            assistant2: result.data.assistant[1] ? result.data.assistant[1] : ""
          };
          this.$refs.refereeInfoModal.form.schedulesId =
            result.data.schedulesId;
          this.infoData.refereeInfoList = refereeInfoList.map(item => {
            item.value = result.data[item.field].join();
            return item;
          });
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    /**
     * @description: 打开射中记录modal
     * @param : status{int} 0: 新增  1:修改
     * @param : type{int}   0: 主队  1:客队
     * @param : data{Object}  修改行数据
     * @return {*}
     * @author: Leo
     */
    async openShootRecordModal(status, type, data) {
      if (status === 1) {
        this.$refs.shootRecordModal.form = { ...data };
      }
      this.$refs.shootRecordModal.setOpenType(status, type);
    },

    searchShootRecordTableData(teamId, teamType) {
      getScoreData(this.schedulesId, teamId).then(res => {
        const result = res.data;
        if (result.code === 0) {
          if (teamType === 0) {
            this.infoData.homeTeamData.shootRecordTableData = result.data;
          } else if (teamType === 1) {
            this.infoData.guestTeamData.shootRecordTableData = result.data;
          }
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 判罚记录modal
    openPenaltyRecordModal(status, type, data) {
      if (status === 1) {
        this.$refs.penaltyRecordModal.form = { ...data };
      }
      this.$refs.penaltyRecordModal.setOpenType(status, type);
    },

    searchPenaltyRecordTableData(teamId, teamType) {
      getPenaltyData(this.schedulesId, teamId).then(res => {
        const result = res.data;
        if (result.code === 0) {
          if (teamType === 0) {
            this.infoData.homeTeamData.penaltyRecordTableData = result.data;
          } else if (teamType === 1) {
            this.infoData.guestTeamData.penaltyRecordTableData = result.data;
          }
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 任意球modal
    openFreeKickModal(status, type, data) {
      if (status === 1) {
        this.$refs.freeKickModal.form = { ...data };
      }
      this.$refs.freeKickModal.setOpenType(status, type);
    },

    searchFreeKickRecordTableData(teamId, teamType) {
      getFreekickData(this.schedulesId, teamId).then(res => {
        const result = res.data;
        if (result.code === 0) {
          if (teamType === 0) {
            this.infoData.homeTeamData.freeKickTableData = result.data;
          } else if (teamType === 1) {
            this.infoData.guestTeamData.freeKickTableData = result.data;
          }
        } else {
          this.$message.error(result.desc);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.scoreDetails-page {
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // z-index: 999;
  .game-result {
    ul {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding-top: 20px;
      li {
        p {
          font-size: 16px;
        }
      }
    }
  }
}
</style>