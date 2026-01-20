<template>
    <div>
        <el-card>
      <div class="table-header">
        <span>Recent Purchase Requests</span>
      </div>
      <el-table :data="recentRequests" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userName" label="User" />
        <el-table-column prop="vipPlan" label="VIP Plan" />
        <el-table-column prop="status" label="Status" />
        <el-table-column prop="createdAt" label="Date" />
      </el-table>
    </el-card>
    </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      recentRequests: [],
    };
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    fetchDashboardData() {
      const purchases = [
        { id: 101, userName: "John", vipPlan: "Gold", status: "pending", createdAt: "2026-01-19" },
        { id: 102, userName: "Jane", vipPlan: "Silver", status: "completed", createdAt: "2026-01-18" },
        { id: 103, userName: "Mike", vipPlan: "Gold", status: "completed", createdAt: "2026-01-17" },
      ];
      this.recentRequests = purchases;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>