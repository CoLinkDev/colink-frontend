<template>
  <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]"></div>
    </div>

    <div class="w-full max-w-md z-10 px-4">
      <div class="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-primary/5">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">Welcome Back</h1>
          <p class="text-muted-foreground">Sign in to your CoLink account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              class="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="you@example.com"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              required
              class="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            >
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            Sign In
          </button>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <router-link to="/register" class="text-primary hover:underline font-medium transition-colors">Create one</router-link>
        </div>
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
