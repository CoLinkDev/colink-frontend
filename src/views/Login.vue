<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center bg-background p-4 sm:p-0">
    <div class="w-full max-w-sm mt-10 sm:mt-0">
      <div class="flex flex-col space-y-2 text-center mb-8">
        <div class="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center mb-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
        </div>
        <h1 class="text-2xl font-semibold tracking-tight">{{ $t('login.welcome') }}</h1>
        <p class="text-sm text-muted-foreground">{{ $t('login.subtitle') }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
        
        <button 
          type="submit" 
          :disabled="loading"
          class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ $t('login.signIn') }}
        </button>
      </form>

      <div class="mt-8 text-center text-sm">
        <span class="text-muted-foreground">{{ $t('login.noAccount') }} </span>
        <router-link to="/register" class="text-foreground font-medium hover:underline underline-offset-4">{{ $t('login.createOne') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import request from '@/utils/request'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const res: any = await request.post('/auth/login', form)
    if (res.code === 0 && res.data?.token) {
      auth.setToken(res.data.token)
      router.push('/')
    } else {
      alert(res.message || 'Login failed')
    }
  } catch (error: any) {
    alert(error.response?.data?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>
