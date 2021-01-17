<!--
 * @Description: 邀请码弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-05 15:25:30
 * @LastEditors: Leo
-->
<template>
  <div class="codeConfig-page">
    <a-modal :title="pageTitle"
             width="500px"
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
          <div class="d-flex">
            <a-input v-model="form.code"
                     placeholder="请生成邀请码"
                     disabled
                     allowClear
                     class="mr-10"
                     :maxLength="30" />
            <a-button type="primary"
                      @click="getCode">生成邀请码</a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item label="教练名称"
                           prop="refereeName">
          <a-input v-model="form.refereeName"
                   placeholder="请输入教练名称"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <a-form-model-item label="联系人"
                           prop="linkMan">
          <a-input v-model="form.linkMan"
                   placeholder="请输入联系人"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <a-form-model-item label="联系电话"
                           prop="telPhone">
          <a-input v-model="form.telPhone"
                   placeholder="请输入联系电话"
                   allowClear
                   :maxLength="30" />
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
import { addCode, updateCode, getCode } from "@/services/educationCode";
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
        refereeName: undefined,
        code: undefined,
        linkMan: undefined,
        telPhone: undefined
      },
      // 搜索项校验规则
      rules: {
        refereeName: [
          {
            required: true,
            message: "请输入教练名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请生成邀请码",
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
      },
      currentId: null
    };
  },
  created() {},
  methods: {
    setOpenType(type, id) {
      this.openType = type;
      this.currentId = id;
      if (type === 0) {
        this.pageTitle = "新增邀请码";
        this.resetAllFields();
      } else {
        this.pageTitle = "修改邀请码";
      }
      this.visible = true;
    },

    resetAllFields() {
      this.form = {
        refereeName: undefined,
        code: undefined,
        linkMan: undefined,
        telPhone: undefined
      };
    },

    // 生成邀请码
    getCode() {
      getCode().then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.form.code = result.data.code;
        } else {
          this.$message.error(result.desc);
        }
      });
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
            data.id = this.currentId;
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
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    }
  }
};
</script>
