import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import type { 
  GlucoseLog, 
  FoodLog, 
  ActivityLog, 
  DailyHabit, 
  HealthScoreBreakdown,
  GlucoseMeasurementType,
  BloodPressureLog,
  UricAcidLog,
  CholesterolLog
} from '../types'

export function useGlukosaState() {
  const todayStr = new Date().toISOString().split('T')[0]

  // Demo datasets for user if they click "Muat Contoh Data"
  const sampleGlucoseLogs: GlucoseLog[] = [
    {
      id: 'g-demo-1',
      value: 94,
      type: 'fasting',
      timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000 + 7 * 3600 * 1000).toISOString(),
      notes: 'Bangun pagi segar'
    },
    {
      id: 'g-demo-2',
      value: 132,
      type: 'post_meal',
      timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000 + 14 * 3600 * 1000).toISOString(),
      notes: 'Setelah makan siang nasi merah + tempe'
    },
    {
      id: 'g-demo-3',
      value: 98,
      type: 'fasting',
      timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000 + 7 * 3600 * 1000).toISOString(),
      notes: 'Gula puasa stabil'
    },
    {
      id: 'g-demo-4',
      value: 168,
      type: 'post_meal',
      timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000 + 14 * 3600 * 1000).toISOString(),
      notes: 'Makan mie goreng + es teh manis (ada lonjakan)'
    },
    {
      id: 'g-demo-5',
      value: 92,
      type: 'fasting',
      timestamp: new Date(new Date().setHours(7, 15, 0, 0)).toISOString(),
      notes: 'Puasa hari ini mantap'
    }
  ]

  const sampleBloodPressureLogs: BloodPressureLog[] = [
    {
      id: 'bp-demo-1',
      systolic: 118,
      diastolic: 78,
      pulse: 72,
      timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000 + 8 * 3600 * 1000).toISOString(),
      notes: 'Pagi hari setelah istirahat cukup'
    }
  ]

  const sampleUricAcidLogs: UricAcidLog[] = [
    {
      id: 'ua-demo-1',
      value: 6.2,
      timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      notes: 'Cek apotek rutin'
    }
  ]

  const sampleCholesterolLogs: CholesterolLog[] = [
    {
      id: 'ch-demo-1',
      value: 195,
      type: 'total',
      timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      notes: 'Pemeriksaan laboratorium puskesmas'
    }
  ]

  const sampleFoodLogs: FoodLog[] = [
    {
      id: 'food-demo-1',
      mealType: 'breakfast',
      timestamp: new Date(new Date().setHours(7, 45, 0, 0)).toISOString(),
      items: [
        {
          foodId: 'f7',
          name: 'Oatmeal (Matang)',
          portionText: '1 mangkok kecil (150g)',
          calories: 107,
          carbs: 18.5,
          protein: 3.8,
          fat: 2.1
        },
        {
          foodId: 'f9',
          name: 'Telur Rebus',
          portionText: '1 butir (55g)',
          calories: 78,
          carbs: 0.6,
          protein: 6.3,
          fat: 5.3
        }
      ],
      totalCalories: 185,
      totalCarbs: 19.1,
      note: 'Sarapan rendah glikemik, purin & garam'
    }
  ]

  const sampleActivityLogs: ActivityLog[] = [
    {
      id: 'act-demo-1',
      type: 'walking',
      title: 'Jalan santai pagi keliling komplek',
      durationMinutes: 20,
      steps: 2350,
      intensity: 'ringan',
      caloriesBurned: 85,
      timestamp: new Date(new Date().setHours(8, 15, 0, 0)).toISOString(),
      notes: 'Membantu sensitivitas insulin & relaksasi pembuluh darah'
    }
  ]

  // Default clean fresh state (empty arrays for genuine user experience)
  const glucoseLogs = useStorage<GlucoseLog[]>('gluko_glucose_logs_v2', [])
  const bloodPressureLogs = useStorage<BloodPressureLog[]>('gluko_bp_logs_v2', [])
  const uricAcidLogs = useStorage<UricAcidLog[]>('gluko_uric_acid_logs_v2', [])
  const cholesterolLogs = useStorage<CholesterolLog[]>('gluko_cholesterol_logs_v2', [])
  const foodLogs = useStorage<FoodLog[]>('gluko_food_logs_v2', [])
  const activityLogs = useStorage<ActivityLog[]>('gluko_activity_logs_v2', [])
  const habitStorage = useStorage<Record<string, DailyHabit>>('gluko_habits_v2', {
    [todayStr]: {
      date: todayStr,
      waterGlasses: 0,
      waterTarget: 8
    }
  })

  // Load sample demo data on demand
  const loadDemoData = () => {
    glucoseLogs.value = [...sampleGlucoseLogs]
    bloodPressureLogs.value = [...sampleBloodPressureLogs]
    uricAcidLogs.value = [...sampleUricAcidLogs]
    cholesterolLogs.value = [...sampleCholesterolLogs]
    foodLogs.value = [...sampleFoodLogs]
    activityLogs.value = [...sampleActivityLogs]
    habitStorage.value[todayStr] = {
      date: todayStr,
      waterGlasses: 4,
      waterTarget: 8
    }
  }

  // Clear / Reset all data to empty
  const resetAllData = () => {
    glucoseLogs.value = []
    bloodPressureLogs.value = []
    uricAcidLogs.value = []
    cholesterolLogs.value = []
    foodLogs.value = []
    activityLogs.value = []
    habitStorage.value[todayStr] = {
      date: todayStr,
      waterGlasses: 0,
      waterTarget: 8
    }
  }

  // Get current today habit
  const todayHabit = computed<DailyHabit>(() => {
    if (!habitStorage.value[todayStr]) {
      habitStorage.value[todayStr] = {
        date: todayStr,
        waterGlasses: 0,
        waterTarget: 8
      }
    }
    return habitStorage.value[todayStr]
  })

  const incrementWater = () => {
    const cur = todayHabit.value.waterGlasses || 0
    habitStorage.value[todayStr] = {
      ...todayHabit.value,
      waterGlasses: Math.min(cur + 1, 15)
    }
  }

  const decrementWater = () => {
    const cur = todayHabit.value.waterGlasses || 0
    if (cur > 0) {
      habitStorage.value[todayStr] = {
        ...todayHabit.value,
        waterGlasses: cur - 1
      }
    }
  }

  // Add Log Methods - Glucose
  const addGlucoseLog = (entry: { value: number; type: GlucoseMeasurementType; notes?: string }) => {
    const newLog: GlucoseLog = {
      id: 'g-' + Date.now(),
      value: entry.value,
      type: entry.type,
      timestamp: new Date().toISOString(),
      notes: entry.notes || ''
    }
    glucoseLogs.value.unshift(newLog)
  }

  const deleteGlucoseLog = (id: string) => {
    glucoseLogs.value = glucoseLogs.value.filter(item => item.id !== id)
  }

  // Add Log Methods - Blood Pressure (Tensi)
  const addBloodPressureLog = (entry: { systolic: number; diastolic: number; pulse?: number; notes?: string }) => {
    const newLog: BloodPressureLog = {
      id: 'bp-' + Date.now(),
      systolic: entry.systolic,
      diastolic: entry.diastolic,
      pulse: entry.pulse,
      timestamp: new Date().toISOString(),
      notes: entry.notes || ''
    }
    bloodPressureLogs.value.unshift(newLog)
  }

  const deleteBloodPressureLog = (id: string) => {
    bloodPressureLogs.value = bloodPressureLogs.value.filter(item => item.id !== id)
  }

  // Add Log Methods - Uric Acid (Asam Urat)
  const addUricAcidLog = (entry: { value: number; notes?: string }) => {
    const newLog: UricAcidLog = {
      id: 'ua-' + Date.now(),
      value: entry.value,
      timestamp: new Date().toISOString(),
      notes: entry.notes || ''
    }
    uricAcidLogs.value.unshift(newLog)
  }

  const deleteUricAcidLog = (id: string) => {
    uricAcidLogs.value = uricAcidLogs.value.filter(item => item.id !== id)
  }

  // Add Log Methods - Cholesterol
  const addCholesterolLog = (entry: { value: number; type?: 'total' | 'ldl' | 'hdl' | 'triglycerides'; notes?: string }) => {
    const newLog: CholesterolLog = {
      id: 'ch-' + Date.now(),
      value: entry.value,
      type: entry.type || 'total',
      timestamp: new Date().toISOString(),
      notes: entry.notes || ''
    }
    cholesterolLogs.value.unshift(newLog)
  }

  const deleteCholesterolLog = (id: string) => {
    cholesterolLogs.value = cholesterolLogs.value.filter(item => item.id !== id)
  }

  // Food & Activity
  const addFoodLog = (entry: Omit<FoodLog, 'id' | 'timestamp'>) => {
    const newLog: FoodLog = {
      id: 'f-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    }
    foodLogs.value.unshift(newLog)
  }

  const deleteFoodLog = (id: string) => {
    foodLogs.value = foodLogs.value.filter(item => item.id !== id)
  }

  const addActivityLog = (entry: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      id: 'act-' + Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    }
    activityLogs.value.unshift(newLog)
  }

  const deleteActivityLog = (id: string) => {
    activityLogs.value = activityLogs.value.filter(item => item.id !== id)
  }

  // 4 Pilar Vital Terbaru (Latest Readings)
  const latestGlucose = computed(() => {
    return glucoseLogs.value.length > 0 ? glucoseLogs.value[0] : null
  })

  const latestBloodPressure = computed(() => {
    return bloodPressureLogs.value.length > 0 ? bloodPressureLogs.value[0] : null
  })

  const latestUricAcid = computed(() => {
    return uricAcidLogs.value.length > 0 ? uricAcidLogs.value[0] : null
  })

  const latestCholesterol = computed(() => {
    return cholesterolLogs.value.length > 0 ? cholesterolLogs.value[0] : null
  })

  // Status helper for Blood Pressure (Tensi)
  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic > 180 || diastolic > 120) {
      return { label: 'Krisis Hipertensi ⚠️', color: 'bg-red-100 text-red-800 border-red-300', desc: 'Segera istirahat & hubungi medis' }
    }
    if (systolic >= 140 || diastolic >= 90) {
      return { label: 'Hipertensi Tk 2', color: 'bg-rose-50 text-rose-700 border-rose-200', desc: 'Tinggi (kurangi garam & kelola stres)' }
    }
    if (systolic >= 130 || diastolic >= 80) {
      return { label: 'Hipertensi Tk 1', color: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Mulai waspada & aktif bergerak' }
    }
    if (systolic >= 120 && diastolic < 80) {
      return { label: 'Meningkat', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'Pra-hipertensi' }
    }
    return { label: 'Optimal / Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: '< 120 / < 80 mmHg' }
  }

  // Status helper for Asam Urat (mg/dL)
  const getUricAcidStatus = (val: number) => {
    if (val <= 7.0) {
      return { label: 'Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: 'Batas aman standar' }
    } else if (val <= 8.5) {
      return { label: 'Waspada (Naik)', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'Kurangi jeroan & emping' }
    } else {
      return { label: 'Tinggi (Risiko Gout)', color: 'bg-rose-50 text-rose-700 border-rose-200', desc: 'Risiko radang sendi' }
    }
  }

  // Status helper for Kolesterol Total (mg/dL)
  const getCholesterolStatus = (val: number) => {
    if (val < 200) {
      return { label: 'Optimal / Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: '< 200 mg/dL' }
    } else if (val <= 239) {
      return { label: 'Batas Tinggi', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: '200–239 mg/dL' }
    } else {
      return { label: 'Tinggi', color: 'bg-rose-50 text-rose-700 border-rose-200', desc: '≥ 240 mg/dL' }
    }
  }

  // Today Filtered Logs
  const todayGlucoseLogs = computed(() => {
    return glucoseLogs.value.filter(log => log.timestamp.startsWith(todayStr))
  })

  const todayFoodLogs = computed(() => {
    return foodLogs.value.filter(log => log.timestamp.startsWith(todayStr))
  })

  const todayActivityLogs = computed(() => {
    return activityLogs.value.filter(log => log.timestamp.startsWith(todayStr))
  })

  // Aggregated Today Summary
  const todaySummary = computed(() => {
    const gl = todayGlucoseLogs.value
    const avgGlucose = gl.length > 0 
      ? Math.round(gl.reduce((acc, cur) => acc + cur.value, 0) / gl.length) 
      : null

    const totalCarbs = todayFoodLogs.value.reduce((acc, cur) => acc + (cur.totalCarbs || 0), 0)
    const totalCalories = todayFoodLogs.value.reduce((acc, cur) => acc + (cur.totalCalories || 0), 0)
    const totalActivityMinutes = todayActivityLogs.value.reduce((acc, cur) => acc + (cur.durationMinutes || 0), 0)
    const totalSteps = todayActivityLogs.value.reduce((acc, cur) => acc + (cur.steps || 0), 0)

    const hasFasting = gl.some(l => l.type === 'fasting')
    const hasBreakfast = todayFoodLogs.value.some(f => f.mealType === 'breakfast')
    const hasPostMeal = gl.some(l => l.type === 'post_meal')

    return {
      avgGlucose,
      readingCount: gl.length,
      totalCarbs: Math.round(totalCarbs),
      totalCalories: Math.round(totalCalories),
      totalActivityMinutes,
      totalSteps,
      hasFasting,
      hasBreakfast,
      hasPostMeal,
      waterGlasses: todayHabit.value.waterGlasses || 0,
      waterTarget: todayHabit.value.waterTarget || 8
    }
  })

  // Time In Range (TIR) - Target 70 - 140 mg/dL (Normal/Optimal)
  const timeInRangeStats = computed(() => {
    if (glucoseLogs.value.length === 0) {
      return { inRangePercent: 100, lowPercent: 0, highPercent: 0, total: 0 }
    }
    const total = glucoseLogs.value.length
    let inRange = 0
    let low = 0
    let high = 0

    glucoseLogs.value.forEach(item => {
      if (item.value < 70) low++
      else if (item.value <= 140) inRange++
      else high++
    })

    return {
      inRangePercent: Math.round((inRange / total) * 100),
      lowPercent: Math.round((low / total) * 100),
      highPercent: Math.round((high / total) * 100),
      total
    }
  })

  // Health Score (0 - 100)
  const healthScore = computed<HealthScoreBreakdown>(() => {
    if (glucoseLogs.value.length === 0 && bloodPressureLogs.value.length === 0 && todayHabit.value.waterGlasses === 0 && todayFoodLogs.value.length === 0 && todayActivityLogs.value.length === 0) {
      return {
        totalScore: 0,
        timeInRangeScore: 0,
        habitConsistencyScore: 0,
        activityScore: 0,
        nutritionBalanceScore: 0,
        label: 'Ayo Mulai Kebiasaan',
        color: 'text-slate-500'
      }
    }

    const tir = timeInRangeStats.value.inRangePercent
    const tirScore = glucoseLogs.value.length > 0 ? Math.round((tir / 100) * 40) : 0

    let habitScore = 0
    const waterRatio = Math.min((todayHabit.value.waterGlasses || 0) / (todayHabit.value.waterTarget || 8), 1)
    habitScore += Math.round(waterRatio * 10)
    if (todayGlucoseLogs.value.length > 0 || bloodPressureLogs.value.length > 0) habitScore += 10
    if (todayFoodLogs.value.length > 0) habitScore += 10

    const actMins = todaySummary.value.totalActivityMinutes
    const actScore = Math.min(Math.round((actMins / 30) * 15), 15)

    const carbs = todaySummary.value.totalCarbs
    let nutScore = todayFoodLogs.value.length > 0 ? 15 : 0
    if (carbs > 250) nutScore = 8
    else if (carbs > 180) nutScore = 12

    const total = tirScore + habitScore + actScore + nutScore

    let label: HealthScoreBreakdown['label'] = 'Optimal'
    let color = 'text-sky-600'
    if (total < 40) {
      label = 'Perlu Perhatian'
      color = 'text-rose-500'
    } else if (total < 70) {
      label = 'Cukup Baik'
      color = 'text-amber-500'
    } else if (total < 85) {
      label = 'Sangat Baik'
      color = 'text-teal-600'
    }

    return {
      totalScore: total,
      timeInRangeScore: tirScore,
      habitConsistencyScore: habitScore,
      activityScore: actScore,
      nutritionBalanceScore: nutScore,
      label,
      color
    }
  })

  // Smart Clinical Heuristics (AI Nutrition & Habit Assistant)
  const smartInsights = computed(() => {
    const list: { id: string; type: 'success' | 'warning' | 'info' | 'tip'; title: string; message: string }[] = []

    if (glucoseLogs.value.length === 0 && bloodPressureLogs.value.length === 0) {
      list.push({
        id: 'start-first-log',
        type: 'info',
        title: 'Mulai Pengukuran Pertamamu 🩺',
        message: 'Catat Tensi Darah atau Gula Darah Puasa saat bangun tidur untuk memantau ritme sirkadian tubuhmu.'
      })
    }

    // 1. Tensi check
    if (latestBloodPressure.value) {
      const { systolic, diastolic } = latestBloodPressure.value
      if (systolic >= 140 || diastolic >= 90) {
        list.push({
          id: 'high-bp',
          type: 'warning',
          title: 'Tekanan Darah Perlu Perhatian 🫀',
          message: `Tensi terakhirmu ${systolic}/${diastolic} mmHg. Coba luangkan waktu napas dalam (deep breathing), kurangi makanan tinggi garam/natrium, dan jalan santai 15 menit.`
        })
      } else if (systolic < 120 && diastolic < 80) {
        list.push({
          id: 'normal-bp',
          type: 'success',
          title: 'Tekanan Darah Sangat Bagus! 🌿',
          message: `Tensi ${systolic}/${diastolic} mmHg berada di rentang optimal. Pembuluh darahmu dalam kondisi relaks dan terlindungi.`
        })
      }
    }

    // 2. Asam urat check
    if (latestUricAcid.value && latestUricAcid.value.value > 7.0) {
      list.push({
        id: 'high-uric-acid',
        type: 'warning',
        title: 'Perhatian: Asam Urat Di Atas Normal 🥩',
        message: `Catatan asam urat terakhirmu ${latestUricAcid.value.value} mg/dL. Batasi emping melinjo & jeroan, perbanyak minum air putih (minimal 2 liter/hari).`
      })
    }

    // 3. Kolesterol check
    if (latestCholesterol.value && latestCholesterol.value.value >= 200) {
      list.push({
        id: 'high-cholesterol',
        type: 'warning',
        title: 'Perhatian: Kolesterol Perlu Dipantau 🧪',
        message: `Kolesterol total terakhirmu ${latestCholesterol.value.value} mg/dL. Kurangi makanan berminyak gorengan jelantah & santan kental berulang.`
      })
    }

    // 4. Check morning fasting glucose
    const latestFasting = glucoseLogs.value.find(l => l.type === 'fasting')
    if (latestFasting) {
      if (latestFasting.value < 70) {
        list.push({
          id: 'hypo',
          type: 'warning',
          title: 'Waspada Hipoglikemia Rendah',
          message: `Gula darah puasa terakhirmu ${latestFasting.value} mg/dL (di bawah 70). Segera konsumsi 15 gram karbohidrat cepat serap.`
        })
      } else if (latestFasting.value <= 100) {
        list.push({
          id: 'fasting-normal',
          type: 'success',
          title: 'Gula Darah Puasa Optimal! 🌿',
          message: `Pagi ini gula puasa berada di ${latestFasting.value} mg/dL. Pertahankan pola makan sehat kemarin!`
        })
      } else if (latestFasting.value <= 125) {
        list.push({
          id: 'fasting-elevated',
          type: 'info',
          title: 'Kategori Pre-diabetes / Sedikit Naik',
          message: `Gula puasa ${latestFasting.value} mg/dL. Kurangi karbohidrat olahan menjelang tidur.`
        })
      } else {
        list.push({
          id: 'fasting-high',
          type: 'warning',
          title: 'Gula Puasa Cenderung Tinggi',
          message: `Gula puasa terukur ${latestFasting.value} mg/dL. Perbanyak minum air putih dan diskusikan dengan dokter.`
        })
      }
    }

    // 5. Movement synergy
    if (todaySummary.value.totalActivityMinutes >= 20) {
      list.push({
        id: 'activity-done',
        type: 'success',
        title: 'Sirkulasi & Sensitivitas Meningkat 👟',
        message: `Aktif ${todaySummary.value.totalActivityMinutes} menit hari ini membantu pembuluh darah lebih lentur dan menurunkan tekanan darah sistolik.`
      })
    }

    return list
  })

  // Helper function to get status badge for glucose
  const getGlucoseStatus = (val: number, type: GlucoseMeasurementType) => {
    if (val < 70) return { label: 'Rendah (Hipo)', color: 'bg-blue-50 text-blue-700 border-blue-200' }
    
    if (type === 'fasting') {
      if (val <= 99) return { label: 'Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      if (val <= 125) return { label: 'Pre-diabetes', color: 'bg-amber-50 text-amber-700 border-amber-200' }
      return { label: 'Tinggi', color: 'bg-rose-50 text-rose-700 border-rose-200' }
    } else {
      if (val <= 139) return { label: 'Normal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
      if (val <= 179) return { label: 'Waspada', color: 'bg-amber-50 text-amber-700 border-amber-200' }
      return { label: 'Tinggi', color: 'bg-rose-50 text-rose-700 border-rose-200' }
    }
  }

  return {
    todayStr,
    glucoseLogs,
    bloodPressureLogs,
    uricAcidLogs,
    cholesterolLogs,
    foodLogs,
    activityLogs,
    todayHabit,
    todaySummary,
    todayGlucoseLogs,
    todayFoodLogs,
    todayActivityLogs,
    timeInRangeStats,
    healthScore,
    smartInsights,
    latestGlucose,
    latestBloodPressure,
    latestUricAcid,
    latestCholesterol,
    incrementWater,
    decrementWater,
    addGlucoseLog,
    deleteGlucoseLog,
    addBloodPressureLog,
    deleteBloodPressureLog,
    addUricAcidLog,
    deleteUricAcidLog,
    addCholesterolLog,
    deleteCholesterolLog,
    addFoodLog,
    deleteFoodLog,
    addActivityLog,
    deleteActivityLog,
    getGlucoseStatus,
    getBloodPressureStatus,
    getUricAcidStatus,
    getCholesterolStatus,
    loadDemoData,
    resetAllData
  }
}
