<template>
  <div class="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"></div>
      <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]"></div>
    </div>

    <div class="w-full max-w-md z-10 px-4">
      <div class="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-primary/5">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">Create Account</h1>
          <p class="text-muted-foreground">Join CoLink to connect your devices</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              class="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
              placeholder="you@example.com"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              required
              class="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
              placeholder="••••••••"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Confirm Password</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              required
              class="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
              placeholder="••••••••"
            >
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            Register
          </button>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>
          <router-link to="/login" class="text-primary hover:underline font-medium transition-colors">Sign in</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert("Passwords don't match")
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
