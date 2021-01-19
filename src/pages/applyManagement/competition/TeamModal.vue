<!--
 * @Description: 球队信息修改modal
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-19 15:46:56
 * @LastEditors: Leo
-->
<template>
  <div class="team-modal">
    <a-modal :title="pageTitle"
             width="620px"
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
        <!-- 球队名称 -->
        <a-form-model-item prop="teamName"
                           label="球队名称">
          <a-input v-model="form.teamName"
                   placeholder="请输入球队名称"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 球队区域 -->
        <a-form-model-item label="球队区域"
                           prop="teamArea">
          <a-select style="width: 100%"
                    v-model="form.teamArea"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="item in teamAreaList"
                             :key="item.id"
                             :value="item.keyAlias">
              {{item.valueAlias}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 年龄组 -->
        <a-form-model-item label="年龄组"
                           prop="yearType">
          <a-radio-group v-model="form.yearType">
            <a-radio :value="item"
                     v-for="(item,index) in yearTypeList"
                     :key="index">
              {{item}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 主场颜色 -->
        <a-form-model-item label="主场颜色"
                           prop="mainColor">
          <a-input v-model="form.mainColor"
                   placeholder="请输入主场颜色"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 客场颜色 -->
        <a-form-model-item label="客场颜色"
                           prop="secondColor">
          <a-input v-model="form.secondColor"
                   placeholder="请输入客场颜色"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 联系人 -->
        <a-form-model-item label="联系人"
                           prop="linkMan">
          <a-input v-model="form.linkMan"
                   placeholder="请输入联系人"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 联系电话 -->
        <a-form-model-item label="联系电话"
                           prop="telPhone">
          <a-input v-model="form.telPhone"
                   placeholder="请输入联系电话"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 球队学校 -->
        <!-- <a-form-model-item label="球队学校"
                           prop="teamSchool">
          <a-input v-model="form.teamSchool"
                   placeholder="请输入球队学校"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item> -->
        <!-- 球队简称 -->
        <!-- <a-form-model-item label="球队简称"
                           prop="teamShortName">
          <a-input v-model="form.teamShortName"
                   placeholder="请输入球队简称"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item> -->
        <!-- 球队logo -->
        <a-form-model-item label="球队logo"
                           prop="teamLogoPath">
          <a-upload name="avatar"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :before-upload="beforeUpload"
                    :customRequest="avatarCustomRequest"
                    @change="avatarHandleChange">
            <img v-if="form.teamLogoPath"
                 :src="form.teamLogoPath"
                 width="86px"
                 alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传球队logo</div>
            </div>
          </a-upload>
        </a-form-model-item>
        <!-- 集体照 -->
        <a-form-model-item label="集体照"
                           prop="teamImage">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="pictureList"
                      :before-upload="beforeUpload"
                      :remove="handleImgRemove"
                      :customRequest="customRequest"
                      @preview="handleImgPreview"
                      @change="handleImgChange">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
            </a-upload>
            <a-modal :visible="previewVisible"
                     :footer="null"
                     @cancel="closeImageModal">
              <img alt="example"
                   style="width: 100%"
                   :src="previewImage" />
            </a-modal>
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
import { getBaseData, baseInfoUpdate } from "@/services/competition";
import { uploadImage } from "@/services/competitionList";
import { getBase64 } from "@/utils/util.js";
export default {
  name: "TeamModal",
  props: {
    yearTypeList: {
      type: Array,
      required: true,
    },
    teamAreaList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "修改球队信息",
      confirmLoading: false,
      form: {
        teamArea: undefined, // 球队区域
        teamSchool: undefined, // 球队学校
        teamName: undefined, // 球队名称
        teamShortName: undefined, // 球队简称
        teamLogoPath: undefined, // 球队logo
        mainColor: undefined, // 主场颜色
        secondColor: undefined, // 客场颜色
        yearType: undefined, // 年龄组
        linkMan: undefined, // 联系人
        telPhone: undefined, // 联系电话
        teamImage: [], // 集体照
        id: null, // 球队id
      },
      // 搜索项校验规则
      rules: {
        teamArea: [
          {
            required: true,
            message: "请输入球队区域",
            trigger: "blur",
          },
        ],
        // teamSchool: [
        //   {
        //     required: true,
        //     message: "请输入球队学校",
        //     trigger: "blur",
        //   },
        // ],
        teamName: [
          {
            required: true,
            message: "请输入球队名称",
            trigger: "blur",
          },
        ],
        // teamShortName: [
        //   {
        //     required: true,
        //     message: "请输入球队简称",
        //     trigger: "blur",
        //   },
        // ],
        teamLogoPath: [
          {
            required: true,
            message: "请上传球队logo",
            trigger: "change",
          },
        ],
        mainColor: [
          {
            required: true,
            message: "请输入主场颜色",
            trigger: "blur",
          },
        ],
        secondColor: [
          {
            required: true,
            message: "请输入客场颜色",
            trigger: "blur",
          },
        ],
        yearType: [
          {
            required: true,
            message: "请选择年龄组",
            trigger: "change",
          },
        ],
        linkMan: [
          {
            required: true,
            message: "请输入联系人",
            trigger: "blur",
          },
        ],
        telPhone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur",
          },
        ],
        teamImage: [
          {
            required: true,
            message: "请上传集体照",
            trigger: "change",
          },
        ],
      },

      // 头像
      loading: false,
      // 证件照
      pictureList: [],
      previewVisible: false,
      previewImage: "",
    };
  },
  methods: {
    setOpenType(teamId) {
      getBaseData(teamId).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.form = {
            ...result.data,
            // yearType: result.data.yearType.split(","),
          };
          this.pictureList = result.data.teamImage.map((item, index) => {
            return {
              uid: Math.random(),
              status: "done",
              url: item,
              name: `集体照${index}`,
            };
          });
        } else {
          this.$message.error(result.desc);
        }
      });
      this.visible = true;
    },

    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("只能上传JPEG、PNG格式图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传图片需小于2MB!");
      }
      return isJpgOrPng && isLt2M;
    },

    // logo
    avatarHandleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        this.loading = false;
      }
    },

    // logo自定义上传
    avatarCustomRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      uploadImage(formData)
        .then((res) => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.teamLogoPath = result.data.fileUrl;
            this.$refs.ruleForm.validateField("teamLogoPath");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    // 集体照
    async handleImgPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleImgChange({ fileList }) {
      this.pictureList = fileList;
      if (fileList.length === 2) {
        this.pictureList = fileList.slice(1);
        this.$message.warning("集体照只能上传一张照片");
      }
    },
    customRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      let progress = { percent: 1 };
      let speed = 100 / (options.file.size / 65000); //上传速度
      const intervalId = setInterval(() => {
        if (progress.percent < 100) {
          progress.percent += speed;
          options.onProgress(progress);
        } else {
          clearInterval(intervalId);
        }
      }, 100);
      uploadImage(formData)
        .then((res) => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.teamImage.push(result.data.fileUrl);
            this.$refs.ruleForm.validateField("teamImage");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    handleImgRemove(file) {
      this.form.teamImage.forEach((item, index) => {
        if (item === file.url) {
          this.form.teamImage.splice(index, 1);
        }
      });
    },

    closeImageModal() {
      this.previewVisible = false;
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
          const data = {
            ...this.form,
            teamImage: this.form.teamImage.join(),
            // yearType: this.form.yearType.join(),
          };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          baseInfoUpdate(data).then((res) => {
            this.$refs.loading.closeLoading();
            const result = res.data;
            if (result.code === 0) {
              this.$message.success(result.desc);
              this.handleCancel();
              this.$emit("refreshAllInfoData", data.id);
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
      this.pictureList = [];
      this.visible = false;
    },
  },
};
</script>

<style lang="less">
.avatar-uploader > .ant-upload {
  width: 100px;
  height: 100px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.ant-modal-body {
  max-height: 660px !important;
  overflow-y: auto !important;
}
</style>