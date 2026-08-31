# Angular Dashboard — Backend

Java + Spring Boot + Microsoft SQL Server REST API for the `angular-dashboard` Angular frontend. Provides real JWT authentication and CRUD/dashboard endpoints, replacing the frontend's old localStorage mock.

```
Angular (http://localhost:4200)
        │  HTTP + JWT (Authorization: Bearer <token>)
        ▼
Spring Boot (http://localhost:8080/api)
        │  JDBC / JPA (Windows Authentication)
        ▼
SQL Server Express (.\SQLEXPRESS) → angular_dashboard database
```

## Requirements

- **Java 17** — this machine has it at `C:\jdk-17.0.20.1`. **You do not need to change your system `JAVA_HOME`/`PATH`** (and you should not — other apps on this machine may depend on an older Java). Every command below points at this JDK explicitly.
- **Maven 3.9.16** — installed at `C:\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin`. No system-wide install/PATH change needed either.
- **SQL Server Express**, local instance `.\SQLEXPRESS`, with **Windows Authentication**. The Windows account running the backend must have login/db_owner rights on the `angular_dashboard` database (the default when you created the instance under your own account is fine).
- **TCP/IP must be enabled** for the SQLEXPRESS instance (see below) — it's off by default and the JDBC driver needs it.

## One-time setup

### 1. Enable TCP/IP on SQLEXPRESS (if not already)

SQL Server Express ships with only Shared Memory enabled. The JDBC driver requires TCP/IP. From an **elevated** (Run as Administrator) PowerShell:

```powershell
$tcp = Get-WmiObject -Namespace "root\Microsoft\SqlServer\ComputerManagement16" -Class ServerNetworkProtocol -Filter "InstanceName='SQLEXPRESS' AND ProtocolName='Tcp'"
$tcp.SetEnable()
Restart-Service -Name 'MSSQL$SQLEXPRESS' -Force
```

(`ComputerManagement16` is for SQL Server 2022; use `ComputerManagement15`/`14`/etc. for older versions — check with `Get-WmiObject -Namespace root\Microsoft\SqlServer -Class __Namespace`.)

Also confirm the **SQL Server Browser** service is running (`Get-Service SQLBrowser`) — it's what lets the JDBC driver resolve the `SQLEXPRESS` named-instance port from `localhost\SQLEXPRESS`.

### 2. Create the database

```powershell
sqlcmd -S .\SQLEXPRESS -E -i database\create-database.sql
```

This only creates the empty `angular_dashboard` database. Tables (`users`, `roles`, `user_roles`) are created automatically by Hibernate the first time the backend starts (`spring.jpa.hibernate.ddl-auto=update`).

### 3. Windows Authentication native driver

`integratedSecurity=true` in the connection string needs Microsoft's native `mssql-jdbc_auth-<version>.x64.dll`, which is **not** distributed via Maven. It's already downloaded into `lib/mssql-jdbc_auth-13.4.0.x64.dll` in this repo, and both the Maven run/test config and the run commands below point `java.library.path` at that folder — no extra setup needed on your end.

## Running the backend

Every command below scopes `JAVA_HOME`/`PATH` to the current PowerShell session only.

```powershell
$env:JAVA_HOME="C:\jdk-17.0.20.1"
$env:Path="C:\jdk-17.0.20.1\bin;C:\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin;$env:Path"

cd F:\DENEMELER\angular-dashboard-backend
mvn spring-boot:run
```

Or build a jar and run it directly with the explicit JDK (works in any shell, no PATH changes at all):

```powershell
C:\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd clean package
C:\jdk-17.0.20.1\bin\java.exe -Djava.library.path=lib -jar target\angular-dashboard-backend-0.0.1-SNAPSHOT.jar
```

The API listens on **http://localhost:8080**. On first startup it seeds the `ADMIN`/`EDITOR`/`USER` roles and one demo user (idempotent — safe to restart, never duplicated).

## Running the frontend

In the `angular-dashboard` folder (unchanged by this backend work):

```bash
npm install
npm start
```

