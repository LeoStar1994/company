<!--
 * @Description: 报名管理 / 赛事 / 查看详情table
 * @Author: Leo
 * @Date: 2020-12-25 11:00:00
 * @LastEditTime: 2021-01-05 14:58:30
 * @LastEditors: Leo
-->
<template>
  <div class="infosTable-page"
       v-if="configshow">
    <a-card v-show="!detailShow"
            :style="`min-height: ${pageMinHeight}px`">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="infosForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <!-- 审核状态 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="审核状态"
                                   prop="checkStatus">
                  <a-select style="width: 100%"
                            v-model="form.checkStatus"
                            allowClear
                            placeholder="请选择">
                    <a-select-option v-for="(item,index) in checkStatusList"
                                     :key="index"
                                     :value="item.value">
                      {{item.label}}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- 球队名称 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="球队名称"
                                   prop="teamName">
                  <a-input v-model="form.teamName"
                           allowClear
                           :maxLength="10"
                           placeholder="请输入球队名称"></a-input>
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
            <a @click="toggleAdvanced"
               style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form-model>
      </div>
      <div>
        <!-- operator -->
        <div class="operator">
          <a-button @click="goBackTrain"
                    class="mr-10"
                    type="primary">返回上一页</a-button>
        </div>
        <!-- table -->
        <standard-table :columns="columns"
                        rowKey="id"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="pagination"
                        @change="handleTableChange">
          <div slot="infoName"
               slot-scope="{text}">
            <img src="../../../assets/img/logo_icon.jpg"
                 width="40px"
                 alt="">
            <span class="ml-6">{{text}}</span>
          </div>
          <div slot="checkStatus"
               slot-scope="{text}">
            {{checkStatusMapObj[text]}}
          </div>
          <div slot="action"
               slot-scope="{record}">
            <a class="mr-12"
               @click="openDetails(record.id)">球队信息
            </a>
            <a class="mr-12 text-green"
               v-if="record.checkStatus === 0"
               @click="openChangeAlarm(record.id, 1)">审核通过
            </a>
            <a class="mr-12 text-orange"
               v-if="record.checkStatus === 0"
               @click="openChangeAlarm(record.id, 2)">不通过
            </a>
            <a class="mr-12 text-green"
               @click="exportInfo(record.id, record.checkStatus)">导出
            </a>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteDetails(record.id)"
                          @cancel="deletecancel">
              <a href="#"
                 class="text-red">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>

    <!-- 球队审核不通过弹框 -->
    <a-modal title="审核反馈"
             :visible="modalVisible"
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
                      :maxLength="300"
                      :auto-size="{ minRows: 4, maxRows: 6 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 明细 -->
    <InfoDetails ref="infoDetails"
                 :infoData="infoData"
                 :detailShow="detailShow"
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
import InfoDetails from "@/components/infoDetails/InfoDetails";
import {
  getInfosTableData,
  changeCheckStatus,
  exportTeam,
  deleteTeam,
  getTeamDetail
} from "@/services/competition";
import { downloadFile } from "@/utils/util";

