<template>
  <div id="app" class="fullscreen-container">
    <button @click="toggleFullScreen">Toggle Fullscreen</button>
    <el-table :data="tableData" style="width: 100%; height: 100%">
      <!-- 表格列定义 -->
      <el-table-column prop="date" label="Date" width="180"></el-table-column>
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-02",
          name: "John",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-04",
          name: "Micheal",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          date: "2016-05-01",
          name: "Jerry",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
    };
  },
  methods: {
    toggleFullScreen() {
      const elem = document.getElementById("app");
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          // Firefox
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          // Chrome, Safari and Opera
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          // IE/Edge
          elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          // Firefox
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          // Chrome, Safari and Opera
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          // IE/Edge
          document.msExitFullscreen();
        }
      }
    },
  },
};
</script>

<style scoped>
.fullscreen-container {
  /* position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0; */
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
</style>
