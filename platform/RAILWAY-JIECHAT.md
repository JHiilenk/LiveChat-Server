# Railway Deploy Notes For jiechat.up.railway.app

Dokumen ini khusus untuk service Railway yang saat ini melayani `https://jiechat.up.railway.app`.

## Target Service

- Domain live: `https://jiechat.up.railway.app`
- Root directory yang benar: `platform/`
- Config file yang benar: `platform/railway.toml`
- Start command yang benar di dalam root `platform/`: `node server.js`

## Environment Yang Disarankan

Gunakan nilai berikut di Railway Variables:

```env
PORT=4001
PUBLIC_BASE_URL=https://jiechat.up.railway.app
APP_NAME=JIELive Control Panel
APP_TAGLINE=Frontend, admin, embed, dan API untuk deployment terpisah.
LIVECHAT_BACKEND_URL=https://jiechat.up.railway.app
DEFAULT_TENANT_CODE=JIELIVE
DEFAULT_DEMO_TENANT_CODE=DEWI
DEFAULT_TEAM_CODE=GENERAL
DEFAULT_CHANNEL_CODE=MAIN
MASTER_PANEL_EMAIL=master@jielive.local
MASTER_PANEL_PASSWORD=ganti-password-master
FREE_TRIAL_DAYS=30
API_PREFIX=/api
```

## Jika Backend Chat Terpisah

Kalau backend chat utama tidak berada di domain yang sama, ganti hanya nilai ini:

```env
LIVECHAT_BACKEND_URL=https://chat-backend-domain-kamu
```

Semua env lain tetap sama.

## Temuan Verifikasi Live Saat Ini

Pemeriksaan terakhir ke domain live menunjukkan service production belum memuat perubahan terbaru dari folder `platform/`.

Temuan utama:

- `/demo` masih `404`
- route `/api/v1/tenants/:tenantCode/renew` belum ada
- route `/api/v1/settings/subscription` belum ada
- `PUBLIC_BASE_URL` masih terbaca sebagai `http://localhost:8080`
- `LIVECHAT_BACKEND_URL` masih terbaca sebagai `http://127.0.0.1:4000`
- homepage live masih menampilkan copy lama seperti `Buka Control Panel` dan `Buka Client Console`

Artinya service Railway yang online sekarang belum sinkron dengan versi lokal terbaru.

## Langkah Redeploy Railway

1. Push perubahan terbaru ke branch GitHub yang dipakai Railway.
2. Di Railway, buka service `LiveChat-Server`.
3. Pastikan `Root Directory` diarahkan ke `platform/`.
4. Pastikan service memakai `platform/railway.toml`.
5. Update variables memakai daftar di atas.
6. Trigger redeploy dari commit terbaru.

## Checklist Verifikasi Setelah Redeploy

1. Buka `https://jiechat.up.railway.app/api/v1/status`.
2. Pastikan route `/demo` muncul di daftar route.
3. Pastikan route `/api/v1/tenants/:tenantCode/renew` muncul di daftar route.
4. Buka `https://jiechat.up.railway.app/demo?tenantCode=DEWI`.
5. Pastikan brand `Dewi Langit Fashion` tampil.
6. Pastikan launcher widget live chat tampil di halaman demo.
7. Buka `https://jiechat.up.railway.app/panel/master`.
8. Login dengan master account.
9. Pastikan tabel tenant memiliki kolom `Demo` dan link `Buka Demo`.
10. Pastikan tenant `DEWI` muncul dengan status trial aktif.

## Indikator Sukses

Deploy dianggap benar jika:

- `PUBLIC_BASE_URL` tidak lagi fallback ke localhost
- `LIVECHAT_BACKEND_URL` tidak lagi fallback ke `127.0.0.1`
- `/demo` aktif
- widget di `/demo` memakai `tenantCode=DEWI`
- panel master menampilkan fitur renewal dan setting trial
