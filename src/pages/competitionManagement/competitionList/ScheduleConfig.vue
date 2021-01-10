<!--
 * @Description: 赛事管理 / 赛事列表 / 赛事日程 / 新增|修改modal
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2020-12-29 17:38:06
 * @LastEditors: Leo
-->
<template>
  <div class="scheduleConfig-page">
    <a-modal :title="scheduleConfigTitle"
             width="660px"
             :visible="scheduleConfigVisible"
             :confirm-loading="confirmLoading"
             centered
             :maskClosable="false"
             destroyOnClose
             @ok="handleOk"
             @cancel="handleCancel">
      <a-form-model ref="scheduleConfigForm"
                    :model="scheduleConfigForm"
                    :rules="scheduleConfigRules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 竞赛组别 -->
        <a-form-model-item label="竞赛组别"
                           prop="gameGrade">
          <a-select style="width: 100%"
                    v-model="scheduleConfigForm.gameGrade"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in gameGradeList"
                             :key="index"
                             :value="item">
              {{item}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 主队 -->
        <a-form-model-item label="主队"
                           prop="homeTeamId">
          <a-select style="width: 100%"
                    v-model="scheduleConfigForm.homeTeamId"
                    @change="teamIdMapTeamName(scheduleConfigForm.homeTeamId, 0)"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in teamsList"
                             :key="index"
                             :value="item.gameTeamId">
              {{item.gameTeamName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 客队 -->
        <a-form-model-item label="客队"
                           prop="awayTeamId">
          <a-select style="width: 100%"
                    v-model="scheduleConfigForm.awayTeamId"
                    @change="teamIdMapTeamName(scheduleConfigForm.awayTeamId, 1)"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in teamsList"
                             :key="index"
                             :value="item.gameTeamId">
              {{item.gameTeamName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 场次 -->
        <a-form-model-item label="场次"
                           prop="gameSessions">
          <a-input v-model="scheduleConfigForm.gameSessions"
                   placeholder="请输入场次"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <!-- 比赛时间 -->
        <a-form-model-item label="比赛时间"
                           required>
          <div class="d-flex h40">
            <a-form-model-item prop="sessionsStartTime"
                               class="flex-1">
              <a-date-picker v-model="scheduleConfigForm.sessionsStartTime"
                             :disabled-date="disabledStartDate"
                             show-time
                             style="width:100%"
                             format="YYYY-MM-DD HH:mm"
                             valueFormat="YYYY-MM-DD HH:mm"
                             placeholder="开始时间" />
            </a-form-model-item>
            <span class="mx-4 h40">~</span>
            <a-form-model-item prop="sessionsEndTime"
                               class="flex-1">
              <a-date-picker v-model="scheduleConfigForm.sessionsEndTime"
                             :disabled-date="disabledEndDate"
                             style="width:100%"
                             show-time
                             format="YYYY-MM-DD HH:mm"
                             valueFormat="YYYY-MM-DD HH:mm"
                             placeholder="结束时间" />
            </a-form-model-item>
          </div>
        </a-form-model-item>
        <!-- 比赛场地 -->
        <a-form-model-item :label="item.label"
                           v-for="(item,index) in placeList"
                           :key="index"
                           :prop="item.prop">
          <a-input v-model="item.place"
                   placeholder="请输入比赛场地"
                   :style="{'margin-left': index >= 1 ? '31.2%' : ''}"
                   allowClear
                   :maxLength="20" />
        </a-form-model-item>
        <a @click="addPlace"
           style="margin-left:153px">+添加场地</a>
      </a-form-model>
    </a-modal>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { addSchedule, updateSchedule } from "@/services/competitionList";
export default {
  name: "scheduleConfig",
  props: {
    gameGradeList: {
      type: Array,
      default: new Array()
    },
    teamsList: {
      type: Array,
      default: new Array()
    }
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      placeList: [{ label: "比赛场地", prop: "place", place: "" }],
      openType: 0,
      scheduleConfigVisible: false,
      scheduleConfigTitle: "新增邀请码",
      confirmLoading: false,
      scheduleConfigForm: {
        awayTeamId: undefined, // 客队id
        awayTeamName: undefined, // 客队名称
        homeTeamId: undefined, // 主队id
        homeTeamName: undefined, // 主队名称
        place: undefined, // 比赛场地，多个地点用逗号隔开
        sessionsEndTime: null, //比赛结束时间
        sessionsStartTime: null, // 比赛开始时间
        hockeyGamesId: undefined, // 赛事id
        gameGrade: undefined, // 赛事组别
        gameSessions: undefined // 场次
      },
      // 搜索项校验规则
      scheduleConfigRules: {
        gameGrade: [
          {
            required: true,
            message: "请选择竞赛组别",
            trigger: "change"
          }
        ],
        homeTeamId: [
          {
            required: true,
            message: "请选择主队",
            trigger: "change"
          }
        ],
        awayTeamId: [
          {
            required: true,
            trigger: "change",
            validator: this.handleCheckTeams
          }
        ],
        gameSessions: [
          {
            required: true,
            message: "请输入场次",
            trigger: "blur"
          },
          {
            pattern: /^\d+$/,
            message: "场次只能输入数字！"
          }
        ],
        sessionsStartTime: [
          {
            required: true,
            message: "请选择比赛开始时间",
            trigger: "change"
          }
        ],
        sessionsEndTime: [
          {
            required: true,
            message: "请选择比赛结束时间",
            trigger: "change"
          }
        ],
        place: [
          {
            required: true,
            trigger: "blur",
            validator: this.handleCheckPlace
          }
        ]
      },
      currentId: null
    };
  },
  created() {},
  methods: {
    /**
     * @description: 打开详情页
     * @param : type{int} 0: 新增， 1:修改
     * @param : id{int}
     * @param : hockeyGamesId{int} 赛事id
     * @return {*}
     * @author: Leo
     */
    setOpenType(type, id, hockeyGamesId) {
      this.openType = type;
      this.currentId = id;
      this.scheduleConfigForm.hockeyGamesId = hockeyGamesId;
      if (type === 0) {
        this.scheduleConfigTitle = "新增赛事日程";
      } else {
        this.scheduleConfigTitle = "修改赛事日程";
      }
      this.scheduleConfigVisible = true;
    },

    // 主客队不能为同一个队伍
    handleCheckTeams(rule, value, callback) {
      const homeTeamVal = this.scheduleConfigForm.homeTeamId;
      if (this.$isEmpty(value)) {
        callback("请选择客队");
      } else if (homeTeamVal === value) {
        callback("主队与客队不能为同一支队伍！");
      }
      callback();
    },

    // 校验比赛场地
    handleCheckPlace(rule, value, callback) {
      const finallyPlace = this.placeList.map(item => item.place).join();
      if (this.$isEmpty(finallyPlace)) {
        callback("请输入比赛场地");
      }
      callback();
    },

    // 通过id映射teamName
    teamIdMapTeamName(teamId, type) {
      if (type === 0) {
        // 主队
        this.scheduleConfigForm.homeTeamName = this.teamsList.find(
          item => item.gameTeamId === teamId
        ).gameTeamName;
      } else {
        // 客队
        this.scheduleConfigForm.awayTeamName = this.teamsList.find(
          item => item.gameTeamId === teamId
        ).gameTeamName;
      }
    },

    // 添加比赛场地
    addPlace() {
      this.placeList.push({ label: "", place: "" });
    },

    // 比赛时间
    disabledStartDate(startValue) {
      const endValue = this.scheduleConfigForm.sessionsEndTime;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > new Date(endValue).valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.scheduleConfigForm.sessionsStartTime;
      if (!endValue || !startValue) {
        return false;
      }
      return new Date(startValue).valueOf() >= endValue.valueOf();
    },

    // 确定
    async handleOk() {
      this.confirmLoading = true;
      await this.onSubmit();
      this.confirmLoading = false;
    },

    // 保存
    onSubmit() {
      this.scheduleConfigForm.place = this.placeList
        .map(item => item.place)
        .join();
      this.$refs.scheduleConfigForm.validate(valid => {
        if (valid) {
          const data = { ...this.scheduleConfigForm };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          if (this.openType === 0) {
            // 新增
            addSchedule(data).then(res => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.handleCancel();
                this.$emit("searchTableData");
              } else {
                this.$message.error(result.desc);
              }
            });
          } else if (this.openType === 1) {
            // 修改
            data.id = this.currentId;
            updateSchedule(data).then(res => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.handleCancel();
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

    handleCancel() {
      this.$refs.scheduleConfigForm.resetFields();
      this.scheduleConfigVisible = false;
    }
  }
};
</script>
<style lang="less">
.ant-modal-body {
  max-height: 600px !important;
  overflow-y: auto !important;
}
</style>