<!--
 * @Description: 用户管理details详情页
 * @Author: Leo
 * @Date: 2020-12-23 14:52:44
 * @LastEditTime: 2020-12-29 18:39:23
 * @LastEditors: Leo
-->
<template>
  <div class="usersConfig-page"
       v-if="configshow">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 赛事名称 -->
        <a-form-model-item label="赛事名称"
                           prop="name">
          <a-input v-model="form.name"
                   allowClear
                   placeholder="请输入赛事名称"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 比赛类型 -->
        <a-form-model-item label="比赛类型"
                           prop="applyStatus">
          <a-select style="width: 100%"
                    v-model="form.applyStatus"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in gameTypeList"
                             :key="index"
                             :value="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 比赛组别 -->
        <a-form-model-item label="比赛组别"
                           prop="applyStatus">
          <a-checkbox-group @change="checkChange"
                            style="width: 100%">
            <a-row>
              <a-col :span="4">
                <a-checkbox value="A">
                  A
                </a-checkbox>
              </a-col>
              <a-col :span="4">
                <a-checkbox value="B">
                  B
                </a-checkbox>
              </a-col>
              <a-col :span="4">
                <a-checkbox value="C">
                  C
                </a-checkbox>
              </a-col>
              <a-col :span="4">
                <a-checkbox value="D">
                  D
                </a-checkbox>
              </a-col>
              <a-col :span="4">
                <a-checkbox value="E">
                  E
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 预报名时间 -->
        <a-form-model-item label="预报名时间"
                           prop="account">
          <a-date-picker :locale="locale" />
          <a-date-picker :locale="locale" />
        </a-form-model-item>

        <!-- 主办单位 -->
        <a-form-model-item label="主办单位"
                           prop="account">
          <a-input v-model="form.account"
                   placeholder="请输入主办单位"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 承办单位 -->
        <a-form-model-item label="承办单位"
                           prop="password">
          <a-input v-model="form.password"
                   placeholder="请输入承办单位"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 举办场地 -->
        <a-form-model-item label="举办场地"
                           prop="mobile">
          <a-input v-model="form.mobile"
                   allowClear
                   placeholder="请输入举办场地"
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="状态"
                           prop="state">
          <a-radio-group v-model="form.state">
            <a-radio value="0">下线</a-radio>
            <a-radio value="1">上线</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="报名表接收人"
                           prop="mobile">
          <a-input v-model="form.mobile"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="接受邮件"
                           prop="mobile">
          <a-input v-model="form.mobile"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
          <a-button type="primary"
                    class="mr-20"
                    :disabled="openType === 1"
                    @click="onSubmit">保存
          </a-button>
          <a-button style="margin-left: 10px;"
                    @click="resetForm">取消
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addUser, updateUser } from "@/services/usersManagement";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  name: "UsersConfig",
  props: {
    configshow: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      required: true,
      default: new Array(),
    },
  },
  data() {
    return {
      locale,
      openType: null, // 0新增 1查看 2修改
      sequenceNumber: null, // 修改时使用，id
      gameTypeList: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      treeDefaultObject: {
        title: "name",
        key: "id",
      },
      form: {
        name: "",
        account: "",
        mobile: "",
        password: "",
        remark: "",
        roles: [],
        state: "0",
      },
      // 搜索项校验规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户",
            trigger: "blur",
          },
          // {
          //   min: 3,
          //   max: 10,
          //   message: "Length should be 3 to 5",
          //   trigger: "blur",
          // },
        ],
        account: [
          {
            required: true,
            message: "请输入账号！",
            trigger: "blur",
          },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "账号必须输入邮箱！",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码！",
            trigger: "blur",
          },
          {
            min: 6,
            max: 12,
            message: "请输入6-12位密码！",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号！",
            trigger: "blur",
          },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确手机号！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["pageMinHeight"]),
  },
  created() {},
  methods: {
    setOpenType(openType, sequenceNumber) {
      this.openType = openType;
      this.sequenceNumber = sequenceNumber;
      if (openType === 0) {
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
        });
      }
    },
    checkChange(checkedValues) {
      console.log("checked = ", checkedValues);
    },
    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addUser(data).then((res) => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.$emit("closeConfig");
                this.$emit("searchTableData");
              } else {
                this.$message.error(result.desc);
              }
            });
          } else if (this.openType === 2) {
            // 修改
            data.sequenceNumber = this.sequenceNumber;
            updateUser(data).then((res) => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.$emit("closeConfig");
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
    // 取消
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.$emit("closeConfig");
    },
  },
};
</script>

<style lang="less" scoped>
.usersConfig-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  margin-top: 24px;
}
.treebox {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px 0;
  min-height: 180px;
}
</style>