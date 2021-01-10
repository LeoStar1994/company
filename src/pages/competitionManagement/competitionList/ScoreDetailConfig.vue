<!--
 * @Description: 赛事管理 / 赛事列表 / 赛事日程 / 成绩录入
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2020-12-29 17:38:06
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
                  @click="openGameResultModal">添加记录</a-button>
        <ul class="d-flex ai-center jc-center text-center">
          <li class="pt-30">
            <p>总比分</p>
            <p>第一节</p>
            <p>第二节</p>
            <p>第三节</p>
          </li>
          <li class="w140 fw-700">
            <h3>{{homeTeamName}}</h3>
            <p>{{gameResultForm.shootMatchHome}}</p>
            <p>{{gameResultForm.firstSectionHome}}</p>
            <p>{{gameResultForm.secondSectionHome}}</p>
            <p>{{gameResultForm.thirdSectionHome}}</p>
          </li>
          <li class="pt-30 fw-700">
            <p>:</p>
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </li>
          <li class="w140 fw-700">
            <h3>{{guestTeamName}}</h3>
            <p>{{gameResultForm.shootMatchAway}}</p>
            <p>{{gameResultForm.firstSectionAway}}</p>
            <p>{{gameResultForm.secondSectionAway}}</p>
            <p>{{gameResultForm.thirdSectionAway}}</p>
          </li>

        </ul>
      </div>
      <!-- 裁判信息 -->
      <div class="referee-info">
        <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">裁判信息</h4>
        <a-button type="primary"
                  class="mb-20 ml-20"
                  @click="openRefereeModal">添加记录</a-button>
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
          <a-table :columns="infoData.homeTeamData.shootRecordColumns"
                   rowKey="id"
                   :pagination="false"
                   :data-source="infoData.homeTeamData.shootRecordTableData"
                   bordered>
            <div slot="action"
                 slot-scope="data">
              <a class="mr-12"
                 @click="openShootRecordModal(1, 0, data)">修改
              </a>
            </div>
          </a-table>
        </div>
        <!-- 判罚记录 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">判罚记录</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openPenaltyRecordModal(0, 0)">添加记录</a-button>
          <a-table :columns="infoData.homeTeamData.penaltyRecordColumns"
                   rowKey="id"
                   :pagination="false"
                   :data-source="infoData.homeTeamData.penaltyRecordTableData"
                   bordered>
            <div slot="action"
                 slot-scope="data">
              <a class="mr-12"
                 @click="openPenaltyRecordModal(1, 0, data)">修改
              </a>
            </div>
          </a-table>
        </div>
        <!-- 任意球 -->
        <div>
          <h4 class="ant-descriptions-title mt-40 d-inlineblock w66">任意球</h4>
          <a-button type="primary"
                    class="mb-20 ml-20"
                    @click="openFreeKickModal(0, 0)">添加记录</a-button>
          <a-table :columns="infoData.homeTeamData.freeKickColumns"
                   rowKey="id"
                   :pagination="false"
                   :data-source="infoData.homeTeamData.freeKickTableData"
                   bordered>
            <div slot="action"
                 slot-scope="data">
              <a class="mr-12"
                 @click="openFreeKickModal(1, 0, data)">修改
              </a>
            </div>
          </a-table>
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
          <a-table :columns="infoData.guestTeamData.shootRecordColumns"
                   rowKey="id"
                   :pagination="false"
                   :data-source="infoData.guestTeamData.shootRecordTableData"
                   bordered>
            <div slot="action"
                 slot-scope="data">
              <a class="mr-12"
                 @click="openShootRecordModal(1, 1, data)">修改
              </a>
            </div>
          </a-table>
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
                 slot-scope="data">
              <a class="mr-12"
                 @click="openPenaltyRecordModal(1, 1, data)">修改
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
          <a-table :columns="infoData.guestTeamData.freeKickColumns"
                   rowKey="id"
                   :pagination="false"
                   :data-source="infoData.guestTeamData.freeKickTableData"
                   bordered>
            <div slot="action"
                 slot-scope="data">
              <a class="mr-12"
                 @click="openFreeKickModal(1, 1, data)">修改
              </a>
            </div>
          </a-table>
        </div>
      </div>
    </a-card>

    <!-- 比赛结果modal -->
    <GameResultModal ref="gameResultModal"
                     :homeTeamName="homeTeamName"
                     :guestTeamName="guestTeamName"
                     @getGamesResultData="getGamesResultData"></GameResultModal>

    <!-- 裁判信息modal -->

    <!-- 射中记录modal -->

    <!-- 判罚记录modal -->

    <!-- 任意球modal -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import GameResultModal from "./GameResultModal";
import { getGamesResult } from "@/services/scoreModals";
export default {
  name: "InfosDetails",
  components: {
    GameResultModal
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
  mounted() {
    // this.getGamesResultData();
  },
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
    openRefereeModal() {},

    /**
     * @description: 打开射中记录modal
     * @param : status{int} 0: 新增  1:修改
     * @param : type{int}   0: 主队  1:客队
     * @return {*}
     * @author: Leo
     */
    openShootRecordModal(status, type) {
      console.log(status, type);
    },

    // 判罚记录modal
    openPenaltyRecordModal(status, type) {
      console.log(status, type);
    },

    // 任意球modal
    openFreeKickModal(status, type) {
      console.log(status, type);
    }
  }
};
</script>

<style lang="less" scoped>
.scoreDetails-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
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