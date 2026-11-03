# 🚀 CI/CD Drilling Lab — Laravel + Inertia + React

<p align="center">
  <a href="#-bahasa-indonesia"><b>🇮🇩 Bahasa Indonesia</b></a> &nbsp;•&nbsp; <a href="#-english"><b>🇬🇧 English</b></a>
</p>

---

<a id="bahasa-indonesia"></a>
## 🇮🇩 Bahasa Indonesia

> **Hands-on Practice & Learning Lab:** Belajar CI/CD dari proses manual hingga full automation (Docker, Jenkins, SonarQube, Kubernetes, GitOps & Argo CD) secara bertahap.

### 🎯 Filosofi & Tujuan Lab

Repository ini berfungsi sebagai **laboratorium belajar CI/CD praktis**.
Prinsip utama drilling ini:

> **"Jangan belajar CI/CD sebagai kumpulan command atau sekadar menghafal Jenkinsfile. Belajar dengan mengubah proses manual menjadi automation sedikit demi sedikit."**

Aplikasi dasar yang digunakan tetap konsisten (**Laravel 11 + Inertia.js + React**), sehingga fokus pembelajaran murni pada **evolusi alur deployment dan automasinya**.

---

### 📁 Struktur File & Progress Per Level

Semua artefak, script, dan pipeline konfigurasi per level dipisahkan dalam folder modular agar mudah dipelajari:

```text
larareact-cicd/
├── docker/
│   └── level-2/            # Dockerfile & compose.yml (Drill 2: Containerization)
│
├── jenkinsfile/
│   ├── level-3/            # Basic Declarative Pipeline (Checkout, Build, Test)
│   ├── level-4/            # Build & Push Docker Image ke Docker Hub via Credentials
│   ├── level-5/            # Automated SSH Deployment ke VPS Server
│   └── ...                 # Level selanjutnya (K8s, SonarQube, GitOps)
```

> 💡 **Catatan:** Cek folder [`/docker/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker) dan [`/jenkinsfile/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile) untuk melihat implementasi dan catatan teknis per tahapan drilling.

---

### 🗺️ Roadmap Kurikulum Drilling (10 Levels)

| Level | Materi & Target | Fokus Utama | Lokasi File / Target |
| :--- | :--- | :--- | :--- |
| **Drill 1** | **Manual Deployment** | Pahami alur deploy manual ke VPS tanpa automation (SSH, Linux, Nginx, PHP-FPM, Composer, npm, DB migration) | Manual di VPS |
| **Drill 2** | **Dockerize Application** | Containerization Laravel & multi-container orchestration (App + MySQL) | [`docker/level-2/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-2) |
| **Drill 3** | **Jenkins Fundamental** | Setup Jenkins Agent, basic Declarative Pipeline (`Checkout` → `Build` → `Test`) | [`jenkinsfile/level-3/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-3) |
| **Drill 4** | **Jenkins → Docker Hub** | Integrasi Docker + Jenkins, secure credentials, build image & push ke Docker Hub | [`jenkinsfile/level-4/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-4) |
| **Drill 5** | **Jenkins → VPS Deployment** | Otomasi deployment ke server VPS via SSH (Pull image baru, restart container) | [`jenkinsfile/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-5) |
| **Drill 6** | **Jenkins → Kubernetes** | Pengenalan konsep K8s (Pod, Deployment, Service, ConfigMap, Secret, rollout) | `k8s/` |
| **Drill 7** | **Jenkins + SonarQube** | Code Quality Analysis & Quality Gate blocking sebelum proses build/deploy | `jenkinsfile/level-7/` |
| **Drill 8** | **Jenkins + Kubernetes** | End-to-end automated deployment & rollback langsung ke Kubernetes Cluster | `jenkinsfile/level-8/` |
| **Drill 9** | **Jenkins + GitOps + Argo CD** | Pemisahan tanggung jawab CI (Jenkins) dan CD (Argo CD) via GitOps repository | GitOps Repo |
| **Drill 10** | **Full CI/CD Pipeline** | Integrasi menyeluruh: Developer → GitHub → Jenkins → Quality Gate → Docker Hub → GitOps → Argo CD → K8s | End-to-End |

---

### 🔁 Target Arsitektur Akhir (Full CI/CD)

```text
Developer ──git push──▶ GitHub
                           │
                           ▼
                 Jenkins Pipeline (CI)
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
          Build           Test        SonarQube (Quality Gate)
                                          │
                                          ▼
                                    Docker Build & Push
                                          │
                                          ▼
                                      Docker Hub
                                          │
                                          ▼
                                  GitOps Repository (CD)
                                          │
                                          ▼
                                       Argo CD
                                          │ (Reconciliation)
                                          ▼
                                  Kubernetes Cluster
                                          │
                                          ▼
                                        User
```

---

### 🧠 Metode Belajar & Failure Drill

Setiap level tidak hanya melatih skenario berhasil (*happy path*), namun juga melatih kemampuan investigasi masalah (*failure drill*):

```text
SUCCESS ──▶ BREAK IT ──▶ OBSERVE ERROR ──▶ FIND ROOT CAUSE ──▶ FIX ──▶ REBUILD
```

#### Knowledge Check Sebelum Naik Level
- **Explain:** Jelaskan alur pipeline dari awal hingga akhir tanpa melihat catatan.
- **Why:** Kenapa komponen ini diperlukan di posisi tersebut?
- **Where:** Di mana proses ini dieksekusi (Host, Jenkins Agent, Container, atau Pod K8s)?
- **Input/Output:** Apa artefak yang masuk dan apa yang dihasilkan?
- **Failure:** Jika tahap ini gagal, log mana yang harus diperiksa dan bagaimana solusinya?

