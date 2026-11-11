export interface AffiliateProduct {
  id: string
  name: string
  subtitle: string
  category: 'Tensi' | 'Gula Darah' | 'Asam Urat & Kolesterol' | 'Nutrisi'
  badge?: string
  priceEstimation: string
  rating: string
  soldCount: string
  features: string[]
  affiliateUrl: string
  highlight?: boolean
  imageFallbackIcon: string
}

export const recommendedHealthProducts: AffiliateProduct[] = [
  {
    id: 'omron-tensimeter',
    name: 'Tensimeter Digital Omron Lengan Atas (Resmi Kemenkes)',
    subtitle: 'Standar Akurasi Rumah Sakit • IntelliSense Technology',
    category: 'Tensi',
    badge: 'Paling Direkomendasikan',
    priceEstimation: 'Rp 380rb - 550rb',
    rating: '4.9',
    soldCount: '10rb+ terjual',
    features: [
      'Akurasi teruji klinis berizin edar Kemenkes RI',
      'Manset nyaman (tidak sakit saat memompa)',
      'Deteksi detak jantung tidak beraturan (aritmia)',
      'Memori otomatis hingga 30-60 data pengukuran'
    ],
    affiliateUrl: 'https://s.shopee.co.id/5fqEWK03sx',
    highlight: true,
    imageFallbackIcon: 'HeartPulse'
  },
  {
    id: 'alat-3in1-gcu',
    name: 'Alat Cek 3-in-1 (Gula Darah, Asam Urat, Kolesterol)',
    subtitle: '1 Alat Multi-Fungsi • Praktis untuk Pemantauan Keluarga',
    category: 'Asam Urat & Kolesterol',
    badge: '3 Pilar Sekaligus',
    priceEstimation: 'Rp 230rb - 320rb',
    rating: '4.8',
    soldCount: '5rb+ terjual',
    features: [
      'Bisa mengukur Gula Darah, Asam Urat & Kolesterol',
      'Hasil cepat dalam 10 - 20 detik',
      'Sudah termasuk jarum lancet & tas penyimpanan',
      'Hemat tanpa perlu bolak-balik ke lab klinik'
    ],
    affiliateUrl: 'https://s.shopee.co.id/5fqEWK03sx', // Bisa diganti link khusus 3in1 kapan saja
    highlight: false,
    imageFallbackIcon: 'Activity'
  },
  {
    id: 'strip-refill-glukosa',
    name: 'Strip Uji Gula Darah & Jarum Lancet Steril',
    subtitle: 'Isi Ulang Resmi • Kemasan Higienis Segel Pabrik',
    category: 'Gula Darah',
    badge: 'Kebutuhan Rutin',
    priceEstimation: 'Rp 85rb - 130rb',
    rating: '4.9',
    soldCount: '15rb+ terjual',
    features: [
      'Strip resmi dengan akurasi terkalibrasi',
      'Jarum lancet tajam tanpa rasa sakit berlebih',
      'Masa kedaluwarsa panjang (pasti baru)'
    ],
    affiliateUrl: 'https://s.shopee.co.id/5fqEWK03sx',
    highlight: false,
    imageFallbackIcon: 'Flame'
  },
  {
    id: 'stevia-cair-natural',
    name: 'Pemanis Alami Daun Stevia Tetes (0 Kalori)',
    subtitle: 'Pengganti Gula Pasir • Ramah Gula Darah & Bebas Kalori',
    category: 'Nutrisi',
    badge: 'Ramah Diabetes',
    priceEstimation: 'Rp 35rb - 65rb',
    rating: '4.9',
    soldCount: '20rb+ terjual',
    features: [
      '100% Ekstrak daun Stevia alami',
      '0 Kalori, tidak menaikkan kadar gula darah',
      'Cukup 1-2 tetes untuk rasa manis teh/kopi',
      'Tanpa rasa pahit/aftertaste kimia'
    ],
    affiliateUrl: 'https://s.shopee.co.id/5fqEWK03sx',
    highlight: false,
    imageFallbackIcon: 'Leaf'
  }
]
