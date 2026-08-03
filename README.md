# Talentia - Gestor de Talentos (PROYECTO ESTUDIANTIL UPTJAA T3-F1 IF-04)

# Datos del Grupo de Trabajo

**Materia:** Programación 4  
**Profesor:** Nelson Ruiz  
**Proyecto:** Talentia - Gestor de Talentos con CRUD, dos roles (Administrador/Reclutador), asignación multiempresa de reclutadores, carga de CV con IA (Google Gemini), URLs prefirmadas temporales R2 y filtros avanzados  

---

## Integrantes del Grupo (4 Integrantes)

1. **Integrante 1 (DBA):** [Yelianni Herrera] - C.I: [ V-30.615.188]
2. **Integrante 2 (Backend):** [Ronald Vizcaya] - C.I: [ V-26.384.967 ]
3. **Integrante 3 (Frontend UI):** [Ricardo Prado] - C.I: [ V-28.658.757 ]
4. **Integrante 4 (Responsividad UI):** [Elias Estrabao] - C.I: [ V-26.896.160 ]

---

## 🚀 Guía de Instalación y Ejecución Local

### Opción A: Despliegue Automatizado con Docker (Recomendado) 🐳

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd talentia
   ```

2. **Crear archivo de entorno local**:
   ```bash
   cp .env.example .env
   ```

3. **Compilar e Iniciar los contenedores**:
   ```bash
   docker-compose up -d --build
   ```

4. **Acceder a la aplicación**:
   - **Frontend App:** [http://localhost:3000](http://localhost:3000)
   - **Backend REST API:** [http://localhost:4000/api](http://localhost:4000/api)
   - **MySQL BD:** `localhost:3306`

---

### Opción B: Ejecución Manual (Sin Docker) 🛠️

1. **Base de Datos**: Importar `doc/database.sql` en tu servidor local de MySQL 8.0:
   ```bash
   mysql -u root -p < doc/database.sql
   ```
2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🔑 Credenciales de Prueba por Defecto

| Usuario | Contraseña | Rol | Correo | Acceso / Permisos |
| :--- | :--- | :--- | :--- | :--- |
| `admin` | `Password123!` | **Administrador** | admin@talentia.com | Acceso completo a todos los módulos y gestión de reclutadores |
| `recruiter1` | `Password123!` | **Reclutador** | recruiter1@talentia.com | Asignado a empresas TechVenezuela y Consulting Group |
| `recruiter2` | `Password123!` | **Reclutador** | recruiter2@talentia.com | Asignado a empresa DataSoft Inc. |

---

## ☁️ Arquitectura e Infraestructura en la Nube

El proyecto implementa una arquitectura moderna orientada a la nube (Cloud-Native), desplegada de manera 100% automatizada mediante **Infraestructura como Código (IaC)** e **Integración y Despliegue Continuo (CI/CD)**.

### Tecnologías y Servicios Utilizados:

1. **Frontend (Capa de Presentación):** 
   - Desarrollado en **React, Vite y TailwindCSS** con validación declarativa mediante **react-hook-form + zod**.
   - Desplegado en **Cloudflare Pages**, una CDN global que ofrece los recursos estáticos desde el borde (edge) de forma instantánea.

2. **Backend (Capa de Lógica de Negocio y API REST):** 
   - Desarrollado en **Node.js (NestJS)** con **TypeORM**.
   - Empaquetado en Docker (almacenado en **Google Artifact Registry**) y desplegado en **Google Cloud Run**. Se autoescala de manera elástica según la demanda.

3. **Base de Datos (Capa de Persistencia):**
   - Motor relacional **MySQL 8.0** desplegado y conectado a la VPC de Google Cloud.

4. **Integraciones de IA y Storage:**
   - **Google Gemini API** para extracción automática de datos estructurados a partir de PDFs de CVs.
   - **Cloudflare R2** (storage compatible S3) para alojar los archivos de CV, generando URLs prefirmadas temporales de lectura segura.

5. **Automatización y DevOps:**
   - La provisión de los recursos en Google Cloud (VPC, Registros de Docker, Cloud Run y Permisos) es orquestada por **Terraform** (`infra/terraform`).
   - Todo el proceso de CI/CD es automatizado mediante **GitHub Actions** (`.github/workflows/deploy.yml`).
   - **Seguridad en Repositorio Público**: Ninguna credencial ni clave privada está expuesta en el código fuente. Las variables de entorno se inyectan dinámicamente en Cloud Run desde los **GitHub Repository Secrets**.

---

## 🔒 Secretos Requeridos en GitHub Actions

Dado que el repositorio es público, las credenciales del servidor y servicios externos se configuran en **Settings -> Secrets and variables -> Actions** en GitHub:

| Nombre del Secreto | Descripción |
| :--- | :--- |
| `GCP_PROJECT_ID` | ID del proyecto en Google Cloud Platform |
| `GCP_CREDENTIALS` | JSON de la cuenta de servicio de GCP con permisos para Cloud Run y Artifact Registry |
| `VITE_API_URL` | URL pública de la API Backend en Cloud Run |
| `CLOUDFLARE_API_TOKEN` | Token de API de Cloudflare para despliegue en Pages |
| `CLOUDFLARE_ACCOUNT_ID` | ID de la cuenta de Cloudflare |
| `DB_HOST` | Host / IP de la base de Datos MySQL |
| `DB_PORT` | Puerto de MySQL (ej. `3306`) |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_ACCESS_SECRET` | Clave secreta para JWT Access Tokens |
| `JWT_REFRESH_SECRET` | Clave secreta para JWT Refresh Tokens |
| `FRONTEND_URL` | URL del frontend desplegado en Cloudflare Pages |
| `GEMINI_API_KEY` | Clave de API de Google Gemini AI |
| `R2_ACCOUNT_ID` | Account ID de Cloudflare R2 |
| `R2_ACCESS_KEY_ID` | Access Key ID para R2 |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key para R2 |
| `R2_BUCKET_NAME` | Nombre del Bucket en R2 (`talentia-cvs`) |
| `R2_PUBLIC_URL` | URL base pública o dominio de R2 |

---

## 📁 Estructura del Monorepo

- `doc/`: Documentación académica del proyecto (Roles, datos del grupo, script `.sql`, manual de usuario).
- `infra/`: Código de infraestructura en **Terraform** y flujos de despliegue (`.github/workflows`).
- `backend/`: API REST en NestJS con TypeORM, JWT, Hash de contraseñas, CRUD de talentos/empresas/reclutadores, parser de CV con Gemini y storage R2.
- `frontend/`: Aplicación SPA en React con Axios, interceptores de seguridad, dark mode y validación declarativa.
- `docker-compose.yml`: Orquestación multi-contenedor para pruebas y desarrollo local.
