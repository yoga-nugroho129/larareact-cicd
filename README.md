# 🚀 Progressive CI/CD & Deployment Architecture — Laravel + Inertia + React

<p align="center">
  <a href="#bahasa-indonesia"><b>🇮🇩 Bahasa Indonesia</b></a> &nbsp;•&nbsp; <a href="#english"><b>🇬🇧 English</b></a>
</p>

---

<a id="bahasa-indonesia"></a>

## 🇮🇩 Bahasa Indonesia

> **Production-Grade DevOps Implementation:** Demonstrasi evolusi arsitektur pipeline CI/CD komprehensif untuk aplikasi full-stack modern, mencakup kontainerisasi, automated quality gating via SonarQube, manajemen kredensial terisolasi, hingga automated deployment ke VPS via Docker Compose.

### 📌 Ringkasan Proyek

Repository ini mendokumentasikan implementasi arsitektur DevOps dan otomatisasi deployment bertahap (6 fase) untuk aplikasi web berbasis **Laravel 11, Inertia.js, dan React**.

Tujuan utama dari proyek ini adalah mengeliminasi proses manual menuju otomatisasi penuh standar industri dengan menerapkan prinsip:

- **Infrastructure as Code (IaC)** & konfigurasi deklaratif.
- **Zero-trust Secrets Management** menggunakan Jenkins Credentials Provider.
- **Immutable Artifacts Delivery** melalui semantic versioning & build-tagged Docker images.
- **Automated Quality Gating** via SonarQube sebelum rilis artefak.
- **Automated Continuous Deployment (CD)** ke server VPS menggunakan Docker Compose.

---

### 📁 Struktur Repositori & Pipeline Artifacts

Konfigurasi pipeline dan infrastruktur dipisahkan secara modular berdasarkan fase implementasi arsitektur:

```text
larareact-cicd/
├── docker/
│   ├── level-2/            # Multi-stage Dockerfile & compose orchestration
│   └── level-5/            # Production multi-stage Dockerfile & VPS compose orchestration
│
├── jenkinsfiles/
│   ├── level-3/            # CI Pipeline: Automated Dependency, Build & Testing
│   ├── level-4/            # CI/Registry: Image Tagging, Secure Auth & Docker Hub Push
│   ├── level-5/            # CD Pipeline: Automated SSH Deployment & Container Rolling on VPS
│   └── level-6/            # CI Pipeline: Static Code Analysis & Quality Gate (SonarQube)
```

> 📂 **Catatan:** Direktori [`/docker/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker) dan [`/jenkinsfiles/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles) menyimpan seluruh manifest teknis yang digunakan di setiap fase arsitektur.

---

### 🗺️ Fase Evolusi Pipeline (6 Stages)

| Fase        | Cakupan Implementasi                           | Target Teknis                                                                                                                                           | Lokasi Konfigurasi                                                                                                                                                                                                                            |
| :---------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1** | **Bare-Metal / VPS Baseline**                  | Setup server dasar tanpa otomatisasi: SSH, Linux, Nginx reverse proxy, socket PHP-FPM, worker process, dan database migration                           | Target VPS                                                                                                                                                                                                                                    |
| **Phase 2** | **Containerization & Local Stack**             | Optimasi multi-stage build Dockerfile untuk runtime PHP 8.4 & asset bundling, serta isolasi network multi-container via Compose                         | [`docker/level-2/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-2)                                                                                                                               |
| **Phase 3** | **Continuous Integration (CI) Core**           | Pipeline deklaratif Jenkins: otomatisasi SCM checkout, instalasi dependensi, linting, dan eksekusi PHPUnit/Pest automated test                          | [`jenkinsfiles/level-3/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-3)                                                                                                                   |
| **Phase 4** | **Artifact Publishing & Secure Registry**      | Build Docker image otomatis, tagging berbasis versi/build, autentikasi terisolasi via Jenkins Credentials, dan publish ke Docker Hub                    | [`jenkinsfiles/level-4/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-4)                                                                                                                   |
| **Phase 5** | **Continuous Deployment (CD) ke VPS**          | Deployment otomatis via secure SSH execution: pull image versi terbaru dari Docker Hub, graceful container rolling, dan health check                    | [`jenkinsfiles/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-5) & [`docker/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-5) |
| **Phase 6** | **Static Analysis & Quality Gate (SonarQube)** | Integrasi SonarQube ke dalam CI: analisis kerentanan, code smells, code coverage, serta blocking pipeline via Quality Gate sebelum release              | [`jenkinsfiles/level-6/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-6)                                                                                                                   |

