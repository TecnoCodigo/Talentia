<div align="center">

| | |
|:---:|:---:|
| ![Educación Universitaria](https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Ministerio_del_Poder_Popular_para_la_Educaci%C3%B3n_Universitaria%2C_Ciencia_y_Tecnolog%C3%ADa.svg/200px-Ministerio_del_Poder_Popular_para_la_Educaci%C3%B3n_Universitaria%2C_Ciencia_y_Tecnolog%C3%ADa.svg.png) | **UNIVERSIDAD POLITÉCNICA TERRITORIAL JOSÉ ANTONIO ANZOÁTEGUI** |

</div>

---

# Proyecto: Sistema de Gestión de Talentos Profesionales (Talentia)

---

**Materia:** Programación 4
**Sección:** IF-04
**Profesor:** Nelson Ruiz

---

## Equipo de Trabajo (Integrantes)

| Nombre y Apellido | Cédula de Identidad | Rol en el Proyecto |
| :--- | :--- | :--- |
| **Yellanni Herrera** | V-30.615.188 | DBA (Administradora de Base de Datos) |
| **Ronald Vizcaya** | V-26.384.967 | Desarrollador Backend (NestJS / API / Cloud) |
| **Ricardo Prado** | V-28.658.757 | Desarrollador Frontend UI (React / Vite) |
| **Elias Estrabao** | V-26.896.160 | Diseño y Responsividad UI (TailwindCSS) |

---

## Descripción Breve

Este documento sirve como presentación formal del equipo de trabajo para el desarrollo del **Sistema de Gestión de Talentos Profesionales (Talentia)**. El sistema permite registrar, categorizar y hacer seguimiento de candidatos y profesionales, vinculándolos a empresas, gestionando sus CVs con **Inteligencia Artificial (Google Gemini)** y controlando el acceso mediante un sistema de roles. Incluye un backend serverless en **NestJS**, una base de datos relacional **MySQL**, almacenamiento de archivos en **Cloudflare R2** y una interfaz web moderna, responsiva y totalmente accesible construida con **React + Vite + TailwindCSS**.

---

## Tecnologías Utilizadas

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React 18 + Vite + TailwindCSS + React Router v6 |
| **Validación** | React Hook Form + Zod |
| **Backend** | NestJS (Node.js) + TypeORM |
| **Base de Datos** | MySQL 5.7 (Producción) / MySQL 8.0 (Local) |
| **Autenticación** | JWT (Access Token 15 min + Refresh Token 7 días) |
| **Inteligencia Artificial** | Google Gemini API (`gemini-2.5-flash`) |
| **Almacenamiento CVs** | Cloudflare R2 (compatible S3) |
| **Contenerización** | Docker + Docker Compose |
| **Nube** | Google Cloud Run (serverless, máx. 1 instancia) |
| **CI/CD** | GitHub Actions |
| **Infraestructura como Código** | Terraform |
| **Hosting Frontend** | Cloudflare Pages |

---

## Módulos del Sistema

- **Dashboard:** Panel de estadísticas con totales de talentos, empresas y disponibilidad.
- **Talentos:** CRUD completo con filtros, paginación, carga de CV con IA y control de permisos por rol.
- **Empresas:** Gestión de empresas a las que se asocian talentos y reclutadores.
- **Reclutadores:** Creación de usuarios con rol Reclutador y asignación a empresas.
- **Perfil:** Actualización de datos personales y cambio de contraseña.
- **Autenticación:** Login seguro con JWT, rotación de tokens y registro de sesiones.

---

## Roles y Permisos

| Rol | Descripción |
| :--- | :--- |
| **Administrador** | Acceso total: gestiona usuarios, empresas, talentos y reclutadores. |
| **Reclutador** | Acceso parcial: gestiona talentos de sus empresas asignadas. |

---

## Enlaces Oficiales

- **Repositorio Código Fuente (GitHub):** https://github.com/TecnoCodigo/Talentia
- **Backend API (Producción):** https://talentia-backend-nestjs-[HASH].us-central1.run.app/api
- **Frontend (Producción):** https://talentia.pages.dev

---

## Instrucciones para Ejecución Local

Para probar el proyecto de manera local (con Docker), sigue estos sencillos pasos:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/TecnoCodigo/Talentia.git
   cd Talentia
   ```

2. **Configurar el entorno:**

   Duplica el archivo de ejemplo para las variables:

   ```bash
   cp .env.example .env
   ```

   *(En Windows con PowerShell: `copy .env.example .env`)*

   > Edita el archivo `.env` y coloca tu `GEMINI_API_KEY` (Google Gemini) y las credenciales `R2_*` (Cloudflare) si deseas usar la función de carga de CV con IA. El resto del sistema funciona sin estas claves.

3. **Ejecutar el entorno completo (Base de Datos, Backend y Frontend):**

   ```bash
   docker-compose up -d --build
   ```

*(Una vez completado, el frontend estará disponible en `http://localhost:3000`, el backend en `http://localhost:4000/api` y la base de datos MySQL en el puerto `3306`).*

---

## Credenciales de Prueba

| Usuario | Contraseña | Rol |
| :--- | :--- | :--- |
| `admin` | `Password123!` | Administrador |
| `recruiter1` | `Password123!` | Reclutador |
| `recruiter2` | `Password123!` | Reclutador |

---

*Universidad Politécnica Territorial José Antonio Anzoátegui — Programación 4, Sección IF-04 — Agosto 2026*
