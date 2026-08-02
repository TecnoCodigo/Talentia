# 📋 Plan de Implementación — Talentia (Gestor de Talentos)

**Fecha:** 01/08/2026
**Materia:** Programación IV — Tema III: Programación Web Avanzada
**Ponderación:** 25%

---

## 1. Contexto y Estado Actual

### Monolito Existente (Credenly)
El proyecto actual es un sistema de autenticación ya funcional con:

| Capa | Tecnología | Detalle |
|------|-----------|---------|
| **Backend** | NestJS + TypeORM | API REST, JWT (access + refresh), bcrypt, SSE |
| **Frontend** | React + Vite + TailwindCSS 3 | SPA responsive, Axios interceptors |
| **BD** | MySQL 8 (Docker) | Tablas: `usuarios`, `sesiones` |
| **Deploy** | Docker Compose + CI/CD | GitHub Actions → GCP Cloud Run + Cloudflare Pages |

### Objetivo
Transformar **Credenly** → **Talentia**: un gestor de talentos con CRUD completo, dos roles (Administrador y Reclutador), gestión de empresas, carga de CVs con lectura automática por IA (Google Gemini), y filtros avanzados.

---

## 2. Decisiones Técnicas Confirmadas

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| **Parsing de CVs** | Google Gemini API | Mayor precisión que regex para extraer datos estructurados de un PDF |
| **Storage de CVs** | Cloudflare R2 | Storage compatible S3 integrado en el ecosistema del deploy existente (Cloudflare Pages) |
| **Branding** | Talentia (logo: círculo placeholder) | Se renombra todo; logo temporal es un círculo sólido con la letra "T" |
| **Permisos de edición** | Por grupo (asociación Reclutador↔Empresa) | El reclutador puede editar talentos de las empresas a las que está asociado + los que él cargó |
| **Relación Reclutador↔Empresa** | Many-to-Many | Un reclutador puede estar asociado a varias empresas simultáneamente |
| **Campo extra en Empresa** | `responsable` | Persona responsable/contacto principal de la empresa |

---

## 3. Sistema de Permisos por Grupos (Reclutador ↔ Empresa)

### Lógica de Permisos para Edición de Talentos

```
¿Puede el reclutador editar este talento?

  ┌─ ¿Lo creó él mismo? (registrado_por = usuario.id)
  │    └─ SÍ → ✅ Puede editar
  │
  ├─ ¿Está asociado a la empresa del talento? (tabla reclutador_empresa)
  │    └─ SÍ → ✅ Puede editar
  │
  └─ Ninguna condición se cumple
       └─ ❌ Solo puede VER, no editar
```

### Tabla Intermedia: `reclutador_empresa`

