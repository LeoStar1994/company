<!--
 * @Description: 详细信息页
 * @Author: Leo
 * @Date: 2020-12-28 16:56:50
 * @LastEditTime: 2020-12-29 15:57:39
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
          <span v-if="item.value.length > 0 && item.value instanceof Array">
            <img v-for="(item1, index) in item.value"
                 :key="index"
                 :src="item1"
                 class="cursor-pointer"
                 @click="viewImage(item1)"
                 alt="">
          </span>
          <span v-else>{{item.value}}</span>
        </a-descriptions-item>
      </a-descriptions>
      <!-- 执裁经历 -->
      <div v-if="infoData.judgeColumns">
        <h4 class="ant-descriptions-title mt-40">执裁经历</h4>
        <a-table :columns="infoData.judgeColumns"
                 rowKey="id"
                 :pagination="false"
                 :data-source="judgeTableData"
                 bordered>
        </a-table>
      </div>
      <!-- 官员信息 -->
      <div v-if="infoData.officerColumns">
        <h4 class="ant-descriptions-title mt-40">官员信息</h4>
        <a-table :columns="infoData.officerColumns"
                 rowKey="id"
                 :pagination="false"
                 :data-source="officerTableData"
                 bordered>
          <div slot="action"
               slot-scope="data">
            <a class="mr-12"
               @click="openInfoDetails(data)">查看
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
                 :data-source="playerTableData"
                 bordered>
          <div slot="playerName"
               slot-scope="{text}">
            {{text}}
          </div>
        </a-table>
      </div>
    </a-card>
    <InfosDetails :infoData="infoData1"
                  style="z-index:10000；overflow: hidden;"
                  :detailShow="detailShow1"
                  @closeDetail="closeDetail"></InfosDetails>
  </div>
</template>

<script>
import { mapState } from "vuex";
const imgURL = require("@/assets/img/logo_icon.jpg");
const judgeTableData = [
  {
    id: "1",
    time: "2019年",
    gameName: "冬季奥运会",
    gameLevel: "国际级",
    appointment: "主裁判",
  },
  {
    id: "2",
    time: "2022年",
    gameName: "冬季奥运会",
    gameLevel: "国际级",
    appointment: "主裁判",
  },
];

const officerTableData = [
  {
    id: "1",
    name: "王老五",
    job: "CEO",
    sex: "女",
    nationality: "中国",
    identityCard: "307282889172817821",
  },
  {
    id: "2",
    name: "王老4",
    job: "CFO",
    sex: "男",
    nationality: "中国",
    identityCard: "307282889172821782",
  },
];
const playerTableData = [
  {
    id: "1",
    name: "王老4",
    gameLevel: "1",
    position: "守门员",
    height: "191",
    weight: "80",
    cursor: "右手",
    numbers: "12312312312311312311",
  },
];
export default {
  name: "InfosDetails",
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
      judgeTableData: judgeTableData,
      officerTableData: officerTableData,
      playerTableData: playerTableData,
      infoData1: {
        name: "林一",
        imgURL: imgURL,
        // 基础信息
        descList: [
          {
            label: "性别",
            value: "男",
            span: 1,
          },
          {
            label: "现裁判等级",
            value: "国际A级",
            span: 1,
          },
          {
            label: "民族",
            value: "汉",
            span: 1,
          },
          {
            label: "批准日期",
            value: "2019-12-12",
            span: 1,
          },
          {
            label: "身高",
            value: "188",
            span: 1,
          },
          {
            label: "健康状况",
            value: "一般",
            span: 1,
          },
          {
            label: "出生日期",
            value: "1990-10-01",
            span: 1,
          },
          {
            label: "外语能力",
            value: "英语",
            span: 1,
          },
          {
            label: "证件照片",
            value: [imgURL, imgURL],
            span: 2,
          },
          {
            label: "外语能力",
            value: "英语",
            span: 1,
          },
        ],
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
    viewImage() {
      // window.open("../../../assets/img/logo_icon.jpg");
    },
    // 官员table查看
    openInfoDetails() {
      // this.$emit("closeDetail");
      this.detailShow1 = true;
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