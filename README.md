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

### 🐳 Running with Docker Compose (Deployment Setup)

The application is fully containerized and can be launched in a single command using Docker Compose. This ensures a clean, isolated environment matching the production specification.

#### Prerequisites
- **Docker Desktop** installed and running on your system.

#### Steps:
1. Open a terminal in the root project directory (`CareSync/`).
2. Run the following command to build and start all containers:
   ```bash
   docker compose up --build -d
   ```
3. Docker will automatically pull MySQL 8.0, build the Spring Boot REST API, build the Angular frontend, and host them.
4. Access the applications:
   - **Frontend UI**: [http://localhost](http://localhost) (Port 80)
   - **Backend API**: [http://localhost:8081](http://localhost:8081)
   - **API Docs (Swagger UI)**: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)
5. To stop and clean up the containers, run:
   ```bash
   docker compose down -v
   ```

---

### 🔥 Deployment with Firebase (Non-Docker Setup)

For hosting the project without Docker, you can deploy the Angular frontend to **Firebase Hosting** and run the Spring Boot backend directly as a **Java JAR executable**.

#### 🔵 Frontend Deployment (Firebase Hosting)

Firebase Hosting is used to serve the static Angular application files.

1. **Install Firebase CLI**:
   Ensure you have the Firebase CLI installed globally:
   ```bash
   npm install -g firebase-tools
   ```
2. **Authenticate with Firebase**:
   ```bash
   firebase login
   ```
3. **Configure the Project ID**:
   Open `frontend/.firebaserc` and change `"default": "caresync-app"` to your actual Firebase Project ID.
4. **Update Backend Endpoint (Production)**:
   Open `frontend/src/environments/environment.prod.ts` and set `apiUrl` to your production API's absolute URL (e.g. `https://your-backend-api.com/api`).
5. **Build the Angular App**:
   Navigate to the `frontend/` directory and build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
   This compiles the app into `dist/frontend/browser`.
6. **Deploy to Firebase Hosting**:
   Deploy the compiled assets directly from the `frontend/` directory:
   ```bash
   firebase deploy --only hosting
   ```

---

#### 🟢 Backend & Database Execution (Without Docker)

You can run the backend locally or on any cloud server directly using Java and Maven.

1. **Set up the Database**:
   - Ensure a MySQL server (like WAMP, XAMPP, or standalone MySQL) is running on port `3306`.
   - Update `backend/src/main/resources/application.properties` with your database username and password.
2. **Build the Runnable JAR**:
   Navigate to the `backend/` directory and compile the application:
   ```bash
   cd backend
   ./mvnw clean package
   ```
   This generates a runnable JAR file at `backend/target/appointment-0.0.1-SNAPSHOT.jar`.
3. **Run the Backend**:
   Start the backend application with Java:
   ```bash
   java -jar target/appointment-0.0.1-SNAPSHOT.jar
   ```
   The backend will run on port `8081`.
4. **Deploy Backend to the Cloud (No Docker)**:
   - **Render / Railway / Heroku**: Connect your GitHub repository to platforms like Render or Railway. They natively detect and build Maven projects without Docker.
   - **Google App Engine**: You can deploy to Google Cloud's App Engine Standard environment (which supports Java natively) using the Maven plugin:
     ```bash
     ./mvnw appengine:deploy
     ```

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
