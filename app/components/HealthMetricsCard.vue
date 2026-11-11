<template>
  <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div>
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>4 Pilar Sehat TemanSehat</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 tracking-wide uppercase">
            Pantau Rutin
          </span>
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">Tensi, Gula Darah, Asam Urat & Kolesterol dalam satu ringkasan</p>
      </div>
      <button 
        @click="$emit('openModal')"
        class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>+ Catat Hasil Tes</span>
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- 1. Tensi (Tekanan Darah) -->
      <div class="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-indigo-950 flex items-center gap-1">
              <span>🫀</span> Tensi Darah
            </span>
            <span 
              v-if="latestBloodPressure"
              class="text-[9px] font-bold px-1.5 py-0.5 rounded-full border"
              :class="getBloodPressureStatus(latestBloodPressure.systolic, latestBloodPressure.diastolic).color"
            >
              {{ getBloodPressureStatus(latestBloodPressure.systolic, latestBloodPressure.diastolic).label }}
            </span>
          </div>

          <div class="mt-2.5">
            <div v-if="latestBloodPressure" class="flex items-baseline gap-1">
              <span class="text-xl sm:text-2xl font-black text-slate-800">
                {{ latestBloodPressure.systolic }}/{{ latestBloodPressure.diastolic }}
              </span>
              <span class="text-[10px] text-slate-500 font-semibold">mmHg</span>
            </div>
            <div v-else class="text-xs text-slate-400 py-1">
              Belum ada data
            </div>
            <p v-if="latestBloodPressure" class="text-[10px] text-slate-500 mt-0.5">
              {{ latestBloodPressure.pulse ? `Nadi: ${latestBloodPressure.pulse} bpm • ` : '' }}
              {{ new Date(latestBloodPressure.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
            </p>
          </div>
        </div>
        <div class="pt-2 border-t border-indigo-100/80 mt-2 text-[10px] text-indigo-800 font-medium">
          Normal: &lt; 120/80 mmHg
        </div>
      </div>

      <!-- 2. Glukosa Darah -->
      <div class="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-sky-950 flex items-center gap-1">
              <span>🩸</span> Gula Darah
            </span>
            <span 
              v-if="latestGlucose"
              class="text-[9px] font-bold px-1.5 py-0.5 rounded-full border"
              :class="getGlucoseStatus(latestGlucose.value, latestGlucose.type).color"
            >
              {{ getGlucoseStatus(latestGlucose.value, latestGlucose.type).label }}
            </span>
          </div>

          <div class="mt-2.5">
            <div v-if="latestGlucose" class="flex items-baseline gap-1">
              <span class="text-xl sm:text-2xl font-black text-slate-800">{{ latestGlucose.value }}</span>
              <span class="text-[10px] text-slate-500 font-semibold">mg/dL</span>
            </div>
            <div v-else class="text-xs text-slate-400 py-1">
              Belum ada data
            </div>
            <p v-if="latestGlucose" class="text-[10px] text-slate-500 mt-0.5">
              {{ latestGlucose.type === 'fasting' ? 'Gula Puasa' : '2 Jam Habis Makan' }}
            </p>
          </div>
        </div>
        <div class="pt-2 border-t border-sky-100/80 mt-2 text-[10px] text-sky-800 font-medium">
          Target: 70–140 mg/dL
        </div>
      </div>

      <!-- 3. Asam Urat -->
      <div class="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-950 flex items-center gap-1">
              <span>🥩</span> Asam Urat
            </span>
            <span 
              v-if="latestUricAcid"
              class="text-[9px] font-bold px-1.5 py-0.5 rounded-full border"
              :class="getUricAcidStatus(latestUricAcid.value).color"
            >
              {{ getUricAcidStatus(latestUricAcid.value).label }}
            </span>
          </div>

          <div class="mt-2.5">
            <div v-if="latestUricAcid" class="flex items-baseline gap-1">
              <span class="text-xl sm:text-2xl font-black text-slate-800">{{ latestUricAcid.value }}</span>
              <span class="text-[10px] text-slate-500 font-semibold">mg/dL</span>
            </div>
            <div v-else class="text-xs text-slate-400 py-1">
              Belum ada data
            </div>
            <p v-if="latestUricAcid" class="text-[10px] text-slate-500 mt-0.5">
              {{ new Date(latestUricAcid.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
            </p>
          </div>
        </div>
        <div class="pt-2 border-t border-amber-100/80 mt-2 text-[10px] text-amber-800 font-medium">
          Normal: ≤ 7.0 mg/dL
        </div>
      </div>

      <!-- 4. Kolesterol Total -->
      <div class="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-rose-950 flex items-center gap-1">
              <span>🧪</span> Kolesterol
            </span>
            <span 
              v-if="latestCholesterol"
              class="text-[9px] font-bold px-1.5 py-0.5 rounded-full border"
              :class="getCholesterolStatus(latestCholesterol.value).color"
            >
              {{ getCholesterolStatus(latestCholesterol.value).label }}
            </span>
          </div>

          <div class="mt-2.5">
            <div v-if="latestCholesterol" class="flex items-baseline gap-1">
              <span class="text-xl sm:text-2xl font-black text-slate-800">{{ latestCholesterol.value }}</span>
              <span class="text-[10px] text-slate-500 font-semibold">mg/dL</span>
            </div>
            <div v-else class="text-xs text-slate-400 py-1">
              Belum ada data
            </div>
            <p v-if="latestCholesterol" class="text-[10px] text-slate-500 mt-0.5">
              {{ new Date(latestCholesterol.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
            </p>
          </div>
        </div>
        <div class="pt-2 border-t border-rose-100/80 mt-2 text-[10px] text-rose-800 font-medium">
          Target: &lt; 200 mg/dL
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { GlucoseLog, BloodPressureLog, UricAcidLog, CholesterolLog, GlucoseMeasurementType } from '../types'

defineProps<{
  latestGlucose: GlucoseLog | null
  latestBloodPressure: BloodPressureLog | null
  latestUricAcid: UricAcidLog | null
  latestCholesterol: CholesterolLog | null
  getGlucoseStatus: (val: number, type: GlucoseMeasurementType) => { label: string; color: string }
  getBloodPressureStatus: (sys: number, dia: number) => { label: string; color: string }
  getUricAcidStatus: (val: number) => { label: string; color: string }
  getCholesterolStatus: (val: number) => { label: string; color: string }
}>()

defineEmits<{
  openModal: []
}>()
</script>
