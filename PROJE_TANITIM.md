# TaskFlow – Proje Tanıtım Dokümanı

| | |
|---|---|
| **Proje adı** | TaskFlow – Görev ve Proje Yönetim Sistemi API Geliştirme Projesi |
| **Hazırlayan** | Batuhan Tonk |
| **Eğitim** | Software Persona – Node.js ile Backend Programlama Eğitimi (Bitirme Projesi) |
| **Tarih** | Kasım 2026 |
| **Teknolojiler** | Node.js, Express.js, REST API, Middleware, JSON |

## 1. Projenin Amacı

Bu proje, eğitim boyunca edinilen Node.js ve Express.js bilgilerinin uygulamalı olarak gösterilmesi amacıyla hazırlanmıştır. Gerçek hayatta kullanılabilecek bir görev ve proje yönetim sisteminin arka yüzü (backend), REST API olarak tasarlanmış ve geliştirilmiştir. Proje; Node.js temelleri, Express.js ile sunucu geliştirme, routing, middleware kullanımı, CRUD operasyonları ve JSON ile veri yönetimi konularını kapsar.

## 2. Proje Senaryosu

Bir yazılım şirketi, ekip içindeki görevleri, projeleri ve çalışanların sorumluluklarını tek bir yerden takip etmek istemektedir. TaskFlow bu ihtiyaç için geliştirilmiş bir API'dir. Arayüzü yoktur, başka bir uygulamanın (web, mobil ya da test aracı) HTTP istekleriyle kullanabileceği şekilde tasarlanmıştır.

## 3. Sistem Özeti

TaskFlow şunları yapabilir:

- **Görev oluşturma:** Başlık, açıklama, durum, öncelik ve atanan kişi bilgisiyle yeni görev eklenir.
- **Çalışana atama:** Her görevin `assignee` alanında sorumlu kişinin adı tutulur.
- **Durum takibi:** Görevler `pending` (bekliyor), `in-progress` (devam ediyor) ve `completed` (tamamlandı) durumlarından birinde olur ve güncellenebilir.
- **Öncelik yönetimi:** Görevler `low`, `medium` veya `high` öncelik taşır.
- **Listeleme, detay, güncelleme ve silme:** Görevlerin tamamı ya da biri görüntülenebilir, değiştirilebilir veya sistemden kaldırılabilir.
- **İstek kaydı:** Gelen her isteğin method, adres ve zamanı logger middleware'i ile kaydedilir.

## 4. Veri Modeli

Veriler `src/data/tasks.json` dosyasında JSON dizisi olarak saklanır. Her görev şu alanlara sahiptir:

| Alan | Açıklama |
|---|---|
| `id` | Otomatik artan sayı |
| `title` | Görev başlığı (zorunlu tek alan) |
| `description` | Görev açıklaması |
| `status` | `pending`, `in-progress`, `completed` (varsayılan: `pending`) |
| `priority` | `low`, `medium`, `high` (varsayılan: `medium`) |
| `assignee` | Görevi alan kişi |
| `createdAt`, `updatedAt` | Oluşturulma ve güncellenme zamanı |

## 5. API Tasarımı

| Method | Adres | İşlem | Başarılı | Hata |
|---|---|---|---|---|
| POST | `/tasks` | Görev ekleme | 201 | 400 |
| GET | `/tasks` | Görev listeleme | 200 | |
| GET | `/tasks/:id` | Görev detayı | 200 | 404 |
| PUT | `/tasks/:id` | Görev güncelleme | 200 | 400, 404 |
| DELETE | `/tasks/:id` | Görev silme | 200 | 404 |

Adresler kaynağı (`/tasks`), HTTP method'ları yapılacak işlemi belirtir. Tüm yanıtlar JSON formatındadır.

## 6. Mimari ve Klasör Yapısı

Kod, sorumluluklarına göre katmanlara ayrılmıştır:

```
src/
├── app.js                   # Sunucu ve middleware kurulumu
├── routes/taskRoutes.js     # Adresleri ilgili fonksiyona yönlendirir
├── controllers/             # CRUD mantığı ve tasks.json okuma/yazma
│   └── taskController.js
├── middleware/logger.js     # İstek kayıt middleware'i
└── data/tasks.json          # Veri dosyası
```

Bir isteğin yolu şöyledir: istek gelir, `express.json()` gövdeyi okur, `logger` isteği kaydeder, `taskRoutes` doğru fonksiyonu seçer, `taskController` veriyi işleyip yanıtı döndürür.

## 7. Middleware

- **`express.json()`:** Gelen JSON gövdesini okur, POST ve PUT isteklerinde `req.body` bu sayede dolar.
- **`logger`:** Her isteği `[zaman damgası] METHOD adres` biçiminde konsola yazar. Route'lardan önce tanımlandığı için tüm istekler kayıt altına alınır.

## 8. Test Sonuçları

Tüm CRUD uçları Postman üzerinden test edilmiştir. Ekran görüntüleri `screenshots` klasöründedir.

| Test | Sonuç |
|---|---|
| Tüm görevleri listeleme | 200 OK |
| Tek görev detayı | 200 OK |
| Yeni görev ekleme (varsayılan `status: pending` atanır) | 201 Created |
| Görev güncelleme (`updatedAt` yenilenir, `createdAt` korunur) | 200 OK |
| Görev silme | 200 OK |
| Olmayan görev (`/tasks/99`) | 404 Not Found |
| Başlıksız görev ekleme | 400 Bad Request |

## 9. Sonuç

TaskFlow, görev yönetiminin temel ihtiyaçlarını karşılayan, katmanlı yapıda ve test edilmiş bir REST API'dir. Eğitimin zorunlu kapsamındaki tüm maddeler (çalışan REST API, eksiksiz CRUD, logger middleware'i, Postman testleri) tamamlanmıştır. İleride filtreleme, arama, sayfalama, validation middleware'i ve raporlama servisleri eklenerek genişletilebilir.

Kurulum ve çalıştırma adımları için `README.md` dosyasına bakınız.
