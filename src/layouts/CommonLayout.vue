<template>
  <div class="common-layout">
    <div class="content">
      <slot></slot>
    </div>
    <page-footer :link-list="footerLinks"
                 :copyright="copyright"></page-footer>
  </div>
</template>

<script>
import PageFooter from "@/layouts/footer/PageFooter";
import { mapState } from "vuex";

export default {
  name: "CommonLayout",
  components: { PageFooter },
  computed: {
    ...mapState("setting", ["footerLinks", "copyright"])
  }
};
</script>

<style scoped lang="less">
.common-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: #001529;
  .content {
    margin: 5vh 5vw 5px;
    flex: 1;
    background-image: url("../assets/img/bg.png");
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
    background-size: contain;
    position: relative;
  }
}
</style>
