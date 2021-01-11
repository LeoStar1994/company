<!--
 * @Description: 判罚记录弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-11 14:11:09
 * @LastEditors: Leo
-->
<template>
  <div class="penaltyRecord-modal">
    <a-modal :title="pageTitle"
             width="600px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             centered
             destroyOnClose
             @ok="handleOk"
             @cancel="handleCancel">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <p class="fw-700 fz-18 pl-30">
          <span>球队名称</span>
          <span class="ml-40">{{teamType === 0 ? homeTeamName : guestTeamName}}</span>
        </p>
        <!-- 事件时间 -->
        <a-form-model-item label="事件时间"
                           prop="actionTime">
          <a-input v-model="form.actionTime"
                   placeholder="请输入事件时间(格式为mm:ss)"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 开始时间 -->
        <a-form-model-item label="开始时间"
                           prop="startTime">
          <a-input v-model="form.startTime"
                   placeholder="请输入开始时间(格式为mm:ss)"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 结束时间 -->
        <a-form-model-item label="结束时间"
                           prop="endTime">
          <a-input v-model="form.endTime"
                   placeholder="请输入结束时间(格式为mm:ss)"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 球员号码 -->
        <a-form-model-item label="球员号码"
                           prop="num">
          <a-input v-model="form.num"
                   placeholder="请输入球员号码"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 判罚时间 -->
        <a-form-model-item label="判罚时间"
                           prop="penaltyTime">
          <a-input v-model="form.penaltyTime"
                   placeholder="请输入判罚时间(格式为mm:ss)"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 判罚原因 -->
        <a-form-model-item label="判罚原因"
                           prop="reason">
          <a-textarea v-model="form.reason"
                      placeholder="请输入判罚原因"
                      allowClear
                      class="w100p"
                      :maxLength="300"
                      :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { penaltyAdd, penaltyUpdate } from "@/services/scoreModals";

const timeRegExp = /^([0-5]{1}\d):([0-5]\d)$/;

export default {
  name: "penaltyRecordModal",
  props: {
    homeTeamName: {
      type: String,
      required: true,
    },
    guestTeamName: {
      type: String,
      required: true,
    },
    awayTeamId: {
      type: Number,
      required: true,
    },
    homeTeamId: {
      type: Number,
      required: true,
    },
    schedulesId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "添加判罚记录",
      openType: 0,
      teamType: null,
      confirmLoading: false,
      form: {
        teamId: null, // 队伍id
        schedulesId: null, // 日程id
        actionTime: undefined,
        endTime: undefined,
        num: undefined,
        penaltyTime: undefined,
        reason: undefined,
        startTime: undefined,
      },
      // 搜索项校验规则
      rules: {
        actionTime: [
          {
            required: true,
            message: "请输入事件时间",
            trigger: "blur",
          },
          {
            pattern: timeRegExp,
            message: "请输入mm:ss时间格式！",
          },
        ],
        endTime: [
          {
            required: true,
            trigger: "blur",
            validator: this.checkEndTime,
          },
        ],
        startTime: [
          {
            required: true,
            trigger: "blur",
            validator: this.checkStartTime,
          },
        ],
        penaltyTime: [
          {
            required: true,
            message: "请输入判罚时间",
            trigger: "blur",
          },
          {
            pattern: timeRegExp,
            message: "请输入mm:ss时间格式！",
          },
        ],
        reason: [
          {
            required: true,
            message: "请输入判罚原因",
            trigger: "blur",
          },
        ],
        num: [
          {
            required: true,
            message: "请输入球员号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    /**
     * @description:
     * @param {int} openType 0 新增 1 修改
     * @param {int} teamType 0 主队 1 客队
     * @return {*}
     * @author: Leo
     */
    setOpenType(openType, teamType) {
      this.openType = openType;
      this.teamType = teamType;
      if (openType === 0) {
        this.pageTitle = "添加判罚记录";
        this.resetFormFields();
      } else {
        this.pageTitle = "修改判罚记录";
      }
      if (teamType === 0) {
        this.form.teamId = this.homeTeamId;
      } else {
        this.form.teamId = this.awayTeamId;
      }
      this.visible = true;
    },

    // 时间校验
    checkStartTime(rule, value, callback) {
      const { endTime } = this.form;
      if (this.$isEmpty(value)) {
        callback("请输入开始时间");
      } else if (!timeRegExp.test(value)) {
        callback("请输入mm:ss时间格式");
      } else if (
        this.timeStrToSeconds(value) > this.timeStrToSeconds(endTime)
      ) {
        callback("开始时间不能大于结束时间");
      }
      callback();
    },
    checkEndTime(rule, value, callback) {
      const { startTime } = this.form;
      if (this.$isEmpty(value)) {
        callback("请输入结束时间");
      } else if (!timeRegExp.test(value)) {
        callback("请输入mm:ss时间格式");
      } else if (
        this.timeStrToSeconds(value) < this.timeStrToSeconds(startTime)
      ) {
        callback("结束时间不能小于开始时间");
      }
      callback();
    },

    timeStrToSeconds(timeStr) {
      const arr = timeStr.split(":");
      return Number(arr[0]) * 60 + Number(arr[1]);
    },

    async handleOk() {
      this.confirmLoading = true;
      await this.onSubmit();
      this.confirmLoading = false;
    },
    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = { ...this.form, schedulesId: this.schedulesId };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            penaltyAdd(data)
              .then((res) => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.handleCancel();
                  this.$emit(
                    "searchPenaltyRecordTableData",
                    data.teamId,
                    this.teamType
                  );
                } else {
                  this.$message.error(result.desc);
                }
              })
              .catch(() => {
                this.$refs.loading.closeLoading();
              });
          } else if (this.openType === 1) {
            penaltyUpdate(data)
              .then((res) => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.handleCancel();
                  this.$emit(
                    "searchPenaltyRecordTableData",
                    data.teamId,
                    this.teamType
                  );
                } else {
                  this.$message.error(result.desc);
                }
              })
              .catch(() => {
                this.$refs.loading.closeLoading();
              });
          }
        } else {
          return false;
        }
      });
    },
    resetFormFields() {
      this.form = {
        teamId: null, // 队伍id
        schedulesId: null, // 日程id
        actionTime: undefined,
        endTime: undefined,
        num: undefined,
        penaltyTime: undefined,
        reason: undefined,
        startTime: undefined,
      };
    },
    handleCancel() {
      this.resetFormFields();
      this.visible = false;
    },
  },
};
</script>
