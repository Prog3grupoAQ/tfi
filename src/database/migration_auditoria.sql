-- ============================================
-- Migración: Tabla de auditoría de usuarios
-- Ejecutar sobre la base de datos prog3_turnos
-- ============================================

CREATE TABLE IF NOT EXISTS `auditoria` (
  `id_auditoria` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `accion` varchar(500) NOT NULL,
  `metodo` varchar(10) NOT NULL,
  `endpoint` varchar(500) NOT NULL,
  `status_code` int(3) UNSIGNED DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_auditoria`),
  KEY `idx_auditoria_usuario` (`id_usuario`),
  KEY `idx_auditoria_fecha` (`fecha_hora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
