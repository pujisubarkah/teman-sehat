<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white">
          <Award class="w-4 h-4" />
        </div>
        <div>
          <h3 class="font-bold text-slate-800 text-base">Health Score Harian</h3>
          <p class="text-xs text-slate-500">Konsistensi kebiasaan sehat & stabilitas glukosa</p>
        </div>
      </div>
      <span 
        class="text-xs font-bold px-3 py-1 rounded-full border"
        :class="badgeColorClass"
      >
        {{ scoreData.label }}
      </span>
    </div>

    <!-- Big Score Circular Display -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-sky-50/80 via-blue-50/40 to-white p-5 rounded-2xl border border-sky-100/90 shadow-xs">
      <div class="flex items-center gap-4">
        <div class="relative w-24 h-24 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              class="text-slate-200"
              stroke-width="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="text-sky-600 transition-all duration-1000 ease-out"
              stroke-dasharray="100, 100"
              :stroke-dashoffset="100 - scoreData.totalScore"
              stroke-linecap="round"
              stroke-width="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-2xl font-black text-slate-800">{{ scoreData.totalScore }}</span>
            <span class="text-[9px] uppercase font-bold text-slate-400">Poin</span>
          </div>
        </div>

        <div>
          <h4 class="font-extrabold text-slate-800 text-base">
            {{ scoreHeadline }}
          </h4>
          <p class="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
            {{ scoreAdvice }}
          </p>
        </div>
      </div>
    </div>

    <!-- 4 Subscore Breakdown Bars -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <!-- 1. Time in Range -->
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
        <div class="flex justify-between font-semibold">
          <span class="text-slate-600 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Stabilitas Glukosa (TIR)
          </span>
          <span class="text-slate-800 font-bold">{{ scoreData.timeInRangeScore }} / 40</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            class="bg-emerald-500 h-full rounded-full transition-all duration-500" 
            :style="{ width: `${(scoreData.timeInRangeScore / 40) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 2. Habit Consistency -->
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
        <div class="flex justify-between font-semibold">
          <span class="text-slate-600 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span> Kebiasaan Hidrasi & Log
          </span>
          <span class="text-slate-800 font-bold">{{ scoreData.habitConsistencyScore }} / 30</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            class="bg-blue-500 h-full rounded-full transition-all duration-500" 
            :style="{ width: `${(scoreData.habitConsistencyScore / 30) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 3. Physical Activity -->
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
        <div class="flex justify-between font-semibold">
          <span class="text-slate-600 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> Aktivitas Fisik (30m)
          </span>
          <span class="text-slate-800 font-bold">{{ scoreData.activityScore }} / 15</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            class="bg-amber-500 h-full rounded-full transition-all duration-500" 
            :style="{ width: `${(scoreData.activityScore / 15) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 4. Nutrition Balance -->
      <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
        <div class="flex justify-between font-semibold">
          <span class="text-slate-600 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-teal-500"></span> Kontrol Porsi Karbohidrat
          </span>
          <span class="text-slate-800 font-bold">{{ scoreData.nutritionBalanceScore }} / 15</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            class="bg-teal-500 h-full rounded-full transition-all duration-500" 
            :style="{ width: `${(scoreData.nutritionBalanceScore / 15) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Award } from 'lucide-vue-next'
import type { HealthScoreBreakdown } from '../types'

const props = defineProps<{
  scoreData: HealthScoreBreakdown
}>()

const badgeColorClass = computed(() => {
  const s = props.scoreData.totalScore
  if (s >= 90) return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (s >= 75) return 'bg-teal-50 text-teal-800 border-teal-200'
  if (s >= 50) return 'bg-amber-50 text-amber-800 border-amber-200'
  return 'bg-rose-50 text-rose-800 border-rose-200'
})

const scoreHeadline = computed(() => {
  const s = props.scoreData.totalScore
  if (s >= 90) return 'Luar Biasa! Pola Hidup Sangat Terjaga 🌿'
  if (s >= 75) return 'Bagus! Konsistensi Berjalan Baik 👍'
  if (s >= 50) return 'Cukup Baik, Yuk Tingkatkan Lagi! 📈'
  return 'Ayo Mulai Kebiasaan Kecil Hari Ini! 🌱'
})

const scoreAdvice = computed(() => {
  const s = props.scoreData.totalScore
  if (s >= 90) return 'Gula darah dalam batas aman dan hidrasi tercapai optimal.'
  if (s >= 75) return 'Pertahankan jalan santai setelah makan untuk meredam lonjakan glukosa.'
  if (s >= 50) return 'Minum lebih banyak air putih dan catat gula darah 2 jam setelah makan siang.'
  return 'Mulai dengan minum 1 gelas air putih dan catat gula darah puasamu pagi ini.'
})
</script>
