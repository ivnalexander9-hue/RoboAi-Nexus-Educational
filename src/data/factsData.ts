import { TechFact } from '../types';

export const TECH_FACTS: TechFact[] = [
  {
    id: 'fact-1',
    title: 'Konsumsi Energi Robot Humanoid vs Manusia',
    category: 'Humanoid & Mekatronika',
    statement: 'Tubuh biologis manusia adalah mahakarya efisiensi termodinamika yang masih jauh mengungguli robot buatan tercanggih.',
    myth: 'Robot listrik humanoid jauh lebih hemat energi dibandingkan tenaga kerja manusia.',
    fact: 'Robot humanoid rata-rata mengonsumsi 500 – 1.200 Watt saat berjalan dan mengangkat beban, sedangkan tubuh manusia hanya membakar sekitar 100 Watt energi biologis (setara satu buah apel per jam kerja).',
    scientificExplanation: 'Otot biologis manusia menggunakan ikatan kimiawi ATP (adenosin trifosfat) dengan efisiensi konversi mekanik ~25% yang dikombinasikan dengan pemulihan elastis alami pada tendon Achilles. Robot humanoid harus terus-menerus mengalirkan arus listrik bolak-balik pada puluhan koil motor elektromagnetik hanya untuk menahan gravitasi dan mempertahankan postur tegak.',
    verifiedSource: 'Nature Biomedical Engineering & MIT Bio-robotics Lab',
    year: 2026,
    dataMetric: {
      label: 'Rasio Konsumsi Daya',
      val: '8x – 12x Lebih Boros'
    }
  },
  {
    id: 'fact-2',
    title: 'Model Visi AI & Masalah "Out-of-Distribution"',
    category: 'Model AI & LLM',
    statement: 'Meskipun akurasi benchmark AI mencapai 99%, satu perubahan kecil tak terduga dapat merusak persepsi robot total.',
    myth: 'Sistem Computer Vision AI melihat dan memahami objek sama persis seperti otak manusia.',
    fact: 'AI tidak "memahami" makna esensial suatu benda, melainkan mengekstrak pola korelasi piksel statistik berdimensi tinggi. Sedikit stiker acak atau pantulan silau yang tidak ada dalam dataset pelatihan dapat membuat AI mendeteksi ember sebagai anjing.',
    scientificExplanation: 'Fenomena ini dikenal sebagai Adversarial Vulnerability dan Distribution Shift. Manusia menggunakan model mental sebab-akibat (causal reasoning) dan invariance fisik 3D, sementara Convolutional Neural Networks dan Vision Transformers sangat terikat pada pola tekstur dan distribusi frekuensi spasial data pelatihan.',
    verifiedSource: 'Stanford HAI & Berkeley Artificial Intelligence Research (BAIR)',
    year: 2026,
    dataMetric: {
      label: 'Kerentanan Adversarial',
      val: 'Dapat Tertipu Stiker 2%'
    }
  },
  {
    id: 'fact-3',
    title: 'Sensor GelSight: Menanamkan Indera Rabaan Taktil Halus pada Jari Robot',
    category: 'Komputasi Neuromorfik',
    statement: 'Robot kini dapat merasakan tekstur kain sutra atau ketebalan uang kertas menggunakan kamera mikro di dalam jari sintetis berbahan silikon.',
    myth: 'Sensor sentuhan robot hanya berupa tombol on/off atau sensor tekanan sederhana.',
    fact: 'Teknologi GelSight menempatkan membran elastomer transparan yang dilapisi cat reflektif dan disinari LED berwarna dari dalam. Kamera mikroskopik internal merekam deformasi silikon dan menghasilkan peta 3D relief permukaan hingga resolusi mikron.',
    scientificExplanation: 'Dengan teknik photometric stereo terbalik, komputer dapat menghitung kedalaman deformasi permukaan secara real-time. Hal ini memungkinkan robot membedakan kartu kredit palsu, mendeteksi apakah baut kencang atau longgar, dan menyesuaikan gaya cengkeram agar telur tidak pecah.',
    verifiedSource: 'MIT Computer Science and Artificial Intelligence Laboratory (CSAIL)',
    year: 2025,
    dataMetric: {
      label: 'Resolusi Rabaan Taktil',
      val: 'Hingga 2 Mikrometer'
    }
  },
  {
    id: 'fact-4',
    title: 'Simulasi Fisika GPU Mempercepat Evolusi Robot Jutaan Kali',
    category: 'Sistem Otonom & Navigasi',
    statement: 'Sebelum melangkah di lantai nyata, robot berkaki telah "hidup" puluhan tahun di alam semesta simulasi paralel.',
    myth: 'Robot dilatih belajar berjalan dengan jatuh berulang kali di laboratorium fisik.',
    fact: 'Di era modern, 99.9% latihan gerak robot dilakukan di simulator fisika GPU paralel (seperti NVIDIA Isaac Gym atau MuJoCo). Ribuan klon robot disimulasikan secara bersamaan dalam satu kartu grafis, menghasilkan latihan setara 10 tahun hanya dalam 20 menit.',
    scientificExplanation: 'Proses ini mengandalkan Massively Parallel Reinforcement Learning (PPO) yang memanfaatkan komputasi tensor tensor-core. Dengan domain randomization, hukum gravitasi, massa sambungan, dan koefisien gesekan diacak terus menerus sehingga otak robot kebal terhadap ketidakpastian dunia nyata.',
    verifiedSource: 'Carnegie Mellon University & NVIDIA Research',
    year: 2026,
    dataMetric: {
      label: 'Akselerasi Waktu Latihan',
      val: '25.000x Real-Time'
    }
  },
  {
    id: 'fact-5',
    title: 'Singularitas Kinematika: Titik Kritis Kehilangan Derajat Kebebasan',
    category: 'Humanoid & Mekatronika',
    statement: 'Lengan robot seberat 500 kg dapat mendadak macet atau menghasilkan kecepatan sendi tak terhingga jika digerakkan ke posisi garis lurus sempurna.',
    myth: 'Lengan robot dengan 6 sendi bisa digerakkan bebas ke arah manapun tanpa batasan matematika.',
    fact: 'Ketika dua atau lebih sumbu sendi sejajar sempurna, determinan dari matriks Jacobian kinematika bernilai nol (det(J) = 0). Kondisi ini disebut "Singularitas Kinematika", di mana lengan kehilangan kemampuan bergerak pada arah tertentu dan invers matriks meledak tak hingga.',
    scientificExplanation: 'Untuk mengatasinya, perencana lintasan modern menggunakan Damped Least Squares (DLS) atau Jacobian Pseudo-inverse dengan pembobotan SVD (Singular Value Decomposition) agar pergerakan tetap stabil di dekat zona singular.',
    verifiedSource: 'IEEE Robotics and Automation Magazine',
    year: 2026,
    dataMetric: {
      label: 'Kondisi Jacobian',
      val: 'Determinant J = 0'
    }
  },
  {
    id: 'fact-6',
    title: 'Cobot vs Robot Tradisional: Mengapa Kandang Baja Ditiadakan?',
    category: 'Otomasi Industri',
    statement: 'Revolusi manufaktur terjadi bukan karena robot menjadi lebih cepat, melainkan karena robot dapat mendeteksi benturan lembut di bawah 50 milidetik.',
    myth: 'Robot industri baru lebih aman hanya karena dibuat dari bahan plastik yang lebih lembut.',
    fact: 'Robot kolaboratif (cobot) tetap menggunakan paduan aluminium dan baja, namun dilengkapi sensor torsi ganda di setiap sendi (joint torque sensors) dan sistem pemantauan daya PFL (Power and Force Limiting) sesuai standar ISO/TS 15066.',
    scientificExplanation: 'Begitu gaya kontak eksternal melebihi batas fisiologis aman (misalnya 150 Newton pada dada manusia), sistem rem elektromagnetik otomatis terkunci dalam 12 milidetik dan motor melepaskan torsinya seketika untuk mencegah cedera remuk.',
    verifiedSource: 'ISO Technical Committee 299 & Fraunhofer Institute',
    year: 2025,
    dataMetric: {
      label: 'Waktu Henti Darurat',
      val: '12 – 25 Milidetik'
    }
  }
];
