# Manual de Usuario e Instalación - Talentia

## Requisitos Previos
- **Node.js**: v18+ (para ejecución manual)
- **Docker & Docker Compose**: Recomendado (para inicio rápido sin instalar MySQL en el sistema)
- **MySQL**: 8.0+ (si se ejecuta de forma manual sin Docker)

---

## 💻 Guía de Despliegue Local

Puedes ejecutar la aplicación en tu máquina local mediante dos métodos simples:

---

### Opción A: Despliegue Automatizado con Docker Compose (Recomendada) 🐳

Es el método más sencillo y rápido ya que Docker se encarga de crear el contenedor de MySQL 8.0, importar los datos de prueba iniciales, compilar la API Backend en NestJS y servir el Frontend en React.

#### Paso 1: Clonar el repositorio y acceder a la carpeta
```bash
git clone <URL_DEL_REPOSITO>
cd talentia
```

#### Paso 2: Crear el archivo de entorno `.env`
Copia el archivo de ejemplo para generar tu archivo `.env`:
```bash
cp .env.example .env
```
*(En Windows con PowerShell: `copy .env.example .env`)*

> 💡 **Nota**: Los valores predeterminados en `.env.example` funcionan inmediatamente para la base de datos MySQL en local. Si deseas probar la lectura de CVs con Inteligencia Artificial (Google Gemini) o el almacenamiento en Cloudflare R2, coloca tu `GEMINI_API_KEY` y credenciales de `R2_*` dentro de `.env`.

#### Paso 3: Compilar y levantar los contenedores
Ejecuta el siguiente comando en la raíz del proyecto:
```bash
docker-compose up -d --build
```

#### Paso 4: Acceder a la aplicación
Una vez finalizado el proceso de construcción:
- **Frontend (React App):** Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
- **Backend (API REST NestJS):** [http://localhost:4000/api](http://localhost:4000/api)
- **MySQL (Base de Datos):** Puerto `3306` (Base de datos: `sistema_autenticacion` / `talentia_db`, Usuario: `credenly_user`, Clave: `credenly_password`).

---

### Opción B: Despliegue Manual (Sin Docker) 🛠️

Si prefieres ejecutar el backend y frontend independientemente en tu sistema operativo:

#### Paso 1: Preparar la Base de Datos en MySQL
1. Inicia tu servidor local de MySQL 8.0.
2. Importa el archivo de base de datos e inicialización ubicado en `doc/database.sql`:
   ```bash
   mysql -u root -p < doc/database.sql
   ```

#### Paso 2: Ejecutar el Backend (NestJS)
1. Abre una terminal y navega a la carpeta backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` dentro de `backend/` con la configuración de tu MySQL local.
4. Inicia el servidor de desarrollo:
   ```bash
   npm run start:dev
   ```
   *El backend estará corriendo en `http://localhost:4000/api`*

#### Paso 3: Ejecutar el Frontend (React + Vite)
1. Abre otra terminal y navega a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:3000` (o la URL indicada por Vite)*

---

## 🔑 Credenciales de Prueba por Defecto

El script inicializa automáticamente la base de datos con los siguientes usuarios de prueba (contraseña para todos en texto plano: **`Password123!`**):

| Usuario | Contraseña | Rol | Correo | Permisos / Acceso |
| :--- | :--- | :--- | :--- | :--- |
| `admin` | `Password123!` | **Administrador** | admin@talentia.com | Acceso total a todos los módulos y gestión de reclutadores |
| `recruiter1` | `Password123!` | **Reclutador** | recruiter1@talentia.com | Asignado a empresas TechVenezuela y Consulting Group |
| `recruiter2` | `Password123!` | **Reclutador** | recruiter2@talentia.com | Asignado a empresa DataSoft Inc. |

---

## 🧩 Funcionalidades

### Panel principal (Dashboard)
- Tarjetas con estadísticas: total de talentos, empresas (solo Admin), talentos disponibles y mis talentos.
- Listado de los últimos talentos añadidos (**ordenados del más nuevo al más viejo**).

### Gestión de Talentos
- **Listado** con filtros por especialidad, estado laboral, país y paginación.
- **Detalle** con contacto, experiencia, empresa asociada y previsualizador/descarga del CV.
- **Creación/Edición** mediante formulario validado (react-hook-form + zod) con máscara de teléfono y selección de empresa.
- **Carga de CV opcional e intuitiva**:
  - Arrastrar y soltar un archivo PDF para precargar datos automáticamente mediante **Google Gemini AI**.
  - El CV es opcional tanto en la creación como en la edición.
  - Generación de **URLs prefirmadas temporales de Cloudflare R2** para visualización directa y segura sin URLs técnicas expuestas al usuario.

### Gestión de Empresas
- Listado con filtros (sector, estado) y paginación.
- Detalle con responsable, contacto, ubicación.
- Creación/Edición (solo Administrador).

### Gestión de Reclutadores (solo Administrador)
- Listado con búsqueda, filtro por estado y columna de **Empresas Asignadas**.
- Registro de nuevos reclutadores con **asignación a múltiples empresas** mediante casillas de verificación (checkboxes).
- Activar/Desactivar reclutadores desde el listado.

### Perfil y Sesiones
- Visualización de datos del usuario y rol.
- Historial de últimas sesiones (dispositivo, IP, fecha).
- Modal con gestión completa de sesiones: filtros por estado, paginación y revocación remota.

### Experiencia de usuario y Validaciones
- **Mensajes de validación claros y amigables**: En todos los formularios se indican claramente los campos obligatorios con `*` y opcionales con `(Opcional)`, eliminando mensajes genéricos como "Invalid input".
- **Modo oscuro** con toggle persistente en el header.
- **Responsive**: mobile-first, sidebar colapsable en móvil, tablas con scroll horizontal.

---

## 🔐 Sistema de Permisos Multiempresa

Un reclutador puede ver y editar un talento si:
1. Lo creó él mismo (`registrado_por`), o
2. Está asociado a cualquiera de las empresas asignadas al reclutador (relación Many-to-Many en `reclutador_empresa`).

El Administrador siempre tiene acceso total a todos los módulos.

---

## ☁️ Despliegue Automatizado (CI/CD Seguro)

El sistema cuenta con integración y entrega continua (CI/CD) automatizada mediante **GitHub Actions** (`.github/workflows/deploy.yml`).

### Proceso de Despliegue a Producción:
1. **Infraestructura con Terraform**: Terraform orquesta la subred VPC, repositorio de Docker en Google Artifact Registry y el servicio de Cloud Run.
2. **Construcción y Registro**: `docker build` empaqueta el backend en NestJS y lo almacena en Google Artifact Registry.
3. **Despliegue Serverless en Cloud Run**: Se actualiza el servicio `talentia-backend-nestjs` inyectando de forma 100% segura todas las credenciales (`DB_*`, `JWT_*`, `GEMINI_API_KEY`, `R2_*`) desde los **GitHub Repository Secrets**, sin exponer información sensible en el código público.
4. **Despliegue del Frontend**: Se compila el frontend en React con la URL del API e instala en la red de borde de **Cloudflare Pages**.