// table columns data
const columns = [
  {
    title: "报名ID",
    dataIndex: "id"
  },
  {
    title: "球队名称",
    dataIndex: "teamName"
    // scopedSlots: { customRender: "infoName" },
  },
  {
    title: "运动员人数",
    dataIndex: "totalMember"
  },
  {
    title: "官员人数",
    dataIndex: "totalTrain"
  },
  {
    title: "领队",
    dataIndex: "linkMan"
  },
  {
    title: "手机号",
    dataIndex: "telPhone"
  },
  {
    title: "审核状态",
    dataIndex: "checkStatus",
    scopedSlots: { customRender: "checkStatus" }
  },
  {
    title: "报名时间",
    dataIndex: "createTime"
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" }
  }
];
const fieldsMapLabel = [
  {
    field: "teamName",
    labelName: "球队名称",
    sort: 1
  },
  {
    field: "linkMan",
    labelName: "联系人",
    sort: 2
  },
  {
    field: "mainColor",
    labelName: "主场赛服颜色",
    sort: 3
  },
  {
    field: "telPhone",
    labelName: "联系电话",
    sort: 4
  },
  {
    field: "secondColor",
    labelName: "客场赛服颜色",
    sort: 5,
    isOccupyAll: true
  },
  {
    field: "teamImage",
    labelName: "集体照",
    sort: 6,
    isOccupyAll: true
  }
];
const fieldsMapLabelSon = [
  {
    field: "trainSex",
    labelName: "性别",
    sort: 1
  },
  {
    field: "country",
    labelName: "国籍",
    sort: 2
  },
  {
    field: "born",
    labelName: "出生日期",
    sort: 3
  },
  {
    field: "cardType",
    labelName: "证件类型",
    sort: 4
  },
  {
    field: "positionName",
    labelName: "职务",
    sort: 5
  },
  {
    field: "identityCard",
    labelName: "证件号码",
    sort: 6
  },
  {
    field: "identityImagePath",
    labelName: "证件照片",
    sort: 7,
    isOccupyAll: true
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
      columns: columns,
      fieldsMapLabel: fieldsMapLabel,
      modalVisible: false,
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
      checkStatusList: [
        { label: "待审核", value: 0 },
        { label: "通过", value: 1 },
        { label: "不通过", value: 2 }
      ],
      checkStatusMapObj: {
        0: "待审核",
        1: "通过",
        2: "不通过"
      },
      form: {
        teamName: undefined,
        checkStatus: undefined,
        hockeyGamesId: null
      },
      // 搜索项校验规则
      rules: {
        teamName: [],
        checkStatus: []
      },
      checkStatusrules: {
        checkResult: []
      },
      detailShow: false,
      // 详情数据
      infoData: {
        name: "",
        imgURL: "",
        // 官员 columns
        officerColumns: [
          {
            title: "ID",
            dataIndex: "id"
          },
          {
            title: "姓名",
            dataIndex: "trainName"
          },
          {
            title: "职务",
            dataIndex: "positionName"
          },
          {
            title: "性别",
            dataIndex: "trainSex"
          },
          {
            title: "国籍",
            dataIndex: "country"
          },
          {
            title: "身份证号/护照号码",
            dataIndex: "identityCard"
          },
          {
            title: "操作",
            scopedSlots: { customRender: "action" }
          }
        ],
        // 运动员 columns
        playerColumns: [
          {
            title: "ID",
            dataIndex: "id"
          },
          {
            title: "姓名",
            dataIndex: "memberName",
            scopedSlots: { customRender: "playerName" }
          },
          {
            title: "队服号",
            dataIndex: "num"
          },
          {
            title: "位置",
            dataIndex: "position"
          },
          {
            title: "身高cm",
            dataIndex: "height"
          },
          {
            title: "体重kg",
            dataIndex: "weight"
          },
          {
            title: "持杆手",
            dataIndex: "holdingRod"
          },
          {
            title: "身份证号/港澳通行证号码",
            dataIndex: "identityCard"
          }
        ],
        // 官员 tableData
        officerTableData: [],
        // 运动员 tableData
        playerTableData: [],
        // 基础信息
        descList: [],
        fieldsMapLabelSon: fieldsMapLabelSon
      },
      checkStatusData: {
        hockeyGamesJoinId: undefined, // 审核状态
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

    setLastSerachData(id) {
      this.form.hockeyGamesId = id;
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
          this.dataSource = result.data.list;
          this.pagination.total = result.data.total;
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

    // 查看
    openDetails(teamId) {
      getTeamDetail({ teamId }).then(res => {
        const result = res.data;
        if (result.code === 0) {
          this.infoData.name = result.data.team.teamName;
          this.infoData.imgURL = result.data.team.teamImage;
          this.infoData.officerTableData = result.data.trainVoList;
          this.infoData.playerTableData = result.data.detailVoList;
          this.infoData.descList = this.formatDetailsData(result.data.team);
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
    openChangeAlarm(hockeyGamesJoinId, checkStatus) {
      this.checkStatusData.hockeyGamesJoinId = hockeyGamesJoinId;
      this.checkStatusData.checkStatus = checkStatus;
      let _this = this;
      if (checkStatus === 1) {
        this.$confirm({
          title:
            "审核通过后，该球队会加入【赛事管理】可进行赛程排序，是否确定通过?",
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
    },
    handleCancel() {
      this.$message.info("已取消操作");
      this.modalVisible = false;
    },

    // 导出
    exportInfo(teamId, checkStatus) {
      if (this.dataSource.length === 0) {
        this.$message.warning("暂无可导出的数据");
        return;
      }
      const data = {
        hockeyGameId: this.form.hockeyGamesId,
        checkStatus,
        teamId
      };
      exportTeam(data).then(res => {
        if (res.status === 200 && res.data) {
          let filename = "";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, "");
              console.log();
            }
          }
          downloadFile(res.data, filename);
        }
      });
    },

    // 删除
    deleteDetails(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      deleteTeam(id)
        .then(res => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.searchTableData();
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    deletecancel() {
      this.$message.warning("删除操作已取消");
    },

    // 返回上一页
    goBackTrain() {
      // this.$refs.infosForm.resetFields();
      this.reset();
      this.$emit("closeConfig");
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