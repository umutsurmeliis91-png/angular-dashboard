# CLAUDE.md

Bu dosya, bu repo üzerinde çalışan Claude Code için kalıcı proje talimatıdır. Buradaki kurallar, bu projede yapılan **her** oturumda geçerlidir.

## 1. Project Overview

Bu proje, kullanıcı authentication'ı ve bir admin dashboard içeren, Angular + PrimeNG tabanlı modern bir frontend uygulamasıdır (`angular-dashboard`).

- Şu anda **gerçek bir backend yoktur**. Authentication tamamen **mock** olarak, `AuthService` içinde sabit kodlanmış bir demo kullanıcı (`admin` / `admin123`) ile doğrulanır ve sonucu **localStorage**'a yazılır.
-Mock authentication yalnızca geliştirme/demo amacıyladır.
Demo credentials gerçek kullanıcı verisi veya production authentication modeli olarak değerlendirilmemelidir.
Backend entegrasyonu başladığında mock credential kontrolü kaldırılmalıdır.

- Mimari, ileride bir **Spring Boot REST API**'ye (`environment.apiUrl` = `http://localhost:8080/api`) bağlanabilecek şekilde tasarlanmıştır, ancak bu entegrasyon henüz yapılmamıştır.
- SSR yoktur, klasik `@angular/build:application` (CSR) kullanılır.

## 2. Technology Stack

Aşağıdaki liste, `package.json`'da fiilen kurulu olan sürümleri yansıtır — projede bulunmayan hiçbir teknoloji eklenmemelidir.

