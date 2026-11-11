<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-hidden border border-slate-100 flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-100 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Share2 class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-bold text-slate-800 text-base">Kirim Kabar Sehat ke Keluarga</h3>
            <p class="text-xs text-slate-500">Pilih penerima & kirim kabar via WhatsApp</p>
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
      <div class="p-6 space-y-4 overflow-y-auto flex-1">
        <!-- Family Contacts Selector -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pilih Kontak Keluarga:
            </label>
            <button 
              type="button"
              @click="showAddContactForm = !showAddContactForm"
              class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>{{ showAddContactForm ? '✕ Batal' : '+ Tambah Kontak' }}</span>
            </button>
          </div>

          <!-- Add Contact Inline Form -->
          <div v-if="showAddContactForm" class="p-3 mb-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2.5 animate-fade-in">
            <p class="text-xs font-bold text-emerald-950">Simpan Kontak Baru:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input 
                v-model="newContactName" 
                type="text" 
                placeholder="Nama (misal: Anak Sulung / Budi)"
                class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <input 
                v-model="newContactPhone" 
                type="tel" 
                placeholder="Nomor WA (misal: 08123456789)"
                class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div class="flex justify-end gap-2 pt-1">
              <button 
                type="button"
                @click="showAddContactForm = false"
                class="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button 
                type="button"
                @click="saveNewContact"
                :disabled="!newContactName || !newContactPhone"
                class="px-3.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition shadow-xs"
              >
                Simpan Kontak
              </button>
            </div>
          </div>

          <!-- Contact Chips -->
          <div class="flex flex-wrap gap-2">
            <!-- Default Option: Bebas / Grup WA -->
            <button
              type="button"
              @click="selectedContactId = 'custom'"
              class="px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5"
              :class="selectedContactId === 'custom' 
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              <span>👨‍👩‍👧‍👦</span>
              <span>Pilih Bebas / Grup WA</span>
            </button>

            <!-- Saved Contacts -->
            <div 
              v-for="contact in savedContacts" 
              :key="contact.id"
              class="inline-flex items-center rounded-xl border transition overflow-hidden text-xs font-semibold"
              :class="selectedContactId === contact.id 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
            >
              <button 
                type="button"
                @click="selectedContactId = contact.id"
                class="px-3 py-2 flex items-center gap-1.5"
              >
                <span>❤️</span>
                <span>{{ contact.name }}</span>
                <span class="text-[10px] opacity-75">({{ contact.phone }})</span>
              </button>
              <button 
                type="button"
                @click.stop="deleteContact(contact.id)"
                class="px-2 py-2 hover:bg-red-500/20 transition text-slate-400 hover:text-red-600"
                :class="selectedContactId === contact.id ? 'text-white/70 hover:text-white' : ''"
                title="Hapus kontak ini"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Custom Phone input if selectedContactId is 'custom' -->
        <div v-if="selectedContactId === 'custom'">
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
            Ketik Nomor WA Lain (Opsional):
          </label>
          <input 
            v-model="customPhone" 
            type="tel" 
            placeholder="Misal: 08123456789 (kosongkan jika ingin pilih langsung di obrolan WA)"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
          />
        </div>

        <!-- Target Recipient Notice -->
        <div class="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
          <span>🎯</span>
          <span>
            Penerima: 
            <strong class="text-slate-800">
              {{ activeRecipientLabel }}
            </strong>
          </span>
        </div>

        <!-- Message Preview Box -->
        <div>
          <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Pratinjau Pesan yang Akan Dikirim</span>
            <span class="text-emerald-700 text-[11px] font-semibold">Tersusun Rapi ✨</span>
          </label>
          <div class="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/70 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {{ formattedMessage }}
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
        <button 
          @click="copyMessageToClipboard"
          class="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <Copy class="w-3.5 h-3.5" />
          <span>{{ copied ? 'Tersalin! ✓' : 'Salin Teks' }}</span>
        </button>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button 
            @click="$emit('close')"
            class="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-200/60 rounded-xl transition"
          >
            Tutup
          </button>
          <button 
            @click="sendViaWhatsApp"
            class="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <Send class="w-3.5 h-3.5" />
            <span>Kirim ke {{ activeRecipientShortName }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { Share2, X, Send, Copy } from 'lucide-vue-next'
import type { 
  GlucoseLog, 
  BloodPressureLog, 
  UricAcidLog, 
  CholesterolLog, 
  DailyHabit 
} from '../types'

interface FamilyContact {
  id: string
  name: string
  phone: string
}

const props = defineProps<{
  isOpen: boolean
  latestGlucose: GlucoseLog | null
  latestBloodPressure: BloodPressureLog | null
  latestUricAcid: UricAcidLog | null
  latestCholesterol: CholesterolLog | null
  todayHabit: DailyHabit
  totalActivityMinutes: number
  totalCarbs: number
}>()

defineEmits<{
  close: []
}>()

// Persistent Family Contacts Storage in localStorage
const savedContacts = useStorage<FamilyContact[]>('temansehat_family_contacts_v1', [
  { id: 'c-1', name: 'Anak Pertama', phone: '08123456789' }
])

const selectedContactId = ref<string>('c-1')
const customPhone = ref('')
const showAddContactForm = ref(false)
const newContactName = ref('')
const newContactPhone = ref('')
const copied = ref(false)

const activeContact = computed(() => {
  return savedContacts.value.find(c => c.id === selectedContactId.value)
})

const activeRecipientLabel = computed(() => {
  if (selectedContactId.value === 'custom') {
    return customPhone.value ? `Nomor Khusus (${customPhone.value})` : 'Pilih Bebas dari Daftar Obrolan WhatsApp'
  }
  return activeContact.value ? `${activeContact.value.name} (${activeContact.value.phone})` : 'Kontak WhatsApp'
})

const activeRecipientShortName = computed(() => {
  if (selectedContactId.value === 'custom') {
    return 'WhatsApp'
  }
  return activeContact.value ? activeContact.value.name : 'WhatsApp'
})

const saveNewContact = () => {
  if (!newContactName.value || !newContactPhone.value) return
  const newId = 'c-' + Date.now()
  savedContacts.value.push({
    id: newId,
    name: newContactName.value.trim(),
    phone: newContactPhone.value.trim()
  })
  selectedContactId.value = newId
  newContactName.value = ''
  newContactPhone.value = ''
  showAddContactForm.value = false
}

const deleteContact = (id: string) => {
  savedContacts.value = savedContacts.value.filter(c => c.id !== id)
  if (selectedContactId.value === id) {
    selectedContactId.value = savedContacts.value.length > 0 ? savedContacts.value[0].id : 'custom'
  }
}

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date())
})

