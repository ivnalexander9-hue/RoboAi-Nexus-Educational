import { NewsItem } from '../types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Model Visi-Bahasa-Aksi (VLA) Generasi 2026 Memangkas Waktu Adaptasi Robotik Hingga 85%',
    category: 'Model AI & LLM',
    date: 'Hari Ini, 25 Okt 2026',
    readTime: '4 mnt baca',
    author: 'Dr. Hendra Wijaya',
    organization: 'DeepMind Robotics & Stanford HAI',
    badge: 'Terkini',
    impactLevel: 'Revolusioner',
    summary: 'Riset gabungan mengumumkan arsitektur VLA baru yang memungkinkan lengan robotik memahami perintah spasial kompleks dalam bahasa manusia tanpa perlu pemrograman ulang titik koordinat.',
    content: [
      'Terobosan baru dalam model Vision-Language-Action (VLA) telah berhasil mengatasi tantangan terberat robotika: generalisasi tanpa pelatihan ulang (zero-shot transfer). Jika sebelumnya robot memerlukan ribuan demonstrasi fisik untuk mempelajari tugas sederhana seperti menyortir botol kaca rapuh, model VLA terbaru mampu mengeksekusi instruksi ambigu seperti "rapikan meja makan dan taruh benda pecah belah ke keranjang hijau" dalam percobaan pertama.',
      'Sistem ini menggabungkan encoder visual multimodal 48-lapisan dengan model difusi aksi kontinu (Action Diffusion Policy). Output model bukan lagi sekadar teks atau bounding box, melainkan trajektori kontinu 7-derajat kebebasan (6-DOF pose + 1-DOF gripper state) dengan frekuensi 50 Hz.',
      'Uji coba independen di tiga pabrik perakitan elektronik di Jerman dan Korea Selatan menunjukkan efisiensi adaptasi lini produksi meningkat drastis. Biaya re-tooling dan pemrograman manual yang biasanya memakan waktu berminggu-minggu kini dipersingkat menjadi kurang dari 4 jam.'
    ],
    keyFacts: [
      'Mendukung lebih dari 300 variasi manipulasi benda acak tanpa kalibrasi ulang fisik.',
      'Inferensi end-to-end berjalan pada latensi ultra-rendah 18ms per kontrol siklus.',
      'Mengurangi konsumsi memori model hingga 40% menggunakan kuantisasi FP8 berbasis blok spasial.'
    ],
    tags: ['VLA Model', 'DeepMind', 'Manipulasi Robotik', 'Zero-shot', 'Diffusion Policy'],
    stats: [
      { metric: 'Penurunan Waktu Training', value: '-85%', change: 'vs Model 2024' },
      { metric: 'Akurasi Pengenalan Spasial', value: '98.4%', change: '+12.6%' },
      { metric: 'Latensi Siklus Kontrol', value: '18 ms', change: 'Real-time 50Hz' }
    ]
  },
  {
    id: 'news-2',
    title: 'Transisi Penuh ke Aktuator Elektromekanik Torsi Tinggi: Robot Humanoid Atlas Baru Mengubah Dinamika Gerak',
    category: 'Humanoid & Mekatronika',
    date: 'Kemarin, 24 Okt 2026',
    readTime: '5 mnt baca',
    author: 'Ir. Maya Pratama, M.Sc.',
    organization: 'Boston Dynamics Engineering Lab',
    badge: 'Trending',
    impactLevel: 'Tinggi',
    summary: 'Era hidrolik berakhir. Generasi terbaru robot humanoid beralih sepenuhnya ke aktuator elektrik kustom dengan densitas torsi 220 Nm/kg dan rentang putaran 360 derajat tanpa henti.',
    content: [
      'Selama lebih dari dua dekade, sistem hidrolik dianggap sebagai satu-satunya cara untuk memberikan daya dorong dan kecepatan ledak yang cukup bagi robot humanoid untuk melompat dan menjaga keseimbangan dinamis. Namun kelemahan hidrolik—seperti risiko kebocoran oli, bobot pompa berat, dan efisiensi termal rendah—selalu membatasi adopsi komersial.',
      'Peluncuran varian all-electric membuktikan bahwa motor flux radial tanpa sikat (brushless axial-flux motors) yang dipadukan dengan harmonic drive gearing presisi tinggi mampu melampaui kemampuan hidrolik. Sendi leher, torso, dan pinggul robot kini memiliki kebebasan rotasi kontinu tak terbatas, membuka pola gerak ergonomis yang mustahil dilakukan manusia.',
      'Dalam simulasi beban kerja logistik, robot mampu berbalik arah secara instan tanpa perlu memutar seluruh tubuhnya, sehingga menghemat energi kinetik dan memangkas waktu siklus pengambilan palet hingga 30%.'
    ],
    keyFacts: [
      'Densitas torsi mencapai 220 Nm/kg, 2.4 kali lebih rapat daripada aktuator industri standar.',
      'Sistem pendingin berbasis vapor-chamber internal mencegah pelemahan magnet neodinium saat suhu tinggi.',
      'Ketahanan baterai meningkat dari 45 menit (versi hidrolik) menjadi 3.8 jam dalam operasional kontinu.'
    ],
    tags: ['Atlas', 'Humanoid', 'Aktuator Elektrik', 'Boston Dynamics', 'Kinematika'],
    stats: [
      { metric: 'Densitas Torsi Aktuator', value: '220 Nm/kg', change: 'Rekor Baru' },
      { metric: 'Daya Tahan Baterai', value: '3.8 Jam', change: '+380% vs Hidrolik' },
      { metric: 'Derajat Kebebasan (DOF)', value: '38 DOF', change: 'Full Articulation' }
    ]
  },
  {
    id: 'news-3',
    title: 'Kamera Neuromorfik Event-Based Diintegrasikan ke Sistem Navigasi Drone Berkecepatan 120 km/jam',
    category: 'Komputasi Neuromorfik',
    date: '23 Okt 2026',
    readTime: '4 mnt baca',
    author: 'Prof. Richard Tan',
    organization: 'IEEE Robotics and Automation Society',
    badge: 'Riset Kunci',
    impactLevel: 'Tinggi',
    summary: 'Sensor penglihatan berbasis impuls biologis mampu menangkap perubahan foton dalam hitungan mikrodetik, menyingkirkan motion blur pada manuver otonom ekstrem.',
    content: [
      'Kamera konvensional merekam lingkungan dalam bentuk rangkaian frame gambar lengkap (biasanya 30-120 frame per detik). Ketika drone terbang di antara pepohonan atau dalam ruangan gelap gulita dengan kecepatan tinggi, frame-rate standar mengalami motion blur dan konsumsi bandwidth data melonjak tinggi.',
      'Sensor neuromorfik yang terinspirasi dari retina mata makhluk hidup bekerja secara asinkron: hanya piksel yang mengalami perubahan intensitas cahaya yang mengirimkan sinyal "spike". Pendekatan ini menghasilkan laju respons efektif setara 10.000 frame per detik dengan konsumsi daya hanya sepersekian watt.',
      'Algoritma SLAM neuromorfik yang berjalan pada chip mikro prosesor lokal memungkinkan drone bermanuver menghindari kabel listrik tipis dan puing bergerak dengan margin keamanan 99.8%.'
    ],
    keyFacts: [
      'Rentang dinamis tinggi (High Dynamic Range) melebihi 140 dB, bekerja dari cahaya terik hingga malam gulita.',
      'Mengurangi kebutuhan komputasi visi sebesar 70% karena tidak ada pemrosesan piksel statis redundan.',
      'Waktu reaksi deteksi halangan diukur di angka 1.2 milidetik.'
    ],
    tags: ['Neuromorphic', 'Event Camera', 'Drone Otonom', 'SLAM', 'IEEE'],
    stats: [
      { metric: 'Kecepatan Respons Foton', value: '1.2 ms', change: 'Sub-frame precision' },
      { metric: 'Efisiensi Daya Komputasi', value: '1.4 W', change: '-70% vs GPU' },
      { metric: 'Dynamic Range Sensor', value: '142 dB', change: 'Zero Saturation' }
    ]
  },
  {
    id: 'news-4',
    title: 'Robot Bedah Mikro Otonom Sukses Lakukan Anastomosis Vaskular Pembuluh Darah 0.8 mm',
    category: 'AI Medis & Bio-Robotika',
    date: '22 Okt 2026',
    readTime: '6 mnt baca',
    author: 'dr. Sarah Alamsyah, Sp.B',
    organization: 'Johns Hopkins Medicine & Intuitive Labs',
    badge: 'Eksklusif',
    impactLevel: 'Revolusioner',
    summary: 'Dengan kompensasi tremor sub-mikron dan panduan optik koheren (OCT), robot mikro menyelesaikan jahitan pembuluh darah halus dengan tingkat kebocoran 0%.',
    content: [
      'Penyambungan pembuluh darah mikroskopis (microvascular anastomosis) berdiameter kurang dari 1 milimeter adalah salah satu prosedur bedah paling menuntut ketelitian fisik manusia. Sedikit saja getaran napas atau kelelahan otot ahli bedah dapat merobek dinding endotel pembuluh darah.',
      'Sistem bedah mikro otonom terbaru memanfaatkan model komputasi biomekanik berpasangan dengan Optical Coherence Tomography (OCT) 3D beresolusi 2 mikron. Robot mampu mengidentifikasi tepi pembuluh secara otomatis dan merencanakan penempatan jarum jahitan dengan ketepatan 12 mikron.',
      'Hasil studi preklinis pada 80 model pembuluh darah menunjukkan waktu penjahitan 40% lebih cepat daripada spesialis berpengalaman, dengan patensi vaskular 100% setelah pemantauan 72 jam.'
    ],
    keyFacts: [
      'Kompensasi getaran aktif hingga frekuensi 25 Hz menggunakan aktuator piezoelektrik.',
      'Sistem haptic feedback merekonstruksi sensasi rabaan jaringan lunak ke konsol dokter bedah.',
      'Memenuhi standar keselamatan FDA untuk sistem bedah otonom terpandu pengawasan manusia.'
    ],
    tags: ['Bedah Mikro', 'Robot Medis', 'OCT Imaging', 'Precision Robotics'],
    stats: [
      { metric: 'Diameter Pembuluh Sukses', value: '0.8 mm', change: 'Sub-millimeter' },
      { metric: 'Presisi Penusukan Jarum', value: '±12 µm', change: '10x tangan manusia' },
      { metric: 'Tingkat Keberhasilan Patensi', value: '100%', change: '80 dari 80 uji' }
    ]
  },
  {
    id: 'news-5',
    title: 'Laporan World Economic Forum 2026: Kolaborasi Cobot Manusia-Robot Melonjak 210% di Asia Tenggara',
    category: 'Otomasi Industri',
    date: '21 Okt 2026',
    readTime: '3 mnt baca',
    author: 'Bambang Sudiro',
    organization: 'World Economic Forum (WEF)',
    badge: 'Trending',
    impactLevel: 'Sedang',
    summary: 'Bukan menggusur pekerja, pabrik modern bertransformasi dengan menerapkan robot kolaboratif (cobots) yang dilengkapi sensor keselamatan fusi ultrasonik dan visi 3D.',
    content: [
      'Laporan komprehensif Future of Work dari Forum Ekonomi Dunia (WEF) menyoroti pergeseran dramatis dalam lanskap otomasi industri. Alih-alih robot tertutup di balik sangkar besi keselamatan, kini 68% instalasi robot baru di manufaktur adalah robot kolaboratif (cobots) yang bekerja berdampingan dengan manusia.',
      'Faktor pemicu utama adalah penerapan sensor kulit taktil kapasitif (capacitive e-skin) dan algoritma estimasi intensi gerak manusia berbasis AI. Begitu tangan manusia mendekati lintasan kerja robot, lengan robotik secara halus menurunkan kecepatan atau membelokkan lintasan tanpa menghentikan operasi secara tiba-tiba.',
      'Indonesia dan Vietnam mencatat pertumbuhan tertinggi dalam adopsi cobot untuk sektor perakitan elektronik presisi, pengemasan makanan, dan farmasi.'
    ],
    keyFacts: [
      'Pertumbuhan tahunan industri cobot global mencapai CAGR 32.5%.',
      'Waktu henti operasional akibat alarm keselamatan palsu berkurang 65%.',
      'Pekerja beralih dari pekerjaan repetitif berat ke supervisi kualitas dan optimasi parameter AI.'
    ],
    tags: ['Cobot', 'Industri 4.0', 'WEF', 'Keselamatan Kerja', 'Manufaktur'],
    stats: [
      { metric: 'Pertumbuhan Instalasi', value: '+210%', change: 'YoY ASEAN' },
      { metric: 'Reduksi Kelelahan Kerja', value: '54%', change: 'Ergonomic Index' },
      { metric: 'Efisiensi Lini Perakitan', value: '+42%', change: 'Output per jam' }
    ]
  },
  {
    id: 'news-6',
    title: 'Navigasi Otonom Tanpa GPS (GPS-Denied SLAM) Menembus Gua Bawah Tanah dan Reaktor Nuklir',
    category: 'Sistem Otonom & Navigasi',
    date: '20 Okt 2026',
    readTime: '5 mnt baca',
    author: 'Prof. David Vance',
    organization: 'DARPA Autonomous Exploration Team',
    badge: 'Riset Kunci',
    impactLevel: 'Tinggi',
    summary: 'Kombinasi sensor fusi LiDAR 3D, sensor inersia taktis (Tactical IMU), dan peta probabilitas sub-voxel memungkinkan eksplorasi lingkungan ekstrem yang terisolasi total.',
    content: [
      'Dalam lingkungan terisolasi seperti terowongan tambang runtuh, gua bawah tanah, atau interior bejana reaktor nuklir, sinyal GPS sama sekali tidak tersedia dan pencahayaan sangat minim. Algoritma SLAM klasik sering mengalami kegagalan "drift" akumulatif ketika berjalan lebih dari beberapa kilometer.',
      'Tim gabungan DARPA memperkenalkan arsitektur SLAM multi-hierarki dengan loop-closure probabilistik tingkat lanjut. Robot berkaki empat (quadruped) yang dikirim ke jaringan lorong bawah tanah sejauh 4.2 km berhasil memetakan geometri 3D dengan deviasi kurang dari 3 sentimeter.',
      'Teknologi ini kini juga diadaptasi untuk misi eksplorasi kawah bulan berbayang abadi (permanently shadowed lunar craters) dalam program Artemis.'
    ],
    keyFacts: [
      'Drift akumulasi posisi ditekan hingga 0.08% dari total jarak tempuh tanpa referensi satelit.',
      'Peta point-cloud voxel yang dihasilkan dapat dikompresi langsung untuk transmisi bandwidth rendah.',
      'Tahan terhadap guncangan getaran mekanis dan debu pekat.'
    ],
    tags: ['GPS-Denied', 'LiDAR SLAM', 'DARPA', 'Quadruped Robot', 'Space Robotics'],
    stats: [
      { metric: 'Akurasi Peta 3D', value: '< 3 cm', change: 'Pada jarak 4.2 km' },
      { metric: 'Drift Position Error', value: '0.08%', change: 'Threshold industri' },
      { metric: 'Berat Sensor Pod', value: '620 gram', change: 'Ultra-ringan' }
    ]
  }
];
