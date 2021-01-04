<!--
 * @Description: 赛事列表 / 详情页
 * @Author: Leo
 * @Date: 2020-12-23 14:52:44
 * @LastEditTime: 2021-01-04 19:13:08
 * @LastEditors: Leo
-->
<template>
  <div class="competitionConfig-page"
       v-if="configshow">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <a-form-model ref="competitionForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 赛事名称 -->
        <a-form-model-item label="赛事名称"
                           prop="hockeyGamesName">
          <a-input v-model="form.hockeyGamesName"
                   allowClear
                   placeholder="请输入赛事名称"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 比赛类型 -->
        <a-form-model-item label="比赛类型"
                           prop="hockeyGameType">
          <a-select style="width: 100%"
                    v-model="form.hockeyGameType"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in hockeyGameTypeList"
                             :key="index"
                             :value="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 比赛组别 -->
        <a-form-model-item label="比赛组别"
                           prop="gameGrade">
          <a-checkbox-group v-model="form.gameGrade"
                            style="width: 100%">
            <a-row>
              <a-col :span="6"
                     v-for="(item, index) in gameGradeList"
                     :key="index">
                <a-checkbox :value="item.value">
                  {{item.label}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 预报名时间 -->
        <a-form-model-item label="预报名时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="preEnrollStartTime">
              <a-date-picker v-model="form.preEnrollStartTime"
                             :disabled-date="disabledStartDate"
                             show-time
                             valueFormat="YYYY-MM-DD"
                             format="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="preEnrollEndTime">
              <a-date-picker v-model="form.preEnrollEndTime"
                             :disabled-date="disabledEndDate"
                             show-time
                             valueFormat="YYYY-MM-DD"
                             format="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 报名时间 -->
        <a-form-model-item label="报名时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="enrollStartTime">
              <a-date-picker v-model="form.enrollStartTime"
                             :disabled-date="disabledStartDate1"
                             show-time
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="enrollEndTime">
              <a-date-picker v-model="form.enrollEndTime"
                             :disabled-date="disabledEndDate1"
                             show-time
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 比赛时间 -->
        <a-form-model-item label="比赛时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="gameStartTime">
              <a-date-picker v-model="form.gameStartTime"
                             :disabled-date="disabledStartDate2"
                             show-time
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="gameEndTime">
              <a-date-picker v-model="form.gameEndTime"
                             :disabled-date="disabledEndDate2"
                             show-time
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 报名是否需要验证码 -->
        <a-form-model-item label="报名是否需要验证码"
                           prop="needPreCode">
          <a-radio-group v-model="form.needPreCode">
            <a-radio :value="item.value"
                     v-for="(item,index) in needPreCodeList"
                     :key="index">{{item.label}}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 竞赛规程 -->
        <a-form-model-item label="竞赛规程"
                           prop="gameRuleName">
          <div class="">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".pdf"
                      :multiple="true"
                      :file-list="gameRulefileList"
                      :customRequest="customRequest2"
                      :remove="gameRuleFileRemove"
                      @change="gameRuleUploadChange">
              <a-button>
                <a-icon type="upload" /> 上传文件
              </a-button>
            </a-upload>
            <span class="ml-10">仅支持pdf格式文件</span>
          </div>
        </a-form-model-item>
        <!-- 宣传封面 -->
        <a-form-model-item label="宣传封面"
                           prop="imageUrl">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="coverPictureList"
                      :before-upload="beforeUpload"
                      :customRequest="customRequest"
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
        <!-- 分享图片 -->
        <a-form-model-item label="分享图片"
                           prop="shareImageUrl">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="sharePictureList"
                      :before-upload="beforeUpload"
                      :customRequest="customRequest1"
                      @preview="handleImgPreview1"
                      @change="handleImgChange1">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </a-upload>
            <a-modal :visible="previewVisible1"
                     :footer="null"
                     @cancel="handleCancel1">
              <img alt="example"
                   style="width: 100%"
                   :src="previewShareImage" />
            </a-modal>
            <span>图片尺寸为5:4，格式支持jpg、png，大小不要超过2M</span>
          </div>
        </a-form-model-item>
        <!-- 分享文案 -->
        <a-form-model-item label="分享文案"
                           prop="shareText">
          <a-input v-model="form.shareText"
                   allowClear
                   placeholder="请输入分享文案（限30字）"
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 赛事介绍 -->
        <a-form-model-item label="赛事介绍"
                           prop="gameIntroducation">
          <Editor v-model="form.gameIntroducation"
                  :isClear="editorIsClear"
                  @change="editorChange"></Editor>
        </a-form-model-item>
        <!-- 主办单位 -->
        <a-form-model-item label="主办单位"
                           prop="masterOrganizer">
          <a-input v-model="form.masterOrganizer"
                   placeholder="请输入主办单位"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 承办单位 -->
        <a-form-model-item label="承办单位"
                           prop="secondaryOrganizer">
          <a-input v-model="form.secondaryOrganizer"
                   placeholder="请输入承办单位"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 举办场地 -->
        <a-form-model-item label="举办场地"
                           prop="gamePlace">
          <a-input v-model="form.gamePlace"
                   allowClear
                   placeholder="请输入举办场地"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 状态 -->
        <a-form-model-item label="状态"
                           prop="saleStatus">
          <a-radio-group v-model="form.saleStatus">
            <a-radio :value="item.value"
                     v-for="(item, index) in saleStatusList"
                     :key="index">{{item.label}}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 报名表接收人 -->
        <a-form-model-item label="报名表接收人"
                           prop="receiveMan">
          <a-input v-model="form.receiveMan"
                   allowClear
                   placeholder="请输入报名表接收人"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 接受邮件 -->
        <a-form-model-item label="接受邮件"
                           prop="receiveEmail">
          <a-input v-model="form.receiveEmail"
                   allowClear
                   placeholder="请输入报名表接受邮件地址"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- buttons -->
        <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
          <a-button type="primary"
                    class="mr-20"
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
import { uploadImage, addGame, updateGame } from "@/services/competition";
import { getBase64 } from "@/utils/util.js";
import Editor from "@/components/wangEditor/wangEditor.vue";

export default {
  name: "CompetitionConfig",
  props: {
    configshow: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Editor,
  },
  data() {
    return {
      openType: null, // 0新增 1修改
      currentId: null, // 修改时使用，id
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      editorIsClear: false, // 富文本编辑器是否clear
      hockeyGameTypeList: [
        { label: "国际级", value: 1 },
        { label: "国家级", value: 2 },
        { label: "国际邀请赛", value: 3 },
        { label: "国内联赛", value: 4 },
      ],
      needPreCodeList: [
        { label: "不需要", value: 0 },
        { label: "需要", value: 1 },
      ],
      saleStatusList: [
        { label: "上线", value: 0 },
        { label: "下线", value: 1 },
      ],
      gameGradeList: [
        { label: "U12", value: "U12" },
        { label: "U14", value: "U14" },
        { label: "U16", value: "U16" },
        { label: "U18", value: "U18" },
        { label: "成年组-男子", value: "成年组-男子" },
        { label: "成年组-女子", value: "成年组-女子" },
      ],
      form: {
        enrollStartTime: null, // 报名开始时间
        enrollEndTime: null, // 报名结束时间
        gameStartTime: null, // 比赛开始时间
        gameEndTime: null, // 比赛结束时间
        preEnrollStartTime: null, // 预报名开始时间
        preEnrollEndTime: null, // 预报名结束时间
        gameGrade: [], // 比赛组别
        gamePlace: "", // 举办场地
        gameRuleName: [], // 竞赛规程文件名（可多选，逗号隔开）
        gameRulePath: [], // 竞赛规程文件路径（可多选，逗号隔开）
        hockeyGameType: undefined, // 比赛类型 1国际级 2国家级 3国际邀请赛 4国内联赛
        hockeyGamesName: "", // 赛事名称
        imageUrl: "", // 宣传封面地址
        masterOrganizer: "", // 主办单位
        needPreCode: 0, // 报名是否需要验证码 0不需要 1需要
        receiveEmail: "", // 接收邮件
        receiveMan: "", // 报名表接收人
        saleStatus: 0, // 状态 0上架 1下架
        secondaryOrganizer: "", // 承办单位
        shareImageUrl: "", // 分享图片地址
        shareText: "", // 分享文案
        gameIntroducation: "", // 赛事介绍
      },
      // 搜索项校验规则
      rules: {
        hockeyGamesName: [
          {
            required: true,
            message: "请输入赛事名称",
            trigger: "blur",
          },
          // {
          //   min: 3,
          //   max: 10,
          //   message: "Length should be 3 to 5",
          //   trigger: "blur",
          // },
        ],
        hockeyGameType: [
          {
            required: true,
            message: "请输入比赛类型",
            trigger: "change",
          },
        ],
        gameGrade: [
          {
            required: true,
            message: "请选择比赛组别",
            trigger: "change",
          },
        ],
        needPreCode: [
          {
            required: true,
            message: "请选择报名是否需要验证码",
            trigger: "change",
          },
        ],
        saleStatus: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
        imageUrl: [
          {
            required: true,
            message: "请上传宣传封面",
            trigger: "change",
          },
        ],
        shareImageUrl: [
          {
            required: true,
            message: "请上传分享图片",
            trigger: "change",
          },
        ],
        gameRuleName: [
          {
            required: true,
            message: "请上传竞赛规程",
            trigger: "change",
          },
        ],
        receiveEmail: [
          {
            required: true,
            message: "请输入报名表接受邮件地址",
            trigger: "blur",
          },
        ],
        receiveMan: [
          {
            required: true,
            message: "请输入报名表接收人",
            trigger: "blur",
          },
        ],
        shareText: [
          {
            required: true,
            message: "请输入分享文案",
            trigger: "blur",
          },
        ],
        masterOrganizer: [
          {
            required: true,
            message: "请输入主办单位",
            trigger: "blur",
          },
        ],
        secondaryOrganizer: [
          {
            required: true,
            message: "请输入承办单位",
            trigger: "blur",
          },
        ],
        preEnrollStartTime: [
          {
            required: true,
            message: "请选择预报名开始时间",
            trigger: "change",
          },
        ],
        preEnrollEndTime: [
          {
            required: true,
            message: "请选择预报名结束时间",
            trigger: "change",
          },
        ],
        enrollStartTime: [
          {
            required: true,
            message: "请选择报名开始时间",
            trigger: "change",
          },
        ],
        enrollEndTime: [
          {
            required: true,
            message: "请选择报名结束时间",
            trigger: "change",
          },
        ],
        gameStartTime: [
          {
            required: true,
            message: "请选择比赛开始时间",
            trigger: "change",
          },
        ],
        gameEndTime: [
          {
            required: true,
            message: "请选择比赛结束时间",
            trigger: "change",
          },
        ],
        gamePlace: [
          {
            required: true,
            message: "请输入举办场地",
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

      gameRulefileList: [], // 竞赛规程file list

      coverPictureList: [], // 宣传封面file list
      previewVisible: false,
      previewCoverImage: "",

      sharePictureList: [], // 分享图片file list
      previewVisible1: false,
      previewShareImage: "",
    };
  },
  computed: {
    ...mapState(["pageMinHeight"]),
  },
  created() {},
  methods: {
    setOpenType(openType, id) {
      this.openType = openType;
      this.currentId = id;
      if (openType === 0) {
        this.$nextTick(() => {
          this.resetData();
          this.$refs.competitionForm.resetFields();
        });
      }
    },

    // date picker
    // 预报名时间
    disabledStartDate(startValue) {
      const endValue = this.form.preEnrollEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > new Date(endValue).valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.form.preEnrollStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return new Date(startValue).valueOf() >= endValue.valueOf();
    },

    // 报名时间
    disabledStartDate1(startValue) {
      const endValue = this.form.enrollEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > new Date(endValue).valueOf();
    },
    disabledEndDate1(endValue) {
      const startValue = this.form.enrollStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return new Date(startValue).valueOf() >= endValue.valueOf();
    },

    // 比赛时间
    disabledStartDate2(startValue) {
      const endValue = this.form.gameEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > new Date(endValue).valueOf();
    },
    disabledEndDate2(endValue) {
      const startValue = this.form.gameStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return new Date(startValue).valueOf() >= endValue.valueOf();
    },

    // upload
    // 竞赛规程
    gameRuleUploadChange({ fileList }) {
      this.gameRulefileList = fileList;
    },

    gameRuleFileRemove(file) {
      const arr = this.form.gameRuleName.split();
      arr.forEach((item, index) => {
        if (item === file.name) {
          arr.splice(index, 1);
        }
      });
      this.form.gameRuleName = arr.length ? arr.join() : "";
    },

    customRequest2(options) {
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
      uploadImage(formData).then((res) => {
        options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.form.gameRuleName.push(result.data.uploadFilename);
          this.form.gameRulePath.push(result.data.fileUrl);
          this.$refs.competitionForm.validateField("gameRuleName");
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 宣传封面
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
      this.coverPictureList = fileList;
      if (fileList.length === 2) {
        this.coverPictureList = fileList.slice(1);
        this.$message.warning("宣传封面只能上传一张图片");
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
      uploadImage(formData).then((res) => {
        options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.form.imageUrl = result.data.fileUrl;
          this.$refs.competitionForm.validateField("imageUrl");
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 分享图片
    handleCancel1() {
      this.previewVisible1 = false;
    },
    async handleImgPreview1(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewShareImage = file.url || file.preview;
      this.previewVisible1 = true;
    },
    handleImgChange1({ fileList }) {
      this.sharePictureList = fileList;
      if (fileList.length === 2) {
        this.sharePictureList = fileList.slice(1);
        this.$message.warning("分享只能上传一张图片");
      }
    },
    customRequest1(options) {
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
      uploadImage(formData).then((res) => {
        options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.form.shareImageUrl = result.data.fileUrl;
          this.$refs.competitionForm.validateField("shareImageUrl");
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 富文本编辑器
    editorChange(val) {
      this.form.gameIntroducation = val;
    },

    // 保存
    onSubmit() {
      this.$refs.competitionForm.validate((valid) => {
        if (valid) {
          const data = {
            ...this.form,
            gameGrade: this.form.gameGrade.join(),
            gameRuleName: this.form.gameRuleName.join(),
            gameRulePath: this.form.gameRulePath.join(),
          };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addGame(data).then((res) => {
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
          } else if (this.openType === 1) {
            // 修改
            data.id = this.currentId;
            updateGame(data).then((res) => {
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
    resetData() {
      this.$refs.competitionForm.resetFields();
      this.gameRulefileList = []; // 竞赛规程file list
      this.coverPictureList = []; // 宣传封面file list
      this.sharePictureList = []; // 分享图片file list
    },

    // 取消
    resetForm() {
      this.resetData();
      this.$emit("closeConfig");
    },
  },
};
</script>

