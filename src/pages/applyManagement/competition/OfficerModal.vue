<!--
 * @Description: 官员信息修改modal
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-02-05 15:33:43
 * @LastEditors: Leo
-->
<template>
  <div class="officer-modal">
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
                           prop="trainName">
          <a-input v-model="form.trainName"
                   placeholder="请输入姓名"
                   allowClear
                   :maxLength="30" />
        </a-form-model-item>
        <!-- 性别 -->
        <a-form-model-item label="性别"
                           prop="trainSex">
          <a-radio-group v-model="form.trainSex">
            <a-radio :value="item.keyAlias"
                     v-for="(item,index) in trainSexList"
                     :key="index">
              {{item.valueAlias}}
            </a-radio>
          </a-radio-group>
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
        <!-- 职务 -->
        <a-form-model-item label="职务"
                           prop="positionId">
          <a-select style="width: 100%"
                    v-model="form.positionId"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in positionNameList"
                             @change="positionIdChange(form.positionId)"
                             :key="index"
                             :value="item.keyAlias">
              {{item.valueAlias}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 国籍 -->
        <a-form-model-item label="国籍"
                           prop="country">
          <a-input v-model="form.country"
                   placeholder="请输入国籍"
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
        <a-form-model-item label="身份证/护照号码"
                           prop="identityCard">
          <a-input v-model="form.identityCard"
                   placeholder="请输入身份证/护照号码"
                   allowClear
                   :maxLength="30" />
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
        <!-- 证件照 -->
        <a-form-model-item label="证件照"
                           prop="identityImagePath">
          <div class="clearfix">
            <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      accept=".png,.jpg,.jpeg,.PNG,.JPG,.JPEG"
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
import { getOfficerData, officerUpdate } from "@/services/competition";
import {
  uploadOfficerImage,
  uploadOfficerCard,
} from "@/services/competitionList";
import { getBase64 } from "@/utils/util.js";
export default {
  name: "OfficerModal",
  props: {
    trainSexList: {
      type: Array,
      required: true,
    },
    cardTypeList: {
      type: Array,
      required: true,
    },
    positionNameList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "修改官员信息",
      confirmLoading: false,
      form: {
        trainName: undefined, // 姓名
        trainSex: undefined, // 性别
        born: undefined, // 生日
        country: undefined, // 国家
        positionName: undefined, // 职务
        positionId: undefined, // 职务id
        imagePath: undefined, // 头像
        cardType: undefined, // 证件类型
        identityCard: undefined, // 证件号
        identityImagePath: [], // 证件照片
        trainId: null,
        teamId: null,
      },
      // 搜索项校验规则
      rules: {
        trainName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        trainSex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
        born: [
          {
            required: true,
            message: "请选择生日",
            trigger: "change",
          },
        ],
        country: [
          {
            required: true,
            message: "请输入国家",
            trigger: "blur",
          },
        ],
        positionId: [
          {
            required: true,
            message: "请选择职务",
            trigger: "change",
          },
        ],
        imagePath: [
          {
            required: true,
            message: "请上传头像",
            trigger: "change",
          },
        ],
        cardType: [
          {
            required: true,
            message: "请选择证件类型",
            trigger: "change",
          },
        ],
        identityCard: [
          {
            required: true,
            message: "请输入身份证/护照",
            trigger: "blur",
          },
        ],
        identityImagePath: [
          {
            required: true,
            message: "请上传证件照",
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
  created() {},
  methods: {
    setOpenType(data) {
      getOfficerData(data.teamId, data.id).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.form = {
            ...result.data,
            cardType: result.data.cardType === "身份证" ? "0" : "1",
            trainSex: result.data.trainSex === "男" ? "0" : "1",
            positionId: result.data.positionId.toString(),
          };
          this.pictureList = result.data.identityImagePath.map(
            (item, index) => {
              return {
                uid: Math.random(),
                status: "done",
                url: item,
                name: `身份证照${index}`,
              };
            }
          );
        } else {
          this.$message.error(result.desc);
        }
      });
      this.visible = true;
    },

    // 通过职务id获取职务name
    positionIdChange(keyAlias) {
      this.form.positionName = this.positionNameList.find(
        (item) => item.keyAlias === keyAlias
      ).valueAlias;
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
      uploadOfficerImage(formData)
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

    // 证件照
    async handleImgPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleImgChange({ fileList }) {
      this.pictureList = fileList;
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
      uploadOfficerCard(formData)
        .then((res) => {
          options.onSuccess(res, options.file); //解决一直loading情况，调用onSuccess
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.form.identityImagePath.push(result.data.fileUrl);
            this.$refs.ruleForm.validateField("identityImagePath");
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
        });
    },

    handleImgRemove(file) {
      this.form.identityImagePath.forEach((item, index) => {
        if (item === file.url) {
          this.form.identityImagePath.splice(index, 1);
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
            identityImagePath: this.form.identityImagePath.join(),
            cardType: Number(this.form.cardType),
            trainSex: Number(this.form.trainSex),
            positionId: Number(this.form.positionId),
          };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          officerUpdate(data).then((res) => {
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