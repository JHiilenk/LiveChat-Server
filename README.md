# Server-LiveChat

Versi ini adalah project terpisah untuk deploy live chat saja, tanpa landing marketing dari folder `PEMULA`. Folder ini bisa dipakai sebagai instance khusus per client dengan domain, origin, akun admin, dan kode team default yang berbeda.

## Karakter Versi Ini

- Root `/` langsung membuka aplikasi live chat.
- Route `/app`, `/login`, `/daftar`, `/admin`, dan `/embed` tetap tersedia agar frontend chat yang sekarang tetap berjalan normal.
- Socket.IO, upload file, member registration, admin panel, dan widget embed tetap aktif.
- Konfigurasi inti bisa dibedakan per deployment memakai environment variable.

## Struktur Penting

- `app/server.js` : server live chat utama
- `app/routes/publicSite.js` : route chat-only untuk app/login/daftar/embed
- `public/pages/index.html` : UI aplikasi chat
- `public/assets/js/app.js` : client chat realtime
- `public/assets/js/widget.js` : widget embed
- `data/` : penyimpanan database lokal per instance deployment

## Menjalankan Lokal

```bash
cd Server-LiveChat
npm install
npm start
```

Buka:

- `http://localhost:3000`

## Environment Variable

Salin `.env.example` menjadi `.env` lalu isi sesuai deployment client.

```env
PORT=3000
APP_ORIGIN=https://chat.client-a.com
SOCKET_CORS_ORIGIN=https://chat.client-a.com
PUBLIC_BASE_URL=https://chat.client-a.com
APP_NAME=Client A Live Chat
APP_DESCRIPTION=Server live chat realtime untuk Client A.
DEFAULT_TEAM_CODE=CLIENTA
DEFAULT_CHANNEL_CODE=GENERAL
DEFAULT_OWNER_USERNAME=owner
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_OWNER_PASSWORD=ganti-password-owner
DEFAULT_ADMIN_PASSWORD=ganti-password-admin
```

## Pola Deploy Banyak Client

Setiap client sebaiknya punya deployment dan storage sendiri.

Contoh pola aman:

1. Satu client = satu hosting instance.
2. Satu client = satu domain/subdomain.
3. Satu client = satu volume data persistent.
4. Set env `APP_ORIGIN`, `SOCKET_CORS_ORIGIN`, `PUBLIC_BASE_URL`, dan `DEFAULT_TEAM_CODE` berbeda untuk tiap client.

## Catatan Operasional

- Folder `data/` harus disimpan di persistent disk/volume saat deploy.
- Jangan pakai password default contoh untuk production.
- Jika satu client butuh branding berbeda, favicon, title, dan manifest bisa diganti di folder `public/` milik project ini tanpa menyentuh folder `PEMULA`.

## Checklist Deploy Cepat

1. Push perubahan terakhir ke branch yang dihubungkan ke Railway.
2. Tunggu deployment baru selesai sampai status `Active`.
3. Buka ulang `/app` dan pastikan asset baru termuat dari query version terbaru.
4. Cek `/admin` untuk memastikan panel admin dan toggle chat langsung ke admin tetap tampil normal.
5. Jika browser masih cache versi lama, lakukan hard refresh sekali setelah deploy.