---

### 🔁 Arsitektur Target Produksi (End-to-End Architecture)

```text
                    DEVELOPER
                        │
                     git push
                        │
                        ▼
                     GitHub
                        │
                  Webhook Trigger
                        │
                        ▼
              Jenkins Pipeline (CI/CD)
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   Code Build    Automated Tests   SonarQube Analysis
                                        │
                                   Quality Gate
                                        │ (Passed)
                                        ▼
                                Docker Image Build
                                        │
                                Docker Registry Push
                                        │
                                        ▼
                                    Docker Hub
                                        │
                                 SSH Remote Deploy
                                        │
                                        ▼
                                    VPS Server
                               [ Docker Compose ]
                            (laravel + nginx + mysql)
                                        │
                                        ▼
                                    End User
```

---

### 🛡️ Resilience & Failure Mode Engineering

Sistem pipeline dirancang dan divalidasi terhadap skenario kegagalan operasional (_failure modes_) nyata:

- **Quality Gate Gating:** Mencegah image di-build dan di-deploy apabila code quality atau security threshold di SonarQube tidak terpenuhi.
- **Secrets Isolation:** Tidak ada kredensial, token, atau passphrase yang disimpan di repository; seluruh kredensial dikelola terenkripsi melalui Jenkins Credentials Store.
- **Automated Container Rolling:** Meminimalkan downtime pada host VPS saat deployment dengan proses graceful pull dan reload container melalui Docker Compose.
- **Rollback Readiness:** Validasi mekanisme rollback cepat pada level container di VPS (re-tagging / pulling image versi stabil sebelumnya).

---

### 💻 Local Development Setup

Untuk menjalankan dan mengembangkan stack aplikasi dasar secara lokal:

#### Prerequisites

- PHP 8.2+ (disarankan 8.4)
- Composer
- Node.js & npm

#### Setup Steps

```bash
# 1. Clone & install dependensi
composer install
npm install

# 2. Inisialisasi environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# 3. Jalankan server lokal
npm run dev
php artisan serve
```

---

<a id="english"></a>

## 🇬🇧 English

> **Production-Grade DevOps Implementation:** Demonstrating the progressive architecture of an enterprise-grade CI/CD and deployment pipeline for a modern full-stack application, encompassing containerization, automated SonarQube quality gating, immutable artifact releases, and automated deployment to VPS via Docker Compose.

### 📌 Project Overview

This repository documents the end-to-end implementation of progressive DevOps automation and infrastructure pipelines (6 phases) for a full-stack web application powered by **Laravel 11, Inertia.js, and React**.

The core objective is to transition from traditional manual deployments to a modern, automated production pipeline adhering to industry best practices:

- **Infrastructure as Code (IaC)** with declarative pipeline specifications.
- **Zero-trust Secrets Management** leveraging isolated Jenkins Credentials Store.
- **Immutable Artifacts Delivery** using semantic versioning and build-tagged Docker containers.
- **Automated Quality Gating** via SonarQube preventing defective code from reaching runtime environments.
- **Automated Continuous Deployment (CD)** to VPS host using Docker Compose.

---

### 📁 Repository Structure & Pipeline Artifacts

Infrastructure manifests, scripts, and pipeline configurations are modularized by architectural phases:

```text
larareact-cicd/
├── docker/
│   ├── level-2/            # Multi-stage Dockerfile & compose orchestration
│   └── level-5/            # Production multi-stage Dockerfile & VPS compose orchestration
│
├── jenkinsfiles/
│   ├── level-3/            # CI Pipeline: Automated Dependency, Build & Testing
│   ├── level-4/            # CI/Registry: Image Tagging, Secure Auth & Docker Hub Push
│   ├── level-5/            # CD Pipeline: Automated SSH Deployment & Container Rolling on VPS
│   └── level-6/            # CI Pipeline: Static Code Analysis & Quality Gate (SonarQube)
```

