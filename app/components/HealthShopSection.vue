<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Banner -->
    <div class="bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-lg shadow-sky-900/10 relative overflow-hidden">
      <div class="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-sky-100 mb-3 border border-white/20">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-300" />
          <span>Rekomendasi Alat Medis Terverifikasi Kemenkes</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">
          Perlengkapan Pantau Mandiri di Rumah
        </h2>
        <p class="text-xs sm:text-sm text-sky-100/90 mt-1.5 leading-relaxed">
          Hasil pencatatan di <strong>TemanSehat</strong> akan jauh lebih akurat jika menggunakan alat ukur berstandar medis resmi. Berikut rekomendasi pilihan toko resmi (Shopee Mall / Star Seller).
        </p>
      </div>
    </div>

    <!-- Category Filters -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="selectedCategory = cat"
        class="px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all shadow-2xs"
        :class="selectedCategory === cat 
          ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30' 
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Product Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="bg-white rounded-3xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden relative group"
        :class="product.highlight ? 'border-sky-300 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'"
      >
        <!-- Highlight Banner Ribbon -->
        <div 
          v-if="product.badge" 
          class="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-between"
          :class="product.highlight ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'"
        >
          <span class="flex items-center gap-1">
            <Sparkles class="w-3 h-3 text-amber-300" />
            {{ product.badge }}
          </span>
          <span class="text-[10px] lowercase font-normal opacity-90">{{ product.category }}</span>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <!-- Top info -->
          <div>
            <div class="flex items-start justify-between gap-2">
              <div>
                <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-sky-600 transition">
                  {{ product.name }}
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ product.subtitle }}
                </p>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                <HeartPulse v-if="product.imageFallbackIcon === 'HeartPulse'" class="w-5 h-5" />
                <Activity v-else-if="product.imageFallbackIcon === 'Activity'" class="w-5 h-5" />
                <Flame v-else-if="product.imageFallbackIcon === 'Flame'" class="w-5 h-5" />
                <Leaf v-else class="w-5 h-5" />
              </div>
            </div>

            <!-- Price & Social Proof -->
            <div class="flex items-center gap-3 mt-3 flex-wrap">
              <span class="text-sm font-extrabold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                Estimasi: {{ product.priceEstimation }}
              </span>
              <div class="flex items-center gap-1 text-xs text-amber-600 font-bold">
                <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{{ product.rating }}</span>
              </div>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs text-slate-500">{{ product.soldCount }}</span>
            </div>

            <!-- Features list -->
            <ul class="mt-4 space-y-1.5 text-xs text-slate-600">
              <li 
                v-for="(feature, idx) in product.features" 
                :key="idx"
                class="flex items-start gap-2"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Bottom Button -->
          <div class="pt-3 border-t border-slate-100">
            <a 
              :href="product.affiliateUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full py-2.5 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
              :class="product.highlight 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'"
            >
              <ShoppingBag class="w-4 h-4" />
              <span>Beli di Shopee Resmi</span>
              <ExternalLink class="w-3.5 h-3.5 opacity-80" />
            </a>
            <p class="text-[10px] text-center text-slate-400 mt-2">
              🔒 Toko Resmi / Shopee Mall • Berizin Kemenkes
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Educational Bottom Card -->
    <div class="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-5 flex items-start gap-3.5 text-amber-900">
      <Info class="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
      <div class="text-xs space-y-1">
        <h4 class="font-bold">Tips Memilih Alat Medis di Rumah:</h4>
        <p class="text-amber-800 leading-relaxed">
          Selalu pastikan tensimeter digital menggunakan tipe <strong>lengan atas</strong> (bukan pergelangan tangan) untuk akurasi optimal. Jangan lupa simpan strip glukosa/asam urat di tempat kering bersuhu ruang dan tertutup rapat agar kalibrasi sensor kimia tetap presisi.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  ShieldCheck, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  ShoppingBag, 
  ExternalLink, 
  Info,
  HeartPulse,
  Activity,
  Flame,
  Leaf
} from 'lucide-vue-next'
import { recommendedHealthProducts } from '../data/affiliateProducts'

const categories = [
  'Semua',
  'Tensi',
  'Gula Darah',
  'Asam Urat & Kolesterol',
  'Nutrisi'
]

const selectedCategory = ref('Semua')

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'Semua') {
    return recommendedHealthProducts
  }
  return recommendedHealthProducts.filter(p => p.category === selectedCategory.value)
})
</script>
