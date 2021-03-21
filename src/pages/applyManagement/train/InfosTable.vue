<!--
 * @Description: 报名管理 / 培训 / 查看详情table
 * @Author: Leo
 * @Date: 2020-12-25 11:00:00
 * @LastEditTime: 2021-03-10 18:16:39
 * @LastEditors: Leo
-->
<template>
  <div class="infosTable-page"
       v-if="configshow">
    <a-card :style="`min-height: ${pageMinHeight}px`"
            v-show="!detailShow">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="infosForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 姓名 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="姓名"
                                   prop="name">
                  <a-input v-model="form.name"
                           allowClear
                           :maxLength="30"
                           placeholder="请输入姓名"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 裁判等级 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="裁判等级"
                                   prop="refereeLevel">
                  <a-select style="width: 100%"
                            v-model="form.refereeLevel"
                            allowClear
                            placeholder="请选择">
                    <a-select-option v-for="(item,index) in refereeLevelList"
                                     :key="index"
                                     :value="item.id">
                      {{item.name}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
          <!-- 查询、重置、收起 -->
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary"
                      @click="searchTableData()">查询</a-button>

            <a-button style="margin-left: 8px"
                      @click="reset">重置</a-button>
            <!-- <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a> -->
          </span>
        </a-form-model>
      </div>
      <div>
        <!-- operator -->
        <div class="operator">
          <a-button @click="goBackTrain"
                    class="mr-10"
                    type="primary">返回上一页</a-button>
          <a-button type="primary"
                    class="mr-10"
                    @click="exportData">导出</a-button>
          <a-upload name="file"
                    class="mr-10"
                    :customRequest="customRequest"
                    :showUploadList="false"
                    accept=".zip"
                    :multiple="true"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
            <a-button type="primary">导入证书</a-button>
          </a-upload>
          <a-button type="primary"
                    class="mr-10"
                    @click="exportTemplate">导出证书模板</a-button>
        </div>
        <!-- table -->
        <standard-table :columns="columns"
                        rowKey="id"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        @change="handleTableChange">
          <div slot="infoName"
               slot-scope="{text, record}">
            <img :src="record.imagePath"
                 v-if="record.imagePath"
                 width="40px"
                 alt="">
            <span class="ml-6">{{text}}</span>
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a-button class="mr-12"
                      size="small"
                      type="primary"
                      @click="openDetails(record.id)">查看
            </a-button>
            <a-button class="mr-12 greenButton"
                      size="small"
                      v-if="record.checkStatusStr === '待审核'"
                      @click="openChangeAlarm(record, 1)">审核通过
            </a-button>
            <a-button class="mr-12 orangeButton"
                      size="small"
                      v-if="record.checkStatusStr === '待审核'"
                      @click="openChangeAlarm(record, 2)">不通过
            </a-button>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteInfo(record.id)"
                          @cancel="deletecancel">
              <a-button size="small"
                        type="danger">删除</a-button>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>

    <!-- 审核不通过弹框 -->
    <a-modal title="审核反馈"
             :visible="modalVisible"
             :maskClosable="false"
             @ok="handleOk"
             @cancel="handleCancel">
      <a-form-model ref="ruleForm"
                    :model="checkStatusData"
                    :rules="checkStatusrules"
                    :wrapper-col="wrapperCol1">
        <a-form-model-item prop="checkResult"
                           style="margin-bottom: 0px;">
          <a-textarea v-model="checkStatusData.checkResult"
                      placeholder="请填写不通过原因"
                      allowClear
                      class="w100p"
                      :maxLength="100"
                      :auto-size="{ minRows: 4, maxRows: 6 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 明细 -->
    <InfoDetails ref="infoDetails"
                 :infoData="infoData"
                 :detailShow="detailShow"
                 :useType="useType"
                 @searchTableData="searchTableData"
                 @closeDetail="closeDetail"></InfoDetails>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import {
  getRefereeDetail,
  deleteReferee,
  exportReferee,
  getInfosTableData,
  changeCheckStatus,
  uploadCertificate,
  exportTemplate
} from "@/services/train";
import { downloadFile } from "@/utils/util";
import InfoDetails from "@/components/infoDetails/InfoDetails";
// table columns data
const columns = [
  // {
  //   title: "记录ID",
  //   dataIndex: "id"
  // },
  {
    title: "姓名",
    dataIndex: "refereeName",
    scopedSlots: { customRender: "infoName" }
  },
  {
    title: "性别",
    dataIndex: "sexType"
  },
  {
    title: "出生日期",
    dataIndex: "bornDate"
  },
  {
    title: "手机号",
    dataIndex: "telPhone"
  },
  {
    title: "现裁判等级",
    dataIndex: "refereeLevel"
  },
  {
    title: "工作单位",
    dataIndex: "workCompany"
  },
  {
    title: "身份证号",
    dataIndex: "identityCard"
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];

const fieldsMapLabel = [
  {
    field: "sexType",
    labelName: "性别",
    sort: 1
  },
  {
    field: "refereeLevel",
    labelName: "现裁判等级",
    sort: 2
  },
  {
    field: "country",
    labelName: "国籍",
    sort: 3
  },
  {
    field: "organization",
    labelName: "机构",
    sort: 4
  },
  {
    field: "nation",
    labelName: "民族",
    sort: 5
  },
  {
    field: "approvalDate",
    labelName: "批准日期",
    sort: 6
  },
  {
    field: "height",
    labelName: "身高",
    sort: 7
  },
  {
    field: "healthyLevel",
    labelName: "健康状况",
    sort: 8
  },
  {
    field: "bornDate",
    labelName: "出生日期",
    sort: 9
  },
  {
    field: "languageType",
    labelName: "外语能力",
    sort: 10
  },
  {
    field: "identityCard",
    labelName: "证件号码",
    sort: 11
  },
  {
    field: "telPhone",
    labelName: "手机号码",
    sort: 12
  },
  {
    field: "degreeLevel",
    labelName: "文化程度",
    sort: 13
  },
  {
    field: "weixinId",
    labelName: "微信号",
    sort: 14
  },
  {
    field: "cardType",
    labelName: "证件类型",
    sort: 15
  },
  {
    field: "identityImagePath",
    labelName: "证件照片",
    sort: 16,
    isOccupyAll: true
  },
  {
    field: "certificateImagePath",
    labelName: "证书",
    sort: 17,
    isOccupyAll: true
  },
  {
    field: "political",
    labelName: "政治面貌",
    sort: 18
  },
  {
    field: "emailAddress",
    labelName: "电子邮箱",
    sort: 20
  },
  {
    field: "workCompany",
    labelName: "代表单位",
    sort: 21
  },
  {
    field: "workAddress",
    labelName: "单位地址",
    sort: 22
  },
  {
    field: "homeAddress",
    labelName: "现住址",
    sort: 23,
    isOccupyAll: true
  },
  {
    field: "hotelName",
    labelName: "选择酒店",
    sort: 24
  },
  {
    field: "roomType",
    labelName: "房间类型",
    sort: 25
  }
];
export default {
  name: "InfosTable",
  components: { StandardTable, InfoDetails },
  props: {
    configshow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      advanced: true,
      tableLoading: false,
      modalVisible: false,
      columns: columns,
      useType: "train",
      dataSource: [],
      // 分页
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
        pageSizeOptions: ["10", "15", "20"],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条数据`
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      wrapperCol1: { span: 22, offset: 1 },
      refereeLevelList: [],
      form: {
        name: undefined,
        refereeLevel: undefined,
        educationId: null,
        educationName: null,
        enrollStatus: null
      },
      // 搜索项校验规则
      rules: {
        name: [],
        refereeLevel: []
      },
      checkStatusrules: {
        checkResult: []
      },
      detailShow: false,
      // 详情数据
      infoData: {
        name: "",
        imgURL: "",
        // 执裁经历 columns
        judgeColumns: [
          {
            title: "赛季",
            dataIndex: "gameSeason"
          },
          {
            title: "比赛名称",
            dataIndex: "gameName"
          },
          {
            title: "比赛级别",
            dataIndex: "gameLevel"
          },
          {
            title: "担任职务",
            dataIndex: "position"
          }
        ],
        // 执裁经历 tableData
        judgeTableData: [],

        // 培训经历 columns
        eductionColumns: [
          {
            title: "培训名称",
            dataIndex: "enducationName"
          },
          {
            title: "培训时间",
            dataIndex: "enducationDate"
          },
          {
            title: "培训单位",
            dataIndex: "enducationCompany"
          },
          {
            title: "证书图片",
            scopedSlots: { customRender: "certificateImagePath" }
          }
        ],
        // 培训经历 tableData
        eductionTableData: [],

        // 教练制裁经历 columns
        refereeJudgeColumns: [
          {
            title: "执教单位",
            dataIndex: "judgeCompany"
          },
          {
            title: "所在区域",
            dataIndex: "region"
          },
          {
            title: "开始时间",
            dataIndex: "startTime"
          },
          {
            title: "结束时间",
            dataIndex: "stopTime"
          }
        ],
        // 教练制裁经历 tableData
        refereeJudgeTableData: [],
        // 基础信息
        descList: []
      },
      fieldsMapLabel: fieldsMapLabel,
      checkStatusData: {
        joinId: undefined, // 教练员报名id
        refereeId: undefined, // 教练员id
        checkStatus: undefined, // 赛事报名id
        checkResult: "" // 审核意见
      }
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"])
  },
  created() {},
  methods: {
    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    setLastSerachData(data) {
      this.form.educationName = data.educationName;
      this.form.enrollStatus = data.enrollStatus;
      this.form.educationId = data.id;
    },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      };
      this.tableLoading = true;
      getInfosTableData(data).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data.refereelVos.records;
          this.refereeLevelList = result.data.educationLevelEnumSelectedModel;
          this.pagination.total = result.data.refereelVos.total;
        } else {
          this.$message.error(result.desc);
        }
        this.tableLoading = false;
      });
    },

    // 分页
    handleTableChange(pagination) {
      let { current, pageSize } = pagination;
      this.pagination.pageSize = pageSize;
      this.pagination.pageNo = current;
      this.searchTableData();
    },

    // 重置分页数据
    resetPagination() {
      this.pagination.pageSize = 10;
      this.pagination.total = 0;
    },

    // 重置
    reset() {
      this.$refs.infosForm.resetFields();
      // this.dataSource = [];
      this.resetPagination();
    },

    // 查看某一个数据列详情
    openDetails(id) {
      getRefereeDetail(id).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.infoData.name = result.data.refereeName;
          this.infoData.imgURL = result.data.imagePath;
          this.infoData.judgeTableData = result.data.detailList; // 执裁经历
          this.infoData.refereeJudgeTableData =
            result.data.refereeJudgeDetailViewDetailVos; // 裁判执裁经历
          this.infoData.eductionTableData = result.data.enducationDetailList; // 培训经历
          this.infoData.isShowEnducationDetail =
            result.data.isShowEnducationDetail;
          this.infoData.descList = this.formatDetailsData(result.data);
          this.detailShow = true;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 数据格式化
    formatDetailsData(data) {
      const detailKeys = Object.keys(data);
      const finallyData = [];
      this.fieldsMapLabel.forEach(item => {
        detailKeys.forEach(item1 => {
          if (item.field === item1) {
            finallyData.push({
              label: item.labelName,
              value: data[item1],
              sort: item.sort,
              span: item.isOccupyAll ? 2 : 1
            });
          }
        });
      });
      return finallyData;
    },

    closeDetail() {
      this.detailShow = false;
    },

    // 打开审核弹框
    openChangeAlarm(rowData, checkStatus) {
      this.checkStatusData.checkStatus = checkStatus;
      this.checkStatusData.joinId = rowData.joinId;
      this.checkStatusData.refereeId = rowData.id;
      let _this = this;
      if (checkStatus === 1) {
        this.$confirm({
          title: "是否确定通过?",
          // content: () => <div style="color:red;">Some descriptions</div>,
          onOk() {
            _this.changeCheckResult(_this.checkStatusData);
          },
          onCancel() {
            _this.$message.info("已取消操作");
          },
          class: "test"
        });
      } else if (checkStatus === 2) {
        // 不通过打开弹框输入意见
        this.modalVisible = true;
      }
    },

    // 审核通过 | 不通过
    changeCheckResult(data) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      changeCheckStatus(data)
        .then(res => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.searchTableData();
          } else {
            this.$message.success(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    async handleOk() {
      await this.changeCheckResult(this.checkStatusData);
      this.modalVisible = false;
      this.resetCheckStatusData();
    },
    handleCancel() {
      this.$message.info("已取消操作");
      this.modalVisible = false;
      this.resetCheckStatusData();
    },
    resetCheckStatusData() {
      this.checkStatusData = {
        joinId: undefined, // 教练员报名id
        refereeId: undefined, // 教练员id
        checkStatus: undefined, // 赛事报名id
        checkResult: "" // 审核意见
      };
    },

    // 删除
    deleteInfo(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteReferee(id).then(res => {
        this.$refs.loading.closeLoading();
        const result = res.data;
        if (result.code === 0) {
          this.$message.success(result.desc);
          this.searchTableData();
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    deletecancel() {
      this.$message.warning("删除操作已取消");
    },

    // 导入证书上传
    customRequest(options) {
      const formData = new FormData();
      formData.append("file", options.file);
      formData.append("endcationId", this.form.educationId);
      this.$refs.loading.openLoading("文件正在上传，请稍后");
      uploadCertificate(formData)
        .then(res => {
          const result = res.data;
          this.$refs.loading.closeLoading();
          if (result.code === 0) {
            this.$message.success(result.desc);
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          options.onError();
          this.$refs.loading.closeLoading();
        });
    },

    // 导出证书模板
    exportTemplate() {
      this.$refs.loading.openLoading("正在导出模板，请稍后。。");
      exportTemplate(this.form.educationId)
        .then(async res => {
          if (res.status === 200 && res.data) {
            let filename = "";
            const disposition = res.headers["content-disposition"];
            if (disposition) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(disposition);
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, "");
              }
            }
            await downloadFile(res.data, filename);
            this.$refs.loading.closeLoading();
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    // 导出
    exportData() {
      if (this.dataSource.length === 0) {
        this.$message.warning("暂无可导出的数据");
        return;
      }
      this.$refs.loading.openLoading("正在导出数据，请稍后。。");
      exportReferee(this.form.educationId)
        .then(async res => {
          if (res.status === 200 && res.data) {
            let filename = "";
            const disposition = res.headers["content-disposition"];
            if (disposition) {
              const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              const matches = filenameRegex.exec(disposition);
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, "");
              }
            }
            await downloadFile(res.data, filename);
            this.$refs.loading.closeLoading();
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    // 返回上一页
    goBackTrain() {
      // this.$refs.infosForm.resetFields();
      this.reset();
      this.$emit("closeConfig");
      this.$emit("searchTableData");
    }
  }
};
</script>

<style lang="less" scoped>
.infosTable-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  margin-top: 24px;
}
</style>