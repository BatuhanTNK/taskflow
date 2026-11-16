# TaskFlow – Görev ve Proje Yönetim Sistemi API'si

Node.js ve Express.js ile geliştirilmiş, REST API mantığında çalışan bir görev yönetim servisidir. Software Persona Node.js ile Backend Programlama Eğitimi kapsamında bitirme projesi olarak hazırlanmıştır.

**Hazırlayan:** Batuhan Tonk

## Özellikler

- Görev ekleme, listeleme, detay görüntüleme, güncelleme ve silme (CRUD)
- Görevlere çalışan atama (`assignee`), durum (`status`) ve öncelik (`priority`) yönetimi
- Her isteğin method, adres ve zaman damgasını kaydeden logger middleware'i
- Veriler `src/data/tasks.json` dosyasında saklanır, veritabanı kurulumu gerekmez
- Uygun HTTP durum kodları ve JSON biçiminde hata mesajları

## Gereksinimler

- [Node.js](https://nodejs.org) 18.11 veya üzeri (proje v20 ile geliştirilmiştir)
- npm (Node.js ile birlikte gelir)
- [Postman](https://www.postman.com/downloads/) (endpoint'leri test etmek için)

## Kurulum

1. Projeyi bilgisayarına indir:
   ```bash
   git clone https://github.com/BatuhanTNK/taskflow.git
   cd taskflow
   ```
   (Zip olarak indirdiysen klasörü çıkarıp terminalde o klasöre gir.)

2. Bağımlılıkları kur:
   ```bash
   npm install
   ```

## Çalıştırma

Sunucuyu başlat:

```bash
npm start
```

Dosyaları kaydettikçe sunucunun otomatik yeniden başlamasını istersen geliştirme modunu kullan:

```bash
npm run dev
```

Terminalde şu satırı görmelisin:

```
Sunucu http://localhost:3000 adresinde çalışıyor
```

Kontrol etmek için tarayıcıda `http://localhost:3000` adresini aç. `{"message":"TaskFlow API çalışıyor"}` yanıtı gelmelidir. Sunucuyu durdurmak için terminalde `Ctrl + C` tuşlarına bas.

## Klasör Yapısı

```
taskflow/
├── src/
│   ├── app.js                      # Sunucu, middleware'ler ve route bağlantısı
│   ├── routes/
│   │   └── taskRoutes.js           # /tasks adreslerinin yönlendirmesi
│   ├── controllers/
│   │   └── taskController.js       # CRUD işlemlerinin mantığı
│   ├── middleware/
│   │   └── logger.js               # İstek kayıt (logger) middleware'i
│   └── data/
│       └── tasks.json              # Görev verileri
├── screenshots/                    # Postman test ekran görüntüleri
├── PROJE_TANITIM.md                # Proje tanıtım dokümanı
├── package.json
└── README.md
```

## API Endpoint'leri

| Method | Adres | Açıklama | Başarılı | Hata |
|---|---|---|---|---|
| GET | `/` | API'nin çalıştığını gösterir | 200 | |
| GET | `/tasks` | Tüm görevleri listeler | 200 | |
| GET | `/tasks/:id` | Belirli bir görevi getirir | 200 | 404 |
| POST | `/tasks` | Yeni görev ekler | 201 | 400 |
| PUT | `/tasks/:id` | Görevi günceller | 200 | 400, 404 |
| DELETE | `/tasks/:id` | Görevi siler | 200 | 404 |

## Görev Modeli

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `id` | sayı | otomatik | Mevcut en büyük id'nin bir fazlası olarak atanır |
| `title` | metin | **evet** | Görev başlığı |
| `description` | metin | hayır | Varsayılan: boş metin |
| `status` | metin | hayır | Varsayılan: `pending`. Kullanılan değerler: `pending`, `in-progress`, `completed` |
| `priority` | metin | hayır | Varsayılan: `medium`. Kullanılan değerler: `low`, `medium`, `high` |
| `assignee` | metin | hayır | Görevi alan kişinin adı. Varsayılan: boş metin |
| `createdAt` | tarih | otomatik | Oluşturulma zamanı (ISO 8601, UTC) |
| `updatedAt` | tarih | otomatik | Son güncellenme zamanı (ISO 8601, UTC) |

## Örnek İstekler

### Görev ekleme

`POST http://localhost:3000/tasks`

Body (raw, JSON):

```json
{
  "title": "Postman ile test et",
  "description": "Tüm CRUD uçlarını dene",
  "priority": "high",
  "assignee": "musa"
}
```

Yanıt: `201 Created`

```json
{
  "id": 4,
  "title": "Postman ile test et",
  "description": "Tüm CRUD uçlarını dene",
  "status": "pending",
  "priority": "high",
  "assignee": "musa",
  "createdAt": "2026-11-14T12:30:38.303Z",
  "updatedAt": "2026-11-14T12:30:38.303Z"
}
```

`status` gönderilmediği için varsayılan değer olan `pending` atanır.

### Görev güncelleme

`PUT http://localhost:3000/tasks/4`

Body (raw, JSON). Yalnızca değişecek alanlar gönderilir:

```json
{
  "status": "completed"
}
```

Yanıt: `200 OK`. Gönderilen alan değişir, `updatedAt` yenilenir, `id` ve `createdAt` korunur.

### Görev silme

`DELETE http://localhost:3000/tasks/4`

Yanıt: `200 OK`

```json
{
  "message": "Görev silindi",
  "task": { "id": 4, "title": "Postman ile test et", "...": "..." }
}
```

### Hata yanıtları

| Durum | Ne zaman | Yanıt |
|---|---|---|
| `400 Bad Request` | `POST /tasks` isteğinde `title` yoksa, ya da `PUT` ile `title` boş gönderilirse | `{ "message": "title alanı zorunludur" }` / `{ "message": "title boş olamaz" }` |
| `404 Not Found` | Verilen `id` ile görev yoksa | `{ "message": "Görev bulunamadı" }` |

## Logger Middleware

`src/middleware/logger.js` gelen her isteği, route'lara ulaşmadan önce yakalar ve konsola `[zaman] METHOD adres` biçiminde yazar. Zaman damgası UTC'dir (Türkiye saatinden 3 saat geridedir).

```
[2026-11-14T11:38:14.047Z] GET /tasks
[2026-11-14T11:38:24.849Z] GET /tasks/1
```

## Postman Testleri

Tüm CRUD uçları Postman üzerinden test edilmiştir. Ekran görüntüleri `screenshots` klasöründedir.

| # | Test | Beklenen sonuç | Ekran görüntüsü |
|---|---|---|---|
| 1 | `GET /tasks` | 200 OK, tüm görevler | [1-get-all.png](screenshots/1-get-all.png) |
| 2 | `GET /tasks/1` | 200 OK, 1 numaralı görev | [2-get-one.png](screenshots/2-get-one.png) |
| 3 | `POST /tasks` | 201 Created, yeni görev | [3-post.png](screenshots/3-post.png) |
| 4 | `PUT /tasks/4` | 200 OK, güncellenmiş görev | [4-put.png](screenshots/4-put.png) |
| 5 | `DELETE /tasks/4` | 200 OK, "Görev silindi" | [5-delete.png](screenshots/5-delete.png) |
| 6 | `GET /tasks/99` | 404 Not Found | [6-get-404.png](screenshots/6-get-404.png) |
| 7 | `POST /tasks` (başlıksız) | 400 Bad Request | [7-post-400.png](screenshots/7-post-400.png) |

Testler sırasında eklenen görev silinmiş, `tasks.json` başlangıçtaki 3 örnek görevle bırakılmıştır.

## Kullanılan Teknolojiler

- Node.js
- Express.js
- JSON dosyası ile veri saklama (`fs` modülü)
- Postman

## Geliştirilebilecek Alanlar

Bu sürüm eğitimin temel kapsamını karşılar. İleride şunlar eklenebilir:

- `status` ve `priority` değerleri için validation middleware'i
- Duruma ve önceliğe göre filtreleme, arama, sayfalama ve sıralama
- Raporlama endpoint'leri (tamamlanan ve bekleyen görev sayıları, genel özet)
- Dosya yerine veritabanı kullanımı
