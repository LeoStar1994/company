<!--
 * @Description: 邀请码弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2020-12-29 17:38:06
 * @LastEditors: Leo
-->
<template>
  <div class="codeConfig-page">
    <a-modal :title="pageTitle"
             width="400px"
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
        <a-form-model-item label="邀请码"
                           prop="code">
          <a-input v-model="form.code"
                   placeholder="请输入邀请码"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="球队名称"
                           prop="teamName">
          <a-input v-model="form.teamName"
                   placeholder="请输入球队名称"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="联系人"
                           prop="linkMan">
          <a-input v-model="form.linkMan"
                   placeholder="请输入联系人"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="联系电话"
                           prop="telPhone">
          <a-input v-model="form.telPhone"
                   placeholder="请输入联系电话"
                   allowClear
                   :maxLength="20" />
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
import { addCode, updateCode } from "@/services/invitationCode";
export default {
  name: "CodeConfig",
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "新增邀请码",
      openType: 0,
      confirmLoading: false,
      form: {
        teamName: undefined,
        code: undefined,
        linkMan: undefined,
        telPhone: undefined,
        hockeyGamesId: null
      },
      // 搜索项校验规则
      rules: {
        teamName: [
          {
            required: true,
            message: "请输入球队名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入邀请码",
            trigger: "blur"
          }
        ],
        linkMan: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur"
          }
        ],
        telPhone: []
      }
    };
  },
  created() {},
  methods: {
    setOpenType(type, id) {
      this.openType = type;
      this.form.hockeyGamesId = id;
      if (type === 0) {
        this.pageTitle = "新增邀请码";
        this.reset();
      } else {
        this.pageTitle = "修改邀请码";
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
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addCode(data).then(res => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.handleCancel();
                this.$emit("searchTableData");
              } else {
                this.$message.error(result.desc);
              }
            });
          } else if (this.openType === 1) {
            // 修改
            updateCode(data).then(res => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.handleCancel();
                this.$emit("searchTableData");
              } else {
                this.$message.error(result.desc);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    reset() {
      this.form = {
        teamName: undefined,
        code: undefined,
        linkMan: undefined,
        telPhone: undefined,
        hockeyGamesId: null
      };
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    }
  }
};
</script>
