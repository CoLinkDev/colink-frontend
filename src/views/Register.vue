<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight mb-2">{{ $t('register.title') }}</h1>
        <p class="text-muted-foreground text-sm">{{ $t('register.subtitle') }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('login.email') }}</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('login.password') }}</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ $t('register.confirmPassword') }}</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
          >
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 mt-2 transition-colors disabled:opacity-50"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ $t('register.register') }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm">
        <span class="text-muted-foreground">{{ $t('register.hasAccount') }} </span>
        <router-link to="/login" class="text-primary font-medium hover:underline">{{ $t('register.signIn') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import request from '@/utils/request'

const router = useRouter()
const { t } = useI18n()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert(t('settings.passwordMismatch'))
    return
  }
  loading.value = true
  try {
    const res: any = await request.post('/auth/register', {
      email: form.email,
      password: form.password
    })
    if (res.code === 0) {
      router.push('/login')
    } else {
      alert(res.message || 'Registration failed')
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>
