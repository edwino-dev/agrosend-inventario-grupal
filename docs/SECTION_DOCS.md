# Documentación por secciones

Este documento describe las secciones principales del repositorio y el propósito de cada archivo/carpeta agregado en la rama `feature/upload-changes`.

## Resumen del PR

- Rama: `feature/upload-changes` → `main`
- PR: `Upload current project files` ([ver PR](https://github.com/edwino-dev/agrosend-inventario-grupal/pull/3))
- Cambios: 14 archivos añadidos, 1 eliminado, 577 líneas añadidas

---

## `docs/database.sql`

- Contenido: esquema y datos iniciales para la base de datos del sistema.
- Uso: importar en MySQL/MariaDB para crear tablas necesarias y datos de ejemplo.

Recomendación: revisar credenciales y ajustar prefijos de tablas si se integra con otras bases.

---

## `public/` (punto de entrada web)

- `public/index.php`: punto de entrada principal que inicializa la aplicación y enruta peticiones.
- `public/.htaccess`: reglas de reescritura y protección para servidores Apache.

Notas de despliegue:
- Configure el `DocumentRoot` del servidor web a `public/`.
- Asegure permisos apropiados en carpetas de logs y subida de archivos.

---

## `src/Modelos/` (Modelos de dominio)

- `Cliente.php`: entidad que representa clientes del sistema.
- `Persona.php`: entidad base para datos personales.
- `Producto.php`: entidad que representa productos disponibles en inventario.
- `Usuario.php`: entidad para usuarios del sistema (credenciales y roles).

Cada modelo incluye atributos y métodos básicos para mapa de datos; adaptar validaciones y relaciones según el ORM o patrón usado.

---

## `src/Servicios/` (Lógica de negocio)

- `AutenticacionService.php`: manejo de login, logout y verificación de tokens/sesiones.
- `BaseService.php`: utilidades compartidas entre servicios (conexión BD, manejo de errores).
- `DashboardService.php`: funciones para métricas y vistas de resumen.
- `MarketcomparisonService.php`: lógica para comparar precios/mercados.
- `MercadoService.php`: operaciones relacionadas con mercados y entidades externas.
- `VentaService.php`: procesamiento de ventas, descuentos y control de stock.

Recomendación: añadir pruebas unitarias para los servicios críticos (autenticación y ventas) antes de producción.

---

## Archivo eliminado

- `main.php`: eliminado porque el proyecto ahora usa `public/index.php` como punto de entrada.

---

## Instrucciones rápidas para desarrollo local

1. Instalar XAMPP (Apache + PHP + MySQL) y apuntar DocumentRoot a `public/`.
2. Importar `docs/database.sql` en MySQL.
3. Configurar conexión a BD en el archivo de configuración (añadir archivo de configuración si hace falta).
4. Abrir `http://localhost/` apuntando a la carpeta del proyecto (o configurar VirtualHost).

---

## Siguientes pasos sugeridos

- Añadir un archivo de configuración `.env.example` y mecanismo para leer variables de entorno.
- Añadir validaciones y sanitización de entradas en `AutenticacionService` y controladores.
- Crear tests automatizados y CI (GitHub Actions) para ejecutar linters y pruebas.

---

Si necesitas que detalle el contenido de algún archivo específico (por ejemplo `src/Servicios/AutenticacionService.php`), indícalo y agrego la documentación detallada.
