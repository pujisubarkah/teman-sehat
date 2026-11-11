<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-b border-sky-100 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white">
            <HeartPulse class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-base">Catat Hasil Pemeriksaan</h3>
            <p class="text-xs text-slate-500">Pilih salah satu dari 4 pilar sehat</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 4-in-1 Switcher Tabs -->
      <div class="p-1.5 bg-slate-100 mx-6 mt-4 rounded-2xl grid grid-cols-4 gap-1 text-[11px] font-bold">
        <button
          v-for="tab in testTabs"
          :key="tab.id"
          type="button"
          @click="activeMetric = tab.id"
          class="py-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1"
          :class="activeMetric === tab.id
            ? 'bg-white text-slate-800 shadow-xs'
            : 'text-slate-500 hover:text-slate-800'"
        >
          <span>{{ tab.icon }}</span>
          <span class="truncate">{{ tab.label }}</span>
        </button>
      </div>

      <!-- ================= FORM 1: TENSI DARAH ================= -->
      <div v-if="activeMetric === 'blood_pressure'" class="p-6 space-y-4">
        <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200/80">
          <label class="block text-xs text-indigo-950 font-bold mb-2 text-center">Tekanan Darah (Sistolik / Diastolik)</label>
          
          <div class="flex items-center justify-center gap-3">
            <!-- Sistolik -->
            <div class="text-center">
              <span class="text-[10px] text-slate-500 font-semibold block mb-0.5">Sistolik (Atas)</span>
              <input 
                v-model.number="systolicValue" 
                type="number" 
                placeholder="120"
                min="60"
                max="260"
                class="w-20 text-center text-3xl font-extrabold text-slate-800 bg-white rounded-xl border border-indigo-200 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            
            <span class="text-2xl font-black text-slate-400 self-end mb-2">/</span>

            <!-- Diastolik -->
            <div class="text-center">
              <span class="text-[10px] text-slate-500 font-semibold block mb-0.5">Diastolik (Bawah)</span>
              <input 
                v-model.number="diastolicValue" 
                type="number" 
                placeholder="80"
                min="40"
                max="160"
                class="w-20 text-center text-3xl font-extrabold text-slate-800 bg-white rounded-xl border border-indigo-200 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <!-- Pulse (Detak Jantung) -->
            <div class="text-center">
              <span class="text-[10px] text-slate-500 font-semibold block mb-0.5">Nadi (BPM)</span>
              <input 
                v-model.number="pulseValue" 
                type="number" 
                placeholder="75"
                min="40"
                max="200"
                class="w-16 text-center text-xl font-bold text-slate-700 bg-white rounded-xl border border-slate-200 py-2 focus:outline-none"
              />
            </div>
          </div>

          <!-- Dynamic Status Badge -->
          <div class="mt-3 flex justify-center">
            <span 
              v-if="currentBpStatus" 
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              :class="currentBpStatus.color"
            >
              <span>●</span> {{ currentBpStatus.label }} ({{ currentBpStatus.desc }})
            </span>
          </div>
        </div>

        <!-- Quick adjust presets -->
        <div class="flex items-center justify-center gap-1.5 text-xs">
          <button 
            v-for="preset in [{s: 115, d: 75}, {s: 120, d: 80}, {s: 130, d: 85}, {s: 140, d: 90}]" 
            :key="preset.s"
            type="button"
            @click="systolicValue = preset.s; diastolicValue = preset.d"
            class="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-800 transition"
          >
            {{ preset.s }}/{{ preset.d }}
          </button>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Catatan Tambahan
          </label>
          <input 
            v-model="notes" 
            type="text" 
            placeholder="Misal: Duduk istirahat 5 menit sebelum tes di lengan kiri"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
          />
        </div>
      </div>

      <!-- ================= FORM 2: GULA DARAH ================= -->
      <div v-else-if="activeMetric === 'glucose'" class="p-6 space-y-4">
        <!-- Measurement Type Selector -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Waktu Pengukuran
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in measurementTypes"
              :key="item.id"
              type="button"
              @click="selectedType = item.id"
              class="px-3 py-2 rounded-xl text-xs font-semibold border text-left transition flex items-center gap-2"
              :class="selectedType === item.id 
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              <span>{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- Big Glucose Input -->
        <div class="text-center bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <label class="block text-xs text-slate-500 font-medium mb-1">Nilai Gula Darah</label>
          <div class="flex items-center justify-center gap-2">
            <input 
              v-model.number="glucoseValue" 
              type="number" 
              placeholder="0"
              min="20"
              max="600"
              class="w-32 text-center text-4xl font-extrabold text-slate-800 bg-transparent border-b-2 border-sky-500 focus:outline-none focus:border-sky-600 transition"
            />
            <span class="text-base font-bold text-slate-400 self-end mb-1">mg/dL</span>
          </div>

          <div class="mt-3 flex justify-center">
            <span 
              v-if="currentGlucoseStatus" 
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              :class="currentGlucoseStatus.color"
            >
              <span>●</span> {{ currentGlucoseStatus.label }} ({{ currentGlucoseStatus.rangeText }})
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2">
          <button 
            v-for="v in [85, 95, 110, 130, 150]" 
            :key="v"
            type="button"
            @click="glucoseValue = v"
            class="px-2.5 py-1 text-xs rounded-lg font-medium border border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-700 transition"
          >
            {{ v }}
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Catatan (Opsional)
          </label>
          <input 
            v-model="notes" 
            type="text" 
            placeholder="Misal: Bangun tidur segar, atau setelah makan nasi merah"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
          />
        </div>
      </div>

      <!-- ================= FORM 3: ASAM URAT ================= -->
      <div v-else-if="activeMetric === 'uric_acid'" class="p-6 space-y-4">
        <div class="text-center bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80">
          <label class="block text-xs text-amber-900 font-semibold mb-1">Kadar Asam Urat (Uric Acid)</label>
          <div class="flex items-center justify-center gap-2">
            <input 
              v-model.number="uricAcidValue" 
              type="number" 
              step="0.1"
              placeholder="0.0"
              class="w-32 text-center text-4xl font-extrabold text-slate-800 bg-transparent border-b-2 border-amber-500 focus:outline-none transition"
            />
            <span class="text-base font-bold text-slate-400 self-end mb-1">mg/dL</span>
          </div>

          <div class="mt-3 flex justify-center">
            <span 
              v-if="currentUricAcidStatus" 
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              :class="currentUricAcidStatus.color"
            >
              <span>●</span> {{ currentUricAcidStatus.label }} ({{ currentUricAcidStatus.rangeText }})
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2">
          <button 
            v-for="v in [4.5, 5.8, 6.5, 7.5, 8.5]" 
            :key="v"
            type="button"
            @click="uricAcidValue = v"
            class="px-2.5 py-1 text-xs rounded-lg font-medium border border-slate-200 bg-white text-slate-600 hover:border-amber-400 hover:text-amber-800 transition"
          >
            {{ v }}
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Catatan (Opsional)
          </label>
          <input 
            v-model="notes" 
            type="text" 
            placeholder="Misal: Cek apotek rutin, persendian terasa nyaman"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
          />
        </div>
      </div>

      <!-- ================= FORM 4: KOLESTEROL ================= -->
      <div v-else-if="activeMetric === 'cholesterol'" class="p-6 space-y-4">
        <div class="text-center bg-rose-50/40 rounded-2xl p-4 border border-rose-200/80">
          <label class="block text-xs text-rose-900 font-semibold mb-1">Nilai Kolesterol Total</label>
          <div class="flex items-center justify-center gap-2">
            <input 
              v-model.number="cholesterolValue" 
              type="number" 
              placeholder="0"
              class="w-32 text-center text-4xl font-extrabold text-slate-800 bg-transparent border-b-2 border-rose-500 focus:outline-none transition"
            />
            <span class="text-base font-bold text-slate-400 self-end mb-1">mg/dL</span>
          </div>

          <div class="mt-3 flex justify-center">
            <span 
              v-if="currentCholesterolStatus" 
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              :class="currentCholesterolStatus.color"
            >
              <span>●</span> {{ currentCholesterolStatus.label }} ({{ currentCholesterolStatus.rangeText }})
            </span>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2">
          <button 
            v-for="v in [160, 185, 205, 230, 250]" 
            :key="v"
            type="button"
            @click="cholesterolValue = v"
            class="px-2.5 py-1 text-xs rounded-lg font-medium border border-slate-200 bg-white text-slate-600 hover:border-rose-400 hover:text-rose-700 transition"
          >
            {{ v }}
          </button>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Catatan (Opsional)
          </label>
          <input 
            v-model="notes" 
            type="text" 
            placeholder="Misal: Cek darah lengkap di laboratorium puskesmas"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
          />
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
          :disabled="isSaveDisabled"
          class="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition flex items-center gap-1.5"
        >
          <Check class="w-4 h-4" />
          <span>Simpan Catatan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { HeartPulse, X, Check } from 'lucide-vue-next'
import type { GlucoseMeasurementType } from '../types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  saveBloodPressure: [data: { systolic: number; diastolic: number; pulse?: number; notes: string }]
  saveGlucose: [data: { value: number; type: GlucoseMeasurementType; notes: string }]
  saveUricAcid: [data: { value: number; notes: string }]
  saveCholesterol: [data: { value: number; type: 'total'; notes: string }]
}>()