- **Angular 21** (`@angular/core` 21.2.x) — standalone components, Signals, functional guard/interceptor
- **TypeScript** 5.9.x, `tsconfig.json` içinde `"strict": true`
- **PrimeNG 21.1.9** + **PrimeIcons** — `@primeuix/themes` (Aura preset, `definePreset` ile indigo özelleştirmesi) `app.config.ts` içinde tanımlı
- **Chart.js 4.x** (PrimeNG `ChartModule` sarmalayıcısı üzerinden, `primeng/chart`)
- **RxJS**, **Reactive Forms**, **Angular Router** (lazy-loaded route'lar), **HttpClient**
- **SCSS** + CSS custom properties (`src/styles.scss`)
- **LocalStorage** (mock authentication persistence, `StorageService` üzerinden)
- Test runner: **Vitest** (`@angular/build:unit-test` builder üzerinden, `ng test`)

PrimeNG sürümünü package.json'daki mevcut sürümle uyumlu tut.
Major upgrade yapmadan önce migration/breaking changes kontrol et.


Projede **olmayanlar**: NgRx/Akita gibi bir state management kütüphanesi, Angular Material, Tailwind, i18n paketi, SSR (`@angular/ssr`), e2e test aracı (Playwright/Cypress kurulu değil, sadece geçici QA amaçlı harici olarak kullanıldı, proje bağımlılığı değildir).

## 3. Existing Architecture

`src/app/` feature-based olarak organize edilmiştir:

```
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts       # login/logout, signal tabanlı auth state
│   │   ├── auth.guard.ts         # authGuard + guestGuard (functional CanActivateFn)
│   │   ├── auth.interceptor.ts   # Authorization header ekleyen functional interceptor
│   │   └── auth.models.ts        # User, LoginCredentials, AuthResponse
│   └── storage/
│       └── storage.service.ts    # tip güvenli localStorage sarmalayıcısı
│
├── layout/
│   ├── main-layout/    # header + sidebar + content + footer CSS Grid iskeleti
│   ├── sidebar/        # masaüstünde sabit, mobilde p-drawer overlay
│   ├── header/         # menü toggle, bildirim popover, kullanıcı menüsü
│   └── footer/
│
├── features/
│   ├── auth/login/                 # login formu (Reactive Forms + PrimeNG)
│   └── dashboard/
│       ├── dashboard.service.ts    # KPI/grafik/aktivite mock verisi
│       └── dashboard/              # KPI kartları, grafikler, recent activity tablosu
│
├── shared/
│   ├── components/kpi-card/    # yeniden kullanılabilir KPI kartı
│   ├── components/not-found/   # 404 sayfası
│   └── models/dashboard.models.ts
│
├── app.ts / app.html      # kök component (router-outlet + p-toast)
├── app.config.ts          # provider'lar: router, http, animations, PrimeNG teması
└── app.routes.ts          # /login, /dashboard (+ children), wildcard → 404
```

- **`core/`**: uygulama genelinde tek instance olan singleton servisler ve global logic (authentication, storage, guard, interceptor). Component'lerin doğrudan bilmediği alt yapı burada yaşar.
- **`features/`**: iş/domain özellikleri (`auth/login`, `dashboard`). Her feature kendi route'una lazy-load edilir (`loadComponent`).
- **`layout/`**: uygulama kabuğu (header, sidebar, footer, main-layout). Sadece `/dashboard` route'u bu kabuğu kullanır; `/login` kendi tam ekran sayfasıdır.
- **`shared/`**: birden fazla feature'ın kullanabileceği tekrar kullanılabilir component'ler ve modeller.

Route yapısı (`app.routes.ts`): `/login` (guestGuard korumalı) ve `/dashboard` (authGuard korumalı, `MainLayout` altında lazy-loaded `Dashboard` child'ı ile). Boş path `/dashboard`'a yönlendirilir; guard zaten girişsiz kullanıcıyı `/login`'e döndürür. Bilinmeyen path'ler `NotFound` component'ine düşer.

## 4. Angular Coding Rules

- **Standalone component mimarisi** kullan. NgModule tabanlı yeni bir yapı **oluşturma**.
- **Functional guard** (`CanActivateFn`) ve **functional interceptor** (`HttpInterceptorFn`) kullan — class tabanlı guard/interceptor ekleme.
- **Signals** uygun olan yerlerde tercih edilmeli (örn. auth state, form loading/error state). Basit, tek seferlik senkron değerler için signal zorunlu değildir.
- Modern template syntax kullan: `@if`, `@for`, `@else` — `*ngIf`/`*ngFor` **ekleme**.
- Route'lar **lazy-loaded** olmalı (`loadComponent`), yeni bir route eklerken bu deseni koru.
- **Strong typing** kullan; gereksiz `any` **kullanma** (proje genelinde şu an hiç `any` yok — bunu koru). Yeni model için `core/auth/auth.models.ts` veya `shared/models/` altında bir `interface` tanımla.
- Component'leri küçük ve tek sorumluluklu tut; business logic'i component'e **doldurma** — service katmanına taşı.
- Gereksiz abstraction **oluşturma**. Yeni bir component/service/utility yazmadan önce `core/`, `shared/`, ilgili `features/*` altında benzer bir yapı olup olmadığını kontrol et.
- Servisler `@Injectable({ providedIn: 'root' })` ile tanımlanır (bkz. `AuthService`, `StorageService`, `DashboardService`).

## 5. PrimeNG / UI Rules

- PrimeNG, projenin **birincil UI component kütüphanesidir**. Yeni bir UI ihtiyacı için önce PrimeNG'de karşılığı olup olmadığını kontrol et (Button, Card, InputText, Password, Checkbox, Avatar, Menu, Drawer, Popover, Toast, Message, Table, Tag, Skeleton, Divider, Chart zaten kullanılıyor).
- Bu proje PrimeNG **21.1.9** kullanıyor; bu sürümde component'ler henüz tam standalone değildir, bu yüzden import'lar **`Module` sınıfları** üzerinden yapılır (`CardModule`, `ButtonModule`, `TableModule`, `ChartModule`, vb. — bkz. `login.ts`, `header.ts`, `dashboard.ts`). Bare component class'ı (`Card`, `Button`, `Table`) import etmeye **çalışma**, standalone hata verir.
- PrimeNG teması `app.config.ts` içinde `providePrimeNG` + `@primeuix/themes` Aura preset'i ve `definePreset` ile özelleştirilmiş indigo paleti olarak tanımlıdır. Bu tema yapılandırmasını **bozma**; yeni bir tema sistemi eklemeye çalışma.
- Basit bir UI ihtiyacı için yeni bir npm dependency **ekleme** — önce PrimeNG ve mevcut `shared/components/` içeriğini kontrol et.

## 6. Authentication Rules

Authentication akışı:

```
Login → AuthService.login() → StorageService (localStorage) → currentUser signal
                                                                      ↓
                                                              authGuard / guestGuard
                                                                      ↓
                                                                 Dashboard
```

- Authentication mantığının tamamı `core/auth/auth.service.ts` içindedir (`AuthService`: `login()`, `logout()`, `getCurrentUser()`, `token()`, `currentUser` signal, `isAuthenticated` computed signal). **Component'ler kullanıcı adı/şifre kontrolü yapmaz.**
- Component'ler **doğrudan `localStorage` kullanmaz**. Tüm persistence `StorageService` üzerinden yapılır.
- `/dashboard` route'u `authGuard` ile korunur; `/login` route'u `guestGuard` ile korunur (zaten girişliyse `/dashboard`'a yönlendirir).
- Logout, sadece `AuthService.logout()` üzerinden yapılır (bkz. `header.ts`) — localStorage temizliği ve signal reset'i orada gerçekleşir.
- Token erişimi `AuthService.token()` üzerinden merkezi yapılır; `core/auth/auth.interceptor.ts` bu metodu kullanarak her isteğe `Authorization: Bearer <token>` ekler.
- **Bu mock authentication gerçek güvenlik sağlamaz.** `mock-jwt-token` gerçek bir JWT değildir. Buna gerçek bir güvenlik mekanizmasıymış gibi davranma; gerçek güvenlik backend'de (Spring Boot + Spring Security) sağlanacaktır.

## 7. LocalStorage Rules

- LocalStorage'a **hiçbir yerden doğrudan** (`localStorage.setItem/getItem`) erişilmez; her zaman `core/storage/storage.service.ts` içindeki `StorageService` (`set<T>`, `get<T>`, `remove`, `clear`, `has`) kullanılır.
- Mevcut key'ler `core/auth/auth.service.ts` içinde `AUTH_STORAGE_KEYS` sabitinde merkezi tanımlıdır: `app_auth` (token) ve `app_user` (User nesnesi). Yeni bir key eklemeden önce bu sabitin genişletilip genişletilemeyeceğini değerlendir; key isimlerini component/service içine dağıtma.
- JSON serialize/deserialize işlemleri sadece `StorageService` içinde yapılır.

## 8. Layout Rules

Ana layout yapısı (`layout/main-layout/`), CSS Grid ile kurulmuştur:

```
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: 'header header' 'sidebar content' 'footer footer';
}
```

- `app-header`, `app-sidebar`, `app-footer` component host'ları `:host { display: contents; }` kullanır — bu sayede gerçek `grid-area` ataması, bu component'lerin **içindeki** `.header`/`.sidebar`/`.footer` elemanlarında çalışır. Bu deseni bozma: bir layout component'ine `grid-area` eklerken bunu ya host'un `:host{display:contents}` alt elemanına ya da host'un kendisine tutarlı şekilde uygula — asla ikisini karıştırma (bu, daha önce sidebar/footer'ın üst üste binmesine sebep olan hataydı).
- Footer her zaman normal document flow içinde, `footer` grid alanında kalmalı; sidebar ile aynı hücreyi/alanı asla paylaşmamalı.
- Layout sorunlarını **z-index hack'i** (`z-index: 9999` gibi) veya `position: absolute` ile **gizleme**. Sorunun kök nedenini (hangi elemanın hangi grid alanına gerçekten yerleştiği) çöz.
- Sidebar/Header/Footer için `height: 100vh` gibi bağımsız yükseklik değerleri **verme**; yükseklik yönetimi `.layout`'un `min-height: 100dvh` + `grid-template-rows: auto 1fr auto` kombinasyonuyla parent'tan doğal olarak gelir.
- Flexbox veya CSS Grid tercih et; mevcut Grid tabanlı yapıyı gerekmedikçe Flexbox'a çevirme.

## 9. Responsive Rules

- Breakpoint'ler: `991px` (sidebar masaüstü/mobil geçişi, header menu-button görünürlüğü) ve `575px` (küçük mobil ince ayarları — footer stack, padding azaltma, username gizleme).
- 991px altında `.sidebar` (statik aside) `display: none` olur; yerine `app-sidebar` içindeki `p-drawer` (`[(mobileOpen)]`) overlay olarak kullanılır. Bu ikili yapıyı (statik aside + mobil drawer) koru — birini kaldırıp diğerini her ekran boyutunda kullanmaya **çalışma**.
- Header'daki hamburger butonu (`.header__menu-btn`) sadece ≤991px'te görünür ve sidebar'ın `mobileOpen` signal'ini toggler.
- Sidebar, header, footer, dashboard kart/grafik/tablo alanları hiçbir breakpoint'te viewport dışına taşmamalı; gereksiz global yatay scrollbar oluşturulmamalı.
- Mevcut responsive davranışı (breakpoint değerleri, drawer/static ikilisi) gerekmedikçe **değiştirme**.

## 10. Future Spring Boot API Integration Rules

- Backend henüz yoktur; gerçek bir API'ye istek **atma**. `environment.apiUrl` (`http://localhost:8080/api`) şimdilik hiçbir yerde kullanılmıyor, sadece gelecekteki entegrasyon için hazır tutulur.
- Backend entegrasyonunda componentlerin değiştirilmesi mümkün olduğunca engellenmeli.
API/HTTP detayları service ve infrastructure katmanında tutulmalı.
Backend entegrasyonu sırasında gerekli model, interceptor, error handling ve configuration değişiklikleri ilgili katmanlarda yapılabilir.
  - `AuthService.login()` → mock `of(...)` yerine `this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)`.
  - `DashboardService` metodları → mock `of(...)` yerine `this.http.get<T>(...)`.
- `core/auth/auth.interceptor.ts` zaten her isteğe `Authorization: Bearer <token>` eklemeye hazırdır; backend entegrasyonunda **değişmesi gerekmez**.
- Component'ler backend/API detaylarını (endpoint, HTTP metodu, request/response şekli) **bilmemeli** — her zaman `AuthService`/`DashboardService` gibi bir servis üzerinden çalışmalı, component içine `HttpClient` **enjekte etme**.
- Backend hazır olmadığı sürece gerçek API çağrısı içeren kod **üretme**; mevcut mock (`of(...)`, `delay(...)`) deseni korunmalı.

## 11. Code Quality Rules

- Kod okunabilir, sürdürülebilir ve güçlü tipli olmalı; `any` kullanma.
- DRY prensibine dikkat et, ama over-engineering yapma — basit bir çözüm yeterliyse gereksiz interface/servis/soyutlama **ekleme**.
- Mevcut çalışan kodu, görevin gerektirmediği yerlerde gereksiz yere **refactor etme**. Bir sorunu düzeltirken mümkün olan en küçük, doğru değişiklik setini uygula.
- Bir feature üzerinde çalışırken ilgisiz başka feature'ların kodunu değiştirme.
- Yeni bir component/service/model oluşturmadan önce mevcut projede (`core/`, `shared/`, ilgili `features/*`) benzer bir yapı olup olmadığını kontrol et; varsa onu kullan/genişlet.

## 12. Testing / Build Rules

- Önemli bir değişiklikten sonra en azından `ng build` (veya `npm run build`) çalıştır; TypeScript/template hatalarını düzelt.
- Var olan unit testler `ng test` (Vitest) ile çalışır; mevcut testleri kırma, gerekiyorsa güncelle (`src/app/app.spec.ts`).
- Routing değişikliklerinde `app.routes.ts` içindeki ilgili route'ları ve guard'ları kontrol et.
- Authentication ile ilgili bir değişiklikten sonra şu akışı zihninde/tarayıcıda doğrula: login → sayfa yenileme sonrası oturumun korunması → dashboard erişimi → logout → logout sonrası dashboard'un tekrar erişilemez olması.
- Layout/UI değişikliklerinde ilgili ekranları (özellikle `/login` ve `/dashboard`) hem masaüstü hem mobil genişlikte kontrol et.

## 13. Claude Code Working Rules

Bu projede bir görevi uygularken şu sırayı takip et:

1. **Analyze** — ilgili dosyaları (component, service, route, stil) oku.
2. **Understand existing architecture** — `core/` / `features/` / `layout/` / `shared/` ayrımına ve bu dosyadaki kurallara uy.
3. **Identify the smallest correct change** — sorunun kök nedenini bul, gereğinden büyük bir refactor'a girişme.
4. **Implement** — değişikliği uygula.
5. **Run build/tests** — `ng build` (ve ilgiliyse `ng test`) çalıştır.
6. **Fix errors** — çıkan hataları düzelt.
7. **Review the change** — değişikliğin bu dosyadaki kurallarla çelişmediğini doğrula.
8. **Summarize** — yapılan değişikliği kısaca özetle.

Ek olarak:
- Yeni bir dosya/klasör oluşturmadan önce mevcut mimaride bir karşılığı olup olmadığını kontrol et.
- Gereksiz npm dependency ekleme; Angular/PrimeNG'de veya projede zaten karşılığı olup olmadığını kontrol et.
- `.env`, API key, şifre gibi gizli bilgileri kaynak koda **yazma**.
- Configuration dosyalarını (`angular.json`, `tsconfig.json`, `package.json`) değiştirmeden önce mevcut içeriğini oku ve gerekçesiz değişiklik yapma.

## 14. Important Rule: Do Not Overwrite Existing Work

Mevcut uygulamanın çalışan bölümlerini yeniden yazma.

Bir görev yalnızca belirli bir alanı ilgilendiriyorsa yalnızca o alan üzerinde çalış.

Özellikle:
- çalışan authentication sistemini
- mevcut PrimeNG theme/configuration'ını
- mevcut layout sistemini
- mevcut responsive davranışını
- mevcut routing yapısını

görev açıkça gerektirmediği sürece değiştirme.

Bir değişiklik başka bir mevcut sistemi etkiliyorsa, önce bunun neden gerekli olduğunu analiz et.

"Baştan yazmak" yerine mevcut kodu iyileştirmeyi tercih et.

Bir dosyayı büyük ölçüde değiştirmeden önce gerçekten buna ihtiyaç olup olmadığını değerlendir.