Opens at **http://localhost:4200** and talks to this backend via `environment.apiUrl` (`http://localhost:8080/api`).

## Demo user

```
Username: admin
Password: admin123
Role:     ADMIN
```

**Development/demo credentials only** — seeded by `DataSeeder` on startup. Do not reuse this account/password in any real deployment.

> New users created from the Angular "Kullanıcılar" screen have no password field in that form, so they're seeded with a fixed development password (`changeme123`, BCrypt-hashed). A real product needs an invite/reset-password flow instead of this shortcut — it was left as-is to avoid changing the existing Angular Users form/component.

## Authentication

- `POST /api/auth/login` — public, takes `{ username, password }`, returns `{ token, user }` matching Angular's `AuthResponse`/`User` models exactly. Real HS512-signed JWT — not a placeholder string.
- Every other `/api/**` endpoint requires `Authorization: Bearer <token>` (added automatically by Angular's existing `auth.interceptor.ts`).
- Passwords are hashed with BCrypt (`spring-security-crypto`), never stored or compared in plain text.
- Token secret: `app.jwt.secret` in `application.properties`, defaulting to a **development-only** value but overridable via the `JWT_SECRET` environment variable. Never put a real production secret in `application.properties`. Expiration: `app.jwt.expiration-ms` (default 24h, override via `JWT_EXPIRATION_MS`).

## API endpoints

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | public | `{username,password}` → `{token,user}` |
| GET | `/api/users` | any authenticated user | list |
| GET | `/api/users/{id}` | any authenticated user | one user |
| POST | `/api/users` | **ADMIN** | `{username,name,email,role}` |
| PUT | `/api/users/{id}` | **ADMIN** | same body as POST |
| DELETE | `/api/users/{id}` | **ADMIN** | 204 No Content |
| GET | `/api/dashboard/kpis` | any authenticated user | Total/Active Users are real DB counts; Orders/Revenue are illustrative (no orders domain yet) |
| GET | `/api/dashboard/sales-overview` | any authenticated user | `{labels,data}` |
| GET | `/api/dashboard/user-growth` | any authenticated user | `{labels,data}` |
| GET | `/api/dashboard/revenue-breakdown` | any authenticated user | `{labels,data}` |
| GET | `/api/dashboard/recent-activity` | any authenticated user | list |

Failures return a uniform JSON body: `{ status, error, message, timestamp, fieldErrors? }` with `400` (validation/bad request), `401` (bad credentials / missing or invalid token), `403` (authenticated but not ADMIN), or `404` (not found).

## CORS

Only `http://localhost:4200` (the Angular dev server) is allowed — configured in `security/SecurityConfig.java`. Extend the allowed-origins list there if you ever serve the frontend from another origin; don't switch it to `*`.

## Package layout

```
security/   SecurityConfig, JwtService, JwtAuthenticationFilter, ApplicationUserDetailsService
auth/       AuthController + login DTOs
user/       User/Role entities, repositories, UserService, UserController
dashboard/  DashboardService, DashboardController, DTOs
common/     ApiError, GlobalExceptionHandler, ResourceNotFoundException
seed/       DataSeeder (idempotent role/admin seeding)
```

## Development-only configuration — do not use as-is in production

- `spring.jpa.hibernate.ddl-auto=update` auto-creates/alters tables from the JPA entities. It's convenient locally but **must not** be used against a production database — it can silently make unreviewed schema changes. Use a migration tool (Flyway/Liquibase) with reviewed, versioned scripts instead.
- The JWT secret's default value in `application.properties` is for local development only; always set a real one via the `JWT_SECRET` environment variable outside local dev.
- Windows Authentication to SQL Server is a local-dev convenience; a deployed environment normally uses a dedicated SQL login/managed identity instead.

## Build & test

```powershell
$env:JAVA_HOME="C:\jdk-17.0.20.1"
$env:Path="C:\jdk-17.0.20.1\bin;C:\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin;$env:Path"
mvn clean test      # runs the Spring context load test against the real SQLEXPRESS database
mvn clean package   # builds target\angular-dashboard-backend-0.0.1-SNAPSHOT.jar
```
