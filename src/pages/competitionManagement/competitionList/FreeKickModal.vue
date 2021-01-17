<!--
 * @Description: 任意球弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-12 14:02:33
 * @LastEditors: Leo
-->
<template>
  <div class="freeKick-modal">
    <a-modal :title="pageTitle"
             width="600px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             :maskClosable="false"
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
        <!-- 球员号码 -->
        <a-form-model-item label="球员号码"
                           prop="scoreNum">
          <a-input v-model="form.scoreNum"
                   placeholder="请输入球员号码"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 对方守门员 -->
        <a-form-model-item label="对方守门员"
                           prop="keeperNum">
          <a-input v-model="form.keeperNum"
                   placeholder="请输入对方守门员"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 是否射中 -->
        <a-form-model-item label="是否射中"
                           prop="scoreResult">
          <a-radio-group v-model="form.scoreResult">
            <a-radio :value="item.id"
                     v-for="item in scoreResultList"
                     :key="item.id">
              {{item.name}}
            </a-radio>
          </a-radio-group>
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
import { freekickAdd, freekickUpdate } from "@/services/scoreModals";

export default {
  name: "freeKickModal",
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
      pageTitle: "添加判罚记录",
      openType: 0,
      teamType: null,
      confirmLoading: false,
      scoreResultList: [
        { name: "是", id: 0 },
        { name: "否", id: 1 }
      ],
      form: {
        teamId: null, // 队伍id
        schedulesId: null, // 日程id
        keeperNum: undefined,
        scoreNum: undefined,
        scoreResult: 0
      },
      // 搜索项校验规则
      rules: {
        scoreNum: [
          {
            required: true,
            message: "请输入球员号码",
            trigger: "blur"
          }
        ],
        keeperNum: [
          {
            required: true,
            message: "请输入对方守门员号码",
            trigger: "blur"
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
        this.pageTitle = "添加任意球";
        this.resetFormFields();
      } else {
        this.pageTitle = "修改任意球";
      }
      if (teamType === 0) {
        this.form.teamId = this.homeTeamId;
      } else {
        this.form.teamId = this.awayTeamId;
      }
      this.visible = true;
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
            freekickAdd(data)
              .then(res => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.handleCancel();
                  this.$emit(
                    "searchFreeKickRecordTableData",
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
            freekickUpdate(data)
              .then(res => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.handleCancel();
                  this.$emit(
                    "searchFreeKickRecordTableData",
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
        keeperNum: undefined,
        scoreNum: undefined,
        scoreResult: 0
      };
    },
    handleCancel() {
      this.resetFormFields();
      this.visible = false;
    }
  }
};
</script>
