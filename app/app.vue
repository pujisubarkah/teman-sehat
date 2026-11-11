<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 selection:bg-sky-100 selection:text-sky-900">
    <!-- Header with Tabs -->
    <HeaderNav 
      :active-tab="activeTab" 
      @update:active-tab="activeTab = $event" 
    />

    <!-- Main Container -->
    <main class="max-w-4xl mx-auto px-4 pt-5 space-y-6">

      <!-- PWA Install Banner -->
      <PwaInstallBanner />

      <!-- ==================== TAB 1: HARI INI (DAILY COMPANION) ==================== -->
      <section v-if="activeTab === 'today'" class="space-y-6 animate-fade-in">
        <!-- Morning / Daily Greeting Companion Card -->
        <MorningGreetingCard 
          :today-habit="todayHabit"
          :today-summary="todaySummary"
          :health-score="healthScore"
          @increment-water="incrementWater"
          @decrement-water="decrementWater"
          @open-activity-modal="showActivityModal = true"
          @open-food-modal="openFoodModalWithMeal"
          @open-glucose-modal="showGlucoseModal = true"
        />

        <!-- 4 Pilar Sehat TemanSehat (Tensi, Gula Darah, Asam Urat, Kolesterol) -->
        <HealthMetricsCard 
          :latest-glucose="latestGlucose"
          :latest-blood-pressure="latestBloodPressure"
          :latest-uric-acid="latestUricAcid"
          :latest-cholesterol="latestCholesterol"
          :get-glucose-status="getGlucoseStatus"
          :get-blood-pressure-status="getBloodPressureStatus"
          :get-uric-acid-status="getUricAcidStatus"
          :get-cholesterol-status="getCholesterolStatus"
          @open-modal="showGlucoseModal = true"
        />

        <!-- WhatsApp Caregiver & Family Share Card -->
        <div class="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/90 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
              <Share2 class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>Kirim Kabar Sehat ke Keluarga</span>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900">WhatsApp</span>
              </h4>
              <p class="text-[11px] text-slate-600 mt-0.5">
                Kirim ringkasan tensi, gula, dan kebiasaan sehat hari ini ke anak/pasangan via WhatsApp.
              </p>
            </div>
          </div>
          <button 
            @click="showWhatsAppModal = true"
            class="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <Send class="w-3.5 h-3.5" />
            <span>Kirim Kabar Sehat</span>
          </button>
        </div>

        <!-- Smart Clinical Insights (AI Assistant Tips) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-sky-600" />
              <span>Saran & Pola Tubuhmu Hari Ini</span>
            </h3>
            <span class="text-xs text-slate-400 font-medium">Analisis Medis Otomatis</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div 
              v-for="insight in smartInsights" 
              :key="insight.id"
              class="p-4 rounded-2xl border transition-all flex items-start gap-3 bg-white shadow-xs"
              :class="insight.type === 'warning' 
                ? 'border-rose-200/80 bg-rose-50/20' 
                : insight.type === 'success' 
                  ? 'border-emerald-200/80 bg-emerald-50/20' 
                  : 'border-slate-200/80'"
            >
              <div 
                class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                :class="insight.type === 'warning' 
                  ? 'bg-rose-100 text-rose-700' 
                  : insight.type === 'success' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-sky-100 text-sky-700'"
              >
                <component 
                  :is="insight.type === 'warning' ? AlertCircle : (insight.type === 'success' ? CheckCircle2 : Lightbulb)" 
                  class="w-4 h-4" 
                />
              </div>
              <div class="flex-1">
                <h4 class="text-xs font-bold text-slate-800">{{ insight.title }}</h4>
                <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ insight.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Health Score Overview -->
        <HealthScoreCard :score-data="healthScore" />

        <!-- Today's Activity & Timeline -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-bold text-slate-800 text-base">Catatan Hari Ini</h3>
              <p class="text-xs text-slate-500">Log tensi, glukosa, makanan & aktivitas harian</p>
            </div>
            <div class="flex items-center gap-1.5">
              <button 
                @click="showGlucoseModal = true"
                class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>+ Tes Lab / Tensi</span>
              </button>
              <button 
                @click="openFoodModalWithMeal('lunch')"
                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>+ Makanan</span>
              </button>
            </div>
          </div>

          <!-- List of today logs combined -->
          <div v-if="todayGlucoseLogs.length === 0 && todayFoodLogs.length === 0 && todayActivityLogs.length === 0 && bloodPressureLogs.length === 0" class="text-center py-10 text-slate-400">
            <HeartPulse class="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p class="text-sm font-medium">Belum ada catatan hari ini.</p>
            <p class="text-xs mt-1">Gunakan tombol di atas atau kartu sapaan pagi untuk mulai mencatat.</p>
          </div>

          <div v-else class="space-y-2.5">
            <!-- Glucose logs today -->
            <div 
              v-for="log in todayGlucoseLogs" 
              :key="log.id"
              class="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                  🩸
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-base font-extrabold text-slate-800">{{ log.value }} mg/dL</span>
                    <span 
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      :class="getGlucoseStatus(log.value, log.type).color"
                    >
                      {{ getGlucoseStatus(log.value, log.type).label }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">
                    {{ log.type === 'fasting' ? 'Gula Darah Puasa' : (log.type === 'post_meal' ? '2 Jam Setelah Makan' : 'Gula Darah') }}
                    <span v-if="log.notes">• {{ log.notes }}</span>
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400 font-medium">
                  {{ new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                </span>
                <button 
                  @click="deleteGlucoseLog(log.id)"
                  class="text-slate-300 hover:text-rose-500 text-xs transition"
                  title="Hapus"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Food logs today -->
            <div 
              v-for="flog in todayFoodLogs" 
              :key="flog.id"
              class="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  🥗
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {{ flog.mealType === 'breakfast' ? 'Sarapan' : (flog.mealType === 'lunch' ? 'Makan Siang' : 'Makan Malam') }}
                    </span>
                    <span class="text-xs font-bold text-emerald-700">{{ flog.totalCalories }} kkal</span>
                    <span class="text-xs font-semibold text-amber-700">• {{ flog.totalCarbs }}g karbo</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {{ flog.items.map(i => i.name).join(', ') }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400 font-medium">
                  {{ new Date(flog.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                </span>
                <button 
                  @click="deleteFoodLog(flog.id)"
                  class="text-slate-300 hover:text-rose-500 text-xs transition"
                  title="Hapus"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Activity logs today -->
            <div 
              v-for="act in todayActivityLogs" 
              :key="act.id"
              class="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                  👟
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">{{ act.title }}</h4>
                  <p class="text-[11px] text-slate-500">
                    {{ act.durationMinutes }} menit • {{ act.steps ? `${act.steps} langkah • ` : '' }}~{{ act.caloriesBurned }} kkal
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400 font-medium">
                  {{ new Date(act.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                </span>
                <button 
                  @click="deleteActivityLog(act.id)"
                  class="text-slate-300 hover:text-rose-500 text-xs transition"
                  title="Hapus"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== TAB 2: GRAFIK & ANALITIK ==================== -->
      <section v-else-if="activeTab === 'analytics'" class="space-y-6 animate-fade-in">
        <!-- Metric Switcher in Analytics: Tensi, Glukosa, Asam Urat, Kolesterol -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl text-xs font-bold">
          <button
            @click="analyticsMetric = 'blood_pressure'"
            class="py-2 rounded-xl transition flex items-center justify-center gap-1.5"
            :class="analyticsMetric === 'blood_pressure' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            <span>🫀</span> Tensi Darah
          </button>
          <button
            @click="analyticsMetric = 'glucose'"
            class="py-2 rounded-xl transition flex items-center justify-center gap-1.5"
            :class="analyticsMetric === 'glucose' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            <span>🩸</span> Glukosa
          </button>
          <button
            @click="analyticsMetric = 'uric_acid'"
            class="py-2 rounded-xl transition flex items-center justify-center gap-1.5"
            :class="analyticsMetric === 'uric_acid' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            <span>🥩</span> Asam Urat
          </button>
          <button
            @click="analyticsMetric = 'cholesterol'"
            class="py-2 rounded-xl transition flex items-center justify-center gap-1.5"
            :class="analyticsMetric === 'cholesterol' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            <span>🧪</span> Kolesterol
          </button>
        </div>

        <!-- 1. BLOOD PRESSURE VIEW -->
        <div v-if="analyticsMetric === 'blood_pressure'" class="space-y-4">
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span>Riwayat Tekanan Darah (Tensi)</span>
                </h3>
                <p class="text-xs text-slate-500">Target Normal: &lt; 120 / &lt; 80 mmHg (Standar Kemenkes / AHA)</p>
              </div>
              <button 
                @click="showGlucoseModal = true"
                class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>+ Catat Tensi</span>
              </button>
            </div>

            <div v-if="bloodPressureLogs.length === 0" class="text-center py-10 text-slate-400 text-xs">
              Belum ada riwayat tensi darah. Klik tombol di atas untuk mencatat tensimu.
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="item in bloodPressureLogs" 
                :key="item.id"
                class="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl font-black text-slate-800">{{ item.systolic }} / {{ item.diastolic }} mmHg</span>
                    <span 
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      :class="getBloodPressureStatus(item.systolic, item.diastolic).color"
                    >
                      {{ getBloodPressureStatus(item.systolic, item.diastolic).label }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ item.pulse ? `Nadi: ${item.pulse} bpm • ` : '' }}
                    {{ new Date(item.timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                    <span v-if="item.notes">• {{ item.notes }}</span>
                  </p>
                </div>
                <button @click="deleteBloodPressureLog(item.id)" class="text-slate-300 hover:text-rose-500 transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. GLUCOSE VIEW -->
        <div v-else-if="analyticsMetric === 'glucose'" class="space-y-6">
          <GlucoseChart 
            :logs="glucoseLogs" 
            :tir-percent="timeInRangeStats.inRangePercent" 
          />

          <!-- Time-in-Range (TIR) Analysis -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-slate-800 text-base">Analisis Time-in-Range (TIR)</h3>
                <p class="text-xs text-slate-500">Standar emas konsensus medis diabetes internasional</p>
              </div>
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Target Medis: &gt; 70%
              </span>
            </div>

            <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div 
                class="bg-blue-500 h-full transition-all duration-700" 
                :style="{ width: `${timeInRangeStats.lowPercent}%` }"
              ></div>
              <div 
                class="bg-emerald-500 h-full transition-all duration-700" 
                :style="{ width: `${timeInRangeStats.inRangePercent}%` }"
              ></div>
              <div 
                class="bg-rose-500 h-full transition-all duration-700" 
                :style="{ width: `${timeInRangeStats.highPercent}%` }"
              ></div>
            </div>

            <div class="grid grid-cols-3 gap-3 text-xs pt-1">
              <div class="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                <span class="text-blue-800 font-semibold block">Hipoglikemia (&lt;70)</span>
                <span class="text-base font-extrabold text-blue-900 mt-1 block">{{ timeInRangeStats.lowPercent }}%</span>
              </div>
              <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                <span class="text-emerald-800 font-semibold block">Zona Aman (70-140)</span>
                <span class="text-base font-extrabold text-emerald-900 mt-1 block">{{ timeInRangeStats.inRangePercent }}%</span>
              </div>
              <div class="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                <span class="text-rose-800 font-semibold block">Lonjakan (&gt;140)</span>
                <span class="text-base font-extrabold text-rose-900 mt-1 block">{{ timeInRangeStats.highPercent }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. URIC ACID VIEW -->
        <div v-else-if="analyticsMetric === 'uric_acid'" class="space-y-4">
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span>Riwayat Asam Urat (Uric Acid)</span>
                </h3>
                <p class="text-xs text-slate-500">Batas normal aman: Pria ≤ 7.0 mg/dL • Wanita ≤ 6.0 mg/dL</p>
              </div>
              <button 
                @click="showGlucoseModal = true"
                class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>+ Catat</span>
              </button>
            </div>

            <div v-if="uricAcidLogs.length === 0" class="text-center py-10 text-slate-400 text-xs">
              Belum ada riwayat asam urat. Klik tombol di atas untuk mencatat hasil tes terakhir.
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="item in uricAcidLogs" 
                :key="item.id"
                class="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl font-black text-slate-800">{{ item.value }} mg/dL</span>
                    <span 
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      :class="getUricAcidStatus(item.value).color"
                    >
                      {{ getUricAcidStatus(item.value).label }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ new Date(item.timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                    <span v-if="item.notes">• {{ item.notes }}</span>
                  </p>
                </div>
                <button @click="deleteUricAcidLog(item.id)" class="text-slate-300 hover:text-rose-500 transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. CHOLESTEROL VIEW -->
        <div v-else-if="analyticsMetric === 'cholesterol'" class="space-y-4">
          <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span>Riwayat Kolesterol Total</span>
                </h3>
                <p class="text-xs text-slate-500">Target sehat: &lt; 200 mg/dL • Batas tinggi: 200–239 mg/dL</p>
              </div>
              <button 
                @click="showGlucoseModal = true"
                class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>+ Catat</span>
              </button>
            </div>

            <div v-if="cholesterolLogs.length === 0" class="text-center py-10 text-slate-400 text-xs">
              Belum ada riwayat kolesterol. Klik tombol di atas untuk mencatat hasil tes terakhir.
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="item in cholesterolLogs" 
                :key="item.id"
                class="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xl font-black text-slate-800">{{ item.value }} mg/dL</span>
                    <span 
                      class="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      :class="getCholesterolStatus(item.value).color"
                    >
                      {{ getCholesterolStatus(item.value).label }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ new Date(item.timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                    <span v-if="item.notes">• {{ item.notes }}</span>
                  </p>
                </div>
                <button @click="deleteCholesterolLog(item.id)" class="text-slate-300 hover:text-rose-500 transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Correlation: Food & Walking vs 4 Pillars -->
        <div class="bg-gradient-to-br from-sky-50 to-indigo-50/40 rounded-3xl p-6 border border-sky-100 shadow-xs space-y-3">
          <div class="flex items-center gap-2">
            <Activity class="w-5 h-5 text-sky-700" />
            <h3 class="font-bold text-slate-800 text-base">Korelasi Kebiasaan & 4 Pilar Sehat</h3>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">
            Menjaga hidrasi air putih minimal 8 gelas/hari membantu membuang kelebihan <strong>asam urat</strong>, sementara berjalan kaki santai 15–30 menit setelah makan terbukti klinis meredam lonjakan <strong>gula darah</strong> sekaligus mengendurkan pembuluh darah untuk menjaga kestabilan <strong>tensi darah</strong>.
          </p>
        </div>
      </section>

      <!-- ==================== TAB 3: JURNAL MAKANAN ==================== -->
      <section v-else-if="activeTab === 'food'" class="space-y-6 animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800">Jurnal Makanan & Database Gizi</h2>
            <p class="text-xs text-slate-500 mt-0.5">Panduan Karbohidrat (Gula), Purin (Asam Urat), Lemak (Kolesterol) & Garam (Tensi)</p>
          </div>
          <button 
            @click="openFoodModalWithMeal('lunch')"
            class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus class="w-4 h-4" />
            <span>+ Catat Piring Makan</span>
          </button>
        </div>

        <!-- Food History Today -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 class="font-bold text-slate-800 text-sm">Riwayat Makanan Tercatat</h3>
          <div v-if="foodLogs.length === 0" class="text-center py-8 text-slate-400 text-xs">
            Belum ada makanan yang dicatat. Tap tombol di atas untuk mencatat makananmu.
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="meal in foodLogs" 
              :key="meal.id"
              class="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
            >
              <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {{ meal.mealType === 'breakfast' ? 'Sarapan' : (meal.mealType === 'lunch' ? 'Makan Siang' : (meal.mealType === 'dinner' ? 'Makan Malam' : 'Camilan')) }}
                  </span>
                  <span class="text-xs text-slate-400">• {{ new Date(meal.timestamp).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }) }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-emerald-700">{{ meal.totalCalories }} kkal</span>
                  <span class="text-xs font-bold text-amber-700">{{ meal.totalCarbs }}g karbo</span>
                  <button @click="deleteFoodLog(meal.id)" class="text-slate-300 hover:text-rose-500 transition">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div v-for="(item, i) in meal.items" :key="i" class="flex justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100">
                  <span class="font-medium text-slate-800">{{ item.name }}</span>
                  <span class="text-slate-500">{{ item.portionText }} • {{ item.carbs }}g karbo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Indonesian Nutrition Guide Box -->
        <div class="bg-sky-50/60 rounded-3xl p-5 border border-sky-200/80 space-y-2">
          <h4 class="font-bold text-sky-950 text-sm flex items-center gap-2">
            <span>💡</span> Panduan 4 Pilar Sehat (Kemenkes)
          </h4>
          <p class="text-xs text-slate-700 leading-relaxed">
            • <strong>Tensi:</strong> Kurangi natrium/garam berlebih (seperti bumbu penyedap instan & makanan kalengan).<br />
            • <strong>Gula Darah:</strong> Terapkan urutan makan: serat sayur dulu, protein, baru nasi/karbohidrat terakhir.<br />
            • <strong>Asam Urat:</strong> Batasi emping melinjo, daun melinjo, jeroan, dan kerang. Perbanyak air putih.<br />
            • <strong>Kolesterol:</strong> Hindari gorengan dengan minyak jelantah & santan kental yang dipanaskan berulang.
          </p>
        </div>
      </section>

      <!-- ==================== TAB 4: AKTIVITAS ==================== -->
      <section v-else-if="activeTab === 'activity'" class="space-y-6 animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-extrabold text-slate-800">Aktivitas & Langkah</h2>
            <p class="text-xs text-slate-500 mt-0.5">Gerak fisik sederhana untuk menjaga sensitivitas insulin & kelenturan pembuluh darah</p>
          </div>
          <button 
            @click="showActivityModal = true"
            class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus class="w-4 h-4" />
            <span>+ Catat Aktivitas</span>
          </button>
        </div>

        <!-- Activity History -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="font-bold text-slate-800 text-sm">Riwayat Aktivitas</h3>
          <div v-if="activityLogs.length === 0" class="text-center py-8 text-slate-400 text-xs">
            Belum ada aktivitas tercatat. Jalan santai 10-15 menit setelah makan sangat dianjurkan!
          </div>
          <div v-else class="space-y-2.5">
            <div 
              v-for="act in activityLogs" 
              :key="act.id"
              class="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
                  👟
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">{{ act.title }}</h4>
                  <p class="text-[11px] text-slate-500">
                    {{ act.durationMinutes }} menit • {{ act.steps ? `${act.steps} langkah • ` : '' }}~{{ act.caloriesBurned }} kkal
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400">
                  {{ new Date(act.timestamp).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }) }}
                </span>
                <button @click="deleteActivityLog(act.id)" class="text-slate-300 hover:text-rose-500 transition">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================== TAB 5: AI NUTRISI ASSISTANT ==================== -->
      <section v-else-if="activeTab === 'assistant'" class="space-y-6 animate-fade-in">
        <div class="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg shadow-sky-950/10">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-extrabold text-white">TemanSehat Assistant</h2>
              <p class="text-xs text-sky-100">Saran cerdas terintegrasi untuk Tensi, Glukosa, Asam Urat & Kolesterol</p>
            </div>
          </div>
        </div>

        <!-- Food Swap & Metabolic Warnings -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
            <span>🔄</span> Alternatif Menu Ramah 4 Pilar Sehat (Food Swap)
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-1">
              <span class="text-rose-700 font-bold">Pemicu Glukosa & Kolesterol ⚠️</span>
              <p class="text-slate-700 font-medium">Gorengan Bakwan / Pisang Goreng Tepung</p>
              <div class="pt-2 text-sky-700 font-semibold flex items-center gap-1.5 border-t border-rose-200/50">
                <span>➜ Ganti ke:</span>
                <span>Edamame Rebus / Telur Rebus / Alpukat</span>
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-1">
              <span class="text-rose-700 font-bold">Pemicu Asam Urat Utama ⚠️</span>
              <p class="text-slate-700 font-medium">Emping Melinjo & Gulai Jeroan (Tinggi Purin)</p>
              <div class="pt-2 text-sky-700 font-semibold flex items-center gap-1.5 border-t border-rose-200/50">
                <span>➜ Ganti ke:</span>
                <span>Tahu / Tempe porsi wajar, Ayam dada kukus, Sayur asem</span>
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-1">
              <span class="text-rose-700 font-bold">Pemicu Tekanan Darah (Tensi) ⚠️</span>
              <p class="text-slate-700 font-medium">Mie Instan / Makanan Kaleng (Tinggi Natrium)</p>
              <div class="pt-2 text-sky-700 font-semibold flex items-center gap-1.5 border-t border-rose-200/50">
                <span>➜ Ganti ke:</span>
                <span>Sup Ayam Sayur Kuah Segar dengan rempah bawang</span>
              </div>
            </div>

            <div class="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-1">
              <span class="text-rose-700 font-bold">Pemicu Kolesterol Jahat (LDL) ⚠️</span>
              <p class="text-slate-700 font-medium">Santan kental gulai yang dipanaskan berulang kali</p>
              <div class="pt-2 text-sky-700 font-semibold flex items-center gap-1.5 border-t border-rose-200/50">
                <span>➜ Ganti ke:</span>
                <span>Sup Bening Ikan Kakap / Sayur Asem / Ayam Bakar</span>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ 4 Pilar Sehat -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 class="font-bold text-slate-800 text-base">Tanya Jawab Seputar 4 Pilar Sehat</h3>
          <div class="space-y-2 text-xs">
            <details class="p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <summary class="font-bold text-slate-800">Kapan waktu paling akurat untuk mengukur tensi darah?</summary>
              <p class="text-slate-600 mt-2 leading-relaxed">
                Waktu ideal adalah pagi hari sekitar 30 menit setelah bangun tidur (sebelum sarapan dan minum kopi/teh) atau malam hari sebelum tidur. Duduk tenang bersandar selama 5 menit dengan lengan sejajar ketinggian jantung sebelum menekan tombol tensimeter.
              </p>
            </details>
            <details class="p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <summary class="font-bold text-slate-800">Kenapa gula darah tinggi sering berbarengan dengan kolesterol dan tensi?</summary>
              <p class="text-slate-600 mt-2 leading-relaxed">
                Kondisi ini dikenal sebagai <em>Sindrom Metabolik</em>. Resistensi insulin membuat pembuluh darah menjadi kaku (memicu tensi naik) dan hati memproduksi lebih banyak lemak trigliserida. Jalan kaki teratur 20 menit dan minum cukup air putih membantu mengendalikan keempatnya sekaligus.
              </p>
            </details>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer with Reset & Sample Controls -->
    <footer class="max-w-4xl mx-auto px-4 mt-12 pt-6 pb-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
      <p class="font-medium">TemanSehat • Kenali Tubuhmu • Pahami Kebiasaanmu • Nikmati Sehatmu</p>
      <div class="flex items-center gap-2">
        <button 
          @click="loadDemoData"
          class="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold transition active:scale-95"
          title="Isi contoh data riwayat"
        >
          + Muat Data Contoh
        </button>
        <button 
          @click="resetAllData"
          class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition active:scale-95"
          title="Kosongkan seluruh data"
        >
          Reset Data Kosong
        </button>
      </div>
    </footer>

    <!-- Modals -->
    <QuickGlucoseModal 
      :is-open="showGlucoseModal" 
      @close="showGlucoseModal = false" 
      @save-blood-pressure="onSaveBloodPressure"
      @save-glucose="onSaveGlucose"
      @save-uric-acid="onSaveUricAcid"
      @save-cholesterol="onSaveCholesterol"
    />

    <FoodSearchModal 
      :is-open="showFoodModal"
      :initial-meal-type="currentMealType"
      @close="showFoodModal = false"
      @save="onSaveFood"
    />

    <ActivityModal 
      :is-open="showActivityModal"
      @close="showActivityModal = false"
      @save="onSaveActivity"
    />

    <WhatsAppShareModal 
      :is-open="showWhatsAppModal"
      :latest-glucose="latestGlucose"
      :latest-blood-pressure="latestBloodPressure"
      :latest-uric-acid="latestUricAcid"
      :latest-cholesterol="latestCholesterol"
      :today-habit="todayHabit"
      :total-activity-minutes="todaySummary.totalActivityMinutes"
      :total-carbs="todaySummary.totalCarbs"
      @close="showWhatsAppModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Plus, 
  Sparkles, 
  HeartPulse, 
  Activity, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb,
  Share2,
  Send
} from 'lucide-vue-next'
import { useGlukosaState } from './composables/useGlukosaState'
import type { GlucoseMeasurementType, MealTimeType, ActivityType } from './types'

// Composable State
const {
  todayHabit,
  todaySummary,
  todayGlucoseLogs,
  todayFoodLogs,
  todayActivityLogs,
  glucoseLogs,
  bloodPressureLogs,
  uricAcidLogs,
  cholesterolLogs,
  foodLogs,
  activityLogs,
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
} = useGlukosaState()

// Tab state
const activeTab = ref('today')
const analyticsMetric = ref<'blood_pressure' | 'glucose' | 'uric_acid' | 'cholesterol'>('blood_pressure')

// Modal states
const showGlucoseModal = ref(false)
const showFoodModal = ref(false)
const showActivityModal = ref(false)
const showWhatsAppModal = ref(false)
const currentMealType = ref<MealTimeType>('breakfast')

const openFoodModalWithMeal = (mealType: string) => {
  currentMealType.value = mealType as MealTimeType
  showFoodModal.value = true
}

// Handlers
const onSaveBloodPressure = (data: { systolic: number; diastolic: number; pulse?: number; notes: string }) => {
  addBloodPressureLog(data)
}

const onSaveGlucose = (data: { value: number; type: GlucoseMeasurementType; notes: string }) => {
  addGlucoseLog(data)
}

const onSaveUricAcid = (data: { value: number; notes: string }) => {
  addUricAcidLog(data)
}

const onSaveCholesterol = (data: { value: number; type: 'total'; notes: string }) => {
  addCholesterolLog(data)
}

const onSaveFood = (data: {
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
}) => {
  addFoodLog(data)
}

const onSaveActivity = (data: {
  type: ActivityType
  title: string
  durationMinutes: number
  intensity: 'ringan' | 'sedang' | 'berat'
  steps: number
  caloriesBurned: number
}) => {
  addActivityLog(data)
}
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
