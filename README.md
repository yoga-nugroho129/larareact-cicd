# 🚀 Progressive CI/CD & Deployment Architecture — Laravel + Inertia + React

<p align="center">
  <a href="#bahasa-indonesia"><b>🇮🇩 Bahasa Indonesia</b></a> &nbsp;•&nbsp; <a href="#english"><b>🇬🇧 English</b></a>
</p>

---

<a id="bahasa-indonesia"></a>
## 🇮🇩 Bahasa Indonesia

> **Production-Grade DevOps Implementation:** Demonstrasi evolusi pipeline CI/CD komprehensif untuk aplikasi full-stack modern, mencakup kontainerisasi, automated quality gating, deployment berbasis immutable artifacts, hingga orkestrasi cloud-native via Kubernetes dan Argo CD.

### 📌 Ringkasan Proyek

Repository ini mendokumentasikan implementasi arsitektur DevOps dan otomatisasi deployment bertahap untuk aplikasi web berbasis **Laravel 11, Inertia.js, dan React**. 

Tujuan utama dari proyek ini adalah mengeliminasi proses manual menuju otomatisasi penuh standar industri dengan menerapkan prinsip:
- **Infrastructure as Code (IaC)** & konfigurasi deklaratif.
- **Zero-trust Secrets Management** menggunakan Jenkins Credentials Provider.
- **Immutable Artifacts Delivery** melalui semantic versioning & build-tagged Docker images.
- **Automated Quality Gating** sebelum deployment berlangsung.
- **Pemisahan Peran CI dan CD** memanfaatkan paradigma GitOps.

---

### 📁 Struktur Repositori & Pipeline Artifacts

Konfigurasi pipeline dan infrastruktur dipisahkan secara modular berdasarkan fase implementasi arsitektur:

```text
larareact-cicd/
├── docker/
│   └── level-2/            # Multi-stage Dockerfile & compose orchestration
│
├── jenkinsfile/
│   ├── level-3/            # CI Pipeline: Automated Dependency, Build & Testing
│   ├── level-4/            # CI/Registry: Image Tagging, Secure Auth & Docker Hub Push
│   ├── level-5/            # CD Pipeline: Automated SSH Deployment & Container Rolling on VPS
│   └── ...                 # Fase lanjutan (Kubernetes, SonarQube, GitOps)
```

> 📂 **Catatan:** Direktori [`/docker/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker) dan [`/jenkinsfile/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile) menyimpan seluruh manifest teknis yang digunakan di setiap fase arsitektur.

---

### 🗺️ Fase Evolusi Pipeline (10 Stages)

| Fase | Cakupan Implementasi | Target Teknis | Lokasi Konfigurasi |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Bare-Metal / VPS Baseline** | Konfigurasi server dasar, Nginx reverse proxy, socket PHP-FPM, worker process, dan database migration manual | Environment VPS |
| **Phase 2** | **Containerization & Local Stack** | Optimasi multi-stage build Dockerfile untuk runtime PHP 8.4 & asset bundling, serta isolasi network multi-container via Compose | [`docker/level-2/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-2) |
| **Phase 3** | **Continuous Integration (CI) Core** | Pipeline deklaratif Jenkins: otomatisasi SCM checkout, instalasi dependensi, linting, dan eksekusi PHPUnit/Pest automated test | [`jenkinsfile/level-3/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-3) |
| **Phase 4** | **Artifact Publishing & Secure Registry** | Build Docker image otomatis, tagging berbasis versi/build, autentikasi terisolasi via Jenkins Credentials, dan publish ke Docker Hub | [`jenkinsfile/level-4/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-4) |
| **Phase 5** | **Continuous Deployment (CD) ke VPS** | Deployment otomatis via secure SSH execution: pull image versi terbaru, graceful container restart, dan health check | [`jenkinsfile/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-5) |
| **Phase 6** | **Container Orchestration (K8s Manifests)** | Transformasi ke cloud-native: implementasi manifest K8s (Deployment, Service, ConfigMap, Secret, dan readiness/liveness probes) | `k8s/` |
| **Phase 7** | **Static Analysis & Quality Gate** | Integrasi SonarQube ke dalam CI: analisis kerentanan, code smells, cakupan tes, serta Quality Gate blocking | `jenkinsfile/level-7/` |
| **Phase 8** | **Automated Kubernetes Rollout** | Pipeline terintegrasi langsung dengan cluster K8s untuk automated zero-downtime rolling update dan rollback | `jenkinsfile/level-8/` |
| **Phase 9** | **GitOps Continuous Delivery (Argo CD)** | Pemisahan tanggung jawab: Jenkins murni mengelola CI, sementara Argo CD mengontrol deployment deklaratif dari GitOps repository | GitOps Repository |
| **Phase 10** | **Enterprise End-to-End CI/CD** | Pipeline produksi terpadu: Source Push → Jenkins CI → Quality Gate → Registry → GitOps State Update → Argo CD Reconciliation → K8s Cluster | Full Architecture |

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
              Jenkins Pipeline (CI)
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
                         Update Image Tag in GitOps Repo
                                        │
                                        ▼
                                GitOps Repository
                                        │
                              Automated Sync / Drift
                                        │
                                        ▼
                                     Argo CD
                                        │
                              Reconciliation Loop
                                        │
                                        ▼
                                Kubernetes Cluster
                           [ Deployment / Pods / Service ]
                                        │
                                        ▼
                                    End User
