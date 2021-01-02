<!--
 * @Description: 教学管理 / 教学详情弹框.
 * @Author: Leo
 * @Date: 2020-12-23 14:52:44
 * @LastEditTime: 2021-01-02 13:56:34
 * @LastEditors: Leo
-->
<template>
  <div class="educationConfig-page"
       v-if="configshow">
    <a-card :body-style="{padding: '24px 32px'}"
            :bordered="false"
            :style="`min-height: ${pageMinHeight}px`">
      <a-form-model ref="competitionForm"
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
                   :maxLength="20" />
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
                    v-model="form.toObject"
                    allowClear
                    placeholder="请选择人群">
            <a-select-option v-for="(item,index) in toObjectList"
                             :key="index"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 培训等级 -->
        <a-form-model-item label="培训等级"
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
                            style="width: 100%">
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
            <a-form-model-item prop="enrollStartTime">
              <a-date-picker v-model="form.enrollStartTime"
                             :disabled-date="disabledStartDate1"
                             @change="startTimeChange1"
                             show-time
                             format="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="enrollEndTime">
              <a-date-picker v-model="form.enrollEndTime"
                             :disabled-date="disabledEndDate1"
                             @change="endTimeChange1"
                             show-time
                             format="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 培训时间 -->
        <a-form-model-item label="培训时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="educationStartTime">
              <a-date-picker v-model="form.educationStartTime"
                             :disabled-date="disabledStartDate2"
                             show-time
                             @change="startTimeChange2"
                             format="YYYY-MM-DD"
                             valueFormat="YYYY-MM-DD"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="educationEndTime">
              <a-date-picker v-model="form.educationEndTime"
                             :disabled-date="disabledEndDate2"
                             show-time
                             @change="endTimeChange2"
                             format="YYYY-MM-DD"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 报名是否需要验证码 -->
        <a-form-model-item label="报名是否需要验证码"
                           prop="needPreCode">
          <a-radio-group v-model="form.needPreCode">
            <a-radio value="1">需要</a-radio>
            <a-radio value="0">不需要</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 主办单位 -->
        <a-form-model-item label="主办单位"
                           prop="masterOrganizer">
          <a-input v-model="form.masterOrganizer"
                   placeholder="请输入主办单位"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 培训地点 -->
        <a-form-model-item label="培训地点"
                           prop="address">
          <a-input v-model="form.address"
                   allowClear
                   placeholder="请输入培训地点"
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 入住酒店 -->
        <a-form-model-item label="入住酒店"
                           prop="hotelIds">
          <a-checkbox-group v-model="form.hotelIds"
                            style="width: 100%">
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
                   :maxLength="20" />
          <a-button @click="saveNewHotel"
                    class="mr-10"
                    type="primary">保存酒店</a-button>
          <a-button @click="cancelAddHotel">取消</a-button>
        </a-form-model-item>
        <!-- 房间类型 -->
        <a-form-model-item label="房间类型"
                           prop="roomType">
          <a-checkbox-group v-model="form.roomType"
                            style="width: 100%">
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
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="coverPictureList"
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
        <!-- 分享图片 -->
        <a-form-model-item label="分享图片"
                           prop="shareImageUrl">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="sharePictureList"
                      :before-upload="beforeUpload"
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
import { getBase64 } from "@/utils/util.js";
import Editor from "@/components/wangEditor/wangEditor.vue";
import {
  getTypeList,
  addEducation,
  updateEducation,
} from "@/services/education";

