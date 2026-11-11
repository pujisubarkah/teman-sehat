<template>
  <div 
    v-if="showBanner && !isStandalone" 
    class="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-3 sm:p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/20 animate-fade-in"
  >
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white shadow-xs">
        <Smartphone class="w-5 h-5" />
      </div>
      <div>
        <h4 class="text-xs sm:text-sm font-bold flex items-center gap-1.5">
          <span>Pasang TemanSehat di HP</span>
          <span class="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-300 text-sky-950 uppercase">PWA</span>
        </h4>
        <p class="text-[11px] text-sky-100 mt-0.5 leading-tight">
          Akses cepat langsung dari layar utama HP layaknya aplikasi asli tanpa perlu Play Store!
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
      <button 
        @click="dismissBanner"
        class="text-xs text-sky-200 hover:text-white px-2 py-1 font-medium transition"
      >
        Nanti
      </button>

      <!-- Android / Chrome Native Prompt Button -->
      <button 
        v-if="deferredPrompt"
        @click="triggerInstall"
        class="px-3.5 py-1.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1"
      >
        <Download class="w-3.5 h-3.5" />
        <span>Pasang Sekarang</span>
      </button>

      <!-- iOS Safari Guidance Button -->
      <button 
        v-else-if="isIos"
        @click="showIosGuide = !showIosGuide"
        class="px-3.5 py-1.5 rounded-xl bg-white text-sky-900 hover:bg-sky-50 text-xs font-bold shadow-sm transition flex items-center gap-1"
      >
        <Share class="w-3.5 h-3.5" />
        <span>Cara Pasang di iPhone</span>
      </button>
    </div>

    <!-- iOS Guide Dropdown -->
    <div 
      v-if="showIosGuide" 
      class="w-full mt-2 pt-2 border-t border-white/20 text-[11px] text-sky-100 flex items-center gap-2"
    >
      <span>📲</span>
      <span>Di Safari iPhone: Tekan tombol <strong>Bagikan (Share)</strong> di menu bawah, lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Smartphone, Download, Share } from 'lucide-vue-next'

const showBanner = ref(true)
const isStandalone = ref(false)
const isIos = ref(false)
const showIosGuide = ref(false)
const deferredPrompt = ref<any>(null)

onMounted(() => {
  // Check if already running in standalone mode (installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
    isStandalone.value = true
    return
  }

  // Detect iOS
  const userAgent = window.navigator.userAgent.toLowerCase()
  isIos.value = /iphone|ipad|ipod/.test(userAgent)

  // Capture PWA install prompt (Chrome/Edge/Android)
  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault()
    deferredPrompt.value = e
    showBanner.value = true
  })
})

const triggerInstall = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      showBanner.value = false
    }
    deferredPrompt.value = null
  }
}

const dismissBanner = () => {
  showBanner.value = false
}
</script>