const activeMetric = ref<'blood_pressure' | 'glucose' | 'uric_acid' | 'cholesterol'>('blood_pressure')

const testTabs = [
  { id: 'blood_pressure', label: 'Tensi', icon: '🫀' },
  { id: 'glucose', label: 'Gula', icon: '🩸' },
  { id: 'uric_acid', label: 'Asam Urat', icon: '🥩' },
  { id: 'cholesterol', label: 'Kolesterol', icon: '🧪' }
] as const

// Form inputs
const systolicValue = ref<number>(118)
const diastolicValue = ref<number>(78)
const pulseValue = ref<number>(72)
const glucoseValue = ref<number>(95)
const selectedType = ref<GlucoseMeasurementType>('fasting')
const uricAcidValue = ref<number>(5.8)
const cholesterolValue = ref<number>(185)
const notes = ref<string>('')

const measurementTypes: { id: GlucoseMeasurementType; label: string; icon: string }[] = [
  { id: 'fasting', label: 'Puasa (Pagi)', icon: '🌅' },
  { id: 'post_meal', label: '2 Jam Habis Makan', icon: '🍽️' },
  { id: 'pre_meal', label: 'Sebelum Makan', icon: '⏳' },
  { id: 'bedtime', label: 'Sebelum Tidur', icon: '🌙' }
]

