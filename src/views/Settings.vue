<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold tracking-tight">Account Settings</h3>
      <p class="text-muted-foreground text-sm mt-1">Update your password and manage your account.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Change Password -->
      <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Key class="w-5 h-5" />
          </div>
          <h4 class="text-lg font-medium">Change Password</h4>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Current Password</label>
            <input 
              v-model="pwdForm.oldPassword" 
              type="password" 
              required
              class="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">New Password</label>
            <input 
              v-model="pwdForm.newPassword" 
              type="password" 
              required
              class="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Confirm New Password</label>
            <input 
              v-model="pwdForm.confirmPassword" 
              type="password" 
              required
              class="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
            >
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2 w-full transition-all disabled:opacity-50"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            Update Password
          </button>
        </form>
      </div>

      <!-- Danger Zone -->
      <div class="bg-card border border-destructive/20 rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
            <ShieldAlert class="w-5 h-5" />
          </div>
          <h4 class="text-lg font-medium text-destructive">Danger Zone</h4>
        </div>
        
        <p class="text-sm text-muted-foreground mb-6">
          These actions are destructive and cannot be undone. Proceed with caution.
        </p>

        <div class="space-y-4">
          <button 
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
          >
            <LogOut class="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Key, ShieldAlert, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import request from '@/utils/request'

const router = useRouter()
const auth = useAuthStore()

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)

const handleChangePassword = async () => {
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    alert('New passwords do not match')
    return
  }
  loading.value = true
  try {
    const res: any = await request.post('/auth/change-password', {
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword
    })
    if (res.code === 0) {
      alert('Password updated successfully. Please login again.')
      auth.clearToken()
      router.push('/login')
    } else {
      alert(res.message || 'Failed to update password')
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to update password')
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  if (!confirm('Are you sure you want to sign out?')) return
  try {
    await request.post('/auth/logout')
  } catch (e) {
    // Ignore error
  }
  auth.clearToken()
  router.push('/login')
}
</script>
