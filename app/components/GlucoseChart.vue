<template>
  <div class="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
    <!-- Chart Header & Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
      <div>
        <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
          <span>Tren Glukosa Darah</span>
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Target: 70–140 mg/dL
          </span>
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">Pantau pola kestabilan gula darah harian dan mingguan</p>
      </div>

      <!-- Timeframe Toggle -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
        <button 
          v-for="t in ['7 Hari', '14 Hari', 'Semua']" 
          :key="t"
          @click="selectedPeriod = t"
          class="px-2.5 py-1 rounded-lg transition"
          :class="selectedPeriod === t 
            ? 'bg-white text-slate-800 shadow-xs' 
            : 'text-slate-500 hover:text-slate-800'"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <!-- Target Range Legend -->
    <div class="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
      <span class="font-bold text-slate-700">Zona Indikator:</span>
      <span class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Rendah (&lt;70)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman (70-140)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Waspada (141-179)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Tinggi (≥180)
      </span>
    </div>

    <!-- Chart Canvas -->
    <div class="h-64 sm:h-72 w-full relative">
      <Line 
        v-if="chartData.labels.length > 0" 
        :data="chartData" 
        :options="chartOptions" 
      />
      <div v-else class="h-full flex items-center justify-center text-slate-400 text-xs">
        Belum ada data pengukuran gula darah.
      </div>
    </div>

    <!-- Quick Stats Cards below Chart -->
    <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
      <div class="p-2.5 bg-slate-50 rounded-xl">
        <span class="text-[11px] text-slate-500">Rata-rata</span>
        <p class="text-base font-extrabold text-slate-800">{{ stats.avg }} <span class="text-xs font-normal text-slate-400">mg/dL</span></p>
      </div>
      <div class="p-2.5 bg-emerald-50/60 rounded-xl">
        <span class="text-[11px] text-emerald-700">Time-in-Range (TIR)</span>
        <p class="text-base font-extrabold text-emerald-800">{{ tirPercent }}%</p>
      </div>
      <div class="p-2.5 bg-slate-50 rounded-xl">
        <span class="text-[11px] text-slate-500">Tertinggi</span>
        <p class="text-base font-extrabold text-slate-800">{{ stats.max }} <span class="text-xs font-normal text-slate-400">mg/dL</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { GlucoseLog } from '../types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  logs: GlucoseLog[]
  tirPercent: number
}>()

const selectedPeriod = ref('7 Hari')

// Sort logs chronologically (oldest to newest for plotting)
const sortedLogs = computed(() => {
  return [...props.logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
})

const stats = computed(() => {
  if (props.logs.length === 0) return { avg: 0, min: 0, max: 0 }
  const vals = props.logs.map(l => l.value)
  const sum = vals.reduce((a, b) => a + b, 0)
  return {
    avg: Math.round(sum / vals.length),
    min: Math.min(...vals),
    max: Math.max(...vals)
  }
})

const chartData = computed(() => {
  const labels = sortedLogs.value.map(log => {
    const d = new Date(log.timestamp)
    const day = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
    const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    const typeLabel = log.type === 'fasting' ? 'Puasa' : log.type === 'post_meal' ? '2j Habis Makan' : 'Cek'
    return `${day} (${typeLabel})`
  })

  const values = sortedLogs.value.map(log => log.value)

  // Point colors based on zones
  const pointColors = sortedLogs.value.map(log => {
    if (log.value < 70) return '#3b82f6'
    if (log.value <= 140) return '#10b981'
    if (log.value <= 179) return '#f59e0b'
    return '#ef4444'
  })

  return {
    labels,
    datasets: [
      {
        label: 'Gula Darah (mg/dL)',
        data: values,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: pointColors,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }
})

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { size: 12, family: 'Poppins', weight: 'bold' },
      bodyFont: { size: 12, family: 'Poppins' },
      padding: 10,
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
        label: function (context) {
          const val = context.parsed.y
          let status = 'Aman/Normal'
          if (val < 70) status = 'Rendah (Hipo)'
          else if (val > 179) status = 'Lonjakan Tinggi'
          else if (val > 140) status = 'Waspada'
          return ` Nilai: ${val} mg/dL • ${status}`
        }
      }
    }
  },
  scales: {
    y: {
      min: 50,
      max: 220,
      grid: {
        color: '#f1f5f9'
      },
      ticks: {
        stepSize: 30,
        font: { size: 10, family: 'Poppins' },
        callback: (value) => `${value}`
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 45,
        minRotation: 20,
        font: { size: 10, family: 'Poppins' }
      }
    }
  }
}
</script>
