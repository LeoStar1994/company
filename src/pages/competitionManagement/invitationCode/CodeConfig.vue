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
                           prop="name">
          <a-input v-model="form.name"
                   placeholder="请输入联系人"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="联系电话"
                           prop="mobile">
          <a-input v-model="form.mobile"
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
        name: undefined,
        mobile: undefined,
      },
      // 搜索项校验规则
      rules: {
        teamName: [
          {
            required: true,
            message: "请输入球队名称",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入邀请码",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur",
          },
        ],
        mobile: [],
      },
    };
  },
  created() {},
  methods: {
    setOpenType(type) {
      this.openType = type;
      if (type === 0) {
        this.pageTitle = "新增邀请码";
      } else {
        this.pageTitle = "修改邀请码";
      }
      this.visible = true;
    },
    handleOk() {
      // this.confirmLoading = true;
      // setTimeout(() => {
      //   this.visible = false;
      //   this.confirmLoading = false;
      // }, 2000);
      this.onSubmit();
    },
    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // const data = { ...this.form };
          // this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            // addUser(data).then((res) => {
            //   this.$refs.loading.closeLoading();
            //   const result = res.data;
            //   if (result.code === 0) {
            //     this.$message.success(result.desc);
            //     this.$emit("closeConfig");
            //     this.$emit("searchTableData");
            //   } else {
            //     this.$message.error(result.desc);
            //   }
            // });
          } else if (this.openType === 1) {
            // 修改
            // updateUser(data).then((res) => {
            //   this.$refs.loading.closeLoading();
            //   const result = res.data;
            //   if (result.code === 0) {
            //     this.$message.success(result.desc);
            //     this.$emit("closeConfig");
            //     this.$emit("searchTableData");
            //   } else {
            //     this.$message.error(result.desc);
            //   }
            // });
          }
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