```sql
CREATE TABLE `reclutador_empresa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,          -- FK → usuarios.id (reclutador)
  `empresa_id` INT NOT NULL,          -- FK → empresas.id
  `asignado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_reclutador_empresa` (`usuario_id`, `empresa_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Ventajas de este modelo:
- **Sin permisos 1 a 1**: Al asociar un reclutador a una empresa, automáticamente puede editar TODOS los talentos de esa empresa
- **Escalable**: Un reclutador nuevo asociado a 3 empresas inmediatamente tiene acceso a editar los talentos de las 3
- **Auditable**: Se sabe cuándo se asignó cada reclutador a cada empresa
- **Admin siempre tiene acceso total**: El Administrador puede editar/eliminar cualquier talento sin restricción

---

## 4. Arquitectura de Base de Datos

### Diagrama Entidad-Relación

```
┌──────────────────┐
│     usuarios     │
│──────────────────│
│ id (PK)          │
│ usuario          │        ┌─────────────────────┐
│ clave            │        │  reclutador_empresa  │
│ nombre           │        │─────────────────────│
│ correo           │◄───────│ usuario_id (FK)      │
│ telefono         │        │ empresa_id (FK) ─────│──┐
│ rol              │        │ asignado_en          │  │
│ estado           │        └─────────────────────┘  │
│ refresh_token_h  │                                  │
│ creado_en        │     ┌────────────────────┐       │
│ actualizado_en   │     │     empresas       │       │
└────────┬─────────┘     │────────────────────│       │
         │               │ id (PK) ◄──────────│───────┘
         │               │ nombre             │
         │               │ rif                │
┌────────┴─────────┐     │ sector             │
│    sesiones      │     │ correo_contacto    │
│──────────────────│     │ telefono           │
│ id (PK)          │     │ direccion          │
│ usuario_id (FK)  │     │ pais              │
│ dispositivo      │     │ ciudad             │
│ ip_acceso        │     │ responsable        │    ┌──────────────────┐
│ estado           │     │ estado             │    │    talentos       │
│ creado_en        │     │ creado_en          │    │──────────────────│
└──────────────────┘     │ actualizado_en     │    │ id (PK)          │
                         └────────────────────┘    │ nombre_completo  │
                                  ▲                │ correo           │
                                  │ FK             │ telefono         │
                                  │                │ especialidad     │
                              ┌───┴────────────┐   │ estado_laboral   │
                              │                │   │ pais             │
                              │   empresa_id ──│───│ ciudad           │
                              │                │   │ resumen          │
                              │                │   │ experiencia_anios│
                              │ registrado_por─│──►│ url_cv           │
                              │   (FK→usuarios)│   │ empresa_id (FK)  │
                              └────────────────┘   │ registrado_por   │
                                                   │ creado_en        │
                                                   │ actualizado_en   │
                                                   └──────────────────┘
```

### SQL — Tablas Nuevas

#### Tabla `empresas`
```sql
CREATE TABLE `empresas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(150) NOT NULL,
  `rif` VARCHAR(30) NULL UNIQUE,
  `sector` VARCHAR(100) NULL,
  `correo_contacto` VARCHAR(100) NULL,
  `telefono` VARCHAR(30) NULL,
  `direccion` TEXT NULL,
  `pais` VARCHAR(80) NOT NULL DEFAULT 'Venezuela',
  `ciudad` VARCHAR(80) NULL,
  `responsable` VARCHAR(150) NULL,
  `estado` ENUM('Activa', 'Inactiva') NOT NULL DEFAULT 'Activa',
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabla `talentos`
```sql
CREATE TABLE `talentos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre_completo` VARCHAR(150) NOT NULL,
  `correo` VARCHAR(100) NULL,
  `telefono` VARCHAR(30) NULL,
  `especialidad` VARCHAR(100) NULL,
  `estado_laboral` ENUM('Disponible','Empleado','Freelance','No Disponible') NOT NULL DEFAULT 'Disponible',
  `pais` VARCHAR(80) NOT NULL DEFAULT 'Venezuela',
  `ciudad` VARCHAR(80) NULL,
  `resumen` TEXT NULL,
  `experiencia_anios` INT NULL DEFAULT 0,
  `url_cv` VARCHAR(500) NULL,
  `empresa_id` INT NULL,
  `registrado_por` INT NOT NULL,
  `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`registrado_por`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Tabla `reclutador_empresa`
```sql
CREATE TABLE `reclutador_empresa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `empresa_id` INT NOT NULL,
  `asignado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_reclutador_empresa` (`usuario_id`, `empresa_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### Modificaciones a tabla `usuarios`
```sql
-- Agregar campo estado y cambiar default de rol
ALTER TABLE `usuarios`
  ADD COLUMN `estado` ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo' AFTER `rol`,
  MODIFY COLUMN `rol` VARCHAR(30) NOT NULL DEFAULT 'Reclutador';
```

---

## 5. Flujo de Carga de CV con Gemini AI

```
┌─────────────┐     ┌───────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Reclutador  │────►│  Frontend     │────►│  Backend NestJS │────►│ Cloudflare   │
│  Sube PDF   │     │  Drag & Drop  │     │  POST /upload-cv│     │ R2 Storage   │
└─────────────┘     └───────────────┘     └────────┬────────┘     └──────────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │  Gemini API     │
                                          │  Extrae datos:  │
                                          │  - Nombre       │
                                          │  - Correo       │
                                          │  - Teléfono     │
                                          │  - Especialidad │
                                          │  - País         │
                                          │  - Experiencia  │
                                          │  - Resumen      │
                                          └────────┬────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │ Retorna JSON    │
                                          │ con datos       │
                                          │ pre-llenados    │
                                          └────────┬────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │ Frontend        │
                                          │ Pre-llena form  │
                                          │ Reclutador      │
                                          │ revisa y ajusta │
                                          │ Selecciona      │
                                          │ empresa         │
                                          │ ──► Guardar     │
                                          └─────────────────┘
```

### Prompt para Gemini (extracto)
```
Analiza el siguiente texto extraído de un CV/currículum y devuelve 
un JSON con los siguientes campos:
{
  "nombre_completo": "",
  "correo": "",
  "telefono": "",
  "especialidad": "",
  "pais": "",
  "ciudad": "",
  "experiencia_anios": 0,
  "resumen": "" // máximo 300 caracteres
}
Si no encuentras un campo, déjalo como null.
```

---

## 6. Archivos a Crear y Modificar

### 6.1 Backend — Archivos NUEVOS (~18 archivos)

| Archivo | Descripción |
|---------|-------------|
| `src/common/guards/roles.guard.ts` | Guard que verifica `@Roles()` contra `req.user.rol` |
| `src/common/decorators/roles.decorator.ts` | Decorador `@Roles('Administrador')` |
| `src/empresas/empresa.entity.ts` | Entidad TypeORM con campo `responsable`, relaciones |
| `src/empresas/empresas.service.ts` | CRUD + filtros por ubicación y estado |
| `src/empresas/empresas.controller.ts` | Endpoints REST protegidos por rol |
| `src/empresas/dto/create-empresa.dto.ts` | DTO con validaciones class-validator |
| `src/empresas/dto/update-empresa.dto.ts` | DTO parcial (PartialType) |
| `src/talentos/talento.entity.ts` | Entidad con relaciones ManyToOne a Empresa y User |
| `src/talentos/talentos.service.ts` | CRUD + filtros avanzados + lógica permisos edición |
| `src/talentos/talentos.controller.ts` | Endpoints REST incluido upload CV |
| `src/talentos/dto/create-talento.dto.ts` | DTO con validaciones |
| `src/talentos/dto/update-talento.dto.ts` | DTO parcial |
| `src/cv-parser/cv-parser.service.ts` | Extrae texto PDF → envía a Gemini → retorna JSON |
| `src/storage/r2-storage.service.ts` | Servicio para subir/descargar archivos a Cloudflare R2 |
| `src/reclutador-empresa/reclutador-empresa.entity.ts` | Entidad tabla intermedia M:N |
| `src/reclutador-empresa/reclutador-empresa.service.ts` | Asignar/desasignar reclutadores a empresas |
| `src/reclutador-empresa/reclutador-empresa.controller.ts` | Endpoints para gestionar asignaciones (Admin) |
| `src/reclutador-empresa/dto/asignar-reclutador.dto.ts` | DTO de asignación |

### 6.2 Backend — Archivos a MODIFICAR (~7 archivos)

| Archivo | Cambios |
|---------|---------|
| `src/app.module.ts` | Registrar entidades, módulos, MulterModule |
| `src/users/user.entity.ts` | Campo `estado`, relaciones OneToMany |
| `src/users/users.service.ts` | CRUD reclutadores, findAll con filtros |
| `src/auth/auth.controller.ts` | Endpoint POST /auth/register (Admin only) |
| `src/main.ts` | Servir estáticos de uploads |
| `package.json` | Deps: `pdf-parse`, `@google/generative-ai`, `@aws-sdk/client-s3` |
| `Dockerfile` | Crear carpeta uploads |

### 6.3 Frontend — Archivos NUEVOS (~16 archivos)

| Archivo | Descripción |
|---------|-------------|
| `src/components/Layout/DashboardLayout.jsx` | Layout con Sidebar + Header + Content |
| `src/components/Layout/Sidebar.jsx` | Navegación lateral responsiva, menú según rol |
| `src/components/Layout/Header.jsx` | Header con logo, usuario, rol badge, logout |
| `src/components/UI/DataTable.jsx` | Tabla reutilizable con paginación y acciones |
| `src/components/UI/Modal.jsx` | Modal para confirmaciones y formularios |
| `src/components/UI/Toast.jsx` | Notificaciones toast (éxito/error/info) |
| `src/components/UI/FilterBar.jsx` | Barra de filtros configurable |
| `src/components/UI/StatsCard.jsx` | Tarjeta de estadísticas para dashboard |
| `src/pages/Dashboard.jsx` | Panel con stats + listados recientes |
| `src/pages/talentos/TalentosListado.jsx` | Tabla con filtros: empresa, estado, correo, especialidad, país |
| `src/pages/talentos/TalentoFormulario.jsx` | Crear/Editar talento con validación |
| `src/pages/talentos/TalentoDetalle.jsx` | Vista detallada + descarga CV |
| `src/pages/talentos/CargarCV.jsx` | Drag & drop → Gemini AI → pre-llenado → guardar |
| `src/pages/empresas/EmpresasListado.jsx` | Tabla con filtros: ubicación, estado |
| `src/pages/empresas/EmpresaFormulario.jsx` | Crear/Editar empresa |
| `src/pages/empresas/EmpresaDetalle.jsx` | Vista detallada + talentos asociados |
| `src/pages/reclutadores/ReclutadoresListado.jsx` | Gestión reclutadores (Admin only) |
| `src/pages/reclutadores/ReclutadorFormulario.jsx` | Registrar reclutador + asignar empresas |

### 6.4 Frontend — Archivos a MODIFICAR (~7 archivos)

| Archivo | Cambios |
|---------|---------|
| `src/App.jsx` | Nuevas rutas, DashboardLayout |
| `src/context/AuthContext.jsx` | Helper `hasRole()`, redirección por rol |
| `src/components/ProtectedRoute.jsx` | Prop `roles` para restricción |
| `src/pages/Login.jsx` | Branding Talentia, redirigir a /dashboard |
| `src/pages/Profile.jsx` | Integrar en DashboardLayout |
| `index.html` | Título y meta Talentia |
| `package.json` | Deps: `react-dropzone` |

### 6.5 Configuración y Documentación

| Archivo | Cambios |
|---------|---------|
| `docker-compose.yml` | Containers `talentia_*`, BD `talentia_db`, volumen uploads |
| `.env.example` | Variables: `GEMINI_API_KEY`, `R2_*`, `DB_NAME=talentia_db` |
| `doc/database.sql` | Script completo con 5 tablas + datos de prueba |
| `doc/README.md` | Reescribir para Talentia |
| `doc/ROLES.md` | Actualizar roles del equipo |
| `doc/MANUAL_USUARIO.md` | Documentar flujo completo |
| `doc/GRUPO.md` | Actualizar nombre proyecto |

---

## 7. Endpoints API — Referencia Completa

### Auth (existentes + nuevos)
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/auth/login` | Público | Iniciar sesión |
| POST | `/api/auth/refresh` | Público | Renovar tokens |
| GET | `/api/auth/profile` | Auth | Perfil del usuario |
| POST | `/api/auth/logout` | Auth | Cerrar sesión |
| GET | `/api/auth/sessions` | Auth | Historial de sesiones |
| DELETE | `/api/auth/sessions/:id` | Auth | Revocar sesión |
| **POST** | **`/api/auth/register`** | **Admin** | **Registrar reclutador** |

### Empresas (todos nuevos)
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/empresas` | Admin | Crear empresa |
| GET | `/api/empresas` | Admin, Reclutador | Listar + filtros (pais, estado) |
| GET | `/api/empresas/:id` | Admin, Reclutador | Detalle empresa |
| PUT | `/api/empresas/:id` | Admin | Actualizar empresa |
| DELETE | `/api/empresas/:id` | Admin | Eliminar empresa |

### Talentos (todos nuevos)
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/talentos` | Admin, Reclutador | Crear talento |
| GET | `/api/talentos` | Admin, Reclutador | Listar + filtros |
| GET | `/api/talentos/:id` | Admin, Reclutador | Detalle talento |
| PUT | `/api/talentos/:id` | Admin, Reclutador* | Actualizar talento |
| DELETE | `/api/talentos/:id` | Admin | Eliminar talento |
| POST | `/api/talentos/upload-cv` | Admin, Reclutador | Subir CV → Gemini → datos |

> *Reclutador solo puede editar talentos que creó o de empresas asignadas

### Reclutador-Empresa (todos nuevos)
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/asignaciones` | Admin | Asignar reclutador a empresa |
| GET | `/api/asignaciones/:userId` | Admin | Ver empresas de un reclutador |
| DELETE | `/api/asignaciones/:id` | Admin | Quitar asignación |

### Usuarios / Reclutadores (nuevos)
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/api/usuarios` | Admin | Listar reclutadores |
| GET | `/api/usuarios/:id` | Admin | Detalle reclutador |
| PUT | `/api/usuarios/:id` | Admin | Editar reclutador |
| PATCH | `/api/usuarios/:id/estado` | Admin | Activar/Desactivar |

---

## 8. Rutas Frontend

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/login` | Login.jsx | Público |
| `/dashboard` | Dashboard.jsx | Admin, Reclutador |
| `/talentos` | TalentosListado.jsx | Admin, Reclutador |
| `/talentos/nuevo` | TalentoFormulario.jsx | Admin, Reclutador |
| `/talentos/cargar-cv` | CargarCV.jsx | Admin, Reclutador |
| `/talentos/:id` | TalentoDetalle.jsx | Admin, Reclutador |
| `/talentos/:id/editar` | TalentoFormulario.jsx | Admin, Reclutador* |
| `/empresas` | EmpresasListado.jsx | Admin, Reclutador |
| `/empresas/nueva` | EmpresaFormulario.jsx | Admin |
| `/empresas/:id` | EmpresaDetalle.jsx | Admin, Reclutador |
| `/empresas/:id/editar` | EmpresaFormulario.jsx | Admin |
| `/reclutadores` | ReclutadoresListado.jsx | Admin |
| `/reclutadores/nuevo` | ReclutadorFormulario.jsx | Admin |
| `/profile` | Profile.jsx | Admin, Reclutador |

---

## 9. Variables de Entorno Nuevas

```env
# Base de Datos (modificado)
DB_NAME=talentia_db

# Google Gemini API (CV parsing)
GEMINI_API_KEY=tu_api_key_de_gemini

# Cloudflare R2 Storage
R2_ACCOUNT_ID=tu_account_id
R2_ACCESS_KEY_ID=tu_access_key
R2_SECRET_ACCESS_KEY=tu_secret_key
R2_BUCKET_NAME=talentia-cvs
R2_PUBLIC_URL=https://tu-dominio.r2.cloudflarestorage.com
```

---

## 10. Orden de Ejecución (5 Fases)

### Fase 1: Base de Datos y Backend Core
1. Reescribir `doc/database.sql` con 5 tablas + datos de prueba
2. Crear entidades TypeORM: `Empresa`, `Talento`, `ReclutadorEmpresa`
3. Modificar entidad `User` (campo `estado`, relaciones)
4. Crear DTOs con validaciones (class-validator)
5. Implementar `RolesGuard` + decorador `@Roles()`
6. Actualizar `app.module.ts`

### Fase 2: Backend — Servicios y Controllers
7. Implementar CRUD `EmpresasService` + `EmpresasController`
8. Implementar CRUD `TalentosService` + `TalentosController` con lógica de permisos
9. Implementar `R2StorageService` (subir/descargar de Cloudflare R2)
10. Implementar `CvParserService` (pdf-parse + Gemini API)
11. Implementar `ReclutadorEmpresaService` + Controller
12. Extender `UsersService` con CRUD reclutadores
13. Agregar `POST /auth/register` en AuthController
14. Instalar dependencias: `pdf-parse`, `@google/generative-ai`, `@aws-sdk/client-s3`

### Fase 3: Frontend — Layout y Navegación
15. Crear `DashboardLayout`, `Sidebar`, `Header`
16. Crear componentes UI: `DataTable`, `Modal`, `Toast`, `FilterBar`, `StatsCard`
17. Modificar `App.jsx` con nuevas rutas
18. Modificar `ProtectedRoute` con prop `roles`
19. Modificar `AuthContext` con helper `hasRole()` y `canEditTalento()`

### Fase 4: Frontend — Páginas CRUD
20. Implementar `Dashboard.jsx` con stats y listados recientes
21. Implementar páginas de Talentos (Listado, Formulario, Detalle)
22. Implementar `CargarCV.jsx` (drag & drop → Gemini → formulario pre-llenado)
23. Implementar páginas de Empresas (Listado, Formulario, Detalle)
24. Implementar páginas de Reclutadores + asignación a empresas (Admin only)

### Fase 5: Branding, Documentación y Verificación
25. Actualizar branding en Login, Profile, index.html (Credenly → Talentia)
26. Generar logo placeholder (círculo + "T")
27. Actualizar Docker Compose y .env.example
28. Reescribir documentación: README, ROLES, MANUAL_USUARIO, GRUPO
29. Probar flujo completo con Docker Compose

---

## 11. Datos de Prueba

### Usuarios
| Usuario | Contraseña | Rol | Estado |
|---------|-----------|-----|--------|
| `admin` | `Password123!` | Administrador | Activo |
| `recruiter1` | `Password123!` | Reclutador | Activo |
| `recruiter2` | `Password123!` | Reclutador | Activo |

### Empresas
| Nombre | Sector | País | Estado | Responsable |
|--------|--------|------|--------|-------------|
| TechVenezuela C.A. | Tecnología | Venezuela | Activa | María González |
| Consulting Group | Consultoría | Colombia | Activa | Juan Rodríguez |
| DataSoft Inc. | Software | Argentina | Activa | Pedro Martínez |

### Talentos (5 de ejemplo)
Se incluirán talentos asignados a las empresas de prueba con diferentes estados laborales, especialidades y países.

### Asignaciones Reclutador-Empresa
| Reclutador | Empresas Asignadas |
|------------|-------------------|
| recruiter1 | TechVenezuela, Consulting Group |
| recruiter2 | DataSoft Inc. |

---

## 12. Verificación Final

### Checklist de Requisitos de la Materia ✅
- [x] Base de Datos MySQL con tablas, llaves primarias y tipos correctos
- [x] Script SQL (.sql) dentro del proyecto para restauración
- [x] CRUD completo: Crear, Leer/Consultar, Actualizar, Eliminar
- [x] Validación previa de campos en formularios
- [x] Vista organizada (tablas/tarjetas) para visualizar registros
- [x] Formulario para modificar registros existentes
- [x] Botón/opción para eliminar registros
- [x] Conexión independiente (TypeORM como ORM equivalente a PDO)
- [x] Sentencias preparadas / sanitización (class-validator + TypeORM)
- [x] Interfaz responsive (TailwindCSS + media queries)
- [x] Web Responsive adaptada a móviles

### Tests Manuales
1. Login Admin → acceso total a todos los módulos
2. Login Reclutador → acceso limitado (no puede eliminar, no gestiona reclutadores)
3. CRUD Empresas: crear, listar, filtrar, editar, eliminar
4. CRUD Talentos: crear, listar, filtrar, editar (verificar permisos), eliminar
5. Carga CV: subir PDF → Gemini extrae datos → pre-llena formulario → guardar
6. Permisos: reclutador edita solo sus talentos y los de empresas asignadas
7. Registro Reclutador: admin crea cuenta → reclutador inicia sesión
8. Responsive: probar 320px+, 768px+, 1024px+
