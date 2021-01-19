<!--
 * @Description: 详细信息页
 * @Author: Leo
 * @Date: 2020-12-28 16:56:50
 * @LastEditTime: 2021-01-19 00:10:44
 * @LastEditors: Leo
-->
<template>
  <div class="infoDetails-page"
       v-if="detailShow">
    <a-card v-show="!detailShow1"
            :style="`min-height: ${pageMinHeight}px`">
      <!-- operator -->
      <div class="operator">
        <a-button @click="goBackInfosTable"
                  class="mr-10"
                  type="primary">返回上一页</a-button>
      </div>
      <!-- avatar | name -->
      <div class="text-center">
        <img :src="infoData.imgURL"
             width="100px"
             alt="teamLogo">
        <h2 class="fz-40 mt-20">{{infoData.name}}</h2>
      </div>

      <!-- 基本信息 | 球队信息 -->
      <a-descriptions title="基本信息"
                      :column="2"
                      v-if="infoData.descList"
                      bordered>
        <a-descriptions-item v-for="(item, index) in infoData.descList"
                             :key="index"
                             :label="item.label"
                             :span="item.span">
          <span v-if="item.value.length > 0 && (item.value instanceof Array)">
            <img v-for="(item1, index) in item.value"
                 :key="index"
                 :src="item1"
                 title="点击下载图片"
                 width="86px"
                 class="cursor-pointer w100 mr-10"
                 @click="viewImage(item1)"
                 alt="">
          </span>
          <span v-else-if="item.label === '操作'">
            <a-button class="mr-12"
                      type="primary"
                      size="small"
                      @click="openBaseInfoModal">修改
            </a-button>
          </span>
          <span v-else>{{item.value}}</span>
        </a-descriptions-item>
      </a-descriptions>
      <!-- 执裁经历 -->
      <div v-if="infoData.judgeColumns">
        <h4 class="ant-descriptions-title mt-40">执裁经历</h4>
        <a-table :columns="infoData.judgeColumns"
                 rowKey="gameName"
                 :pagination="false"
                 :data-source="infoData.judgeTableData"
                 bordered>
        </a-table>
      </div>
      <!-- 官员信息 -->
      <div v-if="infoData.officerColumns">
        <h4 class="ant-descriptions-title mt-40">官员信息</h4>
        <a-table :columns="infoData.officerColumns"
                 rowKey="id"
                 :pagination="false"
                 :data-source="infoData.officerTableData"
                 bordered>
          <div slot="action"
               slot-scope="data">
            <a-button class="mr-12"
                      type="primary"
                      size="small"
                      @click="openInfoDetails(data)">查看
            </a-button>
            <a-button class="mr-12"
                      type="primary"
                      size="small"
                      @click="openOfficerModal(data)">修改
            </a-button>
          </div>
        </a-table>
      </div>
      <!-- 运动员信息 -->
      <div v-if="infoData.playerColumns">
        <h4 class="ant-descriptions-title mt-40">运动员信息</h4>
        <a-table :columns="infoData.playerColumns"
                 rowKey="id"
                 :pagination="false"
                 :data-source="infoData.playerTableData"
                 bordered>
          <div slot="action"
               slot-scope="data">
            <a-button class="mr-12"
                      type="primary"
                      size="small"
                      @click="openPlayerModal(data)">修改
            </a-button>
          </div>
        </a-table>
      </div>
    </a-card>
    <InfosDetails :infoData="infoData1"
                  style="z-index:10000；overflow: hidden;"
                  :detailShow="detailShow1"
                  @closeDetail="closeDetail"></InfosDetails>

    <!-- 球队修改 -->
    <TeamModal ref="teamModal"
               @refreshAllInfoData="refreshAllInfoData"
               :yearTypeList="yearTypeList"
               :teamAreaList="dicData.hokeyGamesTeamArea"></TeamModal>
    <!-- 球队区域、年龄组 -->

    <!-- 官员修改 -->
    <OfficerModal ref="officerModal"
                  @refreshAllInfoData="refreshAllInfoData"
                  :trainSexList="dicData.hokeyGamesSexType"
                  :positionNameList="dicData.hokeyGamesTrainPosition"
                  :cardTypeList="dicData.hokeyGamesCardType"></OfficerModal>
    <!-- 性别、职务、证件类型 -->

    <!-- 运动员修改 -->
    <PlayerModal ref="playerModal"
                 @refreshAllInfoData="refreshAllInfoData"
                 :sexList="dicData.hokeyGamesSexType"
                 :holdingRodList="dicData.hokeyGamesTeamDetailHoldingRod"
                 :positionList="dicData.hokeyGamesTeamDetailPosition"
                 :cardTypeList="dicData.hokeyGamesCardType"></PlayerModal>
    <!-- 性别、持杆手、位置、证件类型 -->

  </div>
</template>

<script>
import { mapState } from "vuex";
import OfficerModal from "../../pages/applyManagement/competition/OfficerModal";
import TeamModal from "../../pages/applyManagement/competition/TeamModal";
import PlayerModal from "../../pages/applyManagement/competition/PlayerModal";
import { getAllDicData, getYearTypeList } from "@/services/competition";
export default {
  name: "InfosDetails",
  components: {
    OfficerModal,
    TeamModal,
    PlayerModal,
  },
  props: {
    detailShow: {
      type: Boolean,
      default: false,
    },
    infoData: {
      type: Object,
      required: true,
      default: new Object(),
    },
  },
  mounted() {
    this.getAllDicData();
  },
  data() {
    return {
      detailShow1: false,
      infoData1: {
        name: "",
        imgURL: "",
        // 基础信息
        descList: [],
      },
      yearTypeList: [], //年龄组list
      dicData: {}, // 字典表下拉list
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  methods: {
    // 返回上一级页面
    goBackInfosTable() {
      this.$emit("closeDetail");
      this.$emit("searchTableData");
    },

    // 打开图片
    viewImage(imgUrl) {
      window.open(imgUrl);
    },

    // 官员table查看
    openInfoDetails(data) {
      this.infoData1.name = data.trainName;
      this.infoData1.imgURL = data.imagePath;
      this.infoData1.descList = this.formatDetailsData(data);
      this.detailShow1 = true;
    },

    // 数据格式化
    formatDetailsData(data) {
      const detailKeys = Object.keys(data);
      const finallyData = [];
      this.infoData.fieldsMapLabelSon.forEach((item) => {
        detailKeys.forEach((item1) => {
          if (item.field === item1) {
            finallyData.push({
              label: item.labelName,
              value: data[item1],
              sort: item.sort,
              span: item.isOccupyAll ? 2 : 1,
            });
          }
        });
      });
      return finallyData;
    },

    // 修改球队基础信息
    openBaseInfoModal() {
      this.getYearTypeList();
      this.$refs.teamModal.setOpenType(this.infoData.teamId);
    },

    // 获取所有字典表下拉list
    getAllDicData() {
      getAllDicData().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dicData = result.data;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 通过赛事id获取球队基础信息年龄组下拉list
    getYearTypeList() {
      getYearTypeList(this.infoData.hockeyGamesId).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.yearTypeList = result.data;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 修改官员信息
    openOfficerModal(data) {
      this.$refs.officerModal.setOpenType(data);
    },

    // 修改运动员信息
    openPlayerModal(data) {
      this.$refs.playerModal.setOpenType(data);
    },

    refreshAllInfoData(teamId) {
      this.$emit("refreshAllInfoData", teamId);
    },

    closeDetail() {
      this.detailShow1 = false;
    },
  },
};
</script>

<style lang="less" scoped>
.infoDetails-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>