> 📂 **Note:** Inspect [`/docker/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker) and [`/jenkinsfiles/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles) to explore technical specifications and pipeline scripts implemented across each phase.

---

### 🗺️ Pipeline Evolution Roadmap (6 Stages)

| Phase       | Architecture Scope                             | Technical Objectives                                                                                                                     | Configuration Target                                                                                                                                                                                                                          |
| :---------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 1** | **Bare-Metal / VPS Baseline**                  | Baseline system provisioning without automation: SSH, Linux, Nginx reverse proxy, PHP-FPM socket tuning, and DB migrations               | Target VPS                                                                                                                                                                                                                                    |
| **Phase 2** | **Containerization & Local Stack**             | Optimized multi-stage Docker build for PHP 8.4 runtime & frontend bundling, with multi-container network isolation via Compose           | [`docker/level-2/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-2)                                                                                                                               |
| **Phase 3** | **Continuous Integration (CI) Core**           | Declarative Jenkins CI: automated SCM checkout, dependency resolution, linting, and automated PHPUnit/Pest test suite execution          | [`jenkinsfiles/level-3/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-3)                                                                                                                   |
| **Phase 4** | **Artifact Publishing & Secure Registry**      | Automated Docker image builds, semantic/build tagging, secure credential injection via Jenkins Credentials, and automated push to Docker Hub | [`jenkinsfiles/level-4/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-4)                                                                                                                   |
| **Phase 5** | **Continuous Deployment (CD) to VPS**          | Automated remote deployment via SSH: pulling latest immutable image, graceful container rolling with Docker Compose, and health validation | [`jenkinsfiles/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-5) & [`docker/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-5) |
| **Phase 6** | **Static Analysis & Quality Gate (SonarQube)** | Integrating SonarQube into CI: automated code smell, vulnerability, and test coverage inspection enforced by an automated Quality Gate   | [`jenkinsfiles/level-6/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfiles/level-6)                                                                                                                   |

---

### 🔁 Production Target Architecture

```text
                    DEVELOPER
                        │
                     git push
                        │
                        ▼
                     GitHub
                        │
                  Webhook Trigger
                        │
                        ▼
              Jenkins Pipeline (CI/CD)
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   Code Build    Automated Tests   SonarQube Analysis
                                        │
                                   Quality Gate
                                        │ (Passed)
                                        ▼
                                Docker Image Build
                                        │
                                Docker Registry Push
                                        │
                                        ▼
                                    Docker Hub
                                        │
                                 SSH Remote Deploy
                                        │
                                        ▼
                                    VPS Server
                               [ Docker Compose ]
                            (laravel + nginx + mysql)
                                        │
                                        ▼
                                    End User
```

---

### 🛡️ Resilience & Failure Mode Engineering

The pipeline implementation has been hardened and validated against real-world production failure scenarios:

- **Quality Gate Enforcement:** Automated halting of the pipeline whenever code vulnerabilities or coverage thresholds fail security criteria.
- **Secrets Isolation:** Strict zero-hardcoding policy; credentials, access tokens, and SSH keys are managed exclusively via Jenkins Credential Provider.
- **Automated Container Rolling:** Minimizing downtime during remote deployments on VPS host via graceful pull and container recreation using Docker Compose.
- **Rollback Readiness:** Engineered for rapid rollbacks at container level on VPS infrastructure (re-tagging and pulling previous immutable image tags).

---

### 💻 Local Development Setup

To run and inspect the underlying full-stack application locally:

#### Prerequisites

- PHP 8.2+ (PHP 8.4 recommended)
- Composer
- Node.js & npm

#### Setup Steps

```bash
# 1. Install dependencies
composer install
npm install

# 2. Configure environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# 3. Start local development servers
npm run dev
php artisan serve
```
