<!--
 * @Description: 用户管理details详情页
 * @Author: Leo
 * @Date: 2020-12-23 14:52:44
 * @LastEditTime: 2020-12-30 12:07:00
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
          <a-date-picker v-model="form.startTime"
                         :disabled-date="disabledStartDate"
                         show-time
                         format="YYYY-MM-DD"
                         placeholder="开始时间" />
          ~
          <a-date-picker v-model="form.endTime"
                         :disabled-date="disabledEndDate"
                         show-time
                         format="YYYY-MM-DD"
                         placeholder="结束时间" />
        </a-form-model-item>
        <!-- 报名时间 -->
        <a-form-model-item label="报名时间"
                           prop="account">
          <a-date-picker v-model="form.startTime"
                         :disabled-date="disabledStartDate"
                         show-time
                         format="YYYY-MM-DD"
                         placeholder="开始时间" />
          ~
          <a-date-picker v-model="form.endTime"
                         :disabled-date="disabledEndDate"
                         show-time
                         format="YYYY-MM-DD"
                         placeholder="结束时间" />
        </a-form-model-item>
        <!-- 比赛时间 -->
        <a-form-model-item label="比赛时间"
                           prop="account">
          <a-date-picker v-model="form.startTime"
                         :disabled-date="disabledStartDate"
                         show-time
                         format="YYYY-MM-DD"
                         placeholder="开始时间" />
          ~
          <a-date-picker v-model="form.endTime"
                         :disabled-date="disabledEndDate"
                         show-time
                         format="YYYY-MM-DD"
                         placeholder="结束时间" />
        </a-form-model-item>
        <!-- 竞赛规程 -->
        <a-form-model-item label="竞赛规程"
                           prop="account">
          <div class="d-flex">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".pdf"
                      :multiple="true"
                      :file-list="fileList"
                      @change="uploadhandleChange">
              <a-button>
                <a-icon type="upload" /> 上传文件
              </a-button>
            </a-upload>
            <span class="ml-10">仅支持pdf格式文件</span>
          </div>
        </a-form-model-item>
        <!-- 宣传封面 -->
        <a-form-model-item label="宣传封面"
                           prop="account">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="coverPictureList"
                      @preview="handleImgPreview"
                      @change="handleImgChange">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </a-upload>
            <a-modal :visible="previewVisible"
                     :footer="null"
                     @cancel="handleCancel">
              <img alt="example"
                   style="width: 100%"
                   :src="previewImage" />
            </a-modal>
            <span>宽高比4:3,格式支持jpg、png，大小不超过200KB</span>
          </div>
        </a-form-model-item>
        <!-- 分享图片 -->
        <a-form-model-item label="分享图片"
                           prop="account">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="coverPictureList"
                      @preview="handleImgPreview"
                      @change="handleImgChange">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </a-upload>
            <a-modal :visible="previewVisible"
                     :footer="null"
                     @cancel="handleCancel">
              <img alt="example"
                   style="width: 100%"
                   :src="previewImage" />
            </a-modal>
            <span>图片尺寸为5:4,格式支持jpg、png,大小不要超过200K</span>
          </div>
        </a-form-model-item>
        <!-- 分享文案 -->
        <a-form-model-item label="分享文案"
                           prop="name">
          <a-input v-model="form.name"
                   allowClear
                   placeholder="请输入分享文案（限30字）"
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 赛事介绍 -->
        <a-form-model-item label="赛事介绍"
                           prop="name">

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
        <!-- 状态 -->
        <a-form-model-item label="状态"
                           prop="state">
          <a-radio-group v-model="form.state">
            <a-radio value="0">下线</a-radio>
            <a-radio value="1">上线</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 报名表接收人 -->
        <a-form-model-item label="报名表接收人"
                           prop="mobile">
          <a-input v-model="form.mobile"
                   allowClear
                   placeholder="请输入报名表接收人"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 接受邮件 -->
        <a-form-model-item label="接受邮件"
                           prop="mobile">
          <a-input v-model="form.mobile"
                   allowClear
                   placeholder="请输入报名表接受邮件地址"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- buttons -->
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
import { getBase64 } from "@/utils/util.js";
// import locale from "ant-design-vue/es/date-picker/locale/zh_CN";

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
      // locale,
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
        startTime: "",
        endTime: "",
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
      fileList: [],

      coverPictureList: [], // 宣传封面上传文件list
      previewVisible: false,
      previewImage: "",

      sharePictureList: [], // 分享上传文件list
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
    // date picker
    disabledStartDate(startValue) {
      const endValue = this.form.endTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.form.startTime;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },

    // upload
    uploadhandleChange() {},

    handleCancel() {
      this.previewVisible = false;
    },
    async handleImgPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleImgChange({ fileList }) {
      if (fileList.length === 2) {
        this.fileList = fileList.slice(1);
        this.$message.warning("宣传封面只能上传一张图片");
      }
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