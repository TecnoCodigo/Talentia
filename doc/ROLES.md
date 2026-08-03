# Distribución de Roles del Equipo - Programación 4

**Unidad Curricular:** Programación 4  
**Docente:** Nelson Ruiz  
**Ponderación:** 25%  
**Modalidad:** Online  
**Proyecto:** Talentia - Gestor de Talentos

---

## Integrantes y Asignación de Roles

### 1. Administrador de Base de Datos (DBA)
- **Responsabilidades:** 
  - Diseñar el modelo relacional de 5 tablas en MySQL 8.0: `usuarios`, `sesiones`, `empresas`, `talentos` y `reclutador_empresa` (relación Many-to-Many reclutador↔empresa).
  - Generar el script DDL/DML `doc/database.sql` con restricciones de unicidad, claves foráneas, enums (`estado_laboral`, `estado` de empresa/usuario) e inserción de datos iniciales (3 usuarios, 3 empresas, 5 talentos, 3 asignaciones).
  - Asegurar la persistencia e integridad de datos en el entorno local (Docker) y en producción (MySQL en Compute Engine).

### 2. Desarrollador Backend (NestJS / Node.js & ORM)
- **Responsabilidades:**
  - Configuración de la conexión a MySQL 8.0 usando **TypeORM / NestJS**.
  - Implementación de la autenticación con contraseñas encriptadas (`bcrypt`) y emisión, verificación y rotación de tokens seguros (`access_token` JWT corta duración + `refresh_token` larga duración).
  - CRUD completo de `empresas`, `talentos` y `reclutador_empresa` con Guards por rol (`@Roles('Administrador')` / `@Roles('Reclutador')`).
  - Lógica de permisos por grupos: el reclutador solo edita talentos que creó o de empresas asignadas.
  - **DTOs con class-validator** (validación server-side con mensajes en español) para todos los endpoints de auth, users, empresas, talentos y asignaciones.
  - Integración con **Google Gemini API** para extracción de datos de CVs en PDF.
  - Integración con **Cloudflare R2** (storage compatible S3) para alojar los PDFs.
  - Endpoints REST protegidos con Guards/Middleware y SSE para logout push en tiempo real.

### 3. Desarrollador UI (Frontend React)
- **Responsabilidades:**
  - Maquetación y diseño en **React + Vite + TailwindCSS** de 18+ páginas: Dashboard, Talentos (listado, detalle, formulario, cargar CV), Empresas (listado, detalle, formulario), Reclutadores (listado, formulario), Perfil, Login, NotFound y Unauthorized.
  - Componentes UI reutilizables: `Button`, `Input`, `FormField`, `DataTable`, `FilterBar`, `Pagination`, `Modal`, `ConfirmModal`, `Badge`, `Spinner`, `Skeleton`, `EmptyState`, `ErrorState`.
  - Validación declarativa de formularios con **react-hook-form + zod** (esquemas espejo de los DTOs del backend) con errores field-level accesibles.
  - Interceptores HTTP (Axios) para adjuntar tokens, refrescar sesión automáticamente y manejar logout por expiración.
  - Modo oscuro con `ThemeContext` y persistencia en localStorage.

### 4. Especialista en Responsividad (CSS & UI Adaptive)
- **Responsabilidades:**
  - Configuración de TailwindCSS con paleta `brand` custom, `darkMode: 'class'` y plugin `tailwindcss-animate`.
  - Diseño mobile-first (320px+, 768px+, 1024px+): Sidebar colapsable en móvil, `DataTable` con scroll horizontal, filtros y paginación responsivos.
  - Accesibilidad: navegación por teclado, modales con focus trap / Escape / ARIA (Headless UI), `aria-label` en botones icono, `role="alert"` en errores, link "saltar al contenido", páginas 404 y de acceso restringido.
  - Estados de carga (skeletons, spinners), estados vacíos y estados de error reintentables en todas las vistas de datos.