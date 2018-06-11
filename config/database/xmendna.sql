--
-- Base de datos: `xmendna`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dnas`
--

CREATE TABLE `dnas` (
  `id` int(11) NOT NULL,
  `dna` text COLLATE utf8_unicode_ci NOT NULL,
  `mutant` tinyint(1) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indices de la tabla `dnas`
--
ALTER TABLE `dnas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de la tabla `dnas`
--
ALTER TABLE `dnas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
