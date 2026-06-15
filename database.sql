-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2026 a las 17:33:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `progra3`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `especialidades_turnos_mes_anterior` ()   BEGIN
    SELECT
        e.nombre AS especialidad,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos
    FROM especialidades e
    LEFT JOIN medicos m
        ON m.id_especialidad = e.id_especialidad
    LEFT JOIN turnos_reservas tr
        ON tr.id_medico = m.id_medico
        AND tr.atendido = 1
        AND tr.fecha_hora >= DATE_FORMAT(
            DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH),
            '%Y-%m-01'
        )
        AND tr.fecha_hora < DATE_FORMAT(
            CURRENT_DATE,
            '%Y-%m-01'
        )
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY cantidad_turnos DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `especialidades_x_turnos` ()   select count(e.id_especialidad) as cant_esp, e.nombre
from turnos_reservas as tr 
inner join medicos as m on m.id_medico = tr.id_medico
inner join especialidades as e on e.id_especialidad = m.id_especialidad
GROUP by e.nombre
HAVING cant_esp > 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `obras_sociales_turnos_mes_anterior` ()   BEGIN
    SELECT
        os.nombre AS obra_social,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos
    FROM obras_sociales os
    LEFT JOIN turnos_reservas tr
        ON tr.id_obra_social = os.id_obra_social
        AND tr.atendido = 1
        AND tr.fecha_hora >= DATE_FORMAT(
            DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH),
            '%Y-%m-01'
        )
        AND tr.fecha_hora < DATE_FORMAT(
            CURRENT_DATE,
            '%Y-%m-01'
        )
    GROUP BY os.id_obra_social, os.nombre
    ORDER BY cantidad_turnos DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `turnos_completados_por_medico_mes` (IN `p_id_medico` INT, IN `p_mes` INT, IN `p_anio` INT)   BEGIN
  SELECT
    tr.fecha_hora,
    CONCAT(up.apellido, ', ', up.nombres) AS paciente,
    tr.id_paciente,
    os.nombre AS obra_social,
    tr.valor_total
  FROM turnos_reservas tr
  INNER JOIN pacientes p       ON p.id_paciente      = tr.id_paciente
  INNER JOIN usuarios up       ON up.id_usuario       = p.id_usuario
  INNER JOIN obras_sociales os ON os.id_obra_social   = tr.id_obra_social
  WHERE tr.id_medico           = p_id_medico
    AND tr.atendido            = 1
    AND tr.activo              = 1
    AND MONTH(tr.fecha_hora)   = p_mes
    AND YEAR(tr.fecha_hora)    = p_anio
  ORDER BY tr.fecha_hora ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `turnos_completados_por_mes` (IN `p_mes` INT, IN `p_anio` INT)   BEGIN
  SELECT
    tr.fecha_hora,
    CONCAT(um.apellido, ', ', um.nombres) AS medico,
    e.nombre AS especialidad,
    CONCAT(up.apellido, ', ', up.nombres) AS paciente,
    os.nombre AS obra_social,
    tr.valor_total
  FROM turnos_reservas tr
  INNER JOIN medicos m        ON m.id_medico         = tr.id_medico
  INNER JOIN usuarios um      ON um.id_usuario        = m.id_usuario
  INNER JOIN especialidades e ON e.id_especialidad    = m.id_especialidad
  INNER JOIN pacientes p      ON p.id_paciente        = tr.id_paciente
  INNER JOIN usuarios up      ON up.id_usuario        = p.id_usuario
  INNER JOIN obras_sociales os ON os.id_obra_social   = tr.id_obra_social
  WHERE tr.atendido = 1
    AND tr.activo   = 1
    AND MONTH(tr.fecha_hora) = p_mes
    AND YEAR(tr.fecha_hora)  = p_anio
  ORDER BY tr.fecha_hora ASC;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `accion` varchar(500) NOT NULL,
  `metodo` varchar(10) NOT NULL,
  `endpoint` varchar(500) NOT NULL,
  `status_code` int(3) UNSIGNED DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `auditoria`
--

