<template>
  <div>
    <!-- Metric Cards -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="6">
        <el-card>
          <div class="stat">
            <div class="stat-title">Total Users</div>
            <div class="stat-value">{{ metrics.totalUsers }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <div class="stat">
            <div class="stat-title">Pending Purchases</div>
            <div class="stat-value">{{ metrics.pendingPurchases }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <div class="stat">
            <div class="stat-title">Completed Purchases</div>
            <div class="stat-value">{{ metrics.completedPurchases }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <div class="stat">
            <div class="stat-title">VIP Revenue</div>
            <div class="stat-value">${{ metrics.vipRevenue }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Purchase Requests Table -->
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
      metrics: {
        totalUsers: 0,
        pendingPurchases: 0,
        completedPurchases: 0,
        vipRevenue: 0,
      },
      recentRequests: [],
    };
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    fetchDashboardData() {
      // This simulates API calls; replace with Axios calls in production
      const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const purchases = [
        { id: 101, userName: "John", vipPlan: "Gold", status: "pending", createdAt: "2026-01-19" },
        { id: 102, userName: "Jane", vipPlan: "Silver", status: "completed", createdAt: "2026-01-18" },
        { id: 103, userName: "Mike", vipPlan: "Gold", status: "completed", createdAt: "2026-01-17" },
      ];

      this.metrics.totalUsers = users.length;
      this.metrics.pendingPurchases = purchases.filter(p => p.status === "pending").length;
      this.metrics.completedPurchases = purchases.filter(p => p.status === "completed").length;
      this.metrics.vipRevenue = purchases
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + (p.vipPlan === "Gold" ? 20 : 10), 0);

      this.recentRequests = purchases;
    },
  },
};
</script>

<style scoped>
.mb-20 {
  margin-bottom: 20px;
}
.stat-title {
  color: #909399;
  font-size: 14px;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
}
.table-header {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
