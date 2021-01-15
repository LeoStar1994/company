<!--
 * @Description: 详细信息页
 * @Author: Leo
 * @Date: 2020-12-28 16:56:50
 * @LastEditTime: 2021-01-15 17:24:40
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
             width="100"
             alt="">
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
                 class="cursor-pointer w100 mr-10"
                 @click="viewImage(item1)"
                 alt="">
          </span>
          <span v-else-if="item.label === '操作'">
            <a class="mr-12"
               @click="openBaseInfoModal">修改球队基本信息
            </a>
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
            <a class="mr-12"
               @click="openInfoDetails(data)">查看
            </a>
            <a class="mr-12"
               @click="openOfficerModal(data)">修改
            </a>
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
            <a class="mr-12"
               @click="openPlayerModal(data)">修改
            </a>
          </div>
        </a-table>
      </div>
    </a-card>
    <InfosDetails :infoData="infoData1"
                  style="z-index:10000；overflow: hidden;"
                  :detailShow="detailShow1"
                  @closeDetail="closeDetail"></InfosDetails>

    <!-- 球队修改 -->
    <TeamModal ref="teamModal"></TeamModal>

    <!-- 官员修改 -->
    <OfficerModal ref="officerModal"></OfficerModal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import OfficerModal from "../../pages/applyManagement/competition/OfficerModal";
import TeamModal from "../../pages/applyManagement/competition/TeamModal";
export default {
  name: "InfosDetails",
  components: {
    OfficerModal,
    TeamModal,
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
  data() {
    return {
      detailShow1: false,
      infoData1: {
        name: "",
        imgURL: "",
        // 基础信息
        descList: [],
      },
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  created() {},
  methods: {
    // 返回上一级页面
    goBackInfosTable() {
      this.$emit("closeDetail");
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

    // 修改基础信息
    openBaseInfoModal() {
      this.$refs.teamModal.setOpenType(this.infoData.teamId);
    },

    // 修改官员信息
    openOfficerModal(data) {
      this.$refs.officerModal.setOpenType(data);
    },

    // 修改运动员信息
    openPlayerModal(data) {},

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