<!--
 * @Description: 报名管理 / 培训 / 查看详情table
 * @Author: Leo
 * @Date: 2020-12-25 11:00:00
 * @LastEditTime: 2020-12-28 18:02:01
 * @LastEditors: Leo
-->
<template>
  <div class="infosTable-page"
       v-if="configshow">
    <a-card :style="`min-height: ${pageMinHeight}px`">
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
                           :maxLength="10"
                           placeholder="请输入姓名"></a-input>
                </a-form-model-item>
              </a-col>
              <!-- 裁判等级 -->
              <a-col :md="8"
                     :sm="24">
                <a-form-model-item label="裁判等级"
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
               @click="openDetails(record.id)">查看
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
                 :detailShow="detailShow"></InfoDetails>

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
import InfoDetails from "./infoDetails";
// table columns data
const columns = [
  {
    title: "记录ID",
    dataIndex: "id",
  },
  {
    title: "姓名",
    dataIndex: "name",
    scopedSlots: { customRender: "infoName" },
  },
  {
    title: "性别",
    dataIndex: "sex",
  },
  {
    title: "出生日期",
    dataIndex: "birthday",
  },
  {
    title: "手机号",
    dataIndex: "mobile",
  },
  {
    title: "现裁判等级",
    dataIndex: "applyTime",
  },
  {
    title: "工作单位",
    dataIndex: "workplace",
  },
  {
    title: "身份证号",
    dataIndex: "identityCard",
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
        { label: "一级", value: 1 },
        { label: "二级", value: 2 },
        { label: "三级", value: 3 },
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
      infoData: {}, // 详情数据
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    desc() {
      if (this.detailShow) {
        return this.$t("detailDesc");
      } else {
        return this.$t("configDesc");
      }
    },
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
      this.dataSource = [];
      this.resetPagination();
    },

    // 查看某一个数据列详情
    openDetails() {
      this.detailShow = true;
    },

    closeDetail() {
      this.detailShow = false;
    },

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

    // 取消
    resetForm() {
      this.$refs.infosForm.resetFields();
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