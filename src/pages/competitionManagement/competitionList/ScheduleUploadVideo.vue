<!--
 * @Description: 赛事列表 => 赛事日程 => 上传视频modal
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-11 18:30:09
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
        <a-form-model-item label="视频"
                           prop="gameRuleName">
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
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { uploadImage, videoSave } from "@/services/competitionList";

export default {
  name: "uploadVideoModal",
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "上传视频",
      confirmLoading: false,
      videoList: [],
      form: {
        videoNames: [], // 视频名称
        videoUrls: [], // 视频连接
        schedulesId: null
      },
      // 搜索项校验规则
      rules: {
        scoreNum: [
          {
            required: true,
            message: "请输入球员号码",
            trigger: "change"
          }
        ]
      }
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
            this.form.videoNames.push(result.data.uploadFilename);
            this.form.videoUrls.push(result.data.fileUrl);
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {});
    },

    videoUploadChange({ fileList }) {
      this.videoList = fileList;
    },

    videoRemove(file) {
      console.log(file);
      // const arr = this.form.gameRuleName.split();
      // arr.forEach((item, index) => {
      //   if (item === file.name) {
      //     arr.splice(index, 1);
      //   }
      // });
      // this.form.gameRuleName = arr.length ? arr.join() : "";
    },

    async handleOk() {
      if (this.videoList.length === 0) {
        this.$message.warning("请先上传视频再进行保存");
        return;
      }
      this.confirmLoading = true;
      await this.saveVideoInfo();
      this.confirmLoading = false;
    },

    saveVideoInfo() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            videoNames: this.form.videoNames.join(),
            videoUrls: this.form.videoNames.join(),
            schedulesId: this.form.schedulesId
          };
          videoSave(data).then(res => {
            const result = res.data;
            if (result.code === 0) {
              this.$message.success(result.desc);
              this.handleCancel();
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
      this.videoList = [];
      this.visible = false;
    }
  }
};
</script>