export default {
  name: "EducationConfig",
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
      openType: null, // 0新增 1查看 2修改
      currentID: null, // 修改时使用，id
      hotelNameIsShow: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 11, offset: 1 },
      editorIsClear: false, // 富文本编辑器是否clear
      educationTypeList: [], // 类型list
      toObjectList: [], // 面对人群list
      educationLevelList: [], // 培训等级list
      needPreCodeList: [
        { label: "不需要", value: 0 },
        { label: "需要", value: 1 },
      ],
      // 入住酒店
      hotelIdsList: [],
      // 授课方式
      educationMethodList: [],
      // 房间类型
      roomTypeList: [],
      saleStatusList: [],
      form: {
        enrollStartTime: null, // 报名开始时间
        enrollEndTime: null, // 报名结束时间
        educationStartTime: null, // 培训开始时间
        educationEndTime: null, // 培训结束时间
        roomType: [], // 房间类型（可多选）
        hotelIds: [], // 入住酒店（可多选）
        toObject: undefined, // 面向人群
        educationType: undefined, // 类型
        educationMethod: [], // 授课方式（可多选）
        educationLevel: undefined, // 培训等级
        educationName: undefined, // 标题
        imageUrl: undefined, // 宣传封面地址
        masterOrganizer: undefined, // 主办单位
        needPreCode: "0", // 报名是否需要验证码 0不需要 1需要
        saleStatus: "0", // 状态 0上架 1下架
        shareImageUrl: undefined, // 分享图片地址
        shareText: undefined, // 分享文案
        educationIntroduction: undefined, // 活动详情
        hotelName: undefined, // 新增酒店名称
      },
      dateData: {
        enrollStartTime: null, // 报名开始时间
        enrollEndTime: null, // 报名结束时间
        educationStartTime: null, // 培训开始时间
        educationEndTime: null, // 培训结束时间
      },
      // 搜索项校验规则
      rules: {
        educationName: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
          // {
          //   min: 3,
          //   max: 10,
          //   message: "Length should be 3 to 5",
          //   trigger: "blur",
          // },
        ],
        educationType: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
          },
        ],
        toObject: [
          {
            required: true,
            message: "请选择面向人群",
            trigger: "change",
          },
        ],
        educationLevel: [
          {
            required: true,
            message: "请选择培训等级",
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
        educationStartTime: [
          {
            required: true,
            message: "请选择培训开始时间",
            trigger: "change",
          },
        ],
        educationEndTime: [
          {
            required: true,
            message: "请选择培训结束时间",
            trigger: "change",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入培训地点",
            trigger: "blur",
          },
        ],
        educationIntroduction: [
          {
            required: true,
            message: "请输入活动详情",
            trigger: "blur",
          },
        ],
        hotelIds: [
          {
            required: true,
            message: "请选择入住酒店",
            trigger: "change",
          },
        ],
        roomType: [
          {
            required: true,
            message: "请选择房间类型",
            trigger: "change",
          },
        ],
        educationMethod: [
          {
            required: true,
            message: "请选择授课方式",
            trigger: "change",
          },
        ],
      },

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
  created() {
    // this.getAllListData();
  },
  mounted() {
    this.getAllListData();
  },
  methods: {
    setOpenType(openType, currentID) {
      this.openType = openType;
      this.currentID = currentID;
      if (openType === 0) {
        this.$nextTick(() => {
          this.$refs.competitionForm.resetFields();
        });
      }
    },

    // 初始化list数据
    getAllListData() {
      // this.$refs.loading.openLoading("数据初始化中，请稍后。。");
      getTypeList()
        .then((res) => {
          // this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            //       educationTypeList: [], // 类型list
            // toObjectList: [], // 面对人群list
            // educationLevelList: [], // 培训等级list
            // needPreCodeList: [
            // ],
            // // 入住酒店
            // hotelIdsList: [],
            // // 授课方式
            // educationMethodList: [],
            // // 房间类型
            // roomTypeList: [],
            this.educationLevelList =
              result.data.educationLevelEnumSelectedModel; // 培训等级
            this.educationMethodList =
              result.data.educationMethodEnumSelectedModel; // 授课方式
            this.roomTypeList = result.data.educationRoomTypEnumSelectedModel; // 房间类型
            this.saleStatusList =
              result.data.educationSaleStateEnumSelectedModel; // 上下线状态
            this.hotelIdsList = result.data.hotelListSelectedModel; // 酒店列表
            this.toObjectList = result.data.toObjectEnumSelectedModel; // 面向人群
            this.educationTypeList = result.data.typeSelectedModel; // 类型列表
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          // this.$refs.loading.closeLoading();
        });
    },

    // date picker
    // 报名时间
    startTimeChange1(date, dateStr) {
      this.dateData.enrollStartTime = dateStr;
    },
    endTimeChange1(date, dateStr) {
      this.dateData.enrollEndTime = dateStr;
    },
    disabledStartDate1(startValue) {
      const endValue = this.form.enrollEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate1(endValue) {
      const startValue = this.form.enrollStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },

    // 培训时间
    startTimeChange2(date, dateStr) {
      this.dateData.educationStartTime = dateStr;
    },
    endTimeChange2(date, dateStr) {
      this.dateData.educationEndTime = dateStr;
    },
    disabledStartDate2(startValue) {
      const endValue = this.form.educationEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate2(endValue) {
      const startValue = this.form.educationStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
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
      if (fileList.length === 2) {
        this.sharePictureList = fileList.slice(1);
        this.$message.warning("分享只能上传一张图片");
      }
    },

    // 新增新的酒店名字
    saveNewHotel() {
      this.hotelIdsList.push({
        name: this.form.hotelName,
        id: this.form.hotelName,
      });
      this.hotelNameIsShow = false;
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
      this.$refs.competitionForm.validate((valid) => {
        console.log(this.form);
        if (valid) {
          const data = {
            ...this.form,
            ...this.dateData,
            gameGrade: this.form.gameGrade.join(),
          };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addEducation(data).then((res) => {
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
            data.currentID = this.currentID;
            updateEducation(data).then((res) => {
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
      this.$refs.competitionForm.resetFields();
      this.coverPictureList = []; // 宣传封面file list
      this.sharePictureList = []; // 分享图片file list
      this.$emit("closeConfig");
    },
  },
};
</script>