# JIELive Platform Scaffold

Folder ini adalah scaffold terpisah untuk arsitektur split: web, admin, embed, dan API. Server lama di `app/` tidak diubah.

## Surface

- `/` atau host biasa untuk web portal
- `/admin` untuk control panel
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
DEFAULT_TENANT_CODE=JIELIVE
DEFAULT_TEAM_CODE=GENERAL
DEFAULT_CHANNEL_CODE=MAIN
API_PREFIX=/api
```

## Railway

Kalau deploy ke Railway, set root directory service ke `platform/` agar service ini terpisah dari server lama.

## Catatan

Scaffold ini masih sederhana, tapi sudah siap dipakai sebagai basis pemisahan frontend dan backend per subdomain. Kalau kamu mau, langkah berikutnya bisa diisi dengan integrasi database tenant, auth admin, dan widget livechat sungguhan.