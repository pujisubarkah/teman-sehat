<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 border-b border-sky-100 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white">
            <UtensilsCrossed class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-base">Jurnal Makanan & Karbohidrat</h3>
            <p class="text-xs text-slate-500">Estimasi nutrisi kuliner Indonesia (TKPI Kemenkes)</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Meal Time Selector -->
      <div class="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Waktu:</span>
        <button 
          v-for="mt in mealTypes" 
          :key="mt.id"
          type="button"
          @click="selectedMeal = mt.id"
          class="px-3 py-1 rounded-full text-xs font-semibold transition"
          :class="selectedMeal === mt.id 
            ? 'bg-sky-600 text-white shadow-sm' 
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
        >
          {{ mt.label }}
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="p-6 border-b border-slate-100 space-y-3">
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari makanan (misal: Nasi putih, Tempe, Ayam, Sayur bayam, Es teh)..."
            class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Categories horizontal pills -->
        <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            class="px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition"
            :class="selectedCategory === cat 
              ? 'bg-slate-800 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Food List -->
      <div class="flex-1 overflow-y-auto p-6 space-y-3">
        <div 
          v-for="food in filteredFoods" 
          :key="food.id"
          class="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all bg-white hover:bg-sky-50/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-sm text-slate-800">{{ food.name }}</h4>
              <span 
                v-if="food.glycemicIndex"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                :class="food.glycemicIndex === 'Tinggi' 
                  ? 'bg-red-100 text-red-700' 
                  : food.glycemicIndex === 'Sedang' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-emerald-100 text-emerald-700'"
              >
                GI: {{ food.glycemicIndex }}
              </span>
              <span 
                v-if="food.purineLevel === 'Tinggi'"
                class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"
                title="Tinggi Purin - Waspada Asam Urat"
              >
                🥩 Purin Tinggi
              </span>
            </div>
            <p v-if="food.healthNotice" class="text-[11px] text-rose-600 font-medium mt-0.5">
              {{ food.healthNotice }}
            </p>
            <p class="text-xs text-slate-500 mt-0.5">Porsi: {{ food.portionName }}</p>
            <div class="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
              <span class="font-bold text-sky-700">{{ food.calories }} kkal</span>
              <span>•</span>
              <span class="font-semibold text-amber-700">Karbo: {{ food.carbs }}g</span>
              <span>•</span>
              <span>Protein: {{ food.protein }}g</span>
              <span>•</span>
              <span>Lemak: {{ food.fat }}g</span>
            </div>
          </div>

          <button 
            @click="addFoodToPlate(food)"
            class="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold active:scale-95 shadow-sm transition flex items-center justify-center gap-1"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Pilih</span>
          </button>
        </div>

        <div v-if="filteredFoods.length === 0" class="text-center py-8 text-slate-400">
          <p class="text-sm">Tidak menemukan makanan yang cocok.</p>
          <p class="text-xs mt-1">Coba kata kunci lain atau pilih kategori Semua.</p>
        </div>
      </div>

      <!-- Current Plate Cart Summary -->
      <div v-if="currentPlate.length > 0" class="p-4 bg-sky-50/80 border-t border-sky-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-sky-950">Piring Makanmu ({{ currentPlate.length }} item):</span>
          <span class="text-xs text-sky-800 font-bold">
            Total: {{ totalPlateCalories }} kkal | {{ totalPlateCarbs }}g Karbo
          </span>
        </div>
        <div class="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
          <div 
            v-for="(item, idx) in currentPlate" 
            :key="idx"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white text-slate-800 text-xs border border-sky-200 shadow-xs"
          >
            <span class="font-semibold">{{ item.name }}</span>
            <span class="text-slate-400 text-[11px]">({{ item.carbs }}g karbo)</span>
            <button 
              @click="removeItem(idx)" 
              class="text-slate-400 hover:text-red-500 ml-1 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p class="text-[11px] text-slate-500">
          Data berbasis Tabel Komposisi Pangan Indonesia (TKPI) Kemenkes.
        </p>
        <div class="flex items-center gap-2">
          <button 
            @click="$emit('close')"
            class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
          >
            Batal
          </button>
          <button 
            @click="handleSaveMeal"
            :disabled="currentPlate.length === 0"
            class="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition flex items-center gap-1.5"
          >
            <Check class="w-4 h-4" />
            <span>Simpan ke Jurnal</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UtensilsCrossed, X, Search, Plus, Check } from 'lucide-vue-next'
import { indonesianFoodDatabase } from '../data/foodDatabase'
import type { FoodItem, MealTimeType } from '../types'

const props = defineProps<{
  isOpen: boolean
  initialMealType?: MealTimeType
}>()

const emit = defineEmits<{
  close: []
  save: [data: {
    mealType: MealTimeType
    items: {
      foodId: string
      name: string
      portionText: string
      calories: number
      carbs: number
      protein: number
      fat: number
    }[]
    totalCalories: number
    totalCarbs: number
    note?: string
  }]
}>()

const searchQuery = ref('')
const selectedCategory = ref('Semua')
const selectedMeal = ref<MealTimeType>(props.initialMealType || 'breakfast')

const mealTypes: { id: MealTimeType; label: string }[] = [
  { id: 'breakfast', label: 'Sarapan' },
  { id: 'lunch', label: 'Makan Siang' },
  { id: 'dinner', label: 'Makan Malam' },
  { id: 'snack', label: 'Camilan' }
]

const categories = [
  'Semua',
  'Makanan Pokok',
  'Lauk Pauk',
  'Sayuran',
  'Buah',
  'Minuman',
  'Camilan'
]

const currentPlate = ref<{
  foodId: string
  name: string
  portionText: string
  calories: number
  carbs: number
  protein: number
  fat: number
}[]>([])

const filteredFoods = computed(() => {
  return indonesianFoodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          food.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'Semua' || food.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const addFoodToPlate = (food: FoodItem) => {
  currentPlate.value.push({
    foodId: food.id,
    name: food.name,
    portionText: food.portionName,
    calories: food.calories,
    carbs: food.carbs,
    protein: food.protein,
    fat: food.fat
  })
}

const removeItem = (index: number) => {
  currentPlate.value.splice(index, 1)
}

const totalPlateCalories = computed(() => {
  return currentPlate.value.reduce((acc, cur) => acc + cur.calories, 0)
})

const totalPlateCarbs = computed(() => {
  return Math.round(currentPlate.value.reduce((acc, cur) => acc + cur.carbs, 0) * 10) / 10
})

const handleSaveMeal = () => {
  if (currentPlate.value.length === 0) return
  emit('save', {
    mealType: selectedMeal.value,
    items: [...currentPlate.value],
    totalCalories: totalPlateCalories.value,
    totalCarbs: totalPlateCarbs.value,
    note: ''
  })
  currentPlate.value = []
  emit('close')
}
</script>
