<div align="center">
  <img src="public/logo.jpeg" alt="EmuBoost Logo" width="150" height="150" style="border-radius: 20px;">
  
  # EmuBoost Pro v2.0
  **Professional Android Emulator & Windows Performance Optimizer**
</div>

---

EmuBoost Pro adalah utilitas tingkat lanjut (*advanced utility*) yang dirancang khusus untuk para *gamer* PC dan pengguna Emulator Android (seperti LDPlayer, BlueStacks, Nox, dll). EmuBoost memodifikasi sistem Windows-mu agar berjalan pada performa puncak, mengurangi *stuttering*, lag, dan memastikan memori teralokasi dengan sempurna untuk game-mu.

## 🔥 Fitur Utama

- **⚡ Turbo Boost (1-Click Optimize):** Membersihkan RAM (Standby List), *Temp files*, dan langsung mengaktifkan profil *High Performance* hanya dengan satu klik.
- **🎮 Emulator Tuning:** Secara otomatis mendeteksi emulator Android yang sedang berjalan dan meningkatkan prioritas CPU-nya secara paksa ke mode ekstrim.
- **🌐 Network & DNS Optimizer:** Menurunkan *ping* secara drastis untuk game *Online* dengan menyetel konfigurasi DNS ke Cloudflare (1.1.1.1).
- **🛑 Disable Game DVR:** Menghilangkan *stuttering* dan *lag* tersembunyi dengan mematikan fitur rekaman latar belakang Xbox bawaan Windows.
- **🖥️ Hardware & Process Monitor:** Lacak penggunaan CPU, RAM, Suhu (Termal), dan matikan proses berat langsung dari *Dashboard* EmuBoost.
- **⬇️ Emulator Download Center:** Unduh versi terbaru dari berbagai emulator ternama langsung dari dalam aplikasi.

---

## 📥 Cara Download & Install (Untuk Pengguna Biasa)

1. Pergi ke halaman **[Releases](https://github.com/keeyy451/boost-keeyy/releases)** di sebelah kanan halaman GitHub ini.
2. Unduh file **`EmuBoost Setup 2.0.0.exe`**.
3. Jalankan file `.exe` tersebut untuk menginstal EmuBoost di komputer kamu.
4. *(Opsional)* Jika Windows Defender memberikan peringatan *SmartScreen*, klik **More Info** -> **Run Anyway**.

---

## 🛠️ Panduan Build (Untuk Developer)

Jika kamu ingin menjalankan *source code* ini atau melakukan modifikasi:

### Prasyarat:
- [Node.js](https://nodejs.org/) (Versi 18 LTS atau lebih baru)
- Git

### Menjalankan di Mode Development:
```bash
git clone https://github.com/keeyy451/boost-keeyy.git
cd boost-keeyy
npm install
npm run dev
```

### Mem-build Aplikasi (.exe Installer):
```bash
npm run package
```
*Installer* akan di-*generate* di dalam folder `dist-electron/`.

---

## 👑 Lisensi (PRO Version)

EmuBoost menyediakan beberapa fitur *Advanced Tweaks* yang dikunci untuk versi PRO.
Bagi para pembeli atau *tester*, kamu bisa membuka seluruh fitur eksklusif tersebut dengan memasukkan *License Key* berformat:
`EMU-PRO-XXXX` (Ganti XXXX dengan 4 karakter alfanumerik bebas yang valid, contoh: `EMU-PRO-EZRA`).

---

<div align="center">
  Dibuat dengan ❤️ menggunakan Electron, React, Vite, dan Tailwind CSS.
</div>
