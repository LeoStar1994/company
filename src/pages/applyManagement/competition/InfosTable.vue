<!--
 * @Description: 报名管理 / 赛事 / 查看详情table
 * @Author: Leo
 * @Date: 2020-12-25 11:00:00
 * @LastEditTime: 2020-12-29 17:41:39
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
                                   prop="judgeLevel">
                  <a-select style="width: 100%"
                            v-model="form.judgeLevel"
                            allowClear
                            placeholder="请选择">
                    <a-select-option v-for="(item,index) in judgeLevelList"
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
                                   prop="name">
                  <a-input v-model="form.name"
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
          <div slot="action"
               slot-scope="{record}">
            <a class="mr-12"
               @click="openDetails(record.id)">球队信息
            </a>
            <a class="mr-12 text-green"
               @click="changeAuditStatus(record.id, 1)">审核通过
            </a>
            <a class="mr-12 text-orange"
               @click="changeAuditStatus(record.id, 2)">不通过
            </a>
            <a class="mr-12 text-green"
               @click="exportInfo(record.id)">导出
            </a>
            <a-popconfirm title="是否删除该条数据?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="deleteInfo(record.sequenceNumber)"
                          @cancel="deletecancel">
              <a href="#"
                 class="text-red">删除</a>
            </a-popconfirm>
          </div>
        </standard-table>
      </div>
    </a-card>
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
import { getInfosTableData } from "@/services/train";
import InfoDetails from "@/components/infoDetails/InfoDetails";

const imgURL = require("@/assets/img/logo_icon.jpg");
// table columns data
const columns = [
  {
    title: "报名ID",
    dataIndex: "id",
  },
  {
    title: "球队名称",
    dataIndex: "name",
    scopedSlots: { customRender: "infoName" },
  },
  {
    title: "运动员人数",
    dataIndex: "sex",
  },
  {
    title: "官员人数",
    dataIndex: "num",
  },
  {
    title: "领队",
    dataIndex: "workplace",
  },
  {
    title: "手机号",
    dataIndex: "mobile",
  },
  {
    title: "审核状态",
    dataIndex: "applyTime",
  },
  {
    title: "报名时间",
    dataIndex: "birthday",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "InfosTable",
  components: { StandardTable, InfoDetails },
  props: {
    configshow: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Array,
      required: true,
      default: new Array(),
    },
  },
  data() {
    return {
      advanced: true,
      tableLoading: false,
      columns: columns,
      // 分页
      pagination: {
        pageSize: 10,
        pageNo: 1,
        total: 0,
        pageSizeOptions: ["10", "15", "20"],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 18, offset: 1 },
      judgeLevelList: [
        { label: "待审核", value: 1 },
        { label: "通过", value: 2 },
        { label: "不通过", value: 3 },
      ],
      form: {
        name: undefined,
        judgeLevel: undefined,
      },
      // 搜索项校验规则
      rules: {
        name: [],
        judgeLevel: [],
      },
      detailShow: false,
      // 详情数据
      infoData: {
        name: "冰球国家队",
        imgURL: imgURL,
        // 官员 columns
        officerColumns: [
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "姓名",
            dataIndex: "name",
          },
          {
            title: "职务",
            dataIndex: "job",
          },
          {
            title: "性别",
            dataIndex: "sex",
          },
          {
            title: "国籍",
            dataIndex: "nationality",
          },
          {
            title: "身份证号/护照号码",
            dataIndex: "identityCard",
          },
          {
            title: "操作",
            scopedSlots: { customRender: "action" },
          },
        ],
        // 运动员 columns
        playerColumns: [
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "姓名",
            dataIndex: "name",
            scopedSlots: { customRender: "playerName" },
          },
          {
            title: "队服号",
            dataIndex: "gameLevel",
          },
          {
            title: "位置",
            dataIndex: "position",
          },
          {
            title: "身高cm",
            dataIndex: "height",
          },
          {
            title: "体重kg",
            dataIndex: "weight",
          },
          {
            title: "持杆手",
            dataIndex: "cursor",
          },
          {
            title: "身份证号/港澳通行证号码",
            dataIndex: "numbers",
          },
        ],
        // 基础信息
        descList: [
          {
            label: "球队全称",
            value: "冰球国家队",
            span: 1,
          },
          {
            label: "联系人",
            value: "刘队",
            span: 1,
          },
          {
            label: "主场赛服颜色",
            value: "红色",
            span: 1,
          },
          {
            label: "联系电话",
            value: "18270707678",
            span: 1,
          },
          {
            label: "客场赛服颜色",
            value: "白色",
            span: 1,
          },
          {
            label: "",
            value: "",
            span: 1,
          },
          {
            label: "集体照",
            value: [imgURL, imgURL],
            span: 2,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  created() {},
  methods: {
    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    // 列表查询
    searchTableData() {
      const data = {
        ...this.form,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      getInfosTableData(data).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data.records;
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

    // 查看某一个数据列详情
    openDetails(id) {
      console.log(id);
      // this.$emit("closeConfig");
      this.detailShow = true;
    },

    closeDetail() {
      this.detailShow = false;
    },

    // 审核通过 | 不通过
    changeAuditStatus() {},

    // 导出
    exportInfo() {},

    // 删除
    deleteDetails(id) {
      console.log(id);
      // this.$refs.loading.openLoading("操作进行中，请稍后。。");
      // deleteRoleInfo(id).then((res) => {
      //   this.$refs.loading.closeLoading();
      //   const result = res.data;
      //   if (result.code === 0) {
      //     this.$message.success(result.desc);
      //     this.searchTableData();
      //   } else {
      //     this.$message.error(result.desc);
      //   }
      // });
    },

    deletecancel() {
      this.$message.warning("删除操作已取消");
    },

    // 导出
    exportData() {},

    // 返回上一页
    goBackTrain() {
      // this.$refs.infosForm.resetFields();
      this.reset();
      this.$emit("closeConfig");
    },
  },
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