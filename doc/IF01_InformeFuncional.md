# IF01 — Informe Funcional del Sistema
## **Talentia** — Gestor de Talentos Profesionales

---

| Campo | Detalle |
| :--- | :--- |
| **Proyecto** | Talentia — Sistema de Gestión de Talentos |
| **Versión** | 1.0.0 |
| **Fecha** | Agosto 2026 |
| **Estado** | En producción |

---

## Tabla de Contenidos

1. [Descripción General del Sistema](#1-descripción-general-del-sistema)
2. [Arquitectura Técnica](#2-arquitectura-técnica)
3. [Módulos del Sistema](#3-módulos-del-sistema)
4. [Modelo de Datos](#4-modelo-de-datos)
5. [API REST — Endpoints](#5-api-rest--endpoints)
6. [Roles y Permisos](#6-roles-y-permisos)
7. [Flujos Principales](#7-flujos-principales)
8. [Infraestructura y Despliegue](#8-infraestructura-y-despliegue)
9. [Variables de Entorno y Secretos](#9-variables-de-entorno-y-secretos)
10. [Instrucciones de Instalación Local](#10-instrucciones-de-instalación-local)

---

## 1. Descripción General del Sistema

**Talentia** es una plataforma web para la gestión integral de talentos profesionales. Permite a organizaciones registrar, categorizar y hacer seguimiento de candidatos/profesionales, vincularlos a empresas, gestionar sus CVs con inteligencia artificial y controlar el acceso mediante un sistema de roles.

### Objetivos del Sistema
- Centralizar la base de talentos profesionales de una organización.
- Facilitar la asignación y seguimiento de talentos por empresa.
- Automatizar la extracción de datos desde CVs en formato PDF mediante IA (Google Gemini).
- Garantizar la seguridad con autenticación JWT y control de acceso por roles.
- Proveer una interfaz moderna, responsiva y accesible.

### Actores del Sistema

| Actor | Descripción |
| :--- | :--- |
| **Administrador** | Acceso total. Gestiona usuarios, empresas, talentos y reclutadores. |
| **Reclutador** | Acceso parcial. Gestiona talentos de las empresas a las que está asignado. |

---

## 2. Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
│              React 18 + Vite + React Router v6                  │
│              Desplegado en: Cloudflare Pages                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / REST API
┌──────────────────────────▼──────────────────────────────────────┐
│                    BACKEND (NestJS)                             │
│           Cloud Run: talentia-backend-nestjs                    │
│           Puerto: automático (inyectado por Cloud Run)          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Auth Module │  │ Talentos     │  │ Empresas / Reclutadores│ │
│  │ JWT + Bcrypt│  │ + CV Parser  │  │ + Storage R2           │ │
│  └─────────────┘  └──────────────┘  └────────────────────────┘ │
└──────┬──────────────────────┬──────────────────────────────────┘
       │ VPC Connector         │ Internet (Egress: PRIVATE_RANGES_ONLY)
       │ (IPs privadas)        │
┌──────▼───────┐   ┌──────────▼───────┐   ┌───────────────────┐
│  MySQL 5.7   │   │  Google Gemini   │   │  Cloudflare R2    │
│  VM GCP      │   │  AI API          │   │  (Almacenamiento  │
│  (VPC)       │   │  (gemini-2.5-    │   │   de CVs PDF)     │
│  Port 3306   │   │   flash)         │   │                   │
└──────────────┘   └──────────────────┘   └───────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | 18 / 4.x |
| **Estilos** | Tailwind CSS | 3.x |
| **Validación Forms** | React Hook Form + Zod | — |
| **Íconos** | Lucide React | — |
| **HTTP Client** | Axios | — |
| **Backend** | NestJS | 10.x |
| **ORM** | TypeORM | — |
| **Base de Datos** | MySQL | 5.7 (prod) / 8.0 (local) |
| **Autenticación** | JWT (Access + Refresh Tokens) | — |
| **Hash de contraseñas** | Bcrypt (10 rounds) | — |
| **IA para CVs** | Google Gemini (`gemini-2.5-flash`) | — |
| **Almacenamiento CVs** | Cloudflare R2 (compatible S3) | — |
| **Contenerización** | Docker + Docker Compose | — |
| **Nube** | Google Cloud Run | — |
| **CI/CD** | GitHub Actions | — |
| **IaC** | Terraform | — |
| **CDN/Hosting Frontend** | Cloudflare Pages | — |

---

## 3. Módulos del Sistema

### 3.1 Módulo de Autenticación (`/auth`)

Gestiona el inicio y cierre de sesión, refresco de tokens y perfil del usuario autenticado.

**Pantallas:**
- `/login` — Formulario de inicio de sesión

**Funcionalidades:**
- Login con usuario y contraseña (bcrypt)
- Emisión de `access_token` (15 min) y `refresh_token` (7 días)
- Rotación de refresh token (cada renovación invalida el anterior)
- Logout con invalidación del refresh token
- Consulta y actualización del perfil del usuario autenticado
- Cambio de contraseña (verificación de clave actual requerida)
- Registro de sesiones activas con IP y dispositivo

---

### 3.2 Módulo de Talentos (`/talentos`)

Núcleo del sistema. Permite gestionar el catálogo completo de profesionales.

**Pantallas:**
- `/talentos` — Listado con filtros y paginación
- `/talentos/nuevo` — Formulario de creación
- `/talentos/:id` — Vista de detalle
- `/talentos/:id/editar` — Formulario de edición
- `/talentos/cargar-cv` — Carga de CV con extracción IA

**Funcionalidades:**
- Listado con filtros por especialidad y estado laboral
- Paginación client-side (10 registros por página)
- Ordenamiento por fecha de creación (más reciente primero)
- Creación con vinculación opcional a empresa
- Edición con control de permisos por rol y empresa
- Eliminación (solo Administrador)
- Carga de CV en PDF con extracción automática de datos por IA
- Almacenamiento del CV en Cloudflare R2
- Vista de detalle con descarga/previsualización del CV
- Botones de editar/eliminar deshabilitados visualmente cuando el usuario no tiene permisos

---

### 3.3 Módulo de Empresas (`/empresas`)

Gestiona las empresas registradas en el sistema a las que pueden asociarse talentos y reclutadores.

**Pantallas:**
- `/empresas` — Listado de empresas
- `/empresas/nueva` — Formulario de creación *(solo Administrador)*
- `/empresas/:id` — Vista de detalle con talentos y reclutadores asignados
- `/empresas/:id/editar` — Formulario de edición *(solo Administrador)*

**Funcionalidades:**
- CRUD completo de empresas
- Filtro por nombre, sector, país y estado
- Vista de detalle con listado de talentos asociados
- Creación y edición restringida a Administradores

---

### 3.4 Módulo de Reclutadores (`/reclutadores`)

Permite al Administrador gestionar los usuarios con rol Reclutador y asignarlos a empresas.

**Pantallas:**
- `/reclutadores` — Listado de reclutadores *(solo Administrador)*
- `/reclutadores/nuevo` — Formulario de creación *(solo Administrador)*

**Funcionalidades:**
- Crear usuarios con rol Reclutador
- Asignar/desasignar reclutadores a múltiples empresas
- Activar/desactivar cuentas de reclutadores
- Visualizar empresas asignadas a cada reclutador

---

### 3.5 Módulo de Dashboard (`/dashboard`)

Panel de inicio con estadísticas y resumen del sistema.

**Funcionalidades:**
- Tarjeta: Total de talentos registrados
- Tarjeta: Total de empresas (solo Administrador)
- Tarjeta: Talentos en estado "Disponible"
- Tarjeta: Talentos registrados por el usuario actual
- Listado de últimos talentos añadidos (ordenados del más nuevo al más viejo)

---

### 3.6 Módulo de Perfil (`/profile`)

Permite al usuario autenticado ver y actualizar sus datos personales.

**Funcionalidades:**
- Ver nombre, correo, teléfono y rol
- Editar nombre, correo y teléfono
- Cambiar contraseña (verificación de clave actual)

---

## 4. Modelo de Datos

### Diagrama de Entidades

```
usuarios
├── id (PK)
├── usuario (UNIQUE)
├── clave (bcrypt hash)
├── nombre
├── correo (UNIQUE)
├── telefono (nullable)
├── rol: 'Administrador' | 'Reclutador'
├── estado: 'Activo' | 'Inactivo'
├── refresh_token_hash (nullable)
├── creado_en
└── actualizado_en
    │
    ├──────────────────────── [1:N] ──────────────────┐
    │                                                  ▼
    │                                             talentos
    │                                             ├── id (PK)
    │                                             ├── nombre_completo
    │                                             ├── correo (nullable)
    │                                             ├── telefono (nullable)
    │                                             ├── especialidad (nullable)
    │                                             ├── estado_laboral: ENUM
    │                                             │   'Disponible' | 'Empleado'
    │                                             │   'Freelance' | 'No Disponible'
    │                                             ├── pais
    │                                             ├── ciudad (nullable)
    │                                             ├── resumen (nullable, TEXT)
    │                                             ├── experiencia_anios (INT)
    │                                             ├── url_cv (nullable)
    │                                             ├── empresa_id (FK nullable)
    │                                             ├── registrado_por (FK)
    │                                             ├── creado_en
    │                                             └── actualizado_en
    │
    └──────── [N:M via reclutador_empresa] ───── empresas
                                                  ├── id (PK)
                                                  ├── nombre
                                                  ├── rif (UNIQUE, nullable)
                                                  ├── sector (nullable)
                                                  ├── correo_contacto (nullable)
                                                  ├── telefono (nullable)
                                                  ├── direccion (nullable, TEXT)
                                                  ├── pais
                                                  ├── ciudad (nullable)
                                                  ├── responsable (nullable)
                                                  ├── estado: 'Activa' | 'Inactiva'
                                                  ├── creado_en
                                                  └── actualizado_en

reclutador_empresa (tabla pivote N:M)
├── id (PK)
├── usuario_id (FK → usuarios)
├── empresa_id (FK → empresas)
├── asignado_en
└── UNIQUE(usuario_id, empresa_id)

sesiones
├── id (PK)
├── usuario_id (FK → usuarios)
├── dispositivo
├── ip_acceso
├── estado: 'Sesión Actual' | etc.
└── creado_en
```

### Configuración de Charset
Todas las tablas usan `utf8mb4_unicode_ci` para soporte completo de caracteres especiales (acentos, ñ, emojis).

---

## 5. API REST — Endpoints

**Autenticación:** Bearer Token (JWT) en header `Authorization`.

### Auth

| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Público | Autenticación con usuario y contraseña |
| `POST` | `/auth/refresh` | Autenticado | Renovar access token con refresh token |
| `POST` | `/auth/logout` | Autenticado | Cerrar sesión e invalidar refresh token |
| `GET` | `/auth/profile` | Autenticado | Obtener perfil del usuario actual |
| `PUT` | `/auth/profile` | Autenticado | Actualizar nombre, correo, teléfono |
| `PUT` | `/auth/change-password` | Autenticado | Cambiar contraseña |
| `GET` | `/auth/sessions` | Autenticado | Listar sesiones activas |

### Talentos

| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/talentos` | Admin, Reclutador | Listar todos los talentos (con filtros por query) |
| `POST` | `/talentos` | Admin, Reclutador | Crear nuevo talento |
| `GET` | `/talentos/:id` | Admin, Reclutador | Obtener detalle de un talento |
| `PUT` | `/talentos/:id` | Admin, Reclutador | Actualizar talento (con validación de permisos) |
| `DELETE` | `/talentos/:id` | **Solo Admin** | Eliminar talento |
| `POST` | `/talentos/upload-cv` | Admin, Reclutador | Subir PDF, extraer datos con IA y almacenar en R2 |

### Empresas

| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/empresas` | Admin, Reclutador | Listar todas las empresas |
| `POST` | `/empresas` | **Solo Admin** | Crear empresa |
| `GET` | `/empresas/:id` | Admin, Reclutador | Detalle de empresa (con talentos y reclutadores) |
| `PUT` | `/empresas/:id` | **Solo Admin** | Actualizar empresa |
| `DELETE` | `/empresas/:id` | **Solo Admin** | Eliminar empresa |

### Usuarios / Reclutadores

| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | **Solo Admin** | Listar todos los usuarios |
| `POST` | `/users` | **Solo Admin** | Crear nuevo usuario (reclutador) |
| `PUT` | `/users/:id` | **Solo Admin** | Actualizar usuario |
| `PUT` | `/users/:id/estado` | **Solo Admin** | Activar / desactivar usuario |

### Reclutador-Empresa (Asignaciones)

| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/reclutador-empresa` | **Solo Admin** | Asignar reclutador a empresa |
| `DELETE` | `/reclutador-empresa/:id` | **Solo Admin** | Desasignar reclutador de empresa |

### Health Check

| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Público | Verificar que el servicio está activo |

---

## 6. Roles y Permisos

### Matriz de Permisos

| Acción | Administrador | Reclutador |
| :--- | :---: | :---: |
| Ver dashboard completo (todas las stats) | ✅ | ⚠️ Parcial |
| Ver todos los talentos | ✅ | ✅ |
| Crear talentos | ✅ | ✅ |
| Editar cualquier talento | ✅ | ❌ |
| Editar talentos propios / de su empresa | ✅ | ✅ |
| Eliminar talentos | ✅ | ❌ |
| Ver empresas | ✅ | ✅ |
| Crear / Editar / Eliminar empresas | ✅ | ❌ |
| Ver reclutadores | ✅ | ❌ |
| Crear / Editar reclutadores | ✅ | ❌ |
| Asignar reclutadores a empresas | ✅ | ❌ |
| Cargar CV con IA | ✅ | ✅ |
| Editar perfil propio | ✅ | ✅ |
| Cambiar contraseña propia | ✅ | ✅ |

### Regla de Permisos para Talentos (Reclutador)

Un reclutador puede **editar** un talento si cumple alguna de estas condiciones:
1. El talento fue registrado por él mismo (`registradoPor.id === user.id`).
2. El talento pertenece a una empresa asignada al reclutador.

En caso contrario, los botones de **Editar** y **Eliminar** se muestran visualmente deshabilitados (gris, `cursor-not-allowed`) con tooltip explicativo.

---

## 7. Flujos Principales

### 7.1 Flujo de Autenticación

```
Usuario ingresa credenciales
        ↓
POST /auth/login
        ↓
Backend verifica usuario en BD
        ↓
Bcrypt compara la contraseña
        ↓
Genera access_token (15 min) + refresh_token (7 días)
        ↓
Guarda hash del refresh_token en BD
        ↓
Retorna ambos tokens al cliente
        ↓
Cliente almacena en memoria (access) y cookie httpOnly (refresh)
        ↓
Cada petición incluye: Authorization: Bearer <access_token>
        ↓
Al expirar → POST /auth/refresh → nuevo access_token
        ↓
Logout → POST /auth/logout → borra hash en BD
```

### 7.2 Flujo de Carga de CV con IA

```
Usuario arrastra/selecciona un PDF en /talentos/cargar-cv
        ↓
Frontend envía multipart/form-data a POST /talentos/upload-cv
        ↓
Backend recibe el buffer del PDF
        ↓
pdf-parse extrae el texto del PDF
        ↓
Google Gemini (gemini-2.5-flash) analiza el texto
        ↓
Gemini retorna JSON con:
  { nombre_completo, correo, telefono, especialidad,
    pais, ciudad, experiencia_anios, resumen }
        ↓
R2StorageService sube el PDF a Cloudflare R2
        ↓
Backend retorna: datos extraídos + url_cv (presigned URL)
        ↓
Frontend prelllena el formulario de creación de talento
        ↓
Usuario revisa, corrige y guarda → POST /talentos
```

### 7.3 Flujo de Registro de Talento Manual

```
Usuario accede a /talentos/nuevo
        ↓
Completa formulario:
  - Nombre completo (requerido)
  - Correo (opcional)
  - Teléfono (opcional, con máscara)
  - Especialidad (opcional)
  - Estado laboral (Disponible por defecto)
  - País / Ciudad (opcional)
  - Años de experiencia (opcional)
  - Empresa asociada (selector, opcional)
  - Resumen (opcional, max 500 chars)
        ↓
React Hook Form + Zod validan en cliente
        ↓
POST /talentos → Backend valida con class-validator
        ↓
TypeORM inserta en tabla talentos
        ↓
Backend retorna el talento creado con relaciones
        ↓
Frontend redirige a /talentos con toast de éxito
```

---

## 8. Infraestructura y Despliegue

### Recursos en Google Cloud Platform

| Recurso | Nombre | Descripción |
| :--- | :--- | :--- |
| **VPC Network** | `credenly-vpc-network` | Red privada compartida |
| **Subnet** | `talentia-vpc-subnet` | Subred `10.9.0.0/28` en `us-central1` |
| **VPC Connector** | `talentia-vpc-connector` | Conector Serverless VPC para Cloud Run → MySQL |
| **Artifact Registry** | `credenly-repo` | Repositorio Docker compartido |
| **Cloud Run** | `talentia-backend-nestjs` | Servicio backend (máx. 1 instancia) |
| **MySQL** | VM en GCP (VPC privada) | Contenedor Docker `credenly_mysql_db` en puerto 3306 |
| **Terraform State** | `credenly-tf-state` | Bucket GCS con prefijo `terraform/talentia-state` |

### Configuración Cloud Run

| Parámetro | Valor |
| :--- | :--- |
| Imagen | `us-central1-docker.pkg.dev/[PROJECT]/credenly-repo/talentia-backend:latest` |
| Región | `us-central1` |
| Máx. instancias | `1` |
| Egress VPC | `PRIVATE_RANGES_ONLY` (IPs privadas → VPC connector; internet → directo) |
| Puerto | Automático (inyectado por Cloud Run en `$PORT`) |
| Autenticación | `noauth` (pública, el JWT protege los endpoints) |

### Pipeline CI/CD (GitHub Actions)

```
Push a rama `main`
        ↓
[Job 1] Terraform (infra)
  - terraform init → plan → apply
  - Provisiona: subnet, VPC connector, Cloud Run
        ↓
[Job 2] Backend (solo si cambió backend/ o infra/)
  - docker build → push a Artifact Registry
  - gcloud run deploy talentia-backend-nestjs
  - Inyecta secretos desde GitHub Repository Secrets
        ↓
[Job 3] Frontend (solo si cambió frontend/ o infra/)
  - npm install → npm run build
  - Deploy en Cloudflare Pages (proyecto: talentia)
```

---

## 9. Variables de Entorno y Secretos

### Backend (`.env` local / GitHub Secrets en producción)

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DB_HOST` | Host del servidor MySQL | `10.x.x.x` |
| `DB_PORT` | Puerto MySQL | `3306` |
| `DB_USER` | Usuario de la BD | `credenly_user` |
| `DB_PASSWORD` | Contraseña de la BD | `***` |
| `DB_NAME` | Nombre de la BD | `talentia_db` |
| `JWT_ACCESS_SECRET` | Secreto para firmar access tokens | String aleatorio |
| `JWT_REFRESH_SECRET` | Secreto para firmar refresh tokens | String aleatorio |
| `JWT_ACCESS_EXPIRATION` | Duración del access token | `15m` |
| `JWT_REFRESH_EXPIRATION` | Duración del refresh token | `7d` |
| `FRONTEND_URL` | URL del frontend (CORS) | `https://talentia.ronaldvizcaya.com` |
| `GEMINI_API_KEY` | Clave API de Google Gemini | `AI...` |
| `R2_ACCOUNT_ID` | ID de cuenta Cloudflare | `***` |
| `R2_ACCESS_KEY_ID` | Clave de acceso R2 | `***` |
| `R2_SECRET_ACCESS_KEY` | Secreto R2 | `***` |
| `R2_BUCKET_NAME` | Nombre del bucket R2 | `talentia-cvs` |
| `R2_PUBLIC_URL` | URL pública del bucket R2 | `https://...r2.dev` |

### GitHub Actions (Secrets adicionales)

| Secret | Descripción |
| :--- | :--- |
| `GCP_PROJECT_ID` | ID del proyecto de Google Cloud |
| `GCP_SA_KEY` | JSON de la cuenta de servicio GCP (base64) |
| `CLOUDFLARE_API_TOKEN` | Token de API de Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | ID de cuenta de Cloudflare |

---

## 10. Instrucciones de Instalación Local

### Opción A: Docker Compose (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/TecnoCodigo/Talentia.git
cd Talentia

# 2. Crear archivo de entorno
copy .env.example .env    # Windows
# cp .env.example .env   # Linux/Mac

# 3. Levantar todos los servicios
docker-compose up -d --build
```

**Servicios disponibles:**

| Servicio | URL |
| :--- | :--- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api |
| MySQL | localhost:3306 |

### Opción B: Manual (sin Docker)

```bash
# Base de datos
mysql -u root -p < doc/database.sql

# Backend
cd backend
npm install
npm run start:dev    # http://localhost:4000/api

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev          # http://localhost:3000
```

### Credenciales de Prueba

| Usuario | Contraseña | Rol |
| :--- | :--- | :--- |
| `admin` | `Password123!` | Administrador |
| `recruiter1` | `Password123!` | Reclutador (emp: TechVenezuela, Consulting Group) |
| `recruiter2` | `Password123!` | Reclutador (emp: DataSoft Inc.) |

> **Nota:** El hash bcrypt de `Password123!` es:
> `$2b$10$3Spkg63edAoyiHesqn3KdOAyHK5HzOyhIN798cLA4ugSCAW1bINl2`

---

*Documento generado automáticamente a partir del análisis del repositorio TecnoCodigo/Talentia — Agosto 2026*
