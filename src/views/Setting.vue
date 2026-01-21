<template>
  <div class="settings-container">
    <div class="section-header">
      <h2>General Settings</h2>
      <p>Manage application branding and global configurations.</p>
    </div>

    <el-card shadow="never" class="config-card">
      <el-form label-position="left" label-width="200px">
        <el-form-item label="Application Name">
          <el-input v-model="sysSettings.appName" style="max-width: 400px" />
        </el-form-item>

        <el-divider />

        <el-form-item label="Maintenance Mode">
          <div class="switch-row">
            <el-switch v-model="sysSettings.maintenance" />
            <span class="hint">Restrict user access while performing updates.</span>
          </div>
        </el-form-item>

        <el-form-item label="User Registration">
          <div class="switch-row">
            <el-switch v-model="sysSettings.allowReg" />
            <span class="hint">Allow new users to sign up to the platform.</span>
          </div>
        </el-form-item>

        <el-divider />

        <el-button type="primary" size="large" @click="saveSettings">Save Configuration</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const sysSettings = reactive({
  appName: 'VIP Premium System',
  maintenance: false,
  allowReg: true
})

const saveSettings = () => {
  ElMessage.success('Settings saved successfully')
}
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 24px;
  .section-header {
    margin-bottom: 24px;
    h2 { margin: 0; }
    p { color: #909399; margin: 4px 0 0; }
  }
  .config-card { border-radius: 12px; }
  .switch-row {
    display: flex;
    flex-direction: column;
    .hint { font-size: 12px; color: #909399; line-height: 1.2; margin-top: 4px; }
  }
}
</style>