INSERT INTO `auditoria` (`id_auditoria`, `id_usuario`, `email`, `accion`, `metodo`, `endpoint`, `status_code`, `ip`, `fecha_hora`) VALUES
(1, 8, 'ferben@correo.com', 'ferben@correo.com inició sesión', 'POST', '/api/v1/auth/login', 200, '::ffff:127.0.0.1', '2026-06-15 12:08:43'),
(2, 8, 'ferben@correo.com', 'ferben@correo.com accedió a GET /api/v1/obras_sociales', 'GET', '/api/v1/obras_sociales', 200, '::ffff:127.0.0.1', '2026-06-15 12:12:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `activo`) VALUES
(1, 'Pediatría', 1),
(2, 'Clinica', 1),
(3, 'Traumatología', 1),
(4, 'Infectología', 1),
(5, 'Ginecología', 1),
(6, 'Oftalmología', 1),
(7, 'Cardiología', 1),
(8, 'Neurología', 1),
(9, 'Dermatología', 1),
(10, 'Gastroenterología', 1),
(11, 'Endocrinología', 1),
(12, 'Urología', 1),
(13, 'Psiquiatría', 1),
(14, 'Reumatología', 1),
(15, 'Oncología', 1),
(16, 'Otorrinolaringología', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_especialidad` int(10) UNSIGNED NOT NULL,
  `matricula` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_consulta` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id_medico`, `id_usuario`, `id_especialidad`, `matricula`, `descripcion`, `valor_consulta`) VALUES
(1, 1, 2, 1000, 'Especialista en Clinica', 2500.00),
(2, 2, 1, 2000, 'Especialista en Pediatría', 5000.00),
(3, 3, 3, 3000, 'Especialista en Traumatología', 10000.00),
(4, 4, 4, 4000, 'Especialista en Infectología', 15000.00),
(5, 13, 3, 99001, 'Especialista en Traumatología', 3000.00),
(6, 16, 2, 77001, 'Especialista en Clinica', 1800.00),
(7, 17, 1, 200000, 'Especialista en Pediatría', 5000.00),
(8, 18, 2, 200001, 'Especialista en Clinica', 5317.00),
(9, 19, 3, 200002, 'Especialista en Traumatología', 5634.00),
(10, 20, 4, 200003, 'Especialista en Infectología', 5951.00),
(11, 21, 5, 200004, 'Especialista en Ginecología', 6268.00),
(12, 22, 6, 200005, 'Especialista en Oftalmología', 6585.00),
(13, 23, 7, 200006, 'Especialista en Cardiología', 6902.00),
(14, 24, 8, 200007, 'Especialista en Neurología', 7219.00),
(15, 25, 9, 200008, 'Especialista en Dermatología', 7536.00),
(16, 26, 10, 200009, 'Especialista en Gastroenterología', 7853.00),
(17, 27, 11, 200010, 'Especialista en Endocrinología', 8170.00),
(18, 28, 12, 200011, 'Especialista en Urología', 8487.00),
(19, 29, 13, 200012, 'Especialista en Psiquiatría', 8804.00),
(20, 30, 14, 200013, 'Especialista en Reumatología', 9121.00),
(21, 31, 15, 200014, 'Especialista en Oncología', 9438.00),
(22, 32, 16, 200015, 'Especialista en Otorrinolaringología', 9755.00),
(23, 33, 1, 200016, 'Especialista en Pediatría', 10072.00),
(24, 34, 2, 200017, 'Especialista en Clinica', 10389.00),
(25, 35, 3, 200018, 'Especialista en Traumatología', 10706.00),
(26, 36, 4, 200019, 'Especialista en Infectología', 11023.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos_obras_sociales`
--

CREATE TABLE `medicos_obras_sociales` (
  `id_medico_obra_social` int(10) UNSIGNED NOT NULL,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos_obras_sociales`
--

INSERT INTO `medicos_obras_sociales` (`id_medico_obra_social`, `id_medico`, `id_obra_social`, `activo`) VALUES
(1, 1, 1, 1),
(5, 7, 10, 1),
(6, 7, 7, 1),
(7, 7, 19, 1),
(8, 8, 20, 1),
(9, 8, 8, 1),
(10, 8, 11, 1),
(11, 8, 9, 1),
(12, 9, 13, 1),
(13, 9, 15, 1),
(14, 9, 6, 1),
(15, 9, 21, 1),
(16, 9, 11, 1),
(17, 10, 24, 1),
(18, 10, 18, 1),
(19, 10, 23, 1),
(20, 10, 13, 1),
(21, 10, 15, 1),
(22, 10, 17, 1),
(23, 11, 20, 1),
(24, 11, 6, 1),
(25, 11, 18, 1),
(26, 11, 17, 1),
(27, 11, 12, 1),
(28, 11, 21, 1),
(29, 11, 16, 1),
(30, 12, 7, 1),
(31, 12, 20, 1),
(32, 12, 8, 1),
(33, 12, 12, 1),
(34, 12, 19, 1),
(35, 12, 18, 1),
(36, 12, 10, 1),
(37, 12, 22, 1),
(38, 13, 12, 1),
(39, 13, 9, 1),
(40, 13, 22, 1),
(41, 13, 16, 1),
(42, 13, 8, 1),
(43, 13, 7, 1),
(44, 13, 13, 1),
(45, 13, 14, 1),
(46, 13, 11, 1),
(47, 14, 13, 1),
(48, 14, 19, 1),
(49, 14, 14, 1),
(50, 14, 23, 1),
(51, 14, 18, 1),
(52, 14, 24, 1),
(53, 14, 15, 1),
(54, 14, 9, 1),
(55, 14, 16, 1),
(56, 14, 20, 1),
(57, 15, 11, 1),
(58, 15, 8, 1),
(59, 15, 7, 1),
(60, 16, 22, 1),
(61, 16, 19, 1),
(62, 16, 9, 1),
(63, 16, 21, 1),
(64, 17, 6, 1),
(65, 17, 12, 1),
(66, 17, 14, 1),
(67, 17, 16, 1),
(68, 17, 22, 1),
(69, 18, 6, 1),
(70, 18, 16, 1),
(71, 18, 18, 1),
(72, 18, 15, 1),
(73, 18, 17, 1),
(74, 18, 11, 1),
(75, 19, 16, 1),
(76, 19, 17, 1),
(77, 19, 12, 1),
(78, 19, 23, 1),
(79, 19, 24, 1),
(80, 19, 18, 1),
(81, 19, 10, 1),
(82, 20, 12, 1),
(83, 20, 24, 1),
(84, 20, 15, 1),
(85, 20, 23, 1),
(86, 20, 6, 1),
(87, 20, 7, 1),
(88, 20, 13, 1),
(89, 20, 21, 1),
(90, 21, 18, 1),
(91, 21, 22, 1),
(92, 21, 21, 1),
(93, 21, 17, 1),
(94, 21, 10, 1),
(95, 21, 6, 1),
(96, 21, 23, 1),
(97, 21, 9, 1),
(98, 21, 8, 1),
(99, 22, 11, 1),
(100, 22, 12, 1),
(101, 22, 17, 1),
(102, 22, 15, 1),
(103, 22, 21, 1),
(104, 22, 10, 1),
(105, 22, 9, 1),
(106, 22, 16, 1),
(107, 22, 14, 1),
(108, 22, 18, 1),
(109, 23, 23, 1),
(110, 23, 14, 1),
(111, 23, 21, 1),
(112, 24, 16, 1),
(113, 24, 6, 1),
(114, 24, 13, 1),
(115, 24, 17, 1),
(116, 25, 21, 1),
(117, 25, 19, 1),
(118, 25, 13, 1),
(119, 25, 15, 1),
(120, 25, 10, 1),
(121, 26, 22, 1),
(122, 26, 21, 1),
(123, 26, 8, 1),
(124, 26, 11, 1),
(125, 26, 20, 1),
(126, 26, 9, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_sociales`
--

CREATE TABLE `obras_sociales` (
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `porcentaje_descuento` decimal(9,2) NOT NULL,
  `es_particular` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `obras_sociales`
--

INSERT INTO `obras_sociales` (`id_obra_social`, `nombre`, `descripcion`, `porcentaje_descuento`, `es_particular`, `activo`) VALUES
(1, 'Particular', 'Sin prepara u obra social', 0.00, 1, 1),
(6, 'OSER', 'Obra social provincial de Entre Ríos (sucesora de IOSPER). Brinda cobertura médica a empleados públicos provinciales, jubilados y sus grupos familiares.', 0.60, 0, 1),
(7, 'PAMI', 'Instituto Nacional de Servicios Sociales para Jubilados y Pensionados. Ofrece cobertura médica, medicamentos y prestaciones sociales para jubilados y pensionados.', 0.75, 0, 1),
(8, 'OSDE', 'Organización de Servicios Directos Empresarios. Red nacional de cobertura médica con amplia cartilla de profesionales, clínicas y sanatorios.', 0.50, 0, 1),
(9, 'OSECAC', 'Obra Social de Empleados de Comercio y Actividades Civiles. Brinda cobertura de salud a trabajadores mercantiles y sus familias.', 0.40, 0, 1),
(10, 'OSUNER', 'Obra Social de la Universidad Nacional de Entre Ríos. Destinada a docentes, no docentes y sus grupos familiares.', 0.55, 0, 1),
(11, 'Federada Salud', 'Cobertura médica de alcance nacional con diferentes planes para particulares, trabajadores y grupos familiares.', 0.45, 0, 1),
(12, 'Jerárquicos Salud', 'Entidad de cobertura médica con presencia en la región centro del país. Ofrece planes para individuos, familias y empresas.', 0.35, 0, 1),
(13, 'Swiss Medical', 'Empresa de medicina privada con amplia red de prestadores, centros médicos y sanatorios propios.', 0.30, 0, 1),
(14, 'Sancor Salud', 'Cobertura médica nacional con distintos niveles de planes y acceso a una extensa red de prestadores.', 0.50, 0, 1),
(15, 'Avalian', 'Cobertura médica privada con presencia en todo el país y planes para particulares y empresas.', 0.42, 0, 1),
(16, 'Medifé', 'Empresa de medicina prepaga con cobertura nacional, múltiples planes y acceso a centros médicos y sanatorios.', 0.38, 0, 1),
(17, 'Galeno', 'Cobertura médica privada con sanatorios propios y una amplia red de profesionales y centros de atención.', 0.65, 0, 1),
(18, 'OMINT', 'Empresa de salud privada orientada a individuos, familias y empresas con planes de cobertura nacional.', 0.20, 0, 1),
(19, 'Unión Personal', 'Obra social vinculada al sindicato UPCN. Ofrece cobertura médica para trabajadores estatales y particulares adheridos.', 0.70, 0, 1),
(20, 'OSMATA', 'Obra Social del Sindicato de Mecánicos y Afines del Transporte Automotor. Atiende a trabajadores del sector automotor.', 0.48, 0, 1),
(21, 'OSPE', 'Obra Social de Petroleros. Brinda cobertura médica a trabajadores de la industria petrolera y sus familias.', 0.80, 0, 1),
(22, 'OSPLAD', 'Obra Social para la Actividad Docente. Destinada a docentes universitarios y otros sectores educativos.', 0.62, 0, 1),
(23, 'OSDEPYM', 'Obra Social de Empresarios, Profesionales y Monotributistas. Muy utilizada por trabajadores independientes.', 0.33, 0, 1),
(24, 'IOSFA', 'Instituto de Obra Social de las Fuerzas Armadas y de Seguridad. Cubre a personal militar, de seguridad y sus familias.', 0.85, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `id_usuario`, `id_obra_social`) VALUES
(5, 37, 6),
(6, 38, 7),
(7, 39, 8),
(8, 40, 9),
(9, 41, 10),
(10, 42, 11),
(11, 43, 12),
(12, 44, 13),
(13, 45, 14),
(14, 46, 15),
(15, 47, 16),
(16, 48, 17),
(17, 49, 18),
(18, 50, 19),
(19, 51, 20),
(20, 52, 21),
(21, 53, 22),
(22, 54, 23),
(23, 55, 24),
(24, 56, 6),
(25, 57, 7),
(26, 58, 8),
(27, 59, 9),
(28, 60, 10),
(29, 61, 11),
(30, 62, 12),
(31, 63, 13),
(32, 64, 14),
(33, 65, 15),
(34, 66, 16),
(35, 67, 17),
(36, 68, 18),
(37, 69, 19),
(38, 70, 20),
(39, 71, 21),
(40, 72, 22),
(41, 73, 23),
(42, 74, 24),
(43, 75, 6),
(44, 76, 7),
(45, 77, 8),
(46, 78, 9),
(47, 79, 10),
(48, 80, 11),
(49, 81, 12),
(50, 82, 13),
(51, 83, 14),
(52, 84, 15),
(53, 85, 16),
(54, 86, 17),
(55, 87, 18),
(56, 88, 19),
(57, 89, 20),
(58, 90, 21),
(59, 91, 22),
(60, 92, 23),
(61, 93, 24),
(62, 94, 6),
(63, 95, 7),
(64, 96, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_reservas`
--

CREATE TABLE `turnos_reservas` (
  `id_turno_reserva` int(10) UNSIGNED NOT NULL,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `atendido` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `turnos_reservas`
--

INSERT INTO `turnos_reservas` (`id_turno_reserva`, `id_medico`, `id_paciente`, `id_obra_social`, `fecha_hora`, `valor_total`, `atendido`, `activo`) VALUES
(8, 18, 5, 6, '2025-06-18 11:00:00', 3394.80, 1, 1),
(9, 11, 5, 6, '2025-10-14 19:30:00', 2507.20, 1, 1),
(10, 17, 6, 7, '2025-11-03 16:30:00', 2042.50, 1, 1),
(11, 8, 6, 7, '2026-05-18 12:00:00', 1329.25, 1, 1),
(12, 22, 7, 8, '2025-07-14 17:00:00', 4877.50, 1, 1),
(13, 12, 7, 8, '2026-01-07 14:00:00', 3292.50, 1, 1),
(14, 17, 7, 8, '2026-02-09 16:30:00', 4085.00, 1, 1),
(15, 19, 8, 9, '2025-07-18 18:30:00', 5282.40, 1, 1),
(16, 24, 8, 9, '2025-12-10 10:00:00', 6233.40, 1, 1),
(17, 8, 9, 10, '2025-09-29 11:00:00', 2392.65, 1, 1),
(18, 12, 9, 10, '2025-12-02 16:00:00', 2963.25, 1, 1),
(19, 19, 10, 11, '2025-10-30 17:30:00', 4842.20, 1, 1),
(20, 14, 10, 11, '2026-06-08 14:00:00', 3970.45, 1, 1),
(21, 15, 11, 12, '2025-08-01 19:30:00', 4898.40, 1, 1),
(22, 20, 11, 12, '2026-01-07 17:00:00', 5928.65, 0, 1),
(23, 20, 12, 13, '2025-08-18 10:00:00', 6384.70, 1, 1),
(24, 5, 12, 13, '2025-12-29 15:30:00', 2100.00, 1, 1),
(25, 26, 12, 13, '2026-03-30 15:00:00', 7716.10, 1, 1),
(26, 19, 13, 14, '2025-08-04 08:30:00', 4402.00, 1, 1),
(27, 22, 13, 14, '2025-11-06 08:00:00', 4877.50, 1, 1),
(28, 25, 14, 15, '2025-09-08 09:30:00', 6209.48, 1, 1),
(29, 19, 14, 15, '2025-10-28 17:30:00', 5106.32, 1, 1),
(30, 18, 14, 15, '2026-05-26 14:00:00', 4922.46, 1, 1),
(31, 7, 15, 16, '2025-06-10 12:30:00', 3100.00, 1, 1),
(32, 12, 15, 16, '2025-12-10 15:00:00', 4082.70, 0, 1),
(33, 17, 15, 16, '2026-02-06 19:30:00', 5065.40, 1, 1),
(34, 3, 16, 17, '2025-10-30 12:30:00', 3500.00, 1, 1),
(35, 11, 16, 17, '2026-04-13 17:30:00', 2193.80, 1, 1),
(36, 20, 17, 18, '2025-08-27 10:00:00', 7296.80, 1, 1),
(37, 20, 17, 18, '2026-01-01 18:00:00', 7296.80, 1, 1),
(38, 17, 17, 18, '2026-06-23 19:30:00', 6536.00, 1, 1),
(39, 5, 18, 19, '2025-07-18 14:30:00', 900.00, 1, 1),
(40, 13, 18, 19, '2025-10-08 09:30:00', 2070.60, 1, 1),
(41, 12, 18, 19, '2026-02-23 14:00:00', 1975.50, 1, 1),
(42, 23, 19, 20, '2025-06-26 15:30:00', 5237.44, 0, 1),
(43, 2, 19, 20, '2025-10-01 09:00:00', 2600.00, 1, 1),
(44, 9, 19, 20, '2026-03-25 19:30:00', 2929.68, 1, 1),
(45, 17, 20, 21, '2025-06-06 16:30:00', 1634.00, 1, 1),
(46, 24, 20, 21, '2025-12-18 09:00:00', 2077.80, 1, 1),
(47, 10, 20, 21, '2026-04-17 18:00:00', 1190.20, 1, 1),
(48, 23, 21, 22, '2025-07-21 11:30:00', 3827.36, 1, 1),
(49, 22, 21, 22, '2026-01-01 19:00:00', 3706.90, 1, 1),
(50, 9, 21, 22, '2026-06-24 08:30:00', 2140.92, 1, 1),
(51, 18, 22, 23, '2025-09-08 12:00:00', 5686.29, 1, 1),
(52, 25, 22, 23, '2026-01-02 14:30:00', 7173.02, 1, 1),
(53, 1, 22, 23, '2026-03-23 12:30:00', 1675.00, 1, 1),
(54, 3, 23, 24, '2025-06-19 08:30:00', 1500.00, 1, 1),
(55, 6, 23, 24, '2026-01-07 09:00:00', 270.00, 1, 1),
(56, 14, 23, 24, '2026-02-03 18:00:00', 1082.85, 1, 1),
(57, 25, 24, 6, '2026-01-20 08:30:00', 4282.40, 1, 1),
(58, 18, 24, 6, '2026-02-13 16:00:00', 3394.80, 1, 1),
(59, 17, 25, 7, '2025-07-24 17:30:00', 2042.50, 1, 1),
(60, 18, 25, 7, '2026-01-15 13:00:00', 2121.75, 1, 1),
(61, 3, 25, 7, '2026-05-07 14:30:00', 2500.00, 1, 1),
(62, 20, 26, 8, '2025-07-07 10:00:00', 4560.50, 1, 1),
(63, 13, 26, 8, '2025-11-11 16:30:00', 3451.00, 1, 1),
(64, 7, 26, 8, '2026-03-17 16:30:00', 2500.00, 1, 1),
(65, 11, 27, 9, '2026-01-30 14:30:00', 3760.80, 0, 1),
(66, 2, 27, 9, '2026-03-19 18:00:00', 3000.00, 1, 1),
(67, 19, 28, 10, '2025-06-12 11:30:00', 3961.80, 1, 1),
(68, 2, 28, 10, '2025-11-24 12:00:00', 2250.00, 1, 1),
(69, 23, 28, 10, '2026-04-14 13:30:00', 4532.40, 1, 1),
(70, 22, 29, 11, '2025-09-09 13:00:00', 5365.25, 1, 1),
(71, 12, 29, 11, '2025-11-14 12:00:00', 3621.75, 1, 1),
(72, 9, 29, 11, '2026-04-14 09:30:00', 3098.70, 0, 1),
(73, 4, 30, 12, '2025-07-30 11:00:00', 9750.00, 1, 1),
(74, 14, 30, 12, '2025-10-27 16:00:00', 4692.35, 1, 1),
(75, 24, 31, 13, '2025-08-08 19:00:00', 7272.30, 1, 1),
(76, 19, 31, 13, '2026-01-06 19:30:00', 6162.80, 1, 1),
(77, 14, 31, 13, '2026-02-06 16:00:00', 5053.30, 1, 1),
(78, 25, 32, 14, '2025-08-27 14:30:00', 5353.00, 1, 1),
(79, 9, 32, 14, '2025-11-03 15:30:00', 2817.00, 1, 1),
(80, 13, 32, 14, '2026-03-19 12:30:00', 3451.00, 1, 1),
(81, 16, 33, 15, '2025-07-25 13:00:00', 4554.74, 1, 1),
(82, 19, 33, 15, '2026-01-28 16:30:00', 5106.32, 1, 1),
(83, 6, 33, 15, '2026-02-25 12:00:00', 1044.00, 1, 1),
(84, 24, 34, 16, '2025-07-25 09:00:00', 6441.18, 1, 1),
(85, 14, 34, 16, '2026-05-14 14:00:00', 4475.78, 1, 1),
(86, 13, 35, 17, '2025-07-31 08:30:00', 2415.70, 1, 1),
(87, 10, 35, 17, '2025-10-29 17:00:00', 2082.85, 1, 1),
(88, 10, 35, 17, '2026-03-05 14:00:00', 2082.85, 1, 1),
(89, 21, 36, 18, '2025-08-29 15:30:00', 7550.40, 1, 1),
(90, 18, 36, 18, '2025-11-20 11:00:00', 6789.60, 1, 1),
(91, 24, 36, 18, '2026-06-17 09:00:00', 8311.20, 1, 1),
(92, 15, 37, 19, '2025-07-14 08:30:00', 2260.80, 1, 1),
(93, 18, 37, 19, '2025-12-12 08:00:00', 2546.10, 1, 1),
(94, 22, 37, 19, '2026-04-20 17:00:00', 2926.50, 1, 1),
(95, 11, 38, 20, '2025-08-01 19:30:00', 3259.36, 1, 1),
(96, 16, 38, 20, '2025-12-16 12:00:00', 4083.56, 1, 1),
(97, 5, 38, 20, '2026-02-23 09:30:00', 1560.00, 1, 1),
(98, 18, 39, 21, '2025-08-08 13:00:00', 1697.40, 1, 1),
(99, 21, 39, 21, '2025-12-19 09:30:00', 1887.60, 1, 1),
(100, 17, 39, 21, '2026-04-07 09:30:00', 1634.00, 1, 1),
(101, 16, 40, 22, '2025-09-11 18:00:00', 2984.14, 1, 1),
(102, 17, 40, 22, '2025-11-25 12:30:00', 3104.60, 1, 1),
(103, 10, 40, 22, '2026-02-26 13:00:00', 2261.38, 1, 1),
(104, 8, 41, 23, '2025-12-08 14:00:00', 3562.39, 0, 1),
(105, 26, 41, 23, '2026-06-08 13:00:00', 7385.41, 1, 1),
(106, 12, 42, 24, '2025-12-22 12:00:00', 987.75, 1, 1),
(107, 8, 42, 24, '2026-03-19 09:00:00', 797.55, 0, 1),
(108, 6, 43, 6, '2025-10-03 10:00:00', 720.00, 0, 1),
(109, 3, 43, 6, '2026-05-28 11:30:00', 4000.00, 1, 1),
(110, 18, 44, 7, '2025-11-20 16:00:00', 2121.75, 1, 1),
(111, 9, 44, 7, '2026-02-25 14:30:00', 1408.50, 1, 1),
(112, 6, 45, 8, '2025-09-29 09:00:00', 900.00, 0, 1),
(113, 12, 45, 8, '2026-02-20 12:00:00', 3292.50, 1, 1),
(114, 23, 46, 9, '2025-08-29 13:30:00', 6043.20, 1, 1),
(115, 14, 46, 9, '2025-12-22 19:00:00', 4331.40, 1, 1),
(116, 1, 46, 9, '2026-06-24 09:30:00', 1500.00, 0, 1),
(117, 22, 47, 10, '2025-08-05 18:00:00', 4389.75, 1, 1),
(118, 5, 47, 10, '2025-11-25 15:30:00', 1350.00, 1, 1),
(119, 2, 47, 10, '2026-05-08 15:00:00', 2250.00, 1, 1),
(120, 3, 48, 11, '2025-08-26 19:30:00', 5500.00, 1, 1),
(121, 10, 48, 11, '2025-10-09 16:00:00', 3273.05, 1, 1),
(122, 10, 48, 11, '2026-06-02 09:00:00', 3273.05, 1, 1),
(123, 11, 49, 12, '2025-08-22 12:30:00', 4074.20, 1, 1),
(124, 26, 49, 12, '2025-10-13 08:00:00', 7164.95, 1, 1),
(125, 25, 49, 12, '2026-04-23 10:30:00', 6958.90, 1, 1),
(126, 5, 50, 13, '2025-12-03 11:30:00', 2100.00, 1, 1),
(127, 10, 50, 13, '2026-04-10 08:00:00', 4165.70, 1, 1),
(128, 2, 51, 14, '2026-01-19 15:00:00', 2500.00, 0, 1),
(129, 13, 51, 14, '2026-04-21 18:30:00', 3451.00, 1, 1),
(130, 25, 52, 15, '2025-07-08 10:30:00', 6209.48, 1, 1),
(131, 25, 52, 15, '2026-04-20 19:30:00', 6209.48, 0, 1),
(132, 22, 53, 16, '2025-07-23 08:00:00', 6048.10, 1, 1),
(133, 6, 53, 16, '2026-01-27 11:00:00', 1116.00, 0, 1),
(134, 9, 53, 16, '2026-02-03 11:30:00', 3493.08, 0, 1),
(135, 12, 54, 17, '2025-07-28 08:00:00', 2304.75, 1, 1),
(136, 5, 54, 17, '2025-10-02 10:30:00', 1050.00, 1, 1),
(137, 10, 54, 17, '2026-06-16 13:00:00', 2082.85, 1, 1),
(138, 9, 55, 18, '2025-09-25 09:30:00', 4507.20, 1, 1),
(139, 18, 56, 19, '2025-08-01 19:00:00', 2546.10, 0, 1),
(140, 10, 56, 19, '2026-01-05 18:00:00', 1785.30, 1, 1),
(141, 1, 56, 19, '2026-05-06 16:30:00', 750.00, 1, 1),
(142, 2, 57, 20, '2025-08-14 11:00:00', 2600.00, 0, 1),
(143, 25, 57, 20, '2025-11-13 12:30:00', 5567.12, 1, 1),
(144, 5, 58, 21, '2025-07-08 19:30:00', 600.00, 1, 1),
(145, 4, 58, 21, '2025-11-20 13:00:00', 3000.00, 1, 1),
(146, 13, 58, 21, '2026-06-17 16:30:00', 1380.40, 1, 1),
(147, 21, 59, 22, '2025-07-15 12:30:00', 3586.44, 1, 1),
(148, 4, 59, 22, '2025-11-18 13:00:00', 5700.00, 1, 1),
(149, 1, 59, 22, '2026-05-22 11:30:00', 950.00, 1, 1),
(150, 22, 60, 23, '2025-07-14 19:00:00', 6535.85, 1, 1),
(151, 21, 60, 23, '2025-11-19 13:30:00', 6323.46, 1, 1),
(152, 5, 60, 23, '2026-03-18 17:30:00', 2010.00, 1, 1),
(153, 24, 61, 24, '2025-07-15 17:00:00', 1558.35, 1, 1),
(154, 23, 61, 24, '2025-11-07 17:30:00', 1510.80, 1, 1),
(155, 16, 61, 24, '2026-04-16 10:00:00', 1177.95, 1, 1),
(156, 15, 62, 6, '2025-07-07 16:30:00', 3014.40, 1, 1),
(157, 16, 62, 6, '2025-11-12 11:00:00', 3141.20, 0, 1),
(158, 7, 62, 6, '2026-02-10 16:30:00', 2000.00, 0, 1),
(159, 22, 63, 7, '2025-08-25 08:00:00', 2438.75, 0, 1),
(160, 21, 63, 7, '2025-12-25 17:30:00', 2359.50, 1, 1),
(161, 26, 63, 7, '2026-03-26 19:00:00', 2755.75, 1, 1),
(162, 11, 64, 8, '2025-07-08 18:30:00', 3134.00, 1, 1),
(163, 13, 64, 8, '2025-12-01 18:30:00', 3451.00, 1, 1),
(164, 4, 64, 8, '2026-04-23 13:00:00', 7500.00, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `documento` varchar(20) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `foto_path` varchar(255) NOT NULL,
  `rol` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento`, `apellido`, `nombres`, `email`, `contrasenia`, `foto_path`, `rol`, `activo`) VALUES
(1, '31000111', 'Lopez', 'Marcelo', 'lopmar@correo.com', '2a2646782c5b98ee3084c8734c05f870dbd39a8320e0a2d356acb12083d61bef', '', 1, 1),
(2, '31000112', 'Diaz', 'Juan', 'diajua@correo.com', 'efe60972bee3664517525d7abd799fda05ecca0cd4ce583894b86a900782b424', '', 1, 1),
(3, '31000113', 'Benitez', 'Horacio', 'benhor@correo.com', 'eb2209c3ce078113e5dad388f31a6e6d81b3578c500a1dd30a7ebd2d36bed230', '', 1, 1),
(4, '31000114', 'Perez', 'Luis', 'perlui@correo.com', 'e738d2ec597343b44987139c0f056c1341e98f8b3d3814640499a8e74b24a650', '', 1, 1),
(8, '51000111', 'Fernandez', 'Benito', 'ferben@correo.com', 'f127f4e9e4248f77eaa446ea9bff721e3e79eedf114ba6e1cfc633853ef07b4c', '', 3, 1),
(10, '51000112', 'Gomez', 'Silvia', 'gomsil@correo.com', '601de117008d80e65ffad05dce97462d8f1b1e9aad6d68cf2b289703b8366b52', '', 3, 1),
(13, '30111222', 'Fernandez', 'Carlos', 'carfer@correo.com', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '', 1, 1),
(14, '30999777', 'Otro', 'Medico', 'otro@correo.com', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c', '', 1, 1),
(16, '31444555', 'Martinez', 'Roberto', 'robmar@correo.com', '9dbd5c893b5b573a1aa909c8cade58df194310e411c590d9fb0d63431841fd67', 'uploads/1781009309699-466676.png', 1, 1),
(17, '30100000', 'Lopez', 'Rosa', 'lopros@email-ejemplo.com', '070a3e3465e9dcd04d8b45bc2358ac219eb88cbe53e47bc0f4f2c7e83669066d', '', 1, 1),
(18, '30100001', 'Diaz', 'Sergio', 'diaser@email-ejemplo.com', 'cbb9783967ea5d3ffbf3dd1ffa4baa35a26c08911d5ade97990c987fdea45275', '', 1, 1),
(19, '30100002', 'Aguilar', 'Beatriz', 'agubea@email-ejemplo.com', '708b8458dc2b58649f6db749f37f320b507d990fab21f095ee576225a29b95bf', '', 1, 1),
(20, '30100003', 'Mendoza', 'Ariel', 'menari@email-ejemplo.com', '5fc558ba01d5daa2253cab69ad3288a758df32bb37ded75c04a6a806abccd3ea', '', 1, 1),
(21, '30100004', 'Suarez', 'Viviana', 'suaviv@email-ejemplo.com', '27a6f28ba12e22b6cd33868528bf86ae1475e1972f6b2227a5f48389bf5549e6', '', 1, 1),
(22, '30100005', 'Bravo', 'Roberto', 'brarob@email-ejemplo.com', '404d28ecc0c484ac671cc7d097d1fae0ed1dfde582b2b0a734fac99f6e1d3e50', '', 1, 1),
(23, '30100006', 'Fuentes', 'Graciela', 'fuegra@email-ejemplo.com', 'a24297f153350d120d153664c333dd4d7e6f9b218cf55ee24e866165d4dd640e', '', 1, 1),
(24, '30100007', 'Martinez', 'Matias', 'marmat@email-ejemplo.com', '5cf679bcc0c080762d0a23fc225b287f7c51907cac94d5194a0e265de44dce33', '', 1, 1),
(25, '30100008', 'Flores', 'Carina', 'flocar@email-ejemplo.com', 'e6e9971f216fc6fa192b4fe3a767b25c324d2a2cf74141454e6ddb040aaf8ca7', '', 1, 1),
(26, '30100009', 'Medina', 'Luis', 'medlui@email-ejemplo.com', '6a0925455a637e9232358360502a3eba53c72ab59f68ddb7ebff8e7c9224b185', '', 1, 1),
(27, '30100010', 'Vega', 'Valeria', 'vegval@email-ejemplo.com', 'd10b06f5dce93586bb312c33f6249b96194911bffa246dfd1db49da0c81e49a2', '', 1, 1),
(28, '30100011', 'Alvarez', 'Gustavo', 'alvgus@email-ejemplo.com', '10f38609cdb13e99cd6423f2e0678b23dad6715c3fd21e4786ccd22672f98b80', '', 1, 1),
(29, '30100012', 'Silva', 'Romina', 'silrom@email-ejemplo.com', '40d275f29363789b7680af99339e9edaf908d76e3ffbfae94f4590bf162fd42d', '', 1, 1),
(30, '30100013', 'Pinto', 'Andres', 'pinand@email-ejemplo.com', 'f07d64bddc0274a11d96f5c63a54811fbb4c02f555f169147027e384353089ca', '', 1, 1),
(31, '30100014', 'Rodriguez', 'Patricia', 'rodpat@email-ejemplo.com', 'bd9b197de4a470d18ebe4a416e058ea5fc4edc98be7ac0472597417027641c59', '', 1, 1),
(32, '30100015', 'Torres', 'Fernando', 'torfer@email-ejemplo.com', '7b26d8406c6c6d5d4dcbd484839a7470cfeb60e8c6ad4e8a13fa0fc091cd1b6a', '', 1, 1),
(33, '30100016', 'Herrera', 'Natalia', 'hernat@email-ejemplo.com', '2d9b1f1c96d5a8c77e621a9f1c7c3a0362780448fd544812738f3fec4404d8c7', '', 1, 1),
(34, '30100017', 'Ramos', 'Sebastian', 'ramseb@email-ejemplo.com', 'dd6b5f8a400bd223fa17cce4c44f1624df9591890b388b02429134fb327a5217', '', 1, 1),
(35, '30100018', 'Guerrero', 'Ana', 'gueana@email-ejemplo.com', 'cd90f1027a0fada7288430c73090036177e4f819e19a62f0932debdea86f44b5', '', 1, 1),
(36, '30100019', 'Rojas', 'Alejandro', 'rojale@email-ejemplo.com', 'b52ef014c06fd59a13a8898c7f089091935b7972aca568649fa6a9b2dfd1cb06', '', 1, 1),
(37, '30200000', 'Rodriguez', 'Juan', 'rodjuap0@email-ejemplo.com', 'beefe504162d15af8a553a1a959bfedb925ebd5c04343f4fb52f72028b6b40bc', '', 2, 1),
(38, '30200001', 'Gonzalez', 'Laura', 'gonlaup1@email-ejemplo.com', '1c1616e8f6844062d9c85e4adc54c5d7ccf2604a6e1b8f6a3ab3b02dfc969d18', '', 2, 1),
(39, '30200002', 'Romero', 'Fernando', 'romferp2@email-ejemplo.com', '0cc748f240cf969a5468b61ad95cfc26eae8c94e4f1e2c98cedaa4f6f63ec28c', '', 2, 1),
(40, '30200003', 'Diaz', 'Adriana', 'diaadrp3@email-ejemplo.com', '25b9c371332d6abec7ad788976f175df2e0c27e241aa3a45afc8f53853178727', '', 2, 1),
(41, '30200004', 'Jimenez', 'Ariel', 'jimarip4@email-ejemplo.com', 'ff8f823da9364a75f5f434dc9841d2e6e099f3107a53b6e80004346ca69ec928', '', 2, 1),
(42, '30200005', 'Medina', 'Karina', 'medkarp5@email-ejemplo.com', 'd76a2b00f289c22362c84a1967b8af6c81ef23c94cea8ad736b547557ecee559', '', 2, 1),
(43, '30200006', 'Ortiz', 'Jorge', 'ortjorp6@email-ejemplo.com', 'c8280545967f48535cbcef7918cd3164d709266ce704e40b92294e0f547bc260', '', 2, 1),
(44, '30200007', 'Ramos', 'Valeria', 'ramvalp7@email-ejemplo.com', '4c03f56add8624c0a4afa549c4a2298855eac19f8c9fed246075259780973a2f', '', 2, 1),
(45, '30200008', 'Castillo', 'Daniel', 'casdanp8@email-ejemplo.com', '45df03c19eaa3c0da2f90ad4cf3b91c06bc9518c3add79dcb01b02032bb92275', '', 2, 1),
(46, '30200009', 'Morales', 'Florencia', 'morflop9@email-ejemplo.com', '566567f3fb61f459d8b563dd6d387400d30388d96fd9dac86b41809e2114ff8d', '', 2, 1),
(47, '30200010', 'Suarez', 'Sebastian', 'suasebp10@email-ejemplo.com', 'bda71007ba55e32b8a3eb2213eeafa76ac300bd4429c781c8ba8f34fa9ed0179', '', 2, 1),
(48, '30200011', 'Rios', 'Maria', 'riomarp11@email-ejemplo.com', '4c697862ea42e398ff12e0dc204dbbc3370c52da8138299127f6ab6b00df99d9', '', 2, 1),
(49, '30200012', 'Silva', 'Roberto', 'silrobp12@email-ejemplo.com', '0c7ab4f78266c14c09c299a8e7179316f2202e2161e6f78d355d5a80e9cac51c', '', 2, 1),
(50, '30200013', 'Soto', 'Silvia', 'sotsilp13@email-ejemplo.com', '8bfbfd1f89bc76149f9440ed72ff6345dbc260ddbf23e5118aebe0bd86059a88', '', 2, 1),
(51, '30200014', 'Arias', 'Hernan', 'ariherp14@email-ejemplo.com', 'd1d6c1e2d5b3b0dff81330276be0eb15d06d28702fc96f27a86b8e85add2e311', '', 2, 1),
(52, '30200015', 'Cortes', 'Romina', 'corromp15@email-ejemplo.com', 'f6e1ce4953bf11cb9948d842b26fb3e8120851e108a2662f0fd9607fa04e8aee', '', 2, 1),
(53, '30200016', 'Quiroga', 'Rodrigo', 'quirodp16@email-ejemplo.com', 'b4da92835574c65fc61e606750f87becfc827e6f57c77fb59b8daa09f090f929', '', 2, 1),
(54, '30200017', 'Martinez', 'Rosa', 'marrosp17@email-ejemplo.com', '9f3046326676b8abffb25c219fccbe2c19516b8769d5ad63496b59f408732bba', '', 2, 1),
(55, '30200018', 'Perez', 'Alejandro', 'peralep18@email-ejemplo.com', '6ae1c3b256add17076b854ae3cf30ffece0931ba21ebf9adc94caedc4ba4d8e7', '', 2, 1),
(56, '30200019', 'Torres', 'Monica', 'tormonp19@email-ejemplo.com', '59335fb4b3ac6991651e405492600a15aed9728c1c9c0b1ab24278f69e840e84', '', 2, 1),
(57, '30200020', 'Fernandez', 'Matias', 'fermatp20@email-ejemplo.com', '31956e03915838ad40f2e8508a81b9f6492a41e05edc92d72687e7daf7378fc9', '', 2, 1),
(58, '30200021', 'Ruiz', 'Noelia', 'ruinoep21@email-ejemplo.com', '5d83c259879886b11cd9b6eda56c3b5aa99b384375bb65b6805c9ccfa416ad2a', '', 2, 1),
(59, '30200022', 'Aguilar', 'Carlos', 'agucarp22@email-ejemplo.com', 'f00533fd228f6e9c713a6d8f12e240dd3043a64038e3a6911b0580f33f8f8cdb', '', 2, 1),
(60, '30200023', 'Vargas', 'Patricia', 'varpatp23@email-ejemplo.com', 'e82a431eee5048de5f27b73c3327bf0e025bef0a87f6898e6f592089b4d1ac5d', '', 2, 1),
(61, '30200024', 'Vega', 'Ricardo', 'vegricp24@email-ejemplo.com', '0a950a2084161cfa72cf710f233d041d512b306053502531bfcd55f867657e24', '', 2, 1),
(62, '30200025', 'Reyes', 'Beatriz', 'reybeap25@email-ejemplo.com', '7d4c253931920ed69790d1bbcaa240e107407e0f3ac56504de4f9c32e834fb86', '', 2, 1),
(63, '30200026', 'Guerrero', 'Leandro', 'gueleap26@email-ejemplo.com', 'd68c929849496de3af69ec9308f908061b1214b03d55b570e73a03e01508f279', '', 2, 1),
(64, '30200027', 'Acosta', 'Paola', 'acopaop27@email-ejemplo.com', '01b158c7557a5287cc4119bcb7ea387ddbb16071767cf380f89a76146599ec2d', '', 2, 1),
(65, '30200028', 'Munoz', 'Luis', 'munluip28@email-ejemplo.com', '3d2ce13e0ee59a17478e0a0cb35e7f448b1cd6cf7d031df25e312fd3498e0c40', '', 2, 1),
(66, '30200029', 'Bravo', 'Claudia', 'braclap29@email-ejemplo.com', '16abdc2bf8c5f9ae64533530c3be73ec58a0659573c3b05440b6f63a155a54f1', '', 2, 1),
(67, '30200030', 'Ibanez', 'Pablo', 'ibapabp30@email-ejemplo.com', '184c9258089f9bd37b52e432e0990d9b62194bdbcf7aa2d55992cfb64b62cadf', '', 2, 1),
(68, '30200031', 'Pinto', 'Natalia', 'pinnatp31@email-ejemplo.com', '863ee418d838a1df5d70babcf09a9453b0a5830e8fa3748d2021a28f32b913f5', '', 2, 1),
(69, '30200032', 'Navarro', 'Emilio', 'navemip32@email-ejemplo.com', 'd28aaf98b21ab2744e56146749a61e2169746752356e101ae80075dcda24f432', '', 2, 1),
(70, '30200033', 'Garcia', 'Viviana', 'garvivp33@email-ejemplo.com', '008f1fa73461df0376211dd6c4afc09e9f3aaa7e6aeb8201a8f55c66c9176bec', '', 2, 1),
(71, '30200034', 'Lopez', 'Miguel', 'lopmigp34@email-ejemplo.com', '152961af24a2e34335512dc8268d84d408a130eca70dbae16366137b1c2c33b2', '', 2, 1),
(72, '30200035', 'Sanchez', 'Marcela', 'sanmarp35@email-ejemplo.com', '4b54f36db26a45615da8e0395cac72442970b949b5082e2f8a1b1e9e602cd705', '', 2, 1),
(73, '30200036', 'Flores', 'Gustavo', 'flogusp36@email-ejemplo.com', '85ebf2d7846a3289f3f6aa4bc33d6a2113f025bc2e7ef7bb8702381efcde48ff', '', 2, 1),
(74, '30200037', 'Moreno', 'Luciana', 'morlucp37@email-ejemplo.com', 'c6e96020dc089fcc3ccf3fbeeafc6f79bd05d2f837a0c0e5e4da6016532abcc4', '', 2, 1),
(75, '30200038', 'Herrera', 'Cristian', 'hercrip38@email-ejemplo.com', '8c5087e52fe35bde49a69cf8cb9aaa9f37573f8012f2db68649bb1b3457edab1', '', 2, 1),
(76, '30200039', 'Castro', 'Ana', 'casanap39@email-ejemplo.com', '3db9949909bcb5533d67ba5bdc2ce9d38c3a8e7b8c79fddc65c5cfe20f79813c', '', 2, 1),
(77, '30200040', 'Delgado', 'Diego', 'deldiep40@email-ejemplo.com', '6608055e43df43a24ec1885c7ead0d847d9e7cb7148622ed132082da984144b2', '', 2, 1),
(78, '30200041', 'Mendoza', 'Graciela', 'mengrap41@email-ejemplo.com', 'd7cd33b30b2da5ef578e94ecf6b5ceae6d41ec0b9d1a8eb4292f80624a10db01', '', 2, 1),
(79, '30200042', 'Molina', 'Facundo', 'molfacp42@email-ejemplo.com', 'bdce9d426d8e6a3bfb173324e08aca74acf739a420c185aee55f8fd0876e8a91', '', 2, 1),
(80, '30200043', 'Alvarez', 'Vanesa', 'alvvanp43@email-ejemplo.com', '463124263b59072e84430c6a81c76cc579e1b6caeec51ce11ed0a564f8e74ad4', '', 2, 1),
(81, '30200044', 'Gomez', 'Andres', 'gomandp44@email-ejemplo.com', '3ddfea7f37ee55f35614466be795c805d95f8944583c4ae053156d8b663a4d26', '', 2, 1),
(82, '30200045', 'Rojas', 'Sandra', 'rojsanp45@email-ejemplo.com', '0c4e5fd1fcd5ed815e2e0c46f0bb6269d134fb5af44de14943eb9237863cece4', '', 2, 1),
(83, '30200046', 'Nunez', 'Sergio', 'nunserp46@email-ejemplo.com', 'e0dd8a4cfaefdcf7219d2deb8c7996fe47b4ee65b8c70bed42cae2012c59b9c0', '', 2, 1),
(84, '30200047', 'Carrasco', 'Cecilia', 'carcecp47@email-ejemplo.com', '87161b2b855d47cea518fb29386e56b22ae7b466463825772c917a31883f557f', '', 2, 1),
(85, '30200048', 'Fuentes', 'Nicolas', 'fuenicp48@email-ejemplo.com', 'a7985e39d0c189753b5083803da7b636434dab31b8d357df26d34d5876609713', '', 2, 1),
(86, '30200049', 'Cabrera', 'Carina', 'cabcarp49@email-ejemplo.com', 'def382e69d6615add0adb5ecf200af8209063eeeeb6201014cb130146fac248a', '', 2, 1),
(87, '30200050', 'Rodriguez', 'Juan', 'rodjuap50@email-ejemplo.com', 'f1eacbbbeac5be33a7e48a5705e7020845ccd3bb9abf8b4c9f47937e6ea115cb', '', 2, 1),
(88, '30200051', 'Gonzalez', 'Laura', 'gonlaup51@email-ejemplo.com', 'be617afec61fdec22bfe302eec0735d7acb43ce65b4efbf39ea67ebc229a6c2f', '', 2, 1),
(89, '30200052', 'Romero', 'Fernando', 'romferp52@email-ejemplo.com', 'eab86daaf99d6107ce1061c1e8add5cb8c0b9804c4a5efa371449b6c02d42495', '', 2, 1),
(90, '30200053', 'Diaz', 'Adriana', 'diaadrp53@email-ejemplo.com', '88e08a91d348474a6754a50afb5a8b7a4131c437e1de999461e1ba4c306f90b6', '', 2, 1),
(91, '30200054', 'Jimenez', 'Ariel', 'jimarip54@email-ejemplo.com', '07edf8eee0f298cc0ee53cb60f420fd02a58248ebc4759884ce07191e76336ca', '', 2, 1),
(92, '30200055', 'Medina', 'Karina', 'medkarp55@email-ejemplo.com', 'dfe3039e0f6c4f6c0fa39feab1325be3615894aeb7729f5ed4aa00b4d2895816', '', 2, 1),
(93, '30200056', 'Ortiz', 'Jorge', 'ortjorp56@email-ejemplo.com', '0db057645307a5b17b08b3a262e597e2f1b736c46d9caaaa38fc5508f9fb8a50', '', 2, 1),
(94, '30200057', 'Ramos', 'Valeria', 'ramvalp57@email-ejemplo.com', '5625fd0b88eeeb1181fca2342f5762acd51b2319e85d82f033143e7ad3470014', '', 2, 1),
(95, '30200058', 'Castillo', 'Daniel', 'casdanp58@email-ejemplo.com', 'a9cad1c6c280b8f5d373edf73a4477bb432abd662b87a24184b2aedaa3c4bb80', '', 2, 1),
(96, '30200059', 'Morales', 'Florencia', 'morflop59@email-ejemplo.com', '7e972f8d7087e6e2ae678f980db194e104ccad10972b054549d0c535c8a2ea52', '', 2, 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_medicos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_medicos` (
`id_medico` int(10) unsigned
,`id_usuario` int(10) unsigned
,`apellido` varchar(100)
,`nombres` varchar(100)
,`email` varchar(255)
,`foto_path` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_medicos_os`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_medicos_os` (
`nombres` varchar(100)
,`apellido` varchar(100)
,`id_medico` int(10) unsigned
,`ids_obras_sociales` mediumtext
,`nombres_obras_sociales` mediumtext
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_pacientes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_pacientes` (
`id_paciente` int(10) unsigned
,`id_usuario` int(10) unsigned
,`apellido` varchar(100)
,`nombres` varchar(100)
,`email` varchar(255)
,`id_obra_social` int(10) unsigned
,`descripcion_obra_social` varchar(255)
,`nombre_obra_social` varchar(120)
,`foto_path` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_medicos`
--
DROP TABLE IF EXISTS `v_medicos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_medicos`  AS SELECT `m`.`id_medico` AS `id_medico`, `m`.`id_usuario` AS `id_usuario`, `u`.`apellido` AS `apellido`, `u`.`nombres` AS `nombres`, `u`.`email` AS `email`, `u`.`foto_path` AS `foto_path` FROM (`medicos` `m` join `usuarios` `u` on(`m`.`id_usuario` = `u`.`id_usuario`)) WHERE `u`.`activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_medicos_os`
--
DROP TABLE IF EXISTS `v_medicos_os`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_medicos_os`  AS SELECT `u`.`nombres` AS `nombres`, `u`.`apellido` AS `apellido`, `m`.`id_medico` AS `id_medico`, group_concat(`os`.`id_obra_social` order by `os`.`id_obra_social` ASC separator ',') AS `ids_obras_sociales`, group_concat(`os`.`nombre` order by `os`.`nombre` ASC separator ',') AS `nombres_obras_sociales` FROM (((`medicos` `m` join `medicos_obras_sociales` `mo` on(`m`.`id_medico` = `mo`.`id_medico` and `mo`.`activo` = 1)) join `obras_sociales` `os` on(`os`.`id_obra_social` = `mo`.`id_obra_social` and `os`.`activo` = 1)) join `usuarios` `u` on(`u`.`id_usuario` = `m`.`id_usuario` and `u`.`activo` = 1)) WHERE `u`.`activo` = 1 GROUP BY `m`.`id_medico`, `u`.`nombres`, `u`.`apellido` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_pacientes`
--
DROP TABLE IF EXISTS `v_pacientes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pacientes`  AS SELECT `p`.`id_paciente` AS `id_paciente`, `p`.`id_usuario` AS `id_usuario`, `u`.`apellido` AS `apellido`, `u`.`nombres` AS `nombres`, `u`.`email` AS `email`, `os`.`id_obra_social` AS `id_obra_social`, `os`.`descripcion` AS `descripcion_obra_social`, `os`.`nombre` AS `nombre_obra_social`, `u`.`foto_path` AS `foto_path` FROM ((`pacientes` `p` join `usuarios` `u` on(`p`.`id_usuario` = `u`.`id_usuario`)) join `obras_sociales` `os` on(`p`.`id_obra_social` = `os`.`id_obra_social`)) WHERE `u`.`activo` = 1 ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `idx_auditoria_usuario` (`id_usuario`),
  ADD KEY `idx_auditoria_fecha` (`fecha_hora`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `fk_medicos_especialidades` (`id_especialidad`),
  ADD KEY `fk_medicos_usuarios` (`id_usuario`);

--
-- Indices de la tabla `medicos_obras_sociales`
--
ALTER TABLE `medicos_obras_sociales`
  ADD PRIMARY KEY (`id_medico_obra_social`),
  ADD KEY `fk_mos_medico` (`id_medico`),
  ADD KEY `fk_mos_obra_social` (`id_obra_social`);

--
-- Indices de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  ADD PRIMARY KEY (`id_obra_social`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD KEY `fk_pacientes_obras_sociales` (`id_obra_social`),
  ADD KEY `fk_pacientes_usuarios` (`id_usuario`);

--
-- Indices de la tabla `turnos_reservas`
--
ALTER TABLE `turnos_reservas`
  ADD PRIMARY KEY (`id_turno_reserva`),
  ADD KEY `fk_turnos_reservas_pacientes` (`id_paciente`),
  ADD KEY `fk_turnos_reservas_medicos` (`id_medico`),
  ADD KEY `fk_turnos_reservas_obras_sociales` (`id_obra_social`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `medicos_obras_sociales`
--
ALTER TABLE `medicos_obras_sociales`
  MODIFY `id_medico_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  MODIFY `id_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `turnos_reservas`
--
ALTER TABLE `turnos_reservas`
  MODIFY `id_turno_reserva` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_medicos_especialidades` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`),
  ADD CONSTRAINT `fk_medicos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `medicos_obras_sociales`
--
ALTER TABLE `medicos_obras_sociales`
  ADD CONSTRAINT `fk_mos_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mos_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `fk_pacientes_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  ADD CONSTRAINT `fk_pacientes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `turnos_reservas`
--
ALTER TABLE `turnos_reservas`
  ADD CONSTRAINT `fk_turnos_reservas_medicos` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  ADD CONSTRAINT `fk_turnos_reservas_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  ADD CONSTRAINT `fk_turnos_reservas_pacientes` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
