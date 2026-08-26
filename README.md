# Angular Dashboard

Kullanıcı authentication'ı ve modern bir admin dashboard'u içeren, sıfırdan kurulmuş bir Angular uygulaması. Şu an için backend yoktur; authentication tamamen **localStorage üzerinden mock** olarak çalışır. Mimari, ileride bir **Spring Boot REST API**'ye kolayca bağlanacak şekilde tasarlanmıştır.

## İçindekiler

- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [Demo kullanıcı](#demo-kullanıcı)
- [Klasör yapısı](#klasör-yapısı)
- [Authentication akışı](#authentication-akışı)
- [LocalStorage yapısı](#localstorage-yapısı)
- [Spring Boot entegrasyonu](#spring-boot-entegrasyonuna-geçiş)
- [Bilinen notlar](#bilinen-notlar)

## Teknolojiler

- **Angular 21** — standalone components, Signals, functional guard/interceptor, yeni `@if` / `@for` kontrol akışı
- **TypeScript** (strict mode)
- **PrimeNG 21** + **PrimeIcons** — Aura teması, indigo/blue özelleştirilmiş renk paleti
- **Chart.js** (PrimeNG Chart sarmalayıcısı üzerinden)
- **Reactive Forms**
- **Angular Router** — lazy-loaded route'lar, functional guard'lar
- **HttpClient** + functional interceptor altyapısı (henüz gerçek bir istek atmıyor)
- **SCSS** + CSS custom properties (merkezi tema token'ları)
- **LocalStorage** (mock authentication persistence)

> Not: Bu proje `primeng@22` yerine `primeng@21.1.9` + Angular 21 kullanır. PrimeNG 22, tüm kurulumlarda ücretsiz kullanımda dahi ekranın altında "Invalid PrimeUI License" uyarı rozeti gösteren yeni bir lisans doğrulama mekanizması içeriyor. Üretime hazır, rozetsiz bir uygulama için son lisanssız sürüm olan 21.1.9'da kalındı.

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
npm start
# veya
ng serve
```

Uygulama varsayılan olarak [http://localhost:4200](http://localhost:4200) adresinde açılır.

Production build almak için:

```bash
npm run build
```

Çıktı `dist/angular-dashboard` klasörüne yazılır.

## Demo kullanıcı

```
Kullanıcı adı: admin
Şifre:         admin123
```

Bu bilgiler login ekranında da gösterilir. Farklı bir kullanıcı adı/şifre girildiğinde "Kullanıcı adı veya şifre hatalı." mesajı gösterilir.

## Klasör yapısı

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.service.ts        # login/logout, signal tabanlı auth state
│   │   │   ├── auth.guard.ts          # authGuard + guestGuard (functional)
│   │   │   ├── auth.interceptor.ts    # Authorization header ekler (functional)
│   │   │   └── auth.models.ts         # User, LoginCredentials, AuthResponse
│   │   └── storage/
│   │       └── storage.service.ts     # tip güvenli localStorage sarmalayıcısı
│   │
│   ├── layout/
│   │   ├── main-layout/               # header + sidebar + content + footer grid'i
│   │   ├── sidebar/                   # masaüstünde sabit, mobilde p-drawer overlay
│   │   ├── header/                    # menü toggle, bildirim, kullanıcı menüsü
│   │   └── footer/
│   │
│   ├── features/
│   │   ├── auth/login/                # login formu (Reactive Forms + PrimeNG)
│   │   └── dashboard/
│   │       ├── dashboard.service.ts   # KPI/grafik/aktivite mock verisi
│   │       └── dashboard/             # KPI kartları, grafikler, recent activity
│   │
│   ├── shared/
│   │   ├── components/kpi-card/       # yeniden kullanılabilir KPI kartı
│   │   ├── components/not-found/      # 404 sayfası
│   │   └── models/dashboard.models.ts
│   │
│   ├── app.ts / app.html              # kök component (router-outlet + toast)
│   ├── app.config.ts                  # provider'lar: router, http, PrimeNG teması
│   └── app.routes.ts                  # /login, /dashboard, 404
│
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
│
└── styles.scss                        # global tema token'ları (CSS custom properties)
```

## Authentication akışı

```
/            → authGuard üzerinden /dashboard'a yönlendirilir
/login       → guestGuard: zaten girişliyse /dashboard'a yönlendirir
/dashboard   → authGuard: girişli değilse /login'e yönlendirir
```

1. Kullanıcı `/login` sayfasında `admin` / `admin123` bilgileriyle giriş yapar.
2. `AuthService.login()` bilgileri mock olarak doğrular (600ms gecikme ile gerçek bir API çağrısını simüle eder).
3. Başarılıysa token + kullanıcı bilgisi `StorageService` üzerinden localStorage'a yazılır ve `currentUser` signal'i güncellenir.
4. `isAuthenticated` computed signal'i `true` olur, `authGuard` artık `/dashboard`'a erişime izin verir.
5. Sayfa yenilendiğinde (`F5`) `AuthService`, `currentUser` signal'ini localStorage'dan senkron olarak geri yükler — kullanıcı login durumunu kaybetmez.
6. Header'daki kullanıcı menüsünden "Çıkış Yap" seçildiğinde `AuthService.logout()` localStorage kayıtlarını temizler, signal'i `null` yapar ve `/login`'e yönlendirir.

Authentication ve localStorage mantığının tamamı `core/auth` ve `core/storage` içinde yaşar; hiçbir component doğrudan `localStorage` API'sine dokunmaz veya kullanıcı adı/şifre kontrolü yapmaz.

## LocalStorage yapısı

| Key         | İçerik                                  |
| ----------- | ---------------------------------------- |
| `app_auth`  | Mock token (`"mock-jwt-token"`)          |
| `app_user`  | `User` nesnesi (id, username, name, email, roles) |

Key isimleri `core/auth/auth.service.ts` içinde `AUTH_STORAGE_KEYS` sabiti olarak merkezi tanımlanmıştır.

> **Güvenlik notu:** Bu mekanizma sadece bir **frontend mock authentication**'dır. `mock-jwt-token` gerçek bir JWT değildir ve hiçbir kriptografik garanti taşımaz. Gerçek güvenlik, backend tarafında (Spring Boot + Spring Security) sağlanmalıdır.

## Spring Boot entegrasyonuna geçiş

Frontend, backend'den bağımsız bir abstraction (`AuthService`, `DashboardService`) üzerinden tasarlandı. Gerçek bir Spring Boot API (`http://localhost:8080/api`, bkz. `src/environments/`) bağlanacağı zaman:

1. `core/auth/auth.service.ts` içindeki `login()` metodunun gövdesi, mock `of(...)` yerine gerçek bir istek ile değiştirilir:
   ```ts
   login(credentials: LoginCredentials): Observable<AuthResponse> {
     return this.http
       .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
       .pipe(tap((res) => this.persistSession(res)));
   }
   ```
2. `logout()` isterse `POST /api/auth/logout` çağrısı da yapabilir.
3. `features/dashboard/dashboard.service.ts` içindeki mock `of(...)` dönüşleri, `this.http.get<T>(...)` çağrılarıyla değiştirilir (ör. `GET /api/dashboard/kpis`, `GET /api/users`).
4. `core/auth/auth.interceptor.ts` zaten her isteğe `Authorization: Bearer <token>` header'ı eklemeye hazırdır — hiçbir değişiklik gerekmez.
5. Component'lerin hiçbiri değişmez; hepsi zaten `this.authService...` / `this.dashboardService...` üzerinden çalışıyor, doğrudan `HttpClient` kullanmıyor.

## Bilinen notlar

- SSR kullanılmamıştır (istenmedi).
- `/dashboard` altında yalnızca Dashboard sayfası gerçek bir route'tur; sidebar'daki "Kullanıcılar" ve "Ayarlar" öğeleri kapsam dışı olduğu için "Yakında" etiketiyle pasif gösterilir.
- Build, `npm run build` ile TypeScript strict modda ve uyarısız/hatasız tamamlanır.