---

### 💻 Local Setup (Aplikasi Dasar)

Jika ingin menjalankan aplikasi task management ini di lokal tanpa Docker/CI/CD:

#### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm

#### Setup Steps
```bash
# 1. Install dependencies
composer install
npm install

# 2. Setup environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# 3. Jalankan development server
npm run dev
php artisan serve
```

---

<a id="english"></a>
## 🇬🇧 English

> **Hands-on Practice & Learning Lab:** Progressive hands-on mastery of CI/CD from manual deployment to full automation (Docker, Jenkins, SonarQube, Kubernetes, GitOps & Argo CD).

### 🎯 Philosophy & Lab Objectives

This repository serves as a **practical CI/CD learning laboratory**.
The core principle of this drilling curriculum is:

> **"Don't learn CI/CD as a collection of arbitrary commands or by memorizing Jenkinsfiles. Learn by incrementally transforming manual processes into automation."**

The base application remains consistent (**Laravel 11 + Inertia.js + React**), ensuring your learning focus stays squarely on **the evolution of deployment workflows and automation architecture**.

---

### 📁 Directory Structure & Level Progress

All artifacts, configuration scripts, and pipelines are modularized by level for clear reference:

```text
larareact-cicd/
├── docker/
│   └── level-2/            # Dockerfile & compose.yml (Drill 2: Containerization)
│
├── jenkinsfile/
│   ├── level-3/            # Basic Declarative Pipeline (Checkout, Build, Test)
│   ├── level-4/            # Build & Push Docker Image to Docker Hub via Credentials
│   ├── level-5/            # Automated SSH Deployment to VPS Server
│   └── ...                 # Upcoming levels (K8s, SonarQube, GitOps)
```

> 💡 **Note:** Check the [`/docker/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker) and [`/jenkinsfile/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile) directories to review real implementation scripts and configurations for each stage.

---

### 🗺️ Drilling Curriculum Roadmap (10 Levels)

| Level | Topic & Objectives | Core Focus | File Location / Target |
| :--- | :--- | :--- | :--- |
| **Drill 1** | **Manual Deployment** | Master manual VPS deployment without automation (SSH, Linux, Nginx, PHP-FPM, Composer, npm, DB migrations) | Manual on VPS |
| **Drill 2** | **Dockerize Application** | Containerize Laravel & multi-container orchestration (App + MySQL) | [`docker/level-2/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/docker/level-2) |
| **Drill 3** | **Jenkins Fundamental** | Setup Jenkins Agent & basic Declarative Pipeline (`Checkout` → `Build` → `Test`) | [`jenkinsfile/level-3/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-3) |
| **Drill 4** | **Jenkins → Docker Hub** | Docker + Jenkins integration, credential management, build image & push to Docker Hub | [`jenkinsfile/level-4/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-4) |
| **Drill 5** | **Jenkins → VPS Deployment** | Automated SSH deployment to VPS (Pull latest image, restart container) | [`jenkinsfile/level-5/`](file:///Users/yoga/Documents/Software%20Development/Learning/larareact-cicd/jenkinsfile/level-5) |
| **Drill 6** | **Jenkins → Kubernetes** | Core K8s concepts (Pod, Deployment, Service, ConfigMap, Secret, kubectl rollout) | `k8s/` |
| **Drill 7** | **Jenkins + SonarQube** | Automated static code analysis & Quality Gate gating before build/deploy | `jenkinsfile/level-7/` |
| **Drill 8** | **Jenkins + Kubernetes** | End-to-end automated deployment & rollback directly on a Kubernetes Cluster | `jenkinsfile/level-8/` |
| **Drill 9** | **Jenkins + GitOps + Argo CD** | Separation of concerns: CI (Jenkins) and CD (Argo CD) via GitOps repository | GitOps Repo |
| **Drill 10** | **Full CI/CD Pipeline** | Complete end-to-end flow: Developer → GitHub → Jenkins → Quality Gate → Docker Hub → GitOps → Argo CD → K8s | End-to-End |

---

### 🔁 Target Architecture (Full CI/CD)

```text
Developer ──git push──▶ GitHub
                           │
                           ▼
                 Jenkins Pipeline (CI)
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
          Build           Test        SonarQube (Quality Gate)
                                          │
                                          ▼
                                    Docker Build & Push
                                          │
                                          ▼
                                      Docker Hub
                                          │
                                          ▼
                                  GitOps Repository (CD)
                                          │
                                          ▼
                                       Argo CD
                                          │ (Reconciliation)
                                          ▼
                                  Kubernetes Cluster
                                          │
                                          ▼
                                        User
```

---

### 🧠 Learning Method & Failure Drills

Each level goes beyond the happy path to emphasize deliberate failure recovery (*failure drills*):

```text
SUCCESS ──▶ BREAK IT ──▶ OBSERVE ERROR ──▶ FIND ROOT CAUSE ──▶ FIX ──▶ REBUILD
```

#### Pre-Level-Up Knowledge Checks
- **Explain:** Can you explain the end-to-end pipeline workflow without referencing notes?
- **Why:** Why is this specific component required at this exact stage?
- **Where:** Where does this process physically run (Host, Jenkins Agent, Container, or K8s Pod)?
- **Input/Output:** What are the inputs consumed and artifacts produced?
- **Failure:** If this stage fails, which log should be inspected and how is it resolved?

---

### 💻 Local Application Setup

To run this task management application locally without Docker or CI/CD pipelines:

#### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm

#### Setup Steps
```bash
# 1. Install dependencies
composer install
npm install

# 2. Setup environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# 3. Start development servers
npm run dev
php artisan serve
```
