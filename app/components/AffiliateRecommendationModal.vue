<template>
  <!-- Floating Non-Intrusive Bottom Toast / Widget -->
  <transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-8 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-8 opacity-0 scale-95"
  >
    <aside 
      v-if="isVisible" 
      aria-label="Rekomendasi Alat Medis"
      class="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-sky-100/80 p-4 overflow-hidden"
    >
      <!-- Top header bar with subtle badge and close button -->
      <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
            <HeartPulse class="w-3.5 h-3.5 text-sky-600" />
            Rekomendasi Alat Medis
          </span>
          <span class="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            Shopee Mall
          </span>
        </div>
        <button 
          @click="dismissToday" 
          class="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
          title="Tutup untuk hari ini"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
          <HeartPulse class="w-6 h-6" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate">
            Tensimeter Digital Omron Lengan Atas
          </h4>
          <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
            Standar klinis resmi Kemenkes RI. Akurat, nyaman & terpercaya untuk cek tensi rutin di rumah.
          </p>

          <div class="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
            <span class="font-extrabold text-slate-800">Rp 380rb-an</span>
            <span>•</span>
            <span class="text-amber-600 font-bold flex items-center gap-0.5">
              <Star class="w-3 h-3 fill-amber-400 text-amber-400" />
              4.9 (10rb+ terjual)
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
        <button 
          @click="dismissToday" 
          class="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition text-center"
        >
          Nanti Saja
        </button>
        <a 
          :href="affiliateLink" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-center"
        >
          <ShoppingBag class="w-3.5 h-3.5" />
          <span>Lihat di Shopee</span>
          <ExternalLink class="w-3 h-3 opacity-80" />
        </a>
      </div>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { HeartPulse, ShoppingBag, ExternalLink, X, Star } from 'lucide-vue-next'

const affiliateLink = 'https://s.shopee.co.id/5fqEWK03sx'
const isVisible = ref(false)

const STORAGE_KEY = 'temansehat_dismiss_shopee_date'

onMounted(() => {
  // Check if dismissed today
  try {
    const lastDismissed = localStorage.getItem(STORAGE_KEY)
    const today = new Date().toISOString().split('T')[0]
    
    if (lastDismissed !== today) {
      // Delay popup 4 seconds so it doesn't jump aggressively on load
      setTimeout(() => {
        isVisible.value = true
      }, 4000)
    }
  } catch {
    isVisible.value = false
  }
})

function dismissToday() {
  isVisible.value = false
  try {
    const today = new Date().toISOString().split('T')[0]
    localStorage.setItem(STORAGE_KEY, today)
  } catch {
    // Ignore storage errors
  }
}

// Function to manually trigger popup (e.g. after logging blood pressure)
function openPopup() {
  isVisible.value = true
}

defineExpose({
  openPopup,
  dismissToday
})
</script>
