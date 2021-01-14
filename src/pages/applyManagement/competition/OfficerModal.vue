<!--
 * @Description: 官员信息修改modal
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-14 17:37:27
 * @LastEditors: Leo
-->
<template>
  <div class="codeConfig-page">
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
        <a-form-model-item label="姓名"
                           prop="trainName">
          <a-input v-model="form.trainName"
                   placeholder="请输入姓名"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="职务"
                           prop="positionName">
          <a-input v-model="form.positionName"
                   placeholder="请输入职务"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="性别"
                           prop="trainSex">
          <a-radio-group v-model="form.trainSex">
            <a-radio :value="item.value"
                     v-for="(item,index) in sexList"
                     :key="index">
              {{item.label}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="国籍"
                           prop="country">
          <a-input v-model="form.country"
                   placeholder="请输入国籍"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="身份证/护照号码"
                           prop="identityCard">
          <a-input v-model="form.identityCard"
                   placeholder="请输入身份证/护照号码"
                   allowClear
                   :maxLength="50" />
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
import { officerUpdate } from "@/services/competition";
export default {
  name: "CodeConfig",
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "修改官员信息",
      confirmLoading: false,
      sexList: [
        { label: "男", value: "0" },
        { label: "女", value: "1" },
      ],
      form: {
        trainName: undefined,
        trainSex: undefined,
        positionName: undefined,
        country: undefined,
        identityCard: undefined,
        id: null,
      },
      // 搜索项校验规则
      rules: {
        trainName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        trainSex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
        positionName: [
          {
            required: true,
            message: "请输入职务",
            trigger: "blur",
          },
        ],
        country: [
          {
            required: true,
            message: "请输入国家",
            trigger: "blur",
          },
        ],
        identityCard: [
          {
            required: true,
            message: "请输入身份证/护照",
            trigger: "blur",
          },
        ],
      },
      currentId: null,
    };
  },
  created() {},
  methods: {
    setOpenType(data) {
      this.form = { ...data };
      this.visible = true;
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
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          officerUpdate(data).then((res) => {
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
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
  },
};
</script>
