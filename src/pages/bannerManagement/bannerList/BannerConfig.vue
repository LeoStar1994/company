<!--
 * @Description: 焦点图详情弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-02-05 15:35:17
 * @LastEditors: Leo
-->
<template>
  <div class="bannerConfig-page">
    <a-modal :title="pageTitle"
             width="700px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             :maskClosable="false"
             centered
             destroyOnClose
             @ok="handleOk"
             @cancel="closeModal">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 名称 -->
        <a-form-model-item label="名称"
                           prop="focusTitle">
          <a-input v-model="form.focusTitle"
                   placeholder="请输入名称"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 类型 -->
        <a-form-model-item label="类型"
                           prop="pageKey">
          <a-select style="width: 100%"
                    v-model="form.pageKey"
                    allowClear
                    placeholder="请选择类型">
            <a-select-option v-for="item in pageKeyList"
                             :key="item.id"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 动作行为 -->
        <a-form-model-item label="动作行为"
                           prop="action">
          <a-select style="width: 100%"
                    v-model="form.action"
                    allowClear
                    @change="actionChange(form.action)"
                    placeholder="请选择类型">
            <a-select-option v-for="item in actionList"
                             :key="item.id"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- appid -->
        <a-form-model-item label="appid"
                           prop="appid"
                           v-if="Number(form.action) === 2">
          <a-input v-model="form.appid"
                   placeholder="请输入appid"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 链接地址 -->
        <a-form-model-item label="链接地址"
                           prop="linkUrl"
                           v-if="Number(form.action) !== 0 && form.action !== undefined ">
          <a-input v-model="form.linkUrl"
                   placeholder="请输入链接地址"
                   allowClear
                   :maxLength="255" />
        </a-form-model-item>
        <!-- 生效日期 -->
        <a-form-model-item label="生效日期"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="startTime">
              <a-date-picker v-model="form.startTime"
                             :disabled-date="disabledStartDate"
                             show-time
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="endTime">
              <a-date-picker v-model="form.endTime"
                             :disabled-date="disabledEndDate"
                             show-time
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 图片 -->
        <a-form-model-item label="图片"
                           prop="imagePath">
          <div class="clearfix">
            <a-upload :action="bannerUploadUrl"
                      :customRequest="customRequest"
                      accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG"
                      list-type="picture-card"
                      :file-list="pictureList"
                      :before-upload="beforeUpload"
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
                   :src="previewCoverImage" />
            </a-modal>
            <span>宽高比4:3，格式支持jpg、png，大小不超过2M</span>
          </div>
        </a-form-model-item>

        <!-- 排序 -->
        <a-form-model-item label="排序"
                           prop="sortNum">
          <a-input v-model="form.sortNum"
                   placeholder="请输入排序值"
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
import { getBase64 } from "@/utils/util.js";
import {
  getTypeList,
  addBanner,
  updateBanner,
  uploadBannerImage,
} from "@/services/banner";
export default {
  name: "BannerConfig",
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 15, offset: 1 },
      pageTitle: "新增焦点图",
      openType: 0,
      confirmLoading: false,
      linkUrlCheck: false,
      form: {
        action: undefined,
        appid: undefined,
        endTime: null,
        startTime: null,
        sortNum: undefined,
        pageKey: undefined,
        linkUrl: undefined,
        imagePath: undefined,
        focusTitle: undefined,
        id: null,
      },
      // 搜索项校验规则
      rules: {
        startTime: [
          {
            required: true,
            message: "请选择生效开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择生效结束时间",
            trigger: "change",
          },
        ],
        imagePath: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
          },
        ],
        sortNum: [
          {
            required: true,
            message: "请输入排序值",
            trigger: "blur",
          },
          {
            pattern: /^\d+$/,
            message: "排序只能输入数字！",
          },
        ],
        pageKey: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
        action: [
          {
            required: true,
            message: "请选择动作行为",
            trigger: "change",
          },
        ],
        appid: [
          {
            required: true,
            message: "请输入appid",
            trigger: "blur",
          },
        ],
        linkUrl: [
          {
            required: true,
            message: "请输入链接URL",
            trigger: "blur",
          },
        ],
        focusTitle: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
      pageKeyList: [], // 类型list
      actionList: [], // 动作行为list
      pictureList: [], // 图片file list
      previewVisible: false,
      previewCoverImage: "",
    };
  },
  created() {
    this.fetchTypeList();
  },
  methods: {
    setOpenType(type) {
      this.openType = type;
      if (type === 0) {
        this.pageTitle = "新增焦点图";
        this.resetAllFields();
      } else {
        this.pageTitle = "修改焦点图";
      }
      this.visible = true;
    },

    resetAllFields() {
      this.form = {
        action: undefined,
        appid: undefined,
        endTime: null,
        startTime: null,
        sortNum: undefined,
        pageKey: undefined,
        linkUrl: undefined,
        imagePath: undefined,
        focusTitle: undefined,
        id: null,
      };
    },

    actionChange(action) {
      const numberAction = Number(action);
      if (numberAction === 0) {
        this.form.appid = undefined;
        this.form.linkUrl = undefined;
      } else if (numberAction === 1 || numberAction === 3) {
        this.form.appid = undefined;
      }
    },

    fetchTypeList() {
      getTypeList().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.pageKeyList = result.data.pageKeyEnumSelectedModel;
          this.actionList = result.data.focusActionEnumSelectedModel;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    disabledStartDate(startValue) {
      const endValue = this.form.endTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > new Date(endValue).valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.form.startTime;
      if (!endValue || !startValue) {
        return false;
      }
      return new Date(startValue).valueOf() >= endValue.valueOf();
    },

    handleCancel() {
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
        this.$message.warning("图片只能上传一张图片");
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

    // 自定义上传
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
      uploadBannerImage(formData)
        .then((res) => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.imagePath = result.data.fileUrl;
            this.$refs.ruleForm.validateField("imagePath");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    handleOk() {
      this.onSubmit();
    },

    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addBanner(data)
              .then((res) => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.closeModal();
                  this.$emit("searchTableData");
                } else {
                  this.$message.error(result.desc);
                }
              })
              .catch(() => {
                this.$refs.loading.closeLoading();
              });
          } else if (this.openType === 1) {
            // 修改
            updateBanner(data)
              .then((res) => {
                this.$refs.loading.closeLoading();
                const result = res.data;
                if (result.code === 0) {
                  this.$message.success(result.desc);
                  this.closeModal();
                  this.$emit("searchTableData");
                } else {
                  this.$message.error(result.desc);
                }
              })
              .catch(() => {
                this.$refs.loading.closeLoading();
              });
          }
        } else {
          return false;
        }
      });
    },
    resetAllData() {
      this.$refs.ruleForm.resetFields();
      this.pictureList = [];
    },
    closeModal() {
      this.resetAllData();
      this.visible = false;
    },
  },
};
</script>