```

---

### 🛡️ Resilience & Failure Mode Engineering

Sistem pipeline dirancang dan divalidasi terhadap skenario kegagalan operasional (*failure modes*) nyata:
- **Quality Gate Gating:** Mencegah image di-build apabila code quality atau security threshold di SonarQube tidak terpenuhi.
- **Secrets Isolation:** Tidak ada kredensial, token, atau passphrase yang disimpan di repository; seluruh kredensial dikelola terenkripsi melalui Jenkins Credentials Store.
- **Rollback Readiness:** Validasi mekanisme rollback cepat pada level container (re-tagging image sebelumnya) maupun level Kubernetes (`kubectl rollout undo` / Argo CD rollback).

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

> **Production-Grade DevOps Implementation:** Demonstrating the progressive architecture of an enterprise-grade CI/CD and deployment pipeline for a modern full-stack application, encompassing containerization, automated quality gating, immutable artifact releases, and cloud-native GitOps deployment via Kubernetes and Argo CD.

### 📌 Project Overview

This repository demonstrates the end-to-end implementation of progressive DevOps automation and infrastructure pipelines for a full-stack web application powered by **Laravel 11, Inertia.js, and React**.

The core objective is to transition from traditional manual deployments to a modern, automated production pipeline adhering to industry best practices:
- **Infrastructure as Code (IaC)** with declarative pipeline specifications.
- **Zero-trust Secrets Management** leveraging isolated Jenkins Credentials Store.
- **Immutable Artifacts Delivery** using semantic versioning and build-tagged Docker containers.
- **Automated Quality Gating** preventing defective code from reaching runtime environments.
- **Decoupled CI/CD Architecture** governed by GitOps principles.

---

### 📁 Repository Structure & Pipeline Artifacts

Infrastructure manifests, scripts, and pipeline configurations are modularized by architectural phases:

```text
larareact-cicd/
├── docker/
│   └── level-2/            # Multi-stage Dockerfile & compose orchestration
│
├── jenkinsfile/
│   ├── level-3/            # CI Pipeline: Automated Dependency, Build & Testing
│   ├── level-4/            # CI/Registry: Image Tagging, Secure Auth & Docker Hub Push
│   ├── level-5/            # CD Pipeline: Automated SSH Deployment & Container Rolling on VPS
│   └── ...                 # Advanced stages (Kubernetes, SonarQube, GitOps)
```

> 📂 **Note:** Inspect [`/docker/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker) and [`/jenkinsfile/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile) to explore technical specifications and pipeline scripts implemented across each phase.

---

### 🗺️ Pipeline Evolution Roadmap (10 Stages)

| Phase | Architecture Scope | Technical Objectives | Configuration Target |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Bare-Metal / VPS Baseline** | Baseline system provisioning, Nginx reverse proxy configuration, PHP-FPM socket tuning, worker processes, and database migrations | Target VPS |
| **Phase 2** | **Containerization & Local Stack** | Optimized multi-stage Docker build for PHP 8.4 runtime & frontend bundling, with multi-container network isolation via Compose | [`docker/level-2/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-2) |
| **Phase 3** | **Continuous Integration (CI) Core** | Declarative Jenkins CI: automated SCM checkout, dependency resolution, linting, and automated PHPUnit/Pest test suite execution | [`jenkinsfile/level-3/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-3) |
| **Phase 4** | **Artifact Publishing & Secure Registry** | Automated Docker image builds, semantic/build tagging, secure credential injection via Jenkins Credentials, and automated push to Docker Hub | [`jenkinsfile/level-4/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-4) |
| **Phase 5** | **Continuous Deployment (CD) to VPS** | Automated remote deployment via SSH: pulling latest immutable image, graceful container rolling, and health validation | [`jenkinsfile/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-5) |
| **Phase 6** | **Container Orchestration (K8s Manifests)** | Cloud-native migration: defining declarative Kubernetes manifests (Deployments, Services, ConfigMaps, Secrets, readiness/liveness probes) | `k8s/` |
| **Phase 7** | **Static Analysis & Quality Gate** | Integrating SonarQube into CI: automated code smell, vulnerability, and test coverage inspection enforced by an automated Quality Gate | `jenkinsfile/level-7/` |
| **Phase 8** | **Automated Kubernetes Rollout** | Direct cluster CI/CD integration executing zero-downtime rolling updates and instant rollback capabilities | `jenkinsfile/level-8/` |
| **Phase 9** | **GitOps Continuous Delivery (Argo CD)** | Decoupled responsibilities: Jenkins drives CI, while Argo CD reconciles cluster state declaratively from a dedicated GitOps repository | GitOps Repository |
| **Phase 10** | **Enterprise End-to-End CI/CD** | Unified production flow: Source Push → Jenkins CI → Quality Gate → Container Registry → GitOps Update → Argo CD Sync → K8s Cluster | Full Architecture |

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
              Jenkins Pipeline (CI)
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
                         Update Image Tag in GitOps Repo
                                        │
                                        ▼
                                GitOps Repository
                                        │
                              Automated Sync / Drift
                                        │
                                        ▼
                                     Argo CD
                                        │
                              Reconciliation Loop
                                        │
                                        ▼
                                Kubernetes Cluster
                           [ Deployment / Pods / Service ]
                                        │
                                        ▼
                                    End User
```

---

### 🛡️ Resilience & Failure Mode Engineering

The pipeline implementation has been hardened and validated against real-world production failure scenarios:
- **Quality Gate Enforcement:** Automated halting of the pipeline whenever code vulnerabilities or coverage thresholds fail security criteria.
- **Secrets Isolation:** Strict zero-hardcoding policy; credentials, access tokens, and SSH keys are managed exclusively via Jenkins Credential Provider.
- **Rollback Readiness:** Engineered for rapid rollbacks at both container level (previous immutable image tags) and cluster level (`kubectl rollout undo` / Argo CD synchronization).

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
