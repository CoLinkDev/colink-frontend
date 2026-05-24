<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center bg-background p-4 sm:p-0">
    <div class="w-full max-w-sm mt-10 sm:mt-0">
      <div class="flex flex-col space-y-2 text-center mb-8">
        <h1 class="text-2xl font-semibold tracking-tight">{{ $t('register.title') }}</h1>
        <p class="text-sm text-muted-foreground">{{ $t('register.subtitle') }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium leading-none">{{ $t('login.email') }}</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium leading-none">{{ $t('login.password') }}</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium leading-none">{{ $t('register.confirmPassword') }}</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            required
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ $t('register.register') }}
        </button>
      </form>

      <div class="mt-8 text-center text-sm">
        <span class="text-muted-foreground">{{ $t('register.hasAccount') }} </span>
        <router-link to="/login" class="text-foreground font-medium hover:underline underline-offset-4">{{ $t('register.signIn') }}</router-link>
      </div>
    </div>

    <!-- Alert Dialog Modal -->
    <Dialog 
      v-model:open="alertDialog.open"
      :title="alertDialog.title"
      :description="alertDialog.description"
      confirmText="OK"
      hideCancel
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import request from '@/utils/request'
import Dialog from '@/components/Dialog.vue'

const router = useRouter()
const { t } = useI18n()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)

const alertDialog = reactive({
  open: false,
  title: '',
  description: ''
})

const showAlert = (title: string, description: string) => {
  alertDialog.title = title
  alertDialog.description = description
  alertDialog.open = true
}

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    showAlert(t('settings.passwordMismatch'), '')
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
      showAlert('Registration Failed', res.message || 'Please try again.')
    }
  } catch (error: any) {
    showAlert('Registration Failed', error.response?.data?.message || 'Connection error.')
  } finally {
    loading.value = false
  }
}
</script>
