<template>
  <div class="users-wrapper">
    <header class="page-header">
      <div class="header-left">
        <span class="category-tag">Community</span>
        <h1>User Directory</h1>
        <p>Monitor member activity and subscription levels across the platform.</p>
      </div>
      <div class="header-stats">
        <div class="stat-badge">
          <span class="dot"></span>
          {{ users.length }} Active Members
        </div>
      </div>
    </header>

    <div class="table-container">
      <div class="table-toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="Filter by name, email, or ID..."
          class="premium-search"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <div class="toolbar-actions">
          <el-button link class="filter-btn"><el-icon><Filter /></el-icon> Filters</el-button>
        </div>
      </div>

      <el-table :data="filteredUsers" v-loading="adminStore.loadStates.users" class="premium-table">
        <el-table-column label="Member" min-width="260">
          <template #default="scope">
            <div class="user-profile">
              <div class="avatar-wrapper">
                <el-avatar 
                  :size="42" 
                  :src="`https://ui-avatars.com/api/?name=${scope.row.name}&background=f1f5f9&color=64748b&bold=true`" 
                />
              </div>
              <div class="user-meta">
                <span class="user-name">{{ scope.row.name }}</span>
                <span class="user-id">UID #{{ scope.row.id }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Contact" min-width="200">
          <template #default="scope">
            <div class="email-cell">{{ scope.row.email }}</div>
          </template>
        </el-table-column>

        <el-table-column label="Access Level" width="180">
          <template #default="scope">
            <div class="access-pill" :class="getAccessClass(scope.row)">
              <el-icon v-if="scope.row.role_id === 2"><StarFilled /></el-icon>
              {{ getAccessLabel(scope.row) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Registration" width="160">
          <template #default="scope">
            <div class="date-text">
              <span class="date">{{ formatDate(scope.row.created_at) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="" align="right" width="80">
          <template #default="scope">
            <el-dropdown trigger="click" placement="bottom-end">
              <el-button link class="more-btn"><el-icon><MoreFilled /></el-icon></el-button>
              <template #dropdown>
                <el-dropdown-menu class="premium-dropdown">
                <el-dropdown-item :icon="User" v-if="scope.row.role_id == 2" @click="handleRoleChange(scope.row,1)">Demote to User</el-dropdown-item>
                <el-dropdown-item :icon="StarFilled" v-else @click="handleRoleChange(scope.row,2)" command="edit">
                  Promote to Admin
                </el-dropdown-item>
                <el-dropdown-item divided class="delete-action" @click="handleDelete(scope.row.id)">
                  <el-icon><Delete /></el-icon> Delete Account
                </el-dropdown-item>
              </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { Search, StarFilled, MoreFilled, User, Delete, Filter } from '@element-plus/icons-vue';
import http from '@/api/http';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDate,getAccessClass,getAccessLabel } from '@/utils/helpers';
import { useAdminStore } from '@/store/admin';

const adminStore = useAdminStore()
const users = computed(() => adminStore.users)
const searchQuery = ref('');

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(u => 
    u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
  );
});

const handleDelete = (id) => {
  ElMessageBox.confirm('This action will permanently revoke user access. Continue?', 'Archive User', {
    confirmButtonText: 'Revoke Access',
    confirmButtonClass: 'el-button--danger',
    cancelButtonText: 'Cancel',
    type: 'warning',
    customClass: 'premium-logout-box',
    center: true,
    showClose: false,
  }).then(async () => {
    await http.delete(`/users/${id}`);
    ElMessage.success('User has been removed from the directory');
    adminStore.fetchUsers();
  });
};

const editDrawer = reactive({
  visible: false,
  submitting: false
});

const editForm = reactive({
  id: null,
  name: '',
  email: '',
  role_id: 1
});

const handleRoleChange = async (user, newRoleId) => {
  try {
    const res = await http.patch(`/users/${user.id}/change-profile`, { role_id: newRoleId });
    ElMessage.success(res?.message || 'Member profile updated successfully');
    adminStore.fetchUsers();
  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message || "Update failed. Please check your connection.");
  }
};

