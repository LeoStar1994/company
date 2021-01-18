<!--
 * @Description: 运动员信息修改modal
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-18 15:10:05
 * @LastEditors: Leo
-->
<template>
  <div class="player-modal">
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
        <!-- 姓名 -->
        <a-form-model-item label="姓名"
                           prop="memberName">
          <a-input v-model="form.memberName"
                   placeholder="请输入姓名"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 性别 -->
        <a-form-model-item label="性别"
                           prop="sex">
          <a-radio-group v-model="form.sex">
            <a-radio :value="item.keyAlias"
                     v-for="(item,index) in sexList"
                     :key="index">
              {{item.valueAlias}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 身高 -->
        <a-form-model-item label="身高"
                           prop="height">
          <a-input v-model="form.height"
                   placeholder="请输入身高"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 体重 -->
        <a-form-model-item label="体重"
                           prop="weight">
          <a-input v-model="form.weight"
                   placeholder="请输入体重"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 生日 -->
        <a-form-model-item prop="born"
                           label="生日">
          <a-date-picker v-model="form.born"
                         :disabled-date="disabledBornDate"
                         show-time
                         style="width:100%"
                         format="YYYY-MM-DD"
                         valueFormat="YYYY-MM-DD"
                         placeholder="生日" />
        </a-form-model-item>
        <!-- 国家 -->
        <a-form-model-item prop="country"
                           label="国家">
          <a-input v-model="form.country"
                   placeholder="请输入国家"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 证件类型 -->
        <a-form-model-item label="证件类型"
                           prop="cardType">
          <a-radio-group v-model="form.cardType">
            <a-radio :value="item.keyAlias"
                     v-for="(item,index) in cardTypeList"
                     :key="index">
              {{item.valueAlias}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 证件号 -->
        <a-form-model-item label="证件号"
                           prop="identityCard">
          <a-input v-model="form.identityCard"
                   placeholder="请输入证件号"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 队服号 -->
        <a-form-model-item label="队服号"
                           prop="num">
          <a-input v-model="form.num"
                   placeholder="请输入队服号"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 位置 -->
        <a-form-model-item label="位置"
                           prop="position">
          <a-select style="width: 100%"
                    v-model="form.position"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in positionList"
                             :key="index"
                             :value="item.keyAlias">
              {{item.valueAlias}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 持杆手 -->
        <a-form-model-item label="持杆手"
                           prop="holdingRod">
          <a-radio-group v-model="form.holdingRod">
            <a-radio :value="item.keyAlias"
                     v-for="(item,index) in holdingRodList"
                     :key="index">
              {{item.valueAlias}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 头像 -->
        <a-form-model-item label="头像"
                           prop="imagePath">
          <a-upload name="avatar"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :before-upload="beforeUpload"
                    :customRequest="avatarCustomRequest"
                    @change="avatarHandleChange">
            <img v-if="form.imagePath"
                 :src="form.imagePath"
                 width="86px"
                 alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传头像</div>
            </div>
          </a-upload>
        </a-form-model-item>
        <!-- 证件正面url -->
        <a-form-model-item label="证件正面照"
                           prop="identityImagePathDown">
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
        <!-- 证件正面url -->
        <a-form-model-item label="证件背面照"
                           prop="identityImagePathUp">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png, .jpg"
                      list-type="picture-card"
                      :file-list="pictureList1"
                      :before-upload="beforeUpload"
                      :remove="handleImgRemove1"
                      :customRequest="customRequest1"
                      @preview="handleImgPreview1"
                      @change="handleImgChange1">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传图片</div>
            </a-upload>
            <a-modal :visible="previewVisible1"
                     :footer="null"
                     @cancel="closeImageModal1">
              <img alt="example"
                   style="width: 100%"
                   :src="previewImage1" />
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
import { getPlayerData, playerUpdate } from "@/services/competition";
import { uploadImage } from "@/services/competitionList";
import { getBase64 } from "@/utils/util.js";
export default {
  name: "PlayerModal",
  props: {
    sexList: {
      type: Array,
      required: true,
    },
    cardTypeList: {
      type: Array,
      required: true,
    },
    holdingRodList: {
      type: Array,
      required: true,
    },
    positionList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "修改运动员信息",
      confirmLoading: false,
      form: {
        memberName: undefined, // 姓名
        sex: undefined, // 性别 0男1女
        born: undefined, // 生日
        country: undefined, // 国家
        height: undefined, // 身高
        weight: undefined, // 体重
        imagePath: undefined, // 头像
        holdingRod: undefined, // 持杆手 0左1右
        position: undefined, // 位置
        num: undefined, // 队服号
        cardType: undefined, // 证件类型 0身份证1护照
        identityCard: undefined, // 证件号
        identityImagePathDown: undefined, // 证件背url
        identityImagePathUp: undefined, // 证件正面url
        teamId: null, // 球队id
        detailId: null, // 运动员id
      },
      // 搜索项校验规则
      rules: {},

      // 头像
      loading: false,
      // 证件照
      pictureList: [],
      previewVisible: false,
      previewImage: "",

      pictureList1: [],
      previewVisible1: false,
      previewImage1: "",
    };
  },
  created() {},
  methods: {
    setOpenType(data) {
      getPlayerData(data.teamId, data.id).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.form = {
            ...result.data,
            sex: result.data.sex === "男" ? "0" : "1",
            cardType: result.data.cardType === "身份证" ? "0" : "1",
            holdingRod: result.data.holdingRod === "左手" ? "0" : "1",
          };
          this.pictureList = [
            {
              uid: Math.random(),
              status: "done",
              url: result.data.identityImagePathUp,
              name: `证件照正面`,
            },
          ];
          this.pictureList1 = [
            {
              uid: Math.random(),
              status: "done",
              url: result.data.identityImagePathDown,
              name: `证件照正面`,
            },
          ];
        } else {
          this.$message.error(result.desc);
        }
      });
      this.visible = true;
    },

    // 生日不能大于当前日期
    disabledBornDate(timeValue) {
      if (!timeValue) {
        return false;
      }
      return timeValue.valueOf() > new Date().valueOf();
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

    // 头像
    avatarHandleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        this.loading = false;
      }
    },

    // 头像自定义上传
    avatarCustomRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      uploadImage(formData)
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

    // 证件照正面
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
        this.$message.warning("证件照正面只能上传一张照片");
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
            this.form.identityImagePathUp = result.data.fileUrl;
            this.$refs.ruleForm.validateField("identityImagePathUp");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    handleImgRemove(file) {
      this.form.identityImagePathUp = "";
    },

    // 证件照背面
    async handleImgPreview1(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage1 = file.url || file.preview;
      this.previewVisible1 = true;
    },
    handleImgChange1({ fileList }) {
      this.pictureList1 = fileList;
      if (fileList.length === 2) {
        this.pictureList1 = fileList.slice(1);
        this.$message.warning("证件照背面只能上传一张照片");
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
      uploadImage(formData)
        .then((res) => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.identityImagePathDown = result.data.fileUrl;
            this.$refs.ruleForm.validateField("identityImagePathDown");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    handleImgRemove1(file) {
      this.form.identityImagePathDown = "";
    },

    closeImageModal() {
      this.previewVisible = false;
    },

    closeImageModal1() {
      this.previewVisible1 = false;
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
            sex: Number(this.form.sex),
            cardType: Number(this.form.cardType),
            holdingRod: Number(this.form.holdingRod),
          };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          playerUpdate(data).then((res) => {
            this.$refs.loading.closeLoading();
            const result = res.data;
            if (result.code === 0) {
              this.$message.success(result.desc);
              this.handleCancel();
              this.$emit("refreshAllInfoData", data.teamId);
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