<!--
 * @Description: 教学管理 / 教学详情弹框.
 * @Author: Leo
 * @Date: 2020-12-23 14:52:44
 * @LastEditTime: 2021-03-10 19:27:32
 * @LastEditors: Leo
-->
<template>
  <div class="educationConfig-page"
       v-if="configshow">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <a-form-model ref="educationForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 标题 -->
        <a-form-model-item label="标题"
                           prop="educationName">
          <a-input v-model="form.educationName"
                   allowClear
                   placeholder="请输入标题"
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 类型 -->
        <a-form-model-item label="类型"
                           prop="educationType">
          <a-select style="width: 100%"
                    v-model="form.educationType"
                    allowClear
                    placeholder="请选择类型">
            <a-select-option v-for="(item,index) in educationTypeList"
                             :key="index"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 面向人群 -->
        <a-form-model-item label="面向人群"
                           prop="toObject">
          <a-select style="width: 100%"
                    :disabled="openType === 1"
                    v-model="form.toObject"
                    @change="isRefeere(form.toObject)"
                    allowClear
                    placeholder="请选择人群">
            <a-select-option v-for="(item,index) in toObjectList"
                             :key="index"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 培训机构 -->
        <a-form-model-item label="培训机构"
                           v-show="form.toObject !== 'refeere' &&  form.toObject !== 'sporter'"
                           prop="organizationIds">
          <a-select style="width: 100%"
                    v-model="form.organizationIds"
                    mode="multiple"
                    allowClear
                    placeholder="请选择培训机构">
            <a-select-option v-for="(item,index) in organizationIdsList"
                             :key="index"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 培训等级 -->
        <a-form-model-item label="培训等级"
                           v-show="form.toObject === 'refeere' || form.toObject === 'sporter'"
                           prop="educationLevel">
          <a-select style="width: 100%"
                    v-model="form.educationLevel"
                    allowClear
                    placeholder="请选择培训等级">
            <a-select-option v-for="(item,index) in educationLevelList"
                             :key="index"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 授课方式 -->
        <a-form-model-item label="授课方式"
                           prop="educationMethod">
          <a-checkbox-group v-model="form.educationMethod"
                            style="width: 100%;vertical-align: middle;">
            <a-row>
              <a-col :span="6"
                     v-for="(item, index) in educationMethodList"
                     :key="index">
                <a-checkbox :value="item.id">
                  {{item.name}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 报名时间 -->
        <a-form-model-item label="报名时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="enrollStartTime"
                               class="flex-1">
              <a-date-picker v-model="form.enrollStartTime"
                             :disabled-date="disabledStartDate1"
                             show-time
                             style="width:100%"
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="enrollEndTime"
                               class="flex-1">
              <a-date-picker v-model="form.enrollEndTime"
                             :disabled-date="disabledEndDate1"
                             show-time
                             style="width:100%"
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 培训时间 -->
        <a-form-model-item label="培训时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="educationStartTime"
                               class="flex-1">
              <a-date-picker v-model="form.educationStartTime"
                             :disabled-date="disabledStartDate2"
                             show-time
                             style="width:100%"
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="educationEndTime"
                               class="flex-1">
              <a-date-picker v-model="form.educationEndTime"
                             show-time
                             style="width:100%"
                             format="YYYY-MM-DD"
                             :disabled-date="disabledEndDate2"
                             valueFormat="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 年龄时间 -->
        <a-form-model-item label="年龄时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="yearOldStartTime"
                               class="flex-1">
              <a-date-picker v-model="form.yearOldStartTime"
                             :disabled-date="disabledStartDate3"
                             show-time
                             style="width:100%"
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="yearOldEndTime"
                               class="flex-1">
              <a-date-picker v-model="form.yearOldEndTime"
                             :disabled-date="disabledEndDate3"
                             show-time
                             style="width:100%"
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
            <a-radio :value="item.id"
                     v-for="item in needPreCodeList"
                     :key="item.id">
              {{item.name}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 主办单位 -->
        <a-form-model-item label="主办单位"
                           prop="masterOrganizer">
          <a-input v-model="form.masterOrganizer"
                   placeholder="请输入主办单位"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 培训地点 -->
        <a-form-model-item label="培训地点"
                           prop="address">
          <a-input v-model="form.address"
                   allowClear
                   placeholder="请输入培训地点"
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 入住酒店 -->
        <a-form-model-item label="入住酒店"
                           v-show="form.toObject === 'refeere' || form.toObject === 'sporter'"
                           prop="hotelIds">
          <a-checkbox-group v-model="form.hotelIds"
                            v-if="hotelIdsList.length > 0"
                            style="width: 100%;vertical-align: middle;">
            <a-row>
              <a-col :span="6"
                     v-for="(item, index) in hotelIdsList"
                     :key="index">
                <a-checkbox :value="item.id">
                  {{item.name}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <a-button @click="hotelNameIsShow = true"
                    type="primary">增加酒店</a-button>
        </a-form-model-item>
        <!-- 酒店名称 -->
        <a-form-model-item label="酒店名称"
                           v-if="hotelNameIsShow"
                           prop="hotelName">
          <a-input v-model="form.hotelName"
                   allowClear
                   placeholder="请输入酒店名称"
                   :maxLength="30" />
          <a-button @click="saveNewHotel"
                    class="mr-10"
                    type="primary">保存酒店</a-button>
          <a-button @click="cancelAddHotel">取消</a-button>
        </a-form-model-item>
        <!-- 房间类型 -->
        <a-form-model-item label="房间类型"
                           v-show="form.toObject === 'refeere' || form.toObject === 'sporter' "
                           prop="roomType">
          <a-checkbox-group v-model="form.roomType"
                            style="width: 100%;vertical-align: middle;">
            <a-row>
              <a-col :span="6"
                     v-for="(item, index) in roomTypeList"
                     :key="index">
                <a-checkbox :value="item.id">
                  {{item.name}}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 宣传封面 -->
        <a-form-model-item label="宣传封面"
                           prop="imageUrl">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG"
                      list-type="picture-card"
                      :file-list="coverPictureList"
                      :before-upload="beforeUpload"
                      :remove="handleImgRemove"
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
                      accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG"
                      list-type="picture-card"
                      :file-list="sharePictureList"
                      :remove="handleImgRemove1"
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
        <!-- 活动详情 -->
        <a-form-model-item label="活动详情"
                           prop="educationIntroduction">
          <Editor v-model="form.educationIntroduction"
                  :isClear="editorIsClear"
                  @change="editorChange"></Editor>
        </a-form-model-item>
        <!-- 状态 -->
        <a-form-model-item label="状态"
                           prop="saleStatus">
          <a-radio-group v-model="form.saleStatus">
            <a-radio v-for="item in saleStatusList"
                     :key="item.id"
                     :value="item.id">
              {{item.name}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 收费金额 -->
        <a-form-model-item label="收费金额"
                           prop="educationFee">
          <a-input v-model="form.educationFee"
                   allowClear
                   placeholder="请输入收费金额(至多保留小数点后两位)"
                   :maxLength="30" />
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
import { getBase64 } from "@/utils/util.js";
import Editor from "@/components/wangEditor/wangEditor.vue";
import {
  getTypeList,
  addHotel,
  addEducation,
  updateEducation,
  uploadImageCover,
  uploadImageShare
} from "@/services/education";

export default {
  name: "EducationConfig",
  props: {
    configshow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Editor
  },
  data() {
    return {
      openType: null, // 0新增 1修改
      currentID: null, // 修改时使用，id
      hotelNameIsShow: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      editorIsClear: false, // 富文本编辑器是否clear
      educationTypeList: [], // 类型list
      toObjectList: [], // 面对人群list
      educationLevelList: [], // 培训等级list
      needPreCodeList: [], // 是否需要验证码list
      hotelIdsList: [], // 入住酒店list
      educationMethodList: [], // 授课方式list
      roomTypeList: [], // 房间类型list
      saleStatusList: [], // 状态list
      organizationIdsList: [], // 培训机构list
      form: {
        enrollStartTime: null, // 报名开始时间
        enrollEndTime: null, // 报名结束时间
        educationStartTime: null, // 培训开始时间
        educationEndTime: null, // 培训结束时间
        yearOldStartTime: null,
        yearOldEndTime: null,
        organizationIds: [], // 培训机构
        roomType: [], // 房间类型（可多选）
        hotelIds: [], // 入住酒店（可多选）
        toObject: undefined, // 面向人群
        educationType: undefined, // 类型
        educationMethod: [], // 授课方式（可多选）
        educationLevel: undefined, // 培训等级
        educationName: undefined, // 标题
        imageUrl: undefined, // 宣传封面地址
        masterOrganizer: undefined, // 主办单位
        address: undefined,
        needPreCode: "0", // 报名是否需要验证码 0不需要 1需要
        saleStatus: "0", // 状态 0上架 1下架
        shareImageUrl: undefined, // 分享图片地址
        shareText: undefined, // 分享文案
        educationIntroduction: undefined, // 活动详情
        hotelName: undefined, // 新增酒店名称
        educationFee: undefined // 收费金额
      },
      // 搜索项校验规则
      rules: {
        educationName: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ],
        educationType: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ],
        toObject: [
          {
            required: true,
            message: "请选择面向人群",
            trigger: "change"
          }
        ],
        organizationIds: [
          {
            required: true,
            message: "请选择培训机构",
            trigger: "change"
          }
        ],
        educationLevel: [
          {
            required: true,
            message: "请选择培训等级",
            trigger: "change"
          }
        ],
        hotelIds: [
          {
            required: true,
            message: "请选择入住酒店",
            trigger: "change"
          }
        ],
        needPreCode: [
          {
            required: true,
            message: "请选择报名是否需要验证码",
            trigger: "change"
          }
        ],
        saleStatus: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ],
        shareText: [
          {
            required: true,
            message: "请输入分享文案",
            trigger: "blur"
          }
        ],
        imageUrl: [
          {
            required: true,
            message: "请上传封面图片",
            trigger: "change"
          }
        ],
        shareImageUrl: [
          {
            required: true,
            message: "请上传分享图片",
            trigger: "change"
          }
        ],
        masterOrganizer: [
          {
            required: true,
            message: "请输入主办单位",
            trigger: "blur"
          }
        ],
        secondaryOrganizer: [
          {
            required: true,
            message: "请输入承办单位",
            trigger: "blur"
          }
        ],
        enrollStartTime: [
          {
            required: true,
            message: "请选择报名开始时间",
            trigger: "change"
          }
        ],
        enrollEndTime: [
          {
            required: true,
            message: "请选择报名结束时间",
            trigger: "change"
          }
        ],
        educationStartTime: [
          {
            required: true,
            message: "请选择培训开始时间",
            trigger: "change"
          }
        ],
        educationEndTime: [
          {
            required: true,
            message: "请选择培训结束时间",
            trigger: "change"
          }
        ],
        yearOldStartTime: [
          {
            required: true,
            message: "请选择年龄开始时间",
            trigger: "change"
          }
        ],
        yearOldEndTime: [
          {
            required: true,
            message: "请选择年龄结束时间",
            trigger: "change"
          }
        ],
        /* address: [
          {
            required: true,
            message: "请输入培训地点",
            trigger: "blur"
          }
        ], */
        educationIntroduction: [
          {
            required: true,
            message: "请输入活动详情",
            trigger: "blur"
          }
        ],
        roomType: [
          {
            required: true,
            message: "请选择房间类型",
            trigger: "change"
          }
        ],
        educationMethod: [
          {
            required: true,
            message: "请选择授课方式",
            trigger: "change"
          }
        ],
        educationFee: [
          {
            trigger: "blur",
            validator: this.handleCheckEducationFee
          }
        ]
      },

      coverPictureList: [], // 宣传封面file list
      previewVisible: false,
      previewCoverImage: "",

      sharePictureList: [], // 分享图片file list
      previewVisible1: false,
      previewShareImage: ""
    };
  },
  computed: {
    ...mapState(["pageMinHeight"])
  },
  created() {},
  mounted() {
    this.getAllListData();
  },
  methods: {
    setOpenType(openType, currentID) {
      this.openType = openType;
      this.currentID = currentID;
      if (openType === 0) {
        this.resetAllFields();
      }
    },

    // 校验价格
    handleCheckEducationFee(rule, value, callback) {
      const regExp = /^(\d+(?:\.\d{2})?)$/;
      if (!this.$isEmpty(value)) {
        if (!regExp.test(value)) {
          callback("只能输入数字、小数点后俩位小数！");
        }
      }
      callback();
    },

    isRefeere() {
      let { toObject } = this.form;
      if (toObject === "refeere" || toObject === "sporter") {
        // 清空rules规则
        delete this.rules.organizationIds;
        this.rules.educationLevel = [
          {
            required: true,
            message: "请选择培训等级",
            trigger: "change"
          }
        ];
        this.rules.hotelIds = [
          {
            required: true,
            message: "请选择房间类型",
            trigger: "change"
          }
        ];
        this.rules.roomType = [
          {
            required: true,
            message: "请选择入住酒店",
            trigger: "change"
          }
        ];
        // 清空已填写数据
        this.form.organizationIds = [];
      } else {
        delete this.rules.educationLevel;
        delete this.rules.hotelIds;
        delete this.rules.roomType;
        this.rules.organizationIds = [
          {
            required: true,
            message: "请选择培训机构",
            trigger: "change"
          }
        ];
        this.form.hotelIds = [];
        this.form.roomType = [];
        this.form.educationLevel = undefined;
      }
    },

    // 初始化list数据
    getAllListData() {
      getTypeList().then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.educationLevelList = result.data.educationLevelEnumSelectedModel; // 培训等级
          this.educationMethodList =
            result.data.educationMethodEnumSelectedModel; // 授课方式
          this.roomTypeList = result.data.educationRoomTypEnumSelectedModel; // 房间类型
          this.saleStatusList = result.data.educationSaleStateEnumSelectedModel; // 上下线状态
          this.hotelIdsList = result.data.hotelListSelectedModel; // 酒店列表
          this.toObjectList = result.data.toObjectEnumSelectedModel; // 面向人群
          this.educationTypeList = result.data.typeSelectedModel; // 类型列表
          this.organizationIdsList =
            result.data.educationOrganizationEnumSelectedModel; // 机构列表
          this.needPreCodeList =
            result.data.educationNeedPreCodeEnumSelectedModel; // 是否需要验证码
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // date picker
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

    // 培训时间
    disabledStartDate2(startValue) {
      const endValue = this.form.educationEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > new Date(endValue).valueOf();
    },
    disabledEndDate2(endValue) {
      const startValue = this.form.educationStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return new Date(startValue).valueOf() >= endValue.valueOf();
    },

    // 年龄时间
    disabledStartDate3(startValue) {
      const endValue = this.form.yearOldEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > new Date(endValue).valueOf();
    },
    disabledEndDate3(endValue) {
      const startValue = this.form.yearOldStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return new Date(startValue).valueOf() >= endValue.valueOf();
    },

    // upload
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
      uploadImageCover(formData)
        .then(res => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.imageUrl = result.data.fileUrl;
            this.$refs.educationForm.validateField("imageUrl");
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
      uploadImageShare(formData)
        .then(res => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.shareImageUrl = result.data.fileUrl;
            this.$refs.educationForm.validateField("shareImageUrl");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    handleImgRemove1() {
      this.form.shareImageUrl = "";
    },

    // 新增新的酒店名字
    saveNewHotel() {
      const data = {
        hotelName: this.form.hotelName
      };
      addHotel(data).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.hotelIdsList.push({
            id: result.data.id,
            name: result.data.hotelName
          });
          this.cancelAddHotel();
        } else {
          this.$message.error(result.desc);
        }
      });
    },
    // 取消新增新酒店
    cancelAddHotel() {
      this.hotelNameIsShow = false;
      this.form.hotelName = undefined;
    },

    // 富文本编辑器
    editorChange(val) {
      this.form.educationIntroduction = val;
    },

    // 保存
    onSubmit() {
      this.$refs.educationForm.validate(valid => {
        if (valid) {
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addEducation(data).then(res => {
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
            data.id = this.currentID;
            updateEducation(data).then(res => {
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

    resetAllFields() {
      this.form = {
        enrollStartTime: null, // 报名开始时间
        enrollEndTime: null, // 报名结束时间
        educationStartTime: null, // 培训开始时间
        educationEndTime: null, // 培训结束时间
        yearOldStartTime: null,
        yearOldEndTime: null,
        roomType: [], // 房间类型（可多选）
        hotelIds: [], // 入住酒店（可多选）
        organizationIds: [], // 培训机构
        toObject: undefined, // 面向人群
        educationType: undefined, // 类型
        educationMethod: [], // 授课方式（可多选）
        educationLevel: undefined, // 培训等级
        educationName: undefined, // 标题
        imageUrl: undefined, // 宣传封面地址
        masterOrganizer: undefined, // 主办单位
        address: undefined,
        needPreCode: "0", // 报名是否需要验证码 0不需要 1需要
        saleStatus: "0", // 状态 0上架 1下架
        shareImageUrl: undefined, // 分享图片地址
        shareText: undefined, // 分享文案
        educationIntroduction: undefined, // 活动详情
        hotelName: undefined, // 新增酒店名称
        educationFee: undefined // 收费金额
      };
      this.coverPictureList = []; // 宣传封面file list
      this.sharePictureList = []; // 分享图片file list
    },

    // 取消
    resetForm() {
      this.resetAllFields();
      this.$emit("closeConfig");
    }
  }
};
</script>