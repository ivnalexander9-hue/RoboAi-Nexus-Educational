import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Apa kepanjangan dan fungsi utama dari model arsitektur VLA dalam robotika modern?',
    category: 'Model AI & LLM',
    options: [
      'Very Large Array – untuk menangkap sinyal radio astronomi pada robot penjelajah mars',
      'Vision-Language-Action – memetakan pemahaman visual dan instruksi teks langsung ke lintasan gerak fisik robot',
      'Variable Linear Actuator – silinder hidrolik yang dapat diubah panjang langkahnya secara mekanis',
      'Virtual Latency Analyzer – software untuk mengukur keterlambatan ping jaringan WiFi pabrik'
    ],
    correctIndex: 1,
    explanation: 'Vision-Language-Action (VLA) adalah model multimodal yang menerima masukan gambar kamera dan instruksi bahasa manusia, lalu menghasilkan aksi motorik kontinu langsung ke aktuator robot.',
    scientificReference: 'Google DeepMind RT-2 & Stanford HAI Research 2026'
  },
  {
    id: 'q2',
    question: 'Kondisi matematis apa yang terjadi saat lengan robot mengalami "Singularitas Kinematika"?',
    category: 'Humanoid & Mekatronika',
    options: [
      'Tegangan baterai menurun drastis di bawah 12 Volt',
      'Determinan Matriks Jacobian sama dengan nol (det(J) = 0), menyebabkan lengan kehilangan arah gerak tertentu',
      'Sensor suhu motor melebihi 100°C sehingga rem darurat aktif',
      'Frekuensi PWM pengendali motor terkunci pada harmonik ketiga'
    ],
    correctIndex: 1,
    explanation: 'Pada kondisi singularitas, matriks Jacobian kehilangan rank penuh (det(J) = 0). Menghitung invers Jacobian membutuhkan kecepatan sendi tak terhingga untuk menghasilkan kecepatan end-effector tertentu.',
    scientificReference: 'Modern Robotics: Mechanics, Planning, and Control (Lynch & Park)'
  },
  {
    id: 'q3',
    question: 'Mengapa sensor penglihatan neuromorfik (Event-Based Camera) sangat unggul untuk drone berkecepatan tinggi dibanding kamera CMOS standar?',
    category: 'Komputasi Neuromorfik',
    options: [
      'Menghasilkan resolusi gambar 8K berwarna sinematik dengan bitrate tinggi',
      'Hanya merekam piksel yang mengalami perubahan intensitas cahaya secara asinkron, menghilangkan motion blur dan latensi mikrodetik',
      'Dapat melihat menembus dinding beton padat menggunakan sinar-X mikro',
      'Menggunakan teknologi lensa kaca safir yang tidak bisa tergores debu'
    ],
    correctIndex: 1,
    explanation: 'Kamera event-based meniru retina biologis: setiap piksel bersifat independen dan hanya memancarkan "spike" saat ada perubahan intensitas cahaya, memberikan waktu respons mikrodetik dan dynamic range ekstrem (>140 dB).',
    scientificReference: 'IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)'
  },
  {
    id: 'q4',
    question: 'Dalam kontrol keseimbangan robot berkaki dua (Bipedal Locomotion), apa peran Center of Mass (CoM) terhadap Support Polygon?',
    category: 'Humanoid & Mekatronika',
    options: [
      'CoM harus selalu berada di luar Support Polygon agar robot melayang di udara',
      'Proyeksi CoM (atau Zero Moment Point) harus berada di dalam batas Support Polygon agar robot tidak terguling',
      'CoM hanya relevan untuk robot beroda dan tidak berpengaruh pada robot berkaki',
      'CoM harus berada persis 1 meter di atas tanah setiap saat tanpa toleransi'
    ],
    correctIndex: 1,
    explanation: 'Kriteria stabilitas statis dan kuasi-statis menuntut proyeksi pusat massa (atau kriteria dinamis ZMP/DCM) tetap berada di dalam poligon yang dibentuk oleh tapak kaki kontak.',
    scientificReference: 'MIT Biomimetic Robotics Lab & Boston Dynamics dynamic balance papers'
  },
  {
    id: 'q5',
    question: 'Apa yang dimaksud dengan "Sim-to-Real Gap" dan teknik apa yang paling ampuh untuk mengatasinya?',
    category: 'Sistem Otonom & Navigasi',
    options: [
      'Perbedaan harga antara software simulator dan robot fisik; diatasi dengan negosiasi lisensi',
      'Perbedaan fisika antara lingkungan virtual dan realita; diatasi dengan Domain Randomization masif di GPU simulator',
      'Keterlambatan pengiriman hardware dari pabrik; diatasi dengan sistem logistik udara',
      'Perbedaan bahasa pemrograman antara C++ dan Python di sistem operasi ROS'
    ],
    correctIndex: 1,
    explanation: 'Sim-to-Real Gap adalah diskrepansi antara simulator fisik dan dunia nyata. Domain Randomization mengacak parameter gesekan, massa, delay, dan noise sensor selama jutaan iterasi di GPU sehingga kebijakan AI kebal saat di deploy ke robot fisik.',
    scientificReference: 'Carnegie Mellon Robotics Institute & NVIDIA Isaac Sim Research'
  },
  {
    id: 'q6',
    question: 'Komponen apa yang membedakan Robot Kolaboratif (Cobot) bersertifikasi ISO/TS 15066 dengan robot industri konvensional berkandang?',
    category: 'Otomasi Industri',
    options: [
      'Cobot tidak memiliki motor listrik dan digerakkan oleh tali pegas manual',
      'Sensor torsi terintegrasi di setiap sendi dan pembatasan daya & gaya (Power and Force Limiting) aktif',
      'Cobot hanya boleh digunakan untuk mengetik dokumen di kantor',
      'Cobot hanya memiliki satu sendi engsel tunggal'
    ],
    correctIndex: 1,
    explanation: 'Cobot dilengkapi sensor torsi presisi di setiap artikulasi dan algoritma pemantauan benturan yang dapat menghentikan gerakan dalam milidetik jika mendeteksi kontak melebihi ambang batas fisiologis aman bagi manusia.',
    scientificReference: 'ISO/TS 15066:2016 Robots and robotic devices - Collaborative robots'
  }
];
