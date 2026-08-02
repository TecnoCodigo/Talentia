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
- [ ] 25. Actualizar branding en Login, Profile, index.html (Credenly → Talentia)
- [ ] 26. Generar logo placeholder (círculo + "T")
- [ ] 27. Actualizar Docker Compose y .env.example
- [ ] 28. Reescribir documentación: README, ROLES, MANUAL_USUARIO, GRUPO
- [ ] 29. Probar flujo completo con Docker Compose
