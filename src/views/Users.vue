<template>
  <div class="users-wrapper">
    <div class="page-header">
      <div class="title-section">
        <h1>User Management</h1>
        <p>Manage your community and monitor subscription status</p>
      </div>
      <div class="header-stats">
        <el-tag type="info" effect="plain">Total: {{ state.users.length }} Users</el-tag>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <div class="table-toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="Search by name or email..."
          prefix-icon="Search"
          class="search-input"
          clearable
        />
      </div>

      <el-table :data="filteredUsers" v-loading="state.isLoading" stripe>
        <el-table-column label="User Profile" min-width="200">
          <template #default="scope">
            <div class="user-identity">
              <el-avatar :size="40" :src="`https://ui-avatars.com/api/?name=${scope.row.name}&background=random`" />
              <div class="ml-12">
                <div class="full-name">{{ scope.row.name }}</div>
                <div class="user-id">UID: #{{ scope.row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="Email Address" min-width="180" />

        <el-table-column label="Account Type" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.role_id === 2" type="warning" effect="dark" round>
              <el-icon><Star /></el-icon> VIP Admin
            </el-tag>
            <el-tag v-else-if="scope.row.is_vip" type="success" effect="light" round>
              VIP Member
            </el-tag>
            <el-tag v-else type="info" effect="plain" round>Regular</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Joined Date" width="180">
          <template #default="scope">
            <div class="date-cell">
              {{ formatDate(scope.row.created_at) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Actions" align="right" width="150">
          <template #default="scope">
            <el-dropdown trigger="click">
              <el-button link type="primary">Manage <el-icon><ArrowDown /></el-icon></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEdit(scope.row)">Edit Profile</el-dropdown-item>
                  <el-dropdown-item divided type="danger" @click="handleDelete(scope.row.id)">
                    <span class="text-danger">Delete Account</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Star, ArrowDown } from '@element-plus/icons-vue';
import http from '@/api/http';
import { ElMessage, ElMessageBox } from 'element-plus';

const state = ref({
  users: [],
  isLoading: false
});

const searchQuery = ref('');

const fetchData = async () => {
  state.value.isLoading = true;
  try {
    const res = await http.get('/users');
    state.value.users = res.data;
  } catch (error) {
    ElMessage.error("Failed to load users");
  } finally {
    state.value.isLoading = false;
  }
};

const filteredUsers = computed(() => {
  return state.value.users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const handleDelete = (id) => {
  ElMessageBox.confirm('Permanent delete this user? This cannot be undone.', 'Warning', {
    type: 'warning',
    confirmButtonText: 'Delete User'
  }).then(async () => {
    await http.delete(`/users/${id}`);
    ElMessage.success('User removed');
    fetchData();
  });
};

onMounted(fetchData);
</script>

<style lang="scss" scoped>
.users-wrapper {
  padding: 24px 24px 24px 5px;
  background-color: #f8fafc;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
    h1 { font-size: 24px; color: #1e293b; margin: 0; font-weight: 700; }
    p { color: #64748b; margin-top: 4px; }
  }

  .table-card { border-radius: 16px; border: none; }

  .table-toolbar {
    margin-bottom: 20px;
    .search-input { width: 300px; }
  }

  .user-identity {
    display: flex;
    align-items: center;
    .full-name { font-weight: 600; color: #1e293b; font-size: 14px; }
    .user-id { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  }

  .date-cell { font-size: 13px; color: #64748b; }
  .ml-12 { margin-left: 12px; }
  .text-danger { color: #f56c6c; }
}
</style>