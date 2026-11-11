export type GlucoseMeasurementType = 'fasting' | 'pre_meal' | 'post_meal' | 'bedtime' | 'random'

export type GlucoseStatus = 'low' | 'normal' | 'elevated' | 'high'

export interface GlucoseLog {
  id: string
  value: number // in mg/dL
  type: GlucoseMeasurementType
  timestamp: string // ISO string
  notes?: string
  mealReferenceId?: string
}

export interface BloodPressureLog {
  id: string
  systolic: number // in mmHg (e.g. 120)
  diastolic: number // in mmHg (e.g. 80)
  pulse?: number // in bpm (e.g. 75)
  timestamp: string
  notes?: string
}

export interface UricAcidLog {
  id: string
  value: number // in mg/dL (e.g. 5.5, 7.2)
  timestamp: string
  notes?: string
}

export interface CholesterolLog {
  id: string
  value: number // in mg/dL (e.g. 190, 225, 260)
  type: 'total' | 'ldl' | 'hdl' | 'triglycerides'
  timestamp: string
  notes?: string
}

export type MealTimeType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodItem {
  id: string
  name: string
  portionName: string
  portionMultiplier: number
  baseServing: string
  calories: number
  carbs: number // in grams
  protein: number // in grams
  fat: number // in grams
  fiber?: number // in grams
  glycemicIndex?: 'Rendah' | 'Sedang' | 'Tinggi'
  purineLevel?: 'Rendah' | 'Sedang' | 'Tinggi' // Untuk Asam Urat
  category: string
  healthNotice?: string // e.g. "Tinggi Purin", "Tinggi Lemak Jenuh", "Tinggi Natrium"
}

export interface FoodLog {
  id: string
  mealType: MealTimeType
  timestamp: string
  items: {
    foodId: string
    name: string
    portionText: string
    calories: number
    carbs: number
    protein: number
    fat: number
    purineLevel?: 'Rendah' | 'Sedang' | 'Tinggi'
  }[]
  totalCalories: number
  totalCarbs: number
  note?: string
}

export type ActivityType = 'walking' | 'running' | 'cycling' | 'gym' | 'stretching' | 'other'

export interface ActivityLog {
  id: string
  type: ActivityType
  title: string
  durationMinutes: number
  steps?: number
  intensity: 'ringan' | 'sedang' | 'berat'
  caloriesBurned: number
  timestamp: string
  notes?: string
}

export interface DailyHabit {
  date: string // YYYY-MM-DD
  waterGlasses: number // e.g. 0 - 8+
  waterTarget: number // default 8
}

export interface HealthScoreBreakdown {
  totalScore: number // 0 - 100
  timeInRangeScore: number // 0 - 40
  habitConsistencyScore: number // 0 - 30
  activityScore: number // 0 - 15
  nutritionBalanceScore: number // 0 - 15
  label: 'Ayo Mulai Kebiasaan' | 'Perlu Perhatian' | 'Cukup Baik' | 'Sangat Baik' | 'Optimal'
  color: string
}
