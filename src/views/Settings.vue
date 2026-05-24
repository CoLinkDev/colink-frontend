<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <h3 class="text-xl font-semibold tracking-tight">{{ $t('settings.title') }}</h3>
      <p class="text-muted-foreground text-sm">{{ $t('settings.subtitle') }}</p>
    </div>

    <div class="max-w-xl">
      <div class="bg-card border border-border rounded-lg p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-foreground shrink-0">
            <Key class="w-4 h-4" />
          </div>
          <h4 class="text-base font-medium">{{ $t('settings.changePassword') }}</h4>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium leading-none">{{ $t('settings.currentPassword') }}</label>
            <input 
              v-model="pwdForm.oldPassword" 
              type="password" 
              required
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium leading-none">{{ $t('settings.newPassword') }}</label>
            <input 
              v-model="pwdForm.newPassword" 
              type="password" 
              required
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium leading-none">{{ $t('settings.confirmNewPassword') }}</label>
            <input 
              v-model="pwdForm.confirmPassword" 
              type="password" 
              required
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-2 w-full"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ $t('settings.updatePassword') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Key } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import request from '@/utils/request'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)

const handleChangePassword = async () => {
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    alert(t('settings.passwordMismatch'))
    return
  }
  loading.value = true
  try {
    const res: any = await request.post('/auth/change-password', {
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword
    })
    if (res.code === 0) {
      alert(t('settings.passwordUpdated'))
      auth.clearToken()
      router.push('/login')
    } else {
      alert(res.message || t('settings.passwordUpdateFailed'))
    }
  } catch (error: any) {
    alert(error.response?.data?.message || t('settings.passwordUpdateFailed'))
  } finally {
    loading.value = false
  }
}
</script>
