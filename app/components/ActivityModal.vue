<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border-b border-amber-100 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white">
            <Footprints class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-base">Catat Aktivitas Bergerak</h3>
            <p class="text-xs text-slate-500">Membantu otot menyerap kelebihan glukosa</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-4">
        <!-- Activity Type Selector -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Jenis Aktivitas
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="act in activityTypes"
              :key="act.id"
              type="button"
              @click="selectedType = act.id"
              class="px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition flex items-center gap-2"
              :class="selectedType === act.id 
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              <span class="text-base">{{ act.icon }}</span>
              <span>{{ act.label }}</span>
            </button>
          </div>
        </div>

        <!-- Duration Input -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label class="block text-xs text-slate-500 font-medium mb-1 text-center">Durasi Aktivitas</label>
          <div class="flex items-center justify-center gap-2">
            <input 
              v-model.number="duration" 
              type="number" 
              min="5" 
              max="300"
              class="w-24 text-center text-3xl font-extrabold text-slate-800 bg-transparent border-b-2 border-amber-500 focus:outline-none"
            />
            <span class="text-sm font-bold text-slate-400 self-end mb-1">menit</span>
          </div>

          <!-- Quick Duration Presets -->
          <div class="flex items-center justify-center gap-2 mt-3">
            <button 
              v-for="d in [10, 15, 20, 30, 45]" 
              :key="d"
              type="button"
              @click="duration = d"
              class="px-2.5 py-1 text-xs rounded-lg font-medium border border-slate-200 bg-white text-slate-600 hover:border-amber-400 hover:text-amber-700 transition"
            >
              {{ d }}m
            </button>
          </div>
        </div>

        <!-- Estimated Steps & Calories -->
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <span class="text-[11px] text-amber-800 font-medium">Estimasi Langkah</span>
            <p class="text-base font-bold text-amber-900 mt-0.5">~{{ estimatedSteps }} langkah</p>
          </div>
          <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span class="text-[11px] text-emerald-800 font-medium">Kalori Terbakar</span>
            <p class="text-base font-bold text-emerald-900 mt-0.5">~{{ estimatedCalories }} kkal</p>
          </div>
        </div>

        <!-- Clinical Fact Card -->
        <div class="p-3.5 bg-teal-50 rounded-2xl border border-teal-200/80 flex items-start gap-2.5">
          <Sparkles class="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p class="text-xs text-teal-900 leading-relaxed font-medium">
            <strong>Fakta Medis:</strong> Kontraksi otot kaki saat jalan santai menarik gula langsung dari pembuluh darah melalui transporter GLUT4 tanpa membebani sekresi hormon insulin.
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
        >
          Batal
        </button>
        <button 
          @click="handleSave"
          :disabled="!duration || duration <= 0"
          class="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 active:scale-95 transition flex items-center gap-1.5"
        >
          <Check class="w-4 h-4" />
          <span>Simpan Aktivitas</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Footprints, X, Check, Sparkles } from 'lucide-vue-next'
import type { ActivityType } from '../types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [data: {
    type: ActivityType
    title: string
    durationMinutes: number
    intensity: 'ringan' | 'sedang' | 'berat'
    steps: number
    caloriesBurned: number
  }]
}>()

const duration = ref<number>(15)
const selectedType = ref<ActivityType>('walking')

const activityTypes: { id: ActivityType; label: string; icon: string; title: string; calPerMin: number; stepsPerMin: number }[] = [
  { id: 'walking', label: 'Jalan Santai', icon: '🚶‍♂️', title: 'Jalan santai meredam glukosa', calPerMin: 4, stepsPerMin: 100 },
  { id: 'running', label: 'Jalan Cepat / Jogging', icon: '🏃‍♂️', title: 'Jalan cepat / jogging', calPerMin: 8, stepsPerMin: 140 },
  { id: 'cycling', label: 'Bersepeda', icon: '🚴‍♂️', title: 'Bersepeda santai', calPerMin: 6, stepsPerMin: 0 },
  { id: 'gym', label: 'Senam / Latihan Beban', icon: '🏋️‍♂️', title: 'Latihan penguatan otot', calPerMin: 5, stepsPerMin: 40 }
]

const currentActivity = computed(() => {
  return activityTypes.find(a => a.id === selectedType.value) || activityTypes[0]
})

const estimatedSteps = computed(() => {
  return (duration.value || 0) * currentActivity.value.stepsPerMin
})

const estimatedCalories = computed(() => {
  return Math.round((duration.value || 0) * currentActivity.value.calPerMin)
})

const handleSave = () => {
  if (!duration.value || duration.value <= 0) return
  emit('save', {
    type: selectedType.value,
    title: currentActivity.value.title,
    durationMinutes: Number(duration.value),
    intensity: selectedType.value === 'running' ? 'sedang' : 'ringan',
    steps: estimatedSteps.value,
    caloriesBurned: estimatedCalories.value
  })
  emit('close')
}
</script>
