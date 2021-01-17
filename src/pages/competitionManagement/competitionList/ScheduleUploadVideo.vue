<!--
 * @Description: 赛事列表 => 赛事日程 => 上传视频modal
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-14 15:12:57
 * @LastEditors: Leo
-->
<template>
  <div class="uploadVideo-modal">
    <a-modal :title="pageTitle"
             width="500px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             centered
             destroyOnClose
             :maskClosable="false"
             @ok="handleOk"
             okText="保存"
             @cancel="handleCancel">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 视频 -->
        <a-form-model-item label="视频"
                           prop="videoUrls">
          <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept=".avi,.wmv,.mpeg,.wma,.rmvb,.rm,.flash,.mp4,.mid"
                    :multiple="true"
                    :file-list="videoList"
                    :customRequest="customRequest"
                    :remove="videoRemove"
                    @change="videoUploadChange">
            <a-button>
              <a-icon type="upload" /> 上传视频
            </a-button>
          </a-upload>
        </a-form-model-item>
        <!-- 封面图 -->
        <a-form-model-item label="封面图"
                           prop="imgUrls">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="pictureList"
                      :before-upload="beforeUpload"
                      :remove="handleImgRemove"
                      :customRequest="customRequestPicture"
                      @preview="handleImgPreview"
                      @change="handleImgChange">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </a-upload>
            <a-modal :visible="previewVisible"
                     :footer="null"
                     @cancel="handlePreviewImgCancel">
              <img alt="example"
                   style="width: 100%"
                   :src="previewCoverImage" />
            </a-modal>
            <span>宽高比4:3，格式支持jpg、png，大小不超过2M</span>
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
import { uploadImage, videoSave } from "@/services/competitionList";
import { getBase64 } from "@/utils/util.js";

export default {
  name: "uploadVideoModal",
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "上传视频",
      confirmLoading: false,
      form: {
        videoNames: "", // 视频名称
        videoUrls: "", // 视频连接
        imgUrls: "", //	封面图链接
        schedulesId: null
      },
      // 搜索项校验规则
      rules: {
        videoUrls: [
          {
            required: true,
            message: "请上传视频"
            // trigger: "change",
          }
        ],
        imgUrls: [
          {
            required: true,
            message: "请上传封面图"
            // trigger: "change",
          }
        ]
      },
      // 视频
      videoList: [],

      // 封面图
      pictureList: [], // 宣传封面file list
      previewVisible: false,
      previewCoverImage: ""
    };
  },
  created() {},
  methods: {
    setOpenType(id) {
      this.form.schedulesId = id;
      this.visible = true;
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
        .then(res => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.videoNames = result.data.uploadFilename;
            this.form.videoUrls = result.data.fileUrl;
            this.$refs.ruleForm.validateField("videoUrls");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    videoUploadChange({ fileList }) {
      this.videoList = fileList;
    },

    videoRemove() {
      this.form.videoUrls = "";
      this.form.videoNames = "";
    },

    // 封面图
    handlePreviewImgCancel() {
      this.previewVisible = false;
    },
    async handleImgPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewCoverImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleImgChange({ fileList }) {
      this.pictureList = fileList;
      if (fileList.length === 2) {
        this.pictureList = fileList.slice(1);
        this.$message.warning("封面图只能上传一张图片");
      }
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
    customRequestPicture(options) {
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
        .then(res => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.imgUrls = result.data.fileUrl;
            this.$refs.ruleForm.validateField("imgUrls");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },
    handleImgRemove() {
      this.form.imageUrl = "";
    },

    async handleOk() {
      if (this.videoList.length === 0) {
        this.$message.warning("请先上传视频再进行保存");
        return;
      }
      if (this.pictureList.length === 0) {
        this.$message.warning("请先上传封面图再进行保存");
        return;
      }
      this.confirmLoading = true;
      await this.saveVideoInfo();
      this.confirmLoading = false;
    },

    saveVideoInfo() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          videoSave(data)
            .then(res => {
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

    handleCancel() {
      this.videoList = [];
      this.pictureList = [];
      this.visible = false;
    }
  }
};
</script>

<style lang="less">
.ant-upload-list-item {
  margin-bottom: 8px !important;
}
</style>