<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 text-white p-6 shadow-xl shadow-blue-950/15">
    <!-- Ambient subtle light reflections -->
    <div class="absolute -top-16 -right-16 w-56 h-56 bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>

    <div class="relative z-10">
      <!-- Greeting Header -->
      <div class="flex items-start justify-between">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-sky-100 border border-white/20">
            <span class="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></span>
            {{ greetingTimeLabel }}
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2.5 text-white">
            Selamat {{ greetingPeriod }}!
          </h2>
          <p class="text-sky-100/90 text-sm mt-1 max-w-md font-medium leading-relaxed">
            Hari ini kita mulai dengan kebiasaan kecil untuk metabolisme & tubuh yang lebih bugar.
          </p>
        </div>

        <!-- Health Score Pill -->
        <div class="hidden sm:flex flex-col items-end text-right bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shadow-inner">
          <span class="text-[10px] text-sky-200 uppercase tracking-widest font-bold">Health Score</span>
          <div class="flex items-baseline gap-1 mt-0.5">
            <span class="text-2xl font-black text-white">{{ healthScore.totalScore }}</span>
            <span class="text-xs text-sky-200">/ 100</span>
          </div>
          <span class="text-[11px] text-cyan-200 font-semibold">{{ healthScore.label }}</span>
        </div>
      </div>

      <!-- Micro Habits Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <!-- Habit 1: Minum Air Putih -->
        <div class="bg-white/10 hover:bg-white/15 transition-all rounded-2xl p-3.5 border border-white/15 flex items-center justify-between backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center text-cyan-200">
              <Droplets class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-white">Sudah minum air putih?</h4>
              <p class="text-xs text-sky-100/80">
                {{ todayHabit.waterGlasses }} dari {{ todayHabit.waterTarget }} gelas hari ini
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button 
              @click="$emit('decrementWater')"
              class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold active:scale-95 transition"
              title="Kurang 1 gelas"
            >
              -
            </button>
            <button 
              @click="$emit('incrementWater')"
              class="px-3 py-1 rounded-lg bg-cyan-300 text-sky-950 hover:bg-cyan-200 text-xs font-bold flex items-center gap-1 active:scale-95 shadow-sm transition"
            >
              <span>+1</span>
              <Droplet class="w-3.5 h-3.5 fill-sky-950" />
            </button>
          </div>
        </div>

        <!-- Habit 2: Sudah Bergerak Hari Ini? -->
        <div 
          @click="$emit('openActivityModal')"
          class="bg-white/10 hover:bg-white/15 cursor-pointer transition-all rounded-2xl p-3.5 border border-white/15 flex items-center justify-between group backdrop-blur-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-200">
              <Footprints class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-white group-hover:text-amber-200 transition">Sudah bergerak hari ini?</h4>
              <p class="text-xs text-sky-100/80">
                <span v-if="todaySummary.totalActivityMinutes > 0">
                  {{ todaySummary.totalActivityMinutes }} mnt aktif ({{ todaySummary.totalSteps }} langkah)
                </span>
                <span v-else>Jalan 10-15 mnt meredam lonjakan gula</span>
              </p>
            </div>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/20 text-white group-hover:bg-white group-hover:text-blue-900 transition flex items-center gap-1">
            <span v-if="todaySummary.totalActivityMinutes > 0">✓ Selesai</span>
            <span v-else>+ Catat</span>
          </span>
        </div>

        <!-- Habit 3: Apa Menu Sarapanmu? -->
        <div 
          @click="$emit('openFoodModal', 'breakfast')"
          class="bg-white/10 hover:bg-white/15 cursor-pointer transition-all rounded-2xl p-3.5 border border-white/15 flex items-center justify-between group backdrop-blur-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-emerald-200">
              <Utensils class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-white group-hover:text-emerald-200 transition">Apa menu sarapanmu?</h4>
              <p class="text-xs text-sky-100/80">
                <span v-if="todaySummary.hasBreakfast">
                  Tercatat • {{ todaySummary.totalCarbs }}g karbo
                </span>
                <span v-else>Cek estimasi karbohidrat & kalori</span>
              </p>
            </div>
          </div>
          <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/20 text-white group-hover:bg-white group-hover:text-blue-900 transition">
            <span v-if="todaySummary.hasBreakfast">✓ Lihat</span>
            <span v-else>+ Catat</span>
          </span>
        </div>

        <!-- Habit 4: Mau Mencatat Gula Darah? -->
        <div 
          @click="$emit('openGlucoseModal')"
          class="bg-white/10 hover:bg-white/15 cursor-pointer transition-all rounded-2xl p-3.5 border border-white/15 flex items-center justify-between group backdrop-blur-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-400/20 border border-rose-300/30 flex items-center justify-center text-rose-200">
              <HeartPulse class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-white group-hover:text-rose-200 transition">Mau mencatat gula darah?</h4>
              <p class="text-xs text-sky-100/80">
                <span v-if="todaySummary.avgGlucose">
                  Hari ini: {{ todaySummary.avgGlucose }} mg/dL ({{ todaySummary.readingCount }}x cek)
                </span>
                <span v-else>Puasa / 2 jam setelah makan</span>
              </p>
            </div>
          </div>
          <span class="text-xs font-bold px-3 py-1 rounded-lg bg-cyan-300 text-sky-950 hover:bg-cyan-200 transition shadow-sm">
            + Input
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  Droplet, 
  Droplets, 
  Footprints, 
  Utensils, 
  HeartPulse 
} from 'lucide-vue-next'
import type { DailyHabit, HealthScoreBreakdown } from '../types'

const props = defineProps<{
  todayHabit: DailyHabit
  todaySummary: {
    avgGlucose: number | null
    readingCount: number
    totalCarbs: number
    totalCalories: number
    totalActivityMinutes: number
    totalSteps: number
    hasFasting: boolean
    hasBreakfast: boolean
    hasPostMeal: boolean
    waterGlasses: number
    waterTarget: number
  }
  healthScore: HealthScoreBreakdown
}>()

defineEmits<{
  incrementWater: []
  decrementWater: []
  openActivityModal: []
  openFoodModal: [mealType: string]
  openGlucoseModal: []
}>()

const hour = new Date().getHours()

const greetingPeriod = computed(() => {
  if (hour >= 4 && hour < 11) return 'Pagi'
  if (hour >= 11 && hour < 15) return 'Siang'
  if (hour >= 15 && hour < 18) return 'Sore'
  return 'Malam'
})

const greetingTimeLabel = computed(() => {
  if (hour >= 4 && hour < 11) return 'Ritual Pagi Sehat'
  if (hour >= 11 && hour < 15) return 'Fokus Siang Hari'
  if (hour >= 15 && hour < 18) return 'Istirahat Sore'
  return 'Refleksi Malam'
})
</script>
