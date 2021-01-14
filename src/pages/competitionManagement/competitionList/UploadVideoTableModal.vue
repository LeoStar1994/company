<!--
 * @Description: 上传视频table 列表
 * @Author: Leo
 * @Date: 2021-01-14 11:08:54
 * @LastEditTime: 2021-01-14 15:23:13
 * @LastEditors: Leo
-->
<template>
  <div class="videoTable-modal">
    <a-modal :title="pageTitle"
             width="800px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             centered
             destroyOnClose
             :maskClosable="false"
             @ok="handleOk"
             @cancel="handleCancel">
      <!-- operator -->
      <div class="operator">
        <a-button @click="openAlarm(0)"
                  class="mr-10"
                  type="primary">新增视频</a-button>
      </div>
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="dataSource"
                      :scroll="{x: 1200, y: 500}"
                      rowKey="id">
        <div slot="imgUrl"
             slot-scope="{text}">
          <img :src="text"
               width="100px"
               alt="">
        </div>
        <div slot="action"
             slot-scope="{record}">
          <a-popconfirm title="是否删除该条视频?"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="deleteVideo(record.id)"
                        @cancel="deletecancel">
            <a href="#"
               class="text-red">删除</a>
          </a-popconfirm>
        </div>
      </standard-table>
    </a-modal>

    <!-- 上传视频 -->
    <ScheduleUploadVideo ref="scheduleUploadVideo"
                         @searchTableData="searchTableData"></ScheduleUploadVideo>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import ScheduleUploadVideo from "./ScheduleUploadVideo";
import { getVideoTableData, videodelete } from "@/services/competitionList";
const columns = [
  {
    title: "封面图",
    dataIndex: "imgUrl",
    scopedSlots: { customRender: "imgUrl" },
    width: "100px",
  },
  {
    title: "视频名称",
    dataIndex: "videoName",
    width: "200px",
  },
  {
    title: "视频链接",
    dataIndex: "videoUrl",
    width: "400px",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    width: "100px",
  },
];

export default {
  name: "VideoTableModal",
  components: { StandardTable, ScheduleUploadVideo },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "视频列表",
      confirmLoading: false,
      columns: columns,
      dataSource: [],
      schedulesId: null,
    };
  },
  methods: {
    setOpenType(schedulesId) {
      this.visible = true;
      this.schedulesId = schedulesId;
      this.searchTableData();
    },

    // 新增视频
    openAlarm() {
      this.$refs.scheduleUploadVideo.setOpenType(this.schedulesId);
    },

    // 查询table
    searchTableData() {
      getVideoTableData(this.schedulesId).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 删除视频
    deleteVideo(id) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      videodelete(id)
        .then((res) => {
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

    async handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
