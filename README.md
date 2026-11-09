# Navakara — Sharing Session Kemenkoan AKN

Satu halaman editorial yang bisa dipakai dua cara: di-scroll seperti landing page,
atau dimainkan seperti deck presentasi (satu scene = satu layar).

## Dipakai saat presentasi

| Tombol | Fungsi |
| --- | --- |
| `→` `↓` `Space` `PageDown` | Scene berikutnya |
| `←` `↑` `PageUp` | Scene sebelumnya |
| `Home` / `End` | Ke cover / ke penutup |
| `O` | Overview — lompat ke bab mana pun |
| `F` | Fullscreen |
| `Esc` | Tutup overview |

Rail di kanan bisa diklik, begitu juga daftar isi dan tombol "Mulai".

## Menjalankan

```bash
npm install
npm run dev       # develop, buka http://localhost:5173
npm run build     # hasil: dist/index.html
```

`npm run build` menghasilkan **satu file** `dist/index.html` dengan font dan gambar
sudah di-inline. File itu bisa dibuka langsung lewat double-click, tanpa server,
tanpa internet.

## Isi & sumber

- 8 scene: Cover → Daftar Isi → About Us → Penyimpanan File → Pembuatan Surat →
  LPJ Kegiatan → Rangkuman → Penutup/Q&A.
- Materi dari slide Sharing Session Kemenkoan AKN.
- Palet "Graphite Mono", tipografi Bodoni Moda / DM Sans / Geist Mono.
- Foto stok Unsplash (rapat & kolaborasi), di-grayscale lewat CSS.
- Contoh surat di scene Pembuatan Surat mengikuti format arsip PKKMB 2025
  (nomor, lampiran, perihal, dan blok tanda tangan).
