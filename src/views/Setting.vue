<template>
  <div class="settings-container">
    <header class="page-header">
      <div class="header-left">
        <span class="category-tag">Administration</span>
        <h1>System Configuration</h1>
        <p>Global parameters and application state management.</p>
      </div>
    </header>

    <div class="glass-card config-surface">
      <div class="card-glow"></div>
      
      <el-form label-position="top" class="premium-form">
        <div class="form-section">
          <div class="section-info">
            <h4>Branding</h4>
            <p>Customize how your platform appears to end-users.</p>
          </div>
          <div class="section-inputs">
            <el-form-item label="Platform Name">
              <el-input v-model="sysSettings.appName" placeholder="e.g. Cinema VIP">
                <template #prefix><el-icon><Monitor /></el-icon></template>
              </el-input>
            </el-form-item>
          </div>
        </div>

        <el-divider class="premium-divider" />

        <div class="form-section">
          <div class="section-info">
            <h4>Access & Security</h4>
            <p>Toggle system-wide availability and registration protocols.</p>
          </div>
          <div class="section-inputs">
            <div class="setting-row">
              <div class="row-label">
                <span class="title">Maintenance Mode</span>
                <span class="description">Disable public access and show a "Under Maintenance" screen.</span>
              </div>
              <el-switch 
                v-model="sysSettings.maintenance" 
                class="premium-switch"
                style="--el-switch-on-color: #ef4444"
              />
            </div>

            <div class="setting-row">
              <div class="row-label">
                <span class="title">Public Registration</span>
                <span class="description">Toggle whether new guests can create accounts.</span>
              </div>
              <el-switch 
                v-model="sysSettings.allowReg" 
                class="premium-switch"
                style="--el-switch-on-color: #10b981"
              />
            </div>
          </div>
        </div>

        <div class="sticky-footer">
          <el-button class="save-btn" @click="saveSettings">
            Deploy Changes
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Monitor, Lock, Connection } from '@element-plus/icons-vue'

const sysSettings = reactive({
  appName: 'VIP Premium System',
  maintenance: false,
  allowReg: true
})

const saveSettings = () => {
  ElMessage({
    message: 'System configuration deployed successfully',
    type: 'success',
    customClass: 'premium-message'
  })
}
</script>

<style lang="scss" scoped>
$text-main: #0f172a;
$text-muted: #64748b;
$ease: cubic-bezier(0.25, 1, 0.5, 1);

.settings-container {
  padding: 0;

  .page-header {
    margin-bottom: 40px;
    .category-tag { font-size: 11px; font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; }
    h1 { font-family: 'Plus Jakarta Sans'; font-size: 32px; font-weight: 800; color: $text-main; letter-spacing: -1px; margin: 8px 0 0; }
    p { color: $text-muted; font-size: 16px; margin-top: 4px; }
  }

  .config-surface {
    background: white;
    border-radius: 24px;
    border: 1px solid #f1f5f9;
    padding: 40px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }

  .form-section {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 40px;
    margin-bottom: 40px;

    .section-info {
      h4 { font-size: 18px; font-weight: 800; color: $text-main; margin: 0 0 8px; }
      p { font-size: 14px; color: $text-muted; line-height: 1.5; }
    }
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #f8fafc;
    &:last-child { border: none; }

    .row-label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      .title { font-size: 14px; font-weight: 700; color: $text-main; }
      .description { font-size: 13px; color: $text-muted; }
    }
  }

  /* Premium Form Styling */
  :deep(.el-input__wrapper) {
    background: #f8fafc;
    box-shadow: none;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    padding: 10px 16px;
    transition: all 0.3s $ease;
    &.is-focus { border-color: $text-main; background: white; }
  }

  :deep(.el-form-item__label) {
    font-weight: 700;
    color: $text-main;
    margin-bottom: 12px;
  }

  .save-btn {
    background: $text-main;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 24px 40px;
    font-weight: 700;
    transition: all 0.3s $ease;
    &:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
  }
}

.premium-divider { margin: 20px 0 40px; border-color: #f1f5f9; }
</style>