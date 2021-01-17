<!--
 * @Description: 比赛结果弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2020-12-29 17:38:06
 * @LastEditors: Leo
-->
<template>
  <div class="gameResult-modal">
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
          <span class="mx-50">{{homeTeamName}}</span>
          <span class="ml-50">{{guestTeamName}}</span>
        </p>
        <!-- 第一节 -->
        <a-form-model-item label="第一节">
          <div class="d-flex h40">
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.firstSectionHome"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
            <span class="mx-4 h40">：</span>
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.firstSectionAway"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 第二节 -->
        <a-form-model-item label="第二节">
          <div class="d-flex h40">
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.secondSectionHome"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
            <span class="mx-4 h40">：</span>
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.secondSectionAway"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 第三节 -->
        <a-form-model-item label="第三节">
          <div class="d-flex h40">
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.thirdSectionHome"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
            <span class="mx-4 h40">：</span>
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.thirdSectionAway"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 加时赛 -->
        <a-form-model-item label="加时赛">
          <div class="d-flex h40">
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.extraTimeHome"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
            <span class="mx-4 h40">：</span>
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.extraTimeAway"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 射门比赛 -->
        <a-form-model-item label="射门比赛">
          <div class="d-flex h40">
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.shootMatchHome"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
            <span class="mx-4 h40">：</span>
            <a-form-model-item prop="code"
                               class="flex-1">
              <a-input v-model="form.shootMatchAway"
                       placeholder="请输入"
                       allowClear
                       :maxLength="30" />
            </a-form-model-item>
          </div>
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
import { gamesResultSave } from "@/services/scoreModals";
export default {
  name: "GameResultModal",
  props: {
    homeTeamName: {
      type: String,
      required: true
    },
    guestTeamName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "添加/修改比赛结果",
      openType: 0,
      confirmLoading: false,
      form: {
        awayTeamId: null,
        homeTeamId: null,
        schedulesId: null,
        firstSectionHome: undefined,
        firstSectionAway: undefined,
        secondSectionHome: undefined,
        secondSectionAway: undefined,
        thirdSectionHome: undefined,
        thirdSectionAway: undefined,
        extraTimeHome: undefined,
        extraTimeAway: undefined,
        shootMatchHome: undefined,
        shootMatchAway: undefined
      },
      // 搜索项校验规则
      rules: {}
    };
  },
  created() {},
  methods: {
    setOpenType() {
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
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          gamesResultSave(data).then(res => {
            this.$refs.loading.closeLoading();
            const result = res.data;
            if (result.code === 0) {
              this.$message.success(result.desc);
              this.handleCancel();
              this.$emit("getGamesResultData");
            } else {
              this.$message.error(result.desc);
            }
          });
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    }
  }
};
</script>
