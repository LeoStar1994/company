<!--
 * @Description: 射中记录弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-11 13:35:52
 * @LastEditors: Leo
-->
<template>
  <div class="shootRecord-modal">
    <a-modal :title="pageTitle"
             width="600px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             centered
             :maskClosable="false"
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
        <!-- 进球时间 -->
        <a-form-model-item label="进球时间"
                           prop="scoreTime">
          <a-input v-model="form.scoreTime"
                   placeholder="请输入进球时间(格式为mm:ss)"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 球员号码 -->
        <a-form-model-item label="球员号码"
                           prop="scoreNum">
          <a-input v-model="form.scoreNum"
                   placeholder="请输入球员号码"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 第一助攻 -->
        <a-form-model-item label="第一助攻"
                           prop="firstAssistsNum">
          <a-input v-model="form.firstAssistsNum"
                   placeholder="请输入第一助攻球员号"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 第二助攻 -->
        <a-form-model-item label="第二助攻"
                           prop="secondAssistsNum">
          <a-input v-model="form.secondAssistsNum"
                   placeholder="请输入第二助攻球员号"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 守门员 -->
        <a-form-model-item label="守门员"
                           prop="goalkeeperNum">
          <a-input v-model="form.goalkeeperNum"
                   placeholder="请输入守门员"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 对阵 -->
        <a-form-model-item label="对阵"
                           prop="against">
          <a-select style="width: 100%"
                    v-model="form.against"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in againstList"
                             :key="index"
                             :value="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
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
import { scoreAdd, scoreUpdate } from "@/services/scoreModals";
export default {
  name: "shootRecordModal",
  props: {
    homeTeamName: {
      type: String,
      required: true
    },
    guestTeamName: {
      type: String,
      required: true
    },
    awayTeamId: {
      type: Number,
      required: true
    },
    homeTeamId: {
      type: Number,
      required: true
    },
    schedulesId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "添加射中记录",
      openType: 0,
      teamType: null,
      confirmLoading: false,
      againstList: [
        {
          label: "EQ",
          value: "EQ"
        },
        {
          label: "+1",
          value: "+1"
        }
      ],
      form: {
        teamId: null, // 队伍id
        schedulesId: null, // 日程id
        against: undefined, // 对阵
        goalkeeperNum: undefined, // 守门员号
        scoreNum: undefined, // 射门球员号码
        scoreTime: undefined, // 进球时间
        firstAssistsNum: undefined,
        secondAssistsNum: undefined,
        id: undefined,
        order: undefined
      },
      // 搜索项校验规则
      rules: {
        against: [
          {
            required: true,
            message: "请选择对阵",
            trigger: "change"
          }
        ],
        goalkeeperNum: [
          {
            required: true,
            message: "请输入守门员号码",
            trigger: "blur"
          }
        ],
        scoreNum: [
          {
            required: true,
            message: "请输入射门球员号码",
            trigger: "blur"
          }
        ],
        scoreTime: [
          {
            required: true,
            message: "请输入进球时间",
            trigger: "blur"
          },
          {
            pattern: /^([0-5]{1}\d):([0-5]\d)$/,
            message: "请输入mm:ss时间格式！"
          }
        ],
        firstAssistsNum: [
          {
            trigger: "blur",
            validator: this.checkFirstAssists
          }
        ],
        secondAssistsNum: [
          {
            trigger: "blur",
            validator: this.checkSecondAssistsNum
          }
        ]
      }
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
        this.pageTitle = "添加射中记录";
        this.resetFormFields();
      } else {
        this.pageTitle = "修改射中记录";
      }
      if (teamType === 0) {
        this.form.teamId = this.homeTeamId;
      } else {
        this.form.teamId = this.awayTeamId;
      }
      this.visible = true;
    },

    // 第一助攻号码不能与球员号码与第二助攻相同
    checkFirstAssists(rule, value, callback) {
      const { secondAssistsNum, scoreNum } = this.form;
      if (value === scoreNum) {
        callback("第一助攻球员不能与进球球员号码相同");
      } else if (value === secondAssistsNum) {
        callback("第一助攻球员不能与第二助攻球员号码相同！");
      }
      callback();
    },

    // 第二助攻号码不能与球员号码与第一助攻相同
    checkSecondAssistsNum(rule, value, callback) {
      const { firstAssistsNum, scoreNum } = this.form;
      if (value === scoreNum) {
        callback("第二助攻球员不能与进球球员号码相同");
      } else if (value === firstAssistsNum) {
        callback("第二助攻球员不能与第一助攻球员号码相同！");
      }
      callback();
    },

    async handleOk() {
      this.confirmLoading = true;
      await this.onSubmit();
      this.confirmLoading = false;
    },
    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = { ...this.form, schedulesId: this.schedulesId };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            scoreAdd(data)
              .then(res => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.handleCancel();
                  this.$emit(
                    "searchShootRecordTableData",
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
            scoreUpdate(data)
              .then(res => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.handleCancel();
                  this.$emit(
                    "searchShootRecordTableData",
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
        against: undefined, // 对阵
        goalkeeperNum: undefined, // 守门员号
        scoreNum: undefined, // 射门球员号码
        scoreTime: undefined, // 进球时间
        firstAssistsNum: undefined,
        secondAssistsNum: undefined,
        id: undefined,
        order: undefined
      };
    },
    handleCancel() {
      this.resetFormFields();
      this.visible = false;
    }
  }
};
</script>
