# Setup Parafrase AI Tool

## 1. Install Package
Jalankan perintah berikut di PowerShell:

```powershell
# Bypass execution policy
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Install Google Generative AI package
npm install @google/generative-ai
```

## 2. Konfigurasi API Key di Server

### Dapatkan API Key
1. Buka https://aistudio.google.com/app/apikey
2. Login dengan akun Google Anda
3. Klik "Create API Key"
4. Copy API Key yang dihasilkan

### Simpan di Environment Variable
1. Buka file `.env.local` di root project
2. Tambahkan API key Anda:
   ```
   GOOGLE_AI_API_KEY=your_api_key_here
   ```
3. Ganti `your_api_key_here` dengan API key yang Anda copy
4. Save file

## 3. Restart Development Server
```bash
# Stop server (Ctrl+C)
# Start ulang
npm run dev
```

## 4. Cara Menggunakan
1. Buka http://localhost:3000
2. Klik card "Parafrase AI"
3. Masukkan teks yang ingin diparafrase
4. Pilih gaya parafrase (Formal, Kasual, Ringkas, dll)
5. Klik tombol "Parafrase"
6. Hasil akan muncul di sebelah kanan
7. Klik icon Copy untuk menyalin hasil

## Fitur
- ✅ 6 gaya parafrase: Formal, Kasual, Ringkas, Detail, Akademik, Kreatif
- ✅ Bahasa Indonesia
- ✅ Copy hasil ke clipboard
- ✅ Hitung karakter dan kata
- ✅ **API Key disimpan di server (aman)**
- ✅ Desain modern dengan Tailwind CSS

## Arsitektur
```
Client (Browser)
    ↓ POST /api/parafrase
    ↓ { text, style }
Server (Next.js API Route)
    ↓ menggunakan GOOGLE_AI_API_KEY dari .env.local
    ↓ memanggil Google Gemini AI
    ↓ return hasil parafrase
Client (Browser)
    ↓ tampilkan hasil
```

## Keamanan
- ✅ API Key **TIDAK** terekspos ke client
- ✅ API Key disimpan di server (environment variable)
- ✅ Request hanya berisi teks dan gaya, tidak ada API key
- ✅ `.env.local` sudah ada di `.gitignore` (tidak ter-commit ke Git)

## Catatan
- Google AI Studio memberikan quota gratis untuk penggunaan API
- Pastikan `.env.local` tidak di-commit ke repository
- Restart server setiap kali mengubah `.env.local`
