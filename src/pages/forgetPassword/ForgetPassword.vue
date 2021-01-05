<!--
 * @Description: 忘记密码弹框
 * @Author: Leo
 * @Date: 2021-01-05 17:03:57
 * @LastEditTime: 2021-01-05 17:49:32
 * @LastEditors: Leo
-->
<template>
  <a-modal title="忘记密码"
           width="800px"
           :visible="visible"
           centered
           destroyOnClose
           @cancel="handleCancel">
    <a-card :bordered="false">
      <a-steps class="steps"
               :current="current">
        <a-step :title="$t('input')" />
        <a-step :title="$t('confirm')" />
        <a-step :title="$t('complete')" />
      </a-steps>
      <div class="content">
        <step1 v-if="current === 0"
               @nextStep="nextStep"></step1>
        <step2 v-if="current === 1"
               @nextStep="nextStep"
               @prevStep="prevStep"></step2>
        <step3 v-if="current === 2"
               @prevStep="prevStep"
               @finish="finish"></step3>
      </div>
    </a-card>
  </a-modal>

</template>

<script>
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default {
  name: "ForgetPassword",
  i18n: require("./i18n"),
  components: { Step1, Step2, Step3 },
  data() {
    return {
      current: 0,
      visible: false,
      confirmLoading: false,
    };
  },
  methods: {
    nextStep() {
      if (this.current < 2) {
        this.current += 1;
      }
    },
    prevStep() {
      if (this.current > 0) {
        this.current -= 1;
      }
    },
    finish() {
      this.current = 0;
    },
    handleOk() {},
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
// .steps {
//   max-width: 950px;
//   margin: 16px auto;
// }
</style>