const formattedMessage = computed(() => {
  let recipientGreeting = 'Halo!'
  if (activeContact.value) {
    recipientGreeting = `Halo ${activeContact.value.name}!`
  }

  let lines: string[] = []
  lines.push(`🌿 *Kabar Sehat dari TemanSehat* 🌿`)
  lines.push(`📅 Hari: ${formattedDate.value}`)
  lines.push(``)
  lines.push(`${recipientGreeting} Ini ringkasan kondisi kesehatan hari ini:`)
  lines.push(``)
  lines.push(`*Hasil Pemeriksaan 4 Pilar:*`)

  // 1. Tensi
  if (props.latestBloodPressure) {
    const { systolic, diastolic, pulse } = props.latestBloodPressure
    const statusText = systolic < 120 && diastolic < 80 ? 'Normal / Optimal' : (systolic <= 129 ? 'Meningkat' : 'Perlu Dijaga')
    lines.push(`🫀 Tensi Darah: *${systolic}/${diastolic} mmHg* (${statusText})${pulse ? ` • Nadi: ${pulse} bpm` : ''}`)
  } else {
    lines.push(`🫀 Tensi Darah: Belum ada catatan`)
  }

  // 2. Gula Darah
  if (props.latestGlucose) {
    const typeLabel = props.latestGlucose.type === 'fasting' ? 'Puasa' : '2 Jam Habis Makan'
    const statusText = props.latestGlucose.value <= 140 ? 'Normal / Aman' : 'Sedikit Naik'
    lines.push(`🩸 Gula Darah: *${props.latestGlucose.value} mg/dL* (${typeLabel} • ${statusText})`)
  } else {
    lines.push(`🩸 Gula Darah: Belum ada catatan`)
  }

  // 3. Asam Urat
  if (props.latestUricAcid) {
    const statusText = props.latestUricAcid.value <= 7.0 ? 'Normal' : 'Tinggi'
    lines.push(`🥩 Asam Urat: *${props.latestUricAcid.value} mg/dL* (${statusText})`)
  }

  // 4. Kolesterol
  if (props.latestCholesterol) {
    const statusText = props.latestCholesterol.value < 200 ? 'Bagus' : 'Batas Waspada'
    lines.push(`🧪 Kolesterol Total: *${props.latestCholesterol.value} mg/dL* (${statusText})`)
  }

  lines.push(``)
  lines.push(`*Kebiasaan Baik Hari Ini:*`)
  lines.push(`💧 Minum Air: ${props.todayHabit.waterGlasses} dari ${props.todayHabit.waterTarget} Gelas`)
  if (props.totalActivityMinutes > 0) {
    lines.push(`👟 Bergerak: ${props.totalActivityMinutes} Menit Jalan Santai / Olahraga`)
  }
  if (props.totalCarbs > 0) {
    lines.push(`🥗 Asupan Karbo: ~${props.totalCarbs}g terkontrol`)
  }

  lines.push(``)
  lines.push(`Alhamdulillah kondisi hari ini terpantau sehat dan bugar! ✨`)
  lines.push(`_Dicatat mandiri via TemanSehat_`)

  return lines.join('\n')
})

const copyMessageToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedMessage.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (e) {
    console.error('Failed to copy', e)
  }
}

const sendViaWhatsApp = () => {
  const textEncoded = encodeURIComponent(formattedMessage.value)
  let rawPhone = ''

  if (selectedContactId.value === 'custom') {
    rawPhone = customPhone.value
  } else if (activeContact.value) {
    rawPhone = activeContact.value.phone
  }

  let cleanPhone = rawPhone.replace(/\D/g, '')
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1)
  }

  const waUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${textEncoded}`
    : `https://api.whatsapp.com/send?text=${textEncoded}`

  window.open(waUrl, '_blank')
}
</script>
