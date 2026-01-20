<template>
  <el-container class="layout">
    <el-aside width="200px">
      <Sidebar />
    </el-aside>

    <el-container>
      <el-header>
        <Navbar />
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

export default {
  components: { Sidebar, Navbar }
}
</script>
