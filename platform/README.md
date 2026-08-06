# JIELive Platform Scaffold

Folder ini adalah scaffold terpisah untuk arsitektur split: web, admin, embed, dan API. Server lama di `app/` tidak diubah.

## Surface

- `/` atau host biasa untuk web portal
- `/demo` untuk landing demo client yang sudah terhubung ke widget tenant
- `/admin` untuk control panel
- `/panel/master` untuk master internal provider
- `/panel/client` untuk panel client tenant
- `/embed` untuk widget surface
- `/api/v1/status` untuk health dan metadata deploy

## Jalankan Lokal

```bash
cd platform
npm install
npm start
```

Lalu buka `http://localhost:4001`.

## Environment

Salin `.env.example` menjadi `.env`.

```env
PORT=4001
PUBLIC_BASE_URL=https://admin.example.com
APP_NAME=JIELive Control Panel
APP_TAGLINE=Frontend, admin, embed, dan API untuk deployment terpisah.
LIVECHAT_BACKEND_URL=https://chat-backend.example.com
DEFAULT_TENANT_CODE=JIELIVE
DEFAULT_DEMO_TENANT_CODE=DEWI
DEFAULT_TEAM_CODE=GENERAL
DEFAULT_CHANNEL_CODE=MAIN
MASTER_PANEL_EMAIL=master@yourdomain.com
MASTER_PANEL_PASSWORD=ganti-password-master
FREE_TRIAL_DAYS=30
API_PREFIX=/api
```

## Railway

Deploy scaffold baru ini sebagai service terpisah di Railway. Jangan arahkan service ini ke root repo lama kalau yang ingin dijalankan adalah split platform.

1. Push branch terbaru ke GitHub.
2. Buat service Railway dari repo ini.
3. Set `Root Directory` ke `platform/`.
4. Pastikan config file yang dipakai adalah [platform/railway.toml](D:/GitHub/LiveTeams/platform/railway.toml).
5. Railway akan menjalankan `node server.js` dari folder `platform/` lewat [platform/Procfile](D:/GitHub/LiveTeams/platform/Procfile) atau `railway.toml`.

## Environment Railway

Isi minimal variable berikut di service Railway:

```env
PORT=4001
PUBLIC_BASE_URL=https://your-platform-domain.up.railway.app
APP_NAME=JIELive Control Panel
APP_TAGLINE=Frontend, admin, embed, dan API untuk deployment terpisah.
LIVECHAT_BACKEND_URL=https://your-livechat-backend.up.railway.app
DEFAULT_TENANT_CODE=JIELIVE
DEFAULT_DEMO_TENANT_CODE=DEWI
DEFAULT_TEAM_CODE=GENERAL
DEFAULT_CHANNEL_CODE=MAIN
MASTER_PANEL_EMAIL=master@yourdomain.com
MASTER_PANEL_PASSWORD=ganti-password-master
FREE_TRIAL_DAYS=30
API_PREFIX=/api
```

Catatan penting:

- `PUBLIC_BASE_URL` harus mengarah ke domain Railway untuk panel split ini, karena URL widget, `/demo`, dan link tenant dibentuk dari nilai ini.
- `LIVECHAT_BACKEND_URL` harus mengarah ke backend chat yang melayani `/api/login-config`, `/api/upload-config`, `/widget.js`, dan surface embed lama.
- `MASTER_PANEL_EMAIL` dan `MASTER_PANEL_PASSWORD` wajib diganti untuk production.
- `DEFAULT_DEMO_TENANT_CODE` dipakai route `/demo` saat tidak ada `tenantCode` di query string.
- `FREE_TRIAL_DAYS` menentukan trial gratis default untuk client baru yang dibuat dari register publik atau panel master.

## Storage Persisten

Mount volume atau persistent disk ke folder `platform/data/`.

Folder ini menyimpan:

- tenant database
- auth tenant
- session platform
- inbox message
- subscription settings

Kalau volume tidak persisten, data client, trial, renewal, dan inbox akan hilang setiap restart deployment.

## Checklist Setelah Deploy

Setelah service Railway aktif, cek route berikut langsung di browser:

1. `/healthz`
2. `/api/v1/status`
3. `/panel/master`
4. `/panel/client`
5. `/demo`
6. `/embed`

Verifikasi minimum:

1. Login ke `/panel/master` memakai `MASTER_PANEL_EMAIL` dan `MASTER_PANEL_PASSWORD`.
2. Pastikan daftar tenant muncul dan kolom `Demo` punya link `Buka Demo`.
3. Buka `/demo` dan pastikan launcher widget live chat tampil.
4. Klik widget dan pastikan iframe embed membuka route tenant yang benar.
5. Daftarkan satu client baru dari `/register` atau panel master lalu cek trial gratis langsung tercatat.
6. Uji endpoint renew tenant dari panel master dan pastikan status langganan berubah.

## Catatan Operasional

- Route `/demo?tenantCode=DEWI` akan memakai tenant spesifik jika tenant tersebut ada; kalau tidak ada, server fallback ke tenant default.
- Link `Buka Demo` pada master overview otomatis mengikuti `publicBaseUrl` tenant dan query `tenantCode`.
- Widget sudah tertanam di halaman demo, jadi setelah deploy kamu cukup verifikasi tenant dan backend URL benar.

## Catatan

Scaffold ini masih sederhana, tapi sudah siap dipakai sebagai basis pemisahan frontend dan backend per subdomain. Kalau kamu mau, langkah berikutnya bisa diisi dengan integrasi database tenant, auth admin, dan widget livechat sungguhan.