onMounted(()=>adminStore.fetchUsers());
</script>

<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$accent: #1e293b;
$ease: cubic-bezier(0.25, 1, 0.5, 1);

.users-wrapper {
  padding: 0;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;

    .category-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #3b82f6;
      margin-bottom: 8px;
      display: block;
    }

    h1 { font-family: 'Plus Jakarta Sans'; font-size: 32px; font-weight: 800; color: $text-main; letter-spacing: -1px; margin: 0; }
    p { color: $text-muted; font-size: 15px; margin-top: 4px; }
  }

  .stat-badge {
    background: white;
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    color: $text-main;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; }
  }

  /* TABLE AREA */
  .table-container {
    background: white;
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    overflow: hidden;
  }

  .table-toolbar {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;

    .premium-search {
      width: 340px;
      :deep(.el-input__wrapper) {
        background: #f8fafc;
        box-shadow: none !important;
        border-radius: 12px;
        padding: 10px 16px;
      }
    }
    .filter-btn { color: $text-muted; font-weight: 600; font-size: 14px; &:hover { color: $text-main; } }
  }

  :deep(.premium-table) {
    .el-table__header th {
      background: #fcfcfd;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.5px;
      padding: 16px 0;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 0;
      .user-meta {
        display: flex;
        flex-direction: column;
        .user-name { font-weight: 700; color: $text-main; font-size: 15px; }
        .user-id { font-size: 11px; color: #94a3b8; font-family: monospace; }
      }
    }

    .email-cell { color: $text-muted; font-size: 14px; }

    /* ACCESS LEVEL PILLS */
    .access-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 700;
      &.admin { background: #fef2f2; color: #dc2626; }
      &.vip { background: #f0fdf4; color: #16a34a; }
      &.standard { background: #f1f5f9; color: $text-muted; }
    }

    .date-text { color: $text-muted; font-size: 13px; font-weight: 500; }
    
    .more-btn {
      font-size: 18px;
      color: #cbd5e1;
      &:hover { color: $text-main; }
    }
  }
}

/* DROPDOWN */
.premium-dropdown {
  border-radius: 12px;
  padding: 8px;
  .delete-action { color: #ef4444; &:hover { background: #fef2f2 !important; } }
}

/* DRAWER INTEGRATION */
:deep(.premium-drawer) {
  background: white;
  border-left: 1px solid #f1f5f9;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.04);

  .el-drawer__header {
    margin-bottom: 0;
    padding: 30px;
    border-bottom: 1px solid #f1f5f9;
  }

  .drawer-header-custom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    .category-tag { font-size: 10px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 1px; }
    h3 { margin: 4px 0 0; font-size: 20px; font-weight: 800; color: $text-main; }
    
    .close-btn { 
      border: 1px solid #e2e8f0; border-radius: 50%; width: 32px; height: 32px; padding: 0;
      color: $text-muted; &:hover { background: #f8fafc; color: $text-main; }
    }
  }

  .drawer-body {
    padding: 30px;

    .profile-card-mini {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 16px;
      margin-bottom: 30px;
      
      h4 { margin: 0; font-weight: 700; color: $text-main; }
      p { margin: 2px 0 0; font-size: 12px; color: $text-muted; font-family: monospace; }
    }
  }

  .edit-form {
    :deep(.el-form-item__label) { font-weight: 700; color: $text-main; font-size: 13px; }
    :deep(.el-input__wrapper) { 
        background: #f8fafc; border-radius: 12px; box-shadow: none !important; border: 1px solid #e2e8f0; 
        &.is-focus { border-color: #3b82f6; background: white; }
    }
  }

  .drawer-footer {
    padding: 20px 30px;
    border-top: 1px solid #f1f5f9;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    
    .el-button { height: 45px; border-radius: 12px; font-weight: 700; }
    .save-btn { background: $text-main; border: none; &:hover { transform: translateY(-1px); } }
  }
}
</style>