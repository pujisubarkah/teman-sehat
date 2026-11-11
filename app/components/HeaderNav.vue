<template>
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
          <HeartPulse class="w-5 h-5" />
        </div>
        <div>
          <h1 class="font-extrabold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
            TemanSehat <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 tracking-wide uppercase">4 Pilar</span>
          </h1>
          <p class="text-[11px] text-slate-500 font-medium">Kenali Tubuhmu • Pahami Kebiasaanmu • Nikmati Sehatmu</p>
        </div>
      </div>

      <!-- Quick Date & Today Status -->
      <div class="flex items-center gap-2">
        <div class="text-right hidden sm:block">
          <p class="text-xs font-bold text-slate-800">{{ currentDateFormatted }}</p>
          <p class="text-[11px] text-sky-600 font-semibold flex items-center justify-end gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Tensi • Gula • Asam Urat • Kolesterol
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="max-w-4xl mx-auto px-4 flex border-t border-slate-100 overflow-x-auto no-scrollbar">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="$emit('update:activeTab', tab.id)"
        class="flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2"
        :class="activeTab === tab.id 
          ? 'border-sky-600 text-sky-700 bg-sky-50/60' 
          : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
        <span 
          v-if="tab.badge" 
          class="text-[10px] px-1.5 py-0.2 rounded-full"
          :class="activeTab === tab.id ? 'bg-sky-200 text-sky-800' : 'bg-slate-200 text-slate-700'"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  HeartPulse, 
  Home, 
  LineChart, 
  UtensilsCrossed, 
  Sparkles,
  Activity
} from 'lucide-vue-next'

const props = defineProps<{
  activeTab: string
}>()

defineEmits<{
  'update:activeTab': [tab: string]
}>()

const currentDateFormatted = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date())
})

const tabs = [
  { id: 'today', label: 'Hari Ini', icon: Home },
  { id: 'analytics', label: 'Grafik & Tren', icon: LineChart },
  { id: 'food', label: 'Jurnal Makanan', icon: UtensilsCrossed },
  { id: 'activity', label: 'Aktivitas', icon: Activity },
  { id: 'assistant', label: 'AI Nutrisi', icon: Sparkles }
]
</script>
