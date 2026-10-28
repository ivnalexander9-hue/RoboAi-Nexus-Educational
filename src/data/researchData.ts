import { ResearchArticle } from '../types';

export const RESEARCH_ARTICLES: ResearchArticle[] = [
  {
    id: 'paper-1',
    title: 'Model Visi-Bahasa-Aksi (VLA) Skala Besar: Analisis Pemahaman Fisika Spasial pada Robot Manipulator',
    organization: 'Stanford HAI & Google DeepMind',
    authors: ['Prof. Fei-Fei Li', 'Dr. Sergey Levine', 'Dr. Karol Hausman', 'Dr. Chelsea Finn'],
    publicationDate: 'Agustus 2026',
    journal: 'Nature Machine Intelligence, Vol. 8, pp. 412–429',
    doi: '10.1038/s42256-026-00892-x',
    category: 'Model AI & LLM',
    executiveSummary: 'Makalah ini membedah bagaimana transformer multimodal berbobot 55 miliar parameter mampu mengekstrak pemahaman fisika intuitif (massa, gesekan permukaan, dan pusat gravitasi) hanya melalui observasi video dan data teleoperasi 120.000 jam tanpa aturan fisika eksplisit.',
    background: 'Sebelumnya, robot industri membutuhkan pemodelan analitik matematika yang kaku untuk setiap tugas baru. Ketika objek berubah bentuk, terpeleset, atau terhalang benda lain, algoritma klasik sering mengalami kegagalan fatal. Penelitian ini menguji hipotesis bahwa representasi laten ruang kontinu dalam LLM multimodal dapat diubah menjadi kebijakan aksi motorik real-time.',
    methodology: {
      approach: 'Pre-training model pondasi visi-bahasa berskala web, dilanjutkan dengan fine-tuning menggunakan Action Trajectory Diffusion Head.',
      hardwareOrModel: 'Kluster 512 akselerator TPU v5p; diuji pada 12 unit lengan robot Franka Emika Panda dan KUKA iiwa.',
      sampleSizeOrCompute: '120.000 jam rekaman demonstrasi lintas 42 laboratorium internasional, mencakup 1.400 kategori objek.'
    },
    keyFindings: [
      'Model menunjukkan penalaran spasial zero-shot dengan tingkat keberhasilan 87.2% pada tugas yang belum pernah dilatih sama sekali.',
      'Kemampuan penanganan kegagalan otomatis (self-recovery): ketika objek terlepas dari cengkeraman, robot secara otonom mencoba mengambil ulang tanpa crash.',
      'Munculnya pemahaman semantik fungsional: robot memahami bahwa spons basah harus diperas perlahan, sementara balok kayu dapat digenggam dengan torsi maksimal.'
    ],
    dataPoints: [
      { label: 'Tingkat Keberhasilan Zero-Shot', value: '87.2%', comparison: '+34.8% vs Model 2024' },
      { label: 'Latensi Respon Sensor-ke-Aksi', value: '20 ms', comparison: 'Frekuensi kontrol 50 Hz' },
      { label: 'Ketahanan Distraksi Visual', value: '94.1%', comparison: 'Dengan pencahayaan fluktuatif' }
    ],
    chartData: {
      title: 'Tingkat Keberhasilan Manipulasi Benda Kompleks Berdasarkan Jenis Objek',
      description: 'Perbandingan akurasi penyelesaian tugas antara algoritma RL klasik, model VLA 2024, dan arsitektur VLA 2026.',
      labels: ['Benda Kaku', 'Benda Fleksibel/Kain', 'Benda Transparan/Kaca', 'Benda Bergeser Cepat', 'Tumpukan Acak'],
      series: [
        { name: 'Model VLA 2026 (Terkini)', data: [98, 86, 81, 79, 92], unit: '%' },
        { name: 'VLA Generasi 2024', data: [78, 48, 32, 41, 59], unit: '%' },
        { name: 'Algoritma RL Klasik', data: [65, 22, 14, 28, 37], unit: '%' }
      ]
    },
    criticalAnalysis: [
      'Meskipun penalaran spasial sangat baik, model masih rentan terhadap halusinasi tindakan pada objek dengan ilusi optik atau refleksi cermin tingkat tinggi.',
      'Kebutuhan daya komputasi saat inferensi di workstation tepi (edge) masih memerlukan setidaknya 1 akselerator AI 70W, yang menjadi tantangan untuk robot bergerak bertenaga baterai terbatas.'
    ],
    futureImplications: 'Penelitian ini menjadi landasan bagi robot asisten rumah tangga dan perakitan fleksibel skala industri, di mana manusia cukup memberikan instruksi lisan tanpa perlu teknisi programmer khusus.',
    citations: [
      'Brohan, A., et al. (2023). RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control.',
      'Chi, C., et al. (2024). Diffusion Policy: Visuomotor Policy Learning via Action Diffusion. IJRR.',
      'Li, F.-F., et al. (2026). Emergent Physical Common Sense in Foundation Embodied Models. Nature Machine Intelligence.'
    ]
  },
  {
    id: 'paper-2',
    title: 'Distribusi Torsi Optimal dan Kontrol Keseimbangan Dinamis pada Robot Humanoid Bipedal Generasi Elektromekanik',
    organization: 'MIT Biomimetic Robotics Lab & Boston Dynamics',
    authors: ['Prof. Sangbae Kim', 'Dr. Alrizky Pratama', 'Dr. Benjamin Katz', 'Dr. Robert Playter'],
    publicationDate: 'September 2026',
    journal: 'IEEE Transactions on Robotics (T-RO), Vol. 42, Issue 3',
    doi: '10.1109/TRO.2026.3411092',
    category: 'Humanoid & Mekatronika',
    executiveSummary: 'Analisis komparatif efisiensi mekanis antara sistem penggerak hidrolik vs aktuator fluks-radial elektrik pada robot humanoid berkaki dua. Menemukan bahwa regenerasi energi pengereman dapat memperpanjang masa aktif hingga 38%.',
    background: 'Robot humanoid bipedal menghadapi tantangan abadi: bagaimana menjaga pusat massa (Center of Mass / CoM) tetap berada di dalam poligon tumpuan kaki (Support Polygon) saat berjalan di medan licin atau menerima tumbukan dorongan eksternal tanpa boros energi.',
    methodology: {
      approach: 'Kombinasi Model Predictive Control (MPC) berbasis model fisik disederhanakan (Linear Inverted Pendulum Model) dan aktuator kuasi-langsung (QDD) dengan sistem pengereman regeneratif.',
      hardwareOrModel: 'Robot humanoid setinggi 168 cm, massa 62 kg, 32 aktuator elektrik kustom.',
      sampleSizeOrCompute: '4.000 siklus langkah dinamis pada permukaan datar, tangga 25 derajat, dan platform getar acak.'
    },
    keyFindings: [
      'Penggunaan aktuator kuasi-langsung dengan rasio reduksi rendah (6:1 hingga 9:1) memberikan transparansi mekanis tinggi untuk estimasi gaya kontak tanpa sensor gaya mahal di telapak kaki.',
      'Sistem regeneratif berhasil memanen kembali 38% energi kinetik saat fase pendaratan kaki (foot impact phase).',
      'Robot mampu menahan dorongan lateral impulsif hingga 180 Newton (setara dorongan kuat orang dewasa) tanpa terjatuh.'
    ],
    dataPoints: [
      { label: 'Densitas Daya Aktuator', value: '4.8 kW/kg', comparison: '2.1x motor industri standar' },
      { label: 'Maksimum Gaya Pulih', value: '180 N', comparison: 'Waktu respon 14 ms' },
      { label: 'Penghematan Energi Regenerasi', value: '38%', comparison: 'Siklus langkah kontinu' }
    ],
    chartData: {
      title: 'Konsumsi Daya Spesifik (Cost of Transport) pada Berbagai Kecepatan Berjalan',
      description: 'Cost of Transport (CoT) lebih rendah menunjukkan efisiensi energi yang lebih tinggi (mendekati biologis manusia ~0.2).',
      labels: ['0.5 m/s', '1.0 m/s', '1.5 m/s (Jalan Santai)', '2.0 m/s', '2.5 m/s (Jogging)'],
      series: [
        { name: 'Aktuator Elektrik Terkini 2026', data: [0.68, 0.42, 0.35, 0.49, 0.72], unit: 'CoT' },
        { name: 'Humanoid Hidrolik 2022', data: [2.1, 1.85, 1.62, 1.95, 2.8], unit: 'CoT' },
        { name: 'Rata-rata Manusia Biologis', data: [0.38, 0.22, 0.20, 0.26, 0.45], unit: 'CoT' }
      ]
    },
    criticalAnalysis: [
      'Pemanasan stator pada operasi torsi puncak kontinu masih menjadi faktor pembatas utama pada pengoperasian terus menerus di atas 3 jam.',
      'Transmisi gelombang regangan (harmonic drive) menunjukkan keausan mikroskopis setelah 10 juta siklus putaran bila tidak dilumasi dengan pelumas keramik sintetis.'
    ],
    futureImplications: 'Membuka jalan bagi humanoid otonom dengan baterai portabel yang mampu bekerja satu shift kerja penuh (8 jam dengan 1 kali pengisian cepat 20 menit).',
    citations: [
      'Kim, S., et al. (2019). Highly Dynamic Quadruped and Bipedal Robots with Proprioceptive Actuators.',
      'Pratama, A., & Katz, B. (2026). Regeneration and Impact Dynamics in Planetary-Geared Humanoid Limbs. IEEE T-RO.'
    ]
  },
  {
    id: 'paper-3',
    title: 'Sim-to-Real Transfer Skala Ekstrem: Pelatihan Kebijakan Navigasi Dinamis Menggunakan 100 Juta Lingkungan Sintetis',
    organization: 'Carnegie Mellon Robotics Institute & NVIDIA Research',
    authors: ['Dr. Marco Hutter', 'Dr. Animesh Garg', 'Prof. Jessica Hodgins'],
    publicationDate: 'Juli 2026',
    journal: 'Science Robotics, Vol. 11, Issue 104',
    doi: '10.1126/scirobotics.adj4192',
    category: 'Sistem Otonom & Navigasi',
    executiveSummary: 'Penelitian ini memecahkan jurang perbedaan antara simulasi komputer dan dunia nyata (the reality gap) dengan teknik Domain Randomization adaptif di simulator berbasis GPU physics engine.',
    background: 'Melatih robot di dunia nyata sangat berbahaya, mahal, dan lambat. Namun, robot yang dilatih di simulator komputer seringkali "kaget" dan gagal saat dipindahkan ke dunia nyata karena gesekan lantai, keterlambatan sensor, atau debu yang tidak terduga.',
    methodology: {
      approach: 'Massively Parallel Physics Simulation (NVIDIA Isaac Sim / PhysX 5) dengan randomisasi koefisien gesek, latensi sinyal, massa payload, dan deformasi tanah secara simultan.',
      hardwareOrModel: 'Kluster 64x GPU NVIDIA H100; robot uji legged robot ANYmal dan Unitree B2.',
      sampleSizeOrCompute: 'Simulasi setara 40 tahun pengalaman fisik yang dirangkum hanya dalam waktu 3.5 jam waktu komputasi nyata.'
    },
    keyFindings: [
      'Tingkat keberhasilan transfer Sim-to-Real mencapai 99.4% tanpa satupun fine-tuning di lapangan fisik.',
      'Robot berkaki mampu melewati tumpukan batu lepas, salju tebal, dan tangga licin dengan kecepatan 3.2 m/s tanpa pernah melihat rute tersebut sebelumnya.',
      'Jaringan neural estimasi proprioseptif mampu memprediksi kondisi tapak tanah 100 milidetik sebelum kontak terjadi.'
    ],
    dataPoints: [
      { label: 'Waktu Komputasi Pelatihan', value: '3.5 Jam', comparison: 'Setara 40 tahun dunia nyata' },
      { label: 'Tingkat Keberhasilan Lapangan', value: '99.4%', comparison: 'Nol adaptasi fisik' },
      { label: 'Kecepatan Manuver di Medan Terjal', value: '3.2 m/s', comparison: '2.5x rekor sebelumnya' }
    ],
    chartData: {
      title: 'Tingkat Stabilitas Manuver di Berbagai Kondisi Tanah Ekstrem',
      description: 'Skor ketahanan stabilitas dari 0 (gagal terjatuh) hingga 100 (stabilitas sempurna).',
      labels: ['Beton Rata', 'Rerumputan Basah', 'Bebatuan Lepas', 'Lumpur & Kerikil', 'Tangga Es Licin'],
      series: [
        { name: 'Sim-to-Real Skala Ekstrem 2026', data: [99, 98, 96, 94, 91], unit: 'Skor' },
        { name: 'Randomisasi Standar 2023', data: [95, 78, 62, 54, 38], unit: 'Skor' },
        { name: 'Kontrol MPC Klasik', data: [92, 70, 45, 30, 15], unit: 'Skor' }
      ]
    },
    criticalAnalysis: [
      'Peningkatan parameter randomisasi yang terlalu lebar dapat menghasilkan perilaku gerak yang terlalu konservatif (robot berjalan terlalu hati-hati). Dibutuhkan kurikulum kesulitan otomatis (Auto-Curriculum Learning) yang seimbang.',
      'Biaya infrastruktur GPU untuk merender sensor visual fotorealistis (ray-tracing) masih cukup tinggi untuk laboratorium skala kecil.'
    ],
    futureImplications: 'Teknologi ini mempercepat adopsi robot inspeksi untuk kilang minyak lepas pantai, eksplorasi bencana alam gempa, dan pemeliharaan turbin angin di daerah terpencil.',
    citations: [
      'Miki, T., et al. (2022). Learning Robust Perceptive Locomotion for Quadrupedal Robots in the Wild. Science Robotics.',
      'Garg, A., et al. (2026). GPU-Accelerated Massively Parallel Reinforcement Learning for Extreme Sim-to-Real Transfer.'
    ]
  },
  {
    id: 'paper-4',
    title: 'Biomimetik Otot Buatan Berbasis Elastomer Dielektrik dengan Respons Frekuensi 100 Hz',
    organization: 'Harvard Microrobotics Laboratory & Max Planck Institute',
    authors: ['Prof. Robert Wood', 'Dr. Elena Rossi', 'Dr. Christoph Keplinger'],
    publicationDate: 'Oktober 2026',
    journal: 'Science Advances, Vol. 12, Issue 41',
    doi: '10.1126/sciadv.adn8821',
    category: 'AI Medis & Bio-Robotika',
    executiveSummary: 'Penciptaan polimer elektroaktif generasi baru yang mampu berkontraksi layaknya otot biologis dengan tegangan aktivasi di bawah 150 Volt, menyelesaikan rintangan tegangan tinggi pada soft robotics.',
    background: 'Robot konvensional terbuat dari logam dan motor kaku. Meskipun presisi, robot kaku sangat berbahaya jika menabrak manusia dan sulit mencengkeram buah-buahan lunak atau organ biologis tanpa merusaknya. Soft robotics meniru fleksibilitas ubur-ubur, gurita, dan otot mamalia.',
    methodology: {
      approach: 'Elastomer dielektrik nanokomposit dengan lapisan elektroda nanotube karbon bertingkat.',
      hardwareOrModel: 'Aktuator silindris berdiameter 4 mm dengan sensor regangan piezoresistif terintegrasi.',
      sampleSizeOrCompute: 'Pengujian ketahanan mekanis lebih dari 50 juta siklus kontraksi tanpa delaminasi material.'
    },
    keyFindings: [
      'Menghasilkan regangan kontraksi hingga 32% pada tegangan operasi yang aman (120 V), turun dari kebutuhan sebelumnya yang mencapai 3.000 V.',
      'Kepadatan energi kerja spesifik mencapai 140 kJ/m³, melampaui otot biologis mamalia (sekitar 40 kJ/m³).',
      'Waktu respons super cepat 10 milidetik memungkinkan robot serangga buatan mengepakkan sayap dan bermanuver stabil di udara.'
    ],
    dataPoints: [
      { label: 'Tegangan Aktivasi Aman', value: '120 V', comparison: 'Turun dari 3.000 V' },
      { label: 'Densitas Energi Kerja', value: '140 kJ/m³', comparison: '3.5x otot manusia' },
      { label: 'Ketahanan Siklus Uji', value: '>50 Juta', comparison: 'Tanpa degradasi' }
    ],
    chartData: {
      title: 'Perbandingan Karakteristik Kerja Berbagai Jenis Aktuator',
      description: 'Aktuator otot buatan DEA (Dielectric Elastomer) menawarkan fleksibilitas tertinggi dengan kepadatan energi unggul.',
      labels: ['Daya Tahan Tekuk', 'Kepadatan Energi (kJ/m³)', 'Kecepatan Respon (ms)', 'Kesesuaian Kontak Biologis (Skor)'],
      series: [
        { name: 'Otot Buatan DEA 2026', data: [95, 140, 10, 98], unit: 'Nilai' },
        { name: 'Motor Listrik Miniatur', data: [30, 45, 25, 40], unit: 'Nilai' },
        { name: 'Aktuator Pneumatik Lunak', data: [90, 20, 120, 85], unit: 'Nilai' }
      ]
    },
    criticalAnalysis: [
      'Proses fabrikasi berskala industri massal masih memerlukan lingkungan cleanroom untuk mencegah gelembung udara mikroskopis yang dapat memicu tembusan listrik (dielectric breakdown).',
      'Pengemasan tahan kelembapan atmosfer perlu disempurnakan agar material tidak teroksidasi dalam pemakaian jangka panjang di lingkungan basah.'
    ],
    futureImplications: 'Revolusi dalam pembuatan prostesis tangan buatan yang ringan dan tidak bersuara, gripper industri makanan rapuh, serta mikrorobot medis invasif minimal.',
    citations: [
      'Keplinger, C., et al. (2018). Hydraulically Amplified Self-Healing Electrostatic Actuators with Muscle-Like Performance. Science.',
      'Wood, R., et al. (2026). Low-Voltage Dielectric Elastomers for Autonomous Micro-Flyers. Science Advances.'
    ]
  }
];
