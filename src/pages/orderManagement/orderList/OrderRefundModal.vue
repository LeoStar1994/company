<!--
 * @Description: 订单退款弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-03-29 14:09:52
 * @LastEditors: Leo
-->
<template>
  <div class="orderRefund-modal">
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
        <!-- 退款流水号 -->
        <a-form-model-item label="退款流水号"
                           prop="wxSerialNumber">
          <a-input v-model="form.wxSerialNumber"
                   placeholder="请输入退款流水号"
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
import { orderRefund } from "@/services/order";
export default {
  name: "OrderRefundModal",
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "退款确认",
      confirmLoading: false,
      form: {
        wxSerialNumber: null, // 流水号
        id: undefined,
      },
      // 搜索项校验规则
      rules: {
        wxSerialNumber: [
          {
            required: true,
            message: "请输入退款流水号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    setOpenType(id) {
      this.form.id = id;
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
          orderRefund(data)
            .then((res) => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.handleCancel();
                this.$emit("searchTableData");
              } else {
                this.$message.error(result.desc);
              }
            })
            .catch(() => {
              this.$refs.loading.closeLoading();
            });
        } else {
          return false;
        }
      });
    },

    resetFormFields() {
      this.form = {
        wxSerialNumber: null, // 流水号
        id: undefined,
      };
    },
    handleCancel() {
      this.resetFormFields();
      this.visible = false;
    },
  },
};
</script>