// BP Status
const currentBpStatus = computed(() => {
  const sys = systolicValue.value
  const dia = diastolicValue.value
  if (!sys || !dia) return null

  if (sys > 180 || dia > 120) {
    return { label: 'Krisis Hipertensi', desc: '> 180/120', color: 'bg-red-100 text-red-800 border-red-300' }
  }
  if (sys >= 140 || dia >= 90) {
    return { label: 'Hipertensi Tk 2', desc: '≥ 140/90', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  }
  if (sys >= 130 || dia >= 80) {
    return { label: 'Hipertensi Tk 1', desc: '130–139 / 80–89', color: 'bg-amber-100 text-amber-800 border-amber-300' }
  }
  if (sys >= 120 && dia < 80) {
    return { label: 'Meningkat', desc: '120–129 / < 80', color: 'bg-amber-50 text-amber-700 border-amber-200' }
  }
  return { label: 'Optimal / Normal', desc: '< 120/80 mmHg', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
})

// Glucose Status
const currentGlucoseStatus = computed(() => {
  const val = glucoseValue.value
  if (!val || val <= 0) return null

  if (val < 70) return { label: 'Hipoglikemia Rendah', rangeText: '< 70 mg/dL', color: 'bg-blue-50 text-blue-700 border-blue-200' }
  if (selectedType.value === 'fasting') {
    if (val <= 99) return { label: 'Normal Puasa', rangeText: '70–99 mg/dL', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    if (val <= 125) return { label: 'Pre-diabetes', rangeText: '100–125 mg/dL', color: 'bg-amber-50 text-amber-700 border-amber-200' }
    return { label: 'Tinggi (Diabetes)', rangeText: '≥ 126 mg/dL', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  } else {
    if (val <= 139) return { label: 'Normal Pasca Makan', rangeText: '70–139 mg/dL', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    if (val <= 179) return { label: 'Sedikit Meningkat', rangeText: '140–179 mg/dL', color: 'bg-amber-50 text-amber-700 border-amber-200' }
    return { label: 'Lonjakan Tinggi', rangeText: '≥ 180 mg/dL', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  }
})

// Uric Acid Status
const currentUricAcidStatus = computed(() => {
  const val = uricAcidValue.value
  if (!val || val <= 0) return null

  if (val <= 7.0) return { label: 'Normal', rangeText: '≤ 7.0 mg/dL', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  if (val <= 8.5) return { label: 'Batas Tinggi', rangeText: '7.1–8.5 mg/dL', color: 'bg-amber-50 text-amber-700 border-amber-200' }
  return { label: 'Tinggi (Risiko Gout)', rangeText: '> 8.5 mg/dL', color: 'bg-rose-50 text-rose-700 border-rose-200' }
})

// Cholesterol Status
const currentCholesterolStatus = computed(() => {
  const val = cholesterolValue.value
  if (!val || val <= 0) return null

  if (val < 200) return { label: 'Optimal / Bagus', rangeText: '< 200 mg/dL', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  if (val <= 239) return { label: 'Batas Tinggi', rangeText: '200–239 mg/dL', color: 'bg-amber-50 text-amber-700 border-amber-200' }
  return { label: 'Tinggi', rangeText: '≥ 240 mg/dL', color: 'bg-rose-50 text-rose-700 border-rose-200' }
})

const isSaveDisabled = computed(() => {
  if (activeMetric.value === 'blood_pressure') return !systolicValue.value || !diastolicValue.value
  if (activeMetric.value === 'glucose') return !glucoseValue.value || glucoseValue.value <= 0
  if (activeMetric.value === 'uric_acid') return !uricAcidValue.value || uricAcidValue.value <= 0
  if (activeMetric.value === 'cholesterol') return !cholesterolValue.value || cholesterolValue.value <= 0
  return false
})

const handleSave = () => {
  if (activeMetric.value === 'blood_pressure') {
    emit('saveBloodPressure', {
      systolic: Number(systolicValue.value),
      diastolic: Number(diastolicValue.value),
      pulse: pulseValue.value ? Number(pulseValue.value) : undefined,
      notes: notes.value.trim()
    })
  } else if (activeMetric.value === 'glucose') {
    emit('saveGlucose', {
      value: Number(glucoseValue.value),
      type: selectedType.value,
      notes: notes.value.trim()
    })
  } else if (activeMetric.value === 'uric_acid') {
    emit('saveUricAcid', {
      value: Number(uricAcidValue.value),
      notes: notes.value.trim()
    })
  } else if (activeMetric.value === 'cholesterol') {
    emit('saveCholesterol', {
      value: Number(cholesterolValue.value),
      type: 'total',
      notes: notes.value.trim()
    })
  }
  notes.value = ''
  emit('close')
}
</script>
