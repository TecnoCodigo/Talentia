# 📋 Lista de Tareas — Implementación Talentia

## Fase 1: Base de Datos y Backend Core
- [x] 1. Reescribir `doc/database.sql` con 5 tablas + datos de prueba
- [x] 2. Crear entidades TypeORM: `Empresa`, `Talento`, `ReclutadorEmpresa`
- [x] 3. Modificar entidad `User` (campo `estado`, relaciones)
- [x] 4. Crear DTOs con validaciones (class-validator)
- [x] 5. Implementar `RolesGuard` + decorador `@Roles()`
- [x] 6. Actualizar `app.module.ts`

## Fase 2: Backend — Servicios y Controllers
- [x] 7. Implementar CRUD `EmpresasService` + `EmpresasController`
- [x] 8. Implementar CRUD `TalentosService` + `TalentosController` con lógica de permisos
- [x] 9. Implementar `R2StorageService` (subir/descargar de Cloudflare R2)
- [x] 10. Implementar `CvParserService` (pdf-parse + Gemini API)
- [x] 11. Implementar `ReclutadorEmpresaService` + Controller
- [x] 12. Extender `UsersService` con CRUD reclutadores
- [x] 13. Agregar `POST /auth/register` en AuthController
- [x] 14. Instalar dependencias: `pdf-parse`, `@google/generative-ai`, `@aws-sdk/client-s3`

## Fase 3: Frontend — Layout y Navegación
- [x] 15. Crear `DashboardLayout`, `Sidebar`, `Header`
- [x] 16. Crear componentes UI: `DataTable`, `Modal`, `Toast`, `FilterBar`, `StatsCard`
- [x] 17. Modificar `App.jsx` con nuevas rutas
- [x] 18. Modificar `ProtectedRoute` con prop `roles`
- [x] 19. Modificar `AuthContext` con helper `hasRole()` y `canEditTalento()`

## Fase 4: Frontend — Páginas CRUD
- [x] 20. Implementar `Dashboard.jsx` con stats y listados recientes
- [x] 21. Implementar páginas de Talentos (Listado, Formulario, Detalle)
- [x] 22. Implementar `CargarCV.jsx` (drag & drop → Gemini → formulario pre-llenado)
- [x] 23. Implementar páginas de Empresas (Listado, Formulario, Detalle)
- [x] 24. Implementar páginas de Reclutadores + asignación a empresas (Admin only)

## Fase 5: Branding, Documentación y Verificación
- [x] 25. Actualizar branding en Login, Profile, index.html (Credenly → Talentia)
- [x] 26. Generar logo placeholder (círculo + "T")
- [x] 27. Actualizar Docker Compose y .env.example
- [x] 28. Reescribir documentación: README, ROLES, MANUAL_USUARIO, GRUPO
- [x] 29. Probar flujo completo con Docker Compose

## Fase 6: Mejora UI/UX
- [x] 30. Crear DTOs en `auth` y `users` (Login, Register, Refresh, UpdateUser, UpdateEstado)
- [x] 31. Endurecer `ValidationPipe` global (whitelist, forbidNonWhitelisted, transform)
- [x] 32. Instalar `react-hook-form`, `zod`, `@hookform/resolvers`, `@headlessui/react`, `tailwindcss-animate`
- [x] 33. Crear componentes UI base (Button, Input, FormField, Spinner, Skeleton, PageLoader, EmptyState, ErrorState, Badge, Pagination)
- [x] 34. Crear esquemas zod espejo de los DTOs (auth, empresa, talento, reclutador)
- [x] 35. Refactorizar formularios a RHF + zod (Login, Talento, Empresa, Reclutador, CargarCV)
- [x] 36. Implementar loaders, skeletons y estados de error/vacío
- [x] 37. Debounce en FilterBar + paginación reutilizable + filtros en Empresas/Reclutadores
- [x] 38. Migrar modales a Headless UI (focus trap, Escape, ARIA)
- [x] 39. Accesibilidad (aria-labels, skip-link, páginas 404 y Unauthorized)
- [x] 40. Dark mode con toggle persistente + paleta brand unificada
- [x] 41. Logo SVG + favicon + meta tags

## Fase 7: Cierre de Pendientes
- [x] 42. Renombrar `docker-compose.yml` (talentia_db, talentia_user, talentia_network)
- [x] 43. Renombrar `package.json` de backend y frontend (talentia-backend / talentia-frontend)
- [x] 44. Actualizar `.env.example` (talentia_db, VITE_API_URL)
- [x] 45. Sincronizar `database.sql` con DTOs (BD → talentia_db, telefono → NULL)
- [x] 46. Reforzar `.gitignore` (.env.local, *.tfstate, *.pem, .terraform/)
- [x] 47. Reescribir README.md para Talentia (MySQL 8.0, roles, credenciales)
- [x] 48. Reescribir MANUAL_USUARIO.md (funcionalidades, dark mode, validación)
- [x] 49. Actualizar GRUPO.md y ROLES.md (proyecto Talentia, responsabilidades reales)
- [x] 50. Actualizar PLAN_IMPLEMENTACION.md con apéndice UI/UX