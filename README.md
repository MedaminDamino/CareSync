# Hospital Appointment Management System (CareSync)

A complete, production-grade, full-stack Hospital Appointment Management System built with a secure **Spring Boot 3** REST API backend and a modern, high-end responsive **Angular 17+ (v21)** frontend utilizing Angular Material and Chart.js dashboards.

---

## 🌟 Key Features

### 🔑 Role-Based Access Control (RBAC)
- **Admin**:
  - Full CRUD management of **Specialities** and **Doctors**.
  - Read-only lookup of **Patients**.
  - Overview list of all **Appointments**.
  - Interactive **Dashboard Analytics** showing appointment counts by status, patient age distribution, and monthly appointment volume graphs (using `Chart.js` & `ng2-charts`).
- **Doctor**:
  - View personalized appointment lists.
  - Manage appointment statuses: **Accept** (`ACCEPTED`), **Reject** (`REJECTED`), or **Complete** (`COMPLETED`).
- **Patient**:
  - Search and filter Doctors by Speciality.
  - **Book appointments** with reason, date, and time.
  - View personal appointment history and cancel pending appointments.

---

## 🏗️ Architecture & Design Patterns

The system strictly adheres to **SOLID principles** and industry-standard design patterns:
- **Layered Architecture**: Keeps code cleanly separated into Presentation, Service, Repository, and Database layers.
- **DTO Pattern**: Isolates internal JPA entities from API request/response payloads to prevent data leaks.
- **Repository Pattern**: Extends `JpaRepository` for clean database access.
- **Strategy & Guard Patterns**: Angular route guards enforce role permissions dynamically, while interceptors handle JWT injection and errors.
- **CORS & JWT Security**: Custom Spring Security filters authenticate users using high-security stateless JSON Web Tokens.

---

## 🚀 Getting Started

### Prerequisites
- **Java JDK 17**
- **Node.js v18+** & **npm**
- **MySQL Server** (running locally or remotely)

---

### 🗄️ Database Setup
1. **Start your MySQL server first** (e.g., using XAMPP/WAMP or a standalone installation). It must be running on `localhost:3306`.
2. The database will be created automatically if it doesn't exist. If for some reason it isn't, create it manually in phpMyAdmin or the MySQL console:
   ```sql
   CREATE DATABASE hospital_db;
   ```
3. Open the backend configuration file: [application.properties](file:///f:/C/me/GLID2%20Projet/angular%20project/backend/src/main/resources/application.properties)
4. The default settings assume a standard XAMPP/WAMP MySQL setup with no password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=
   ```
   If your MySQL has a password, enter it here.

---

### 🟢 Running the Backend
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Start the application using the Maven Wrapper:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
3. The server will start on port **8081**.
4. You can explore the interactive OpenAPI/Swagger Documentation at:
   - [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)

---

### 🔵 Running the Frontend
1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Angular local development server:
   ```bash
   npm run start
   ```
4. Open your browser and navigate to:
   - [http://localhost:4200](http://localhost:4200)

---

## 👥 Seeded Credentials (Automatic Database Seeding)

The backend seeds initial records automatically on startup. Use the credentials below to log in:

### 1. Admin Account
- **Email**: `admin@hospital.com`
- **Password**: `admin123`

### 2. Doctor Accounts
- **Dr. Alice Smith** (Cardiology)
  - **Email**: `alice@hospital.com`
  - **Password**: `doctor123`
- **Dr. Bob Johnson** (Pediatrics)
  - **Email**: `bob@hospital.com`
  - **Password**: `doctor123`
- **Dr. Clara Oswald** (Neurology)
  - **Email**: `clara@hospital.com`
  - **Password**: `doctor123`

### 3. Patient Accounts
- **John Doe**
  - **Email**: `john@gmail.com`
  - **Password**: `patient123`
- **Jane Miller**
  - **Email**: `jane@gmail.com`
  - **Password**: `patient123`
