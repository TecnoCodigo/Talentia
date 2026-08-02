-- ======================================================
-- SCRIPT DE BASE DE DATOS - TALENTIA
-- Proyecto: Gestor de Talentos
-- ======================================================

CREATE DATABASE IF NOT EXISTS `sistema_autenticacion` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `sistema_autenticacion`;

-- ------------------------------------------------------
-- Eliminación de tablas en orden inverso a dependencias
-- ------------------------------------------------------
DROP TABLE IF EXISTS `sesiones`;
DROP TABLE IF EXISTS `reclutador_empresa`;
DROP TABLE IF EXISTS `talentos`;
DROP TABLE IF EXISTS `empresas`;
DROP TABLE IF EXISTS `usuarios`;

-- ------------------------------------------------------
-- Estructura de la tabla `usuarios`
-- ------------------------------------------------------
CREATE TABLE `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario` VARCHAR(50) NOT NULL UNIQUE,
    `clave` VARCHAR(255) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(100) NOT NULL UNIQUE,
    `telefono` VARCHAR(20) NOT NULL,
    `rol` VARCHAR(30) NOT NULL DEFAULT 'Reclutador',
    `estado` ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
    `refresh_token_hash` VARCHAR(255) NULL,
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `actualizado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Estructura de la tabla `sesiones`
-- ------------------------------------------------------
CREATE TABLE `sesiones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NOT NULL,
    `dispositivo` VARCHAR(255) NOT NULL,
    `ip_acceso` VARCHAR(45) NOT NULL,
    `estado` VARCHAR(50) NOT NULL DEFAULT 'Sesión Actual',
    `creado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Estructura de la tabla `empresas`
-- ------------------------------------------------------
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

-- ------------------------------------------------------
-- Estructura de la tabla `talentos`
-- ------------------------------------------------------
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

-- ------------------------------------------------------
-- Estructura de la tabla `reclutador_empresa`
-- ------------------------------------------------------
CREATE TABLE `reclutador_empresa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `empresa_id` INT NOT NULL,
  `asignado_en` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_reclutador_empresa` (`usuario_id`, `empresa_id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Datos de Prueba Iniciales
-- Nota: La contraseña de todos los usuarios de prueba es: Password123!
-- ------------------------------------------------------

INSERT INTO `usuarios` (`id`, `usuario`, `clave`, `nombre`, `correo`, `telefono`, `rol`, `estado`, `creado_en`) VALUES 
(1, 'admin', '$2b$10$3Spkg63edAoyiHesqn3KdOAyHK5HzOyhIN798cLA4ugSCAW1bINl2', 'Administrador General', 'admin@talentia.com', '+58 414-0000000', 'Administrador', 'Activo', '2026-08-01 10:00:00'),
(2, 'recruiter1', '$2b$10$3Spkg63edAoyiHesqn3KdOAyHK5HzOyhIN798cLA4ugSCAW1bINl2', 'Reclutador Uno', 'recruiter1@talentia.com', '+58 412-1111111', 'Reclutador', 'Activo', '2026-08-01 10:05:00'),
(3, 'recruiter2', '$2b$10$3Spkg63edAoyiHesqn3KdOAyHK5HzOyhIN798cLA4ugSCAW1bINl2', 'Reclutador Dos', 'recruiter2@talentia.com', '+58 424-2222222', 'Reclutador', 'Activo', '2026-08-01 10:10:00');

INSERT INTO `empresas` (`id`, `nombre`, `sector`, `pais`, `estado`, `responsable`) VALUES 
(1, 'TechVenezuela C.A.', 'Tecnología', 'Venezuela', 'Activa', 'María González'),
(2, 'Consulting Group', 'Consultoría', 'Colombia', 'Activa', 'Juan Rodríguez'),
(3, 'DataSoft Inc.', 'Software', 'Argentina', 'Activa', 'Pedro Martínez');

INSERT INTO `reclutador_empresa` (`usuario_id`, `empresa_id`) VALUES 
(2, 1),
(2, 2),
(3, 3);

INSERT INTO `talentos` (`nombre_completo`, `correo`, `telefono`, `especialidad`, `estado_laboral`, `pais`, `experiencia_anios`, `empresa_id`, `registrado_por`) VALUES 
('Juan Pérez', 'juan.perez@email.com', '+58 414-1234567', 'Desarrollo Frontend', 'Disponible', 'Venezuela', 3, 1, 2),
('Ana Gómez', 'ana.gomez@email.com', '+57 300-7654321', 'Análisis de Datos', 'Empleado', 'Colombia', 5, 2, 2),
('Luis Silva', 'luis.silva@email.com', '+54 11-12345678', 'Desarrollo Backend', 'Freelance', 'Argentina', 7, 3, 3),
('María Fernández', 'maria.fer@email.com', '+58 412-9876543', 'Diseño UX/UI', 'No Disponible', 'Venezuela', 2, 1, 2),
('Carlos Ruiz', 'carlos.ruiz@email.com', '+58 424-5556677', 'DevOps', 'Disponible', 'Venezuela', 4, NULL, 1);