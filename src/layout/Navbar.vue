<template>
  <div class="navbar">
    <span class="title">Admin Dashboard</span>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;
}
.title {
  font-weight: bold;
}
</style>
