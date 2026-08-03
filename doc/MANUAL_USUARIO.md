# Manual de Usuario e Instalación - Talentia

## Requisitos Previos
- Node.js (v18+)
- Docker y Docker Compose (opción recomendada para BD local)
- MySQL 8.0 (si se ejecuta sin Docker)

---

## 🚀 Ejecución Rápida con Docker Compose

1. Clonar o extraer el proyecto en la carpeta de preferencia.
2. Copiar el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con valores reales para `GEMINI_API_KEY` y las variables `R2_*` (Cloudflare R2) si se desea usar la carga de CV con IA. Sin estas claves, el resto del sistema funciona excepto el endpoint `/talentos/upload-cv`.
3. Ejecutar los contenedores en segundo plano:
   ```bash
   docker-compose up -d --build
   ```
4. El sistema estará disponible en:
   - **Frontend (React UI):** `http://localhost:3000`
   - **Backend API (NestJS):** `http://localhost:4000/api`
   - **MySQL BD (`talentia_db`):** `localhost:3306`

---

## 🔑 Credenciales de Prueba por Defecto

La base de datos se inicializa automáticamente con los siguientes usuarios (contraseña en texto plano para todos: `Password123!`):

| Usuario | Contraseña | Rol | Correo |
| :--- | :--- | :--- | :--- |
| `admin` | `Password123!` | Administrador | admin@talentia.com |
| `recruiter1` | `Password123!` | Reclutador | recruiter1@talentia.com |
| `recruiter2` | `Password123!` | Reclutador | recruiter2@talentia.com |

---

## 🧩 Funcionalidades

### Panel principal (Dashboard)
- Tarjetas con estadísticas: total de talentos, empresas (solo Admin), talentos disponibles y mis talentos.
- Listado de los últimos talentos añadidos.

### Gestión de Talentos
- **Listado** con filtros (especialidad, estado laboral) y paginación.
- **Detalle** con contacto, experiencia, empresa asociada y descarga del CV.
- **Creación/Edición** mediante formulario validado (react-hook-form + zod) con máscara de teléfono y selección de empresa.
- **Carga de CV inteligente**: arrastrar y soltar un PDF → Google Gemini extrae los datos → se pre-llena el formulario para revisión.

### Gestión de Empresas
- Listado con filtros (sector, estado) y paginación.
- Detalle con responsable, contacto, ubicación.
- Creación/Edición (solo Administrador).

### Gestión de Reclutadores (solo Administrador)
- Listado con búsqueda y filtro por estado.
- Registro de nuevos reclutadores con asignación opcional a una empresa.
- Activar/Desactivar reclutadores desde el listado.

### Perfil y Sesiones
- Visualización de datos del usuario y rol.
- Historial de últimas sesiones (dispositivo, IP, fecha).
- Modal con gestión completa de sesiones: filtros por estado, paginación y revocación remota (vía Server-Sent Events).

### Experiencia de usuario
- **Modo oscuro** con toggle persistente en el header.
- **Validación de formularios** con errores field-level accesibles (`aria-invalid`, `role="alert"`).
- **Loaders y skeletons** durante la carga de datos.
- **Estados de error y vacío** reintentables en listados y detalles.
- **Accesibilidad**: navegación por teclado, focus trap en modales (Headless UI), link "saltar al contenido", páginas 404 y de acceso restringido.
- **Responsive**: mobile-first, sidebar colapsable en móvil, tablas con scroll horizontal.

---

## 🔐 Sistema de Permisos por Grupos

Un reclutador puede editar un talento si:
1. Lo creó él mismo (`registrado_por`), o
2. Está asociado a la empresa del talento (tabla `reclutador_empresa`).

El Administrador siempre tiene acceso total. La asociación reclutador↔empresa es Many-to-Many, por lo que asignar un reclutador a una empresa le da acceso a editar todos los talentos de esa empresa.

---

## ☁️ Despliegue Automatizado (CI/CD)

El sistema ya no depende de despliegues manuales, todo se ejecuta de manera automatizada a través de un flujo de integración y entrega continua (CI/CD) utilizando **GitHub Actions**.

### ¿Cómo funciona el despliegue a producción?
Cada vez que se hace un *Push* a la rama `main` del repositorio, se activa automáticamente un flujo (`deploy.yml`) que realiza los siguientes pasos de forma estrictamente secuencial:

1. **Aprovisionamiento con Terraform**: Conecta con Google Cloud Platform y aplica el estado de Terraform, garantizando que la red VPC, el motor de base de datos de Compute Engine (MySQL 8.0), las reglas del cortafuegos y el registro de contenedores estén creados y actualizados.
2. **Construcción de Imágenes**: Se ejecuta `docker build` en el directorio de `backend` y se sube de manera segura a Google Artifact Registry.
3. **Despliegue Serverless**: Se actualiza el servicio de **Google Cloud Run** inyectando la nueva imagen de contenedor, de manera que la API en la nube esté ejecutando la última versión del código de manera elástica y segura.
4. **Despliegue del Frontend**: Se descargan e instalan las dependencias de Node.js, se hace un _build_ del código en React con las variables de entorno inyectadas que enlazan con el nuevo backend de Cloud Run, y finalmente se empujan todos los archivos estáticos hacia un proyecto de **Cloudflare Pages** configurado para servir al usuario de la manera más rápida posible.

Gracias a esta arquitectura orientada a *DevOps* moderno, tú como usuario o desarrollador solo tienes que centrarte en hacer tus commits; la infraestructura y el paso a la nube se ajustan solos de forma inmediata.