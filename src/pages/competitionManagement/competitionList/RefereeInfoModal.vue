<!--
 * @Description: 裁判信息弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-11 17:21:02
 * @LastEditors: Leo
-->
<template>
  <div class="refereeInfo-modal">
    <a-modal :title="pageTitle"
             width="600px"
             :visible="visible"
             :maskClosable="false"
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
        <!-- 主裁判 -->
        <a-form-model-item label="主裁判">
          <div class="d-flex h40">
            <a-form-model-item prop="referee1"
                               class="flex-1">
              <a-input v-model="form.referee1"
                       placeholder="请输入主裁判"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
            <span class="mx-4 h40"></span>
            <a-form-model-item prop="referee2"
                               class="flex-1">
              <a-input v-model="form.referee2"
                       placeholder="请输入主裁判"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 边裁 -->
        <a-form-model-item label="边裁">
          <div class="d-flex h40">
            <a-form-model-item prop="sideReferee1"
                               class="flex-1">
              <a-input v-model="form.sideReferee1"
                       placeholder="请输入边裁"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
            <span class="mx-4 h40"></span>
            <a-form-model-item prop="sideReferee2"
                               class="flex-1">
              <a-input v-model="form.sideReferee2"
                       placeholder="请输入边裁"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 计时 -->
        <a-form-model-item label="计时">
          <div class="d-flex h40">
            <a-form-model-item prop="timeMan"
                               class="flex-1">
              <a-input v-model="form.timeMan"
                       placeholder="请输入计时"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 记录 -->
        <a-form-model-item label="记录">
          <div class="d-flex h40">
            <a-form-model-item prop="recordMan"
                               class="flex-1">
              <a-input v-model="form.recordMan"
                       placeholder="请输入记录"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 宣告 -->
        <a-form-model-item label="宣告">
          <div class="d-flex h40">
            <a-form-model-item prop="declareMan"
                               class="flex-1">
              <a-input v-model="form.declareMan"
                       placeholder="请输入宣告"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 记罚 -->
        <a-form-model-item label="记罚">
          <div class="d-flex h40">
            <a-form-model-item prop="penaltyMan1"
                               class="flex-1">
              <a-input v-model="form.penaltyMan1"
                       placeholder="请输入记罚"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
            <span class="mx-4 h40"></span>
            <a-form-model-item prop="penaltyMan2"
                               class="flex-1">
              <a-input v-model="form.penaltyMan2"
                       placeholder="请输入记罚"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 助理 -->
        <a-form-model-item label="助理">
          <div class="d-flex h40">
            <a-form-model-item prop="assistant1"
                               class="flex-1">
              <a-input v-model="form.assistant1"
                       placeholder="请输入助理"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
            <span class="mx-4 h40"></span>
            <a-form-model-item prop="assistant2"
                               class="flex-1">
              <a-input v-model="form.assistant2"
                       placeholder="请输入助理"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 裁判监督 -->
        <a-form-model-item label="裁判监督">
          <div class="d-flex h40">
            <a-form-model-item prop="refereeSupervision1"
                               class="flex-1">
              <a-input v-model="form.refereeSupervision1"
                       placeholder="请输入裁判监督"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
            <span class="mx-4 h40"></span>
            <a-form-model-item prop="refereeSupervision2"
                               class="flex-1">
              <a-input v-model="form.refereeSupervision2"
                       placeholder="请输入裁判监督"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 比赛监督 -->
        <a-form-model-item label="比赛监督">
          <div class="d-flex h40">
            <a-form-model-item prop="matchSupervise1"
                               class="flex-1">
              <a-input v-model="form.matchSupervise1"
                       placeholder="请输入比赛监督"
                       allowClear
                       :maxLength="20" />
            </a-form-model-item>
            <span class="mx-4 h40"></span>
            <a-form-model-item prop="matchSupervise2"
                               class="flex-1">
              <a-input v-model="form.matchSupervise2"
                       placeholder="请输入比赛监督"
                       allowClear
                       :maxLength="20" />
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
import { refereeInfoSave } from "@/services/scoreModals";
export default {
  name: "refereeInfoModal",
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "添加裁判信息",
      openType: 0,
      confirmLoading: false,
      form: {
        schedulesId: null,
        timeMan: undefined, // 计时
        recordMan: undefined, // 记录
        declareMan: undefined, // 宣告
        referee1: undefined, // 主裁
        referee2: undefined,
        sideReferee1: undefined, // 边裁
        sideReferee2: undefined,
        refereeSupervision1: undefined, // 裁判监督
        refereeSupervision2: undefined,
        matchSupervise1: undefined, // 比赛监督
        matchSupervise2: undefined,
        penaltyMan1: undefined, // 记罚
        penaltyMan2: undefined,
        assistant1: undefined, // 助理
        assistant2: undefined
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
          const {
            schedulesId,
            timeMan,
            recordMan,
            declareMan,
            referee1,
            referee2,
            sideReferee1,
            sideReferee2,
            refereeSupervision1,
            refereeSupervision2,
            matchSupervise1,
            matchSupervise2,
            penaltyMan1,
            penaltyMan2,
            assistant1,
            assistant2
          } = this.form;
          const data = {
            schedulesId,
            timeMan,
            recordMan,
            declareMan,
            referee: `${referee1},${referee2}`,
            sideReferee: `${sideReferee1},${sideReferee2}`,
            refereeSupervision: `${refereeSupervision1},${refereeSupervision2}`,
            matchSupervise: `${matchSupervise1},${matchSupervise2}`,
            penaltyMan: `${penaltyMan1},${penaltyMan2}`,
            assistant: `${assistant1},${assistant2}`
          };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          refereeInfoSave(data).then(res => {
            this.$refs.loading.closeLoading();
            const result = res.data;
            if (result.code === 0) {
              this.$message.success(result.desc);
              this.handleCancel();
              this.$emit("getRefereeInfoData");
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
