# Despliegue seguro de Nayarit Real Estate

Este documento no debe contener contraseñas, hashes reales ni nombres completos de cuentas.

## Entornos

| Entorno | Rama | Dominio | Credenciales de despliegue |
| --- | --- | --- | --- |
| Producción anterior | `main` | `uli.mausalinas.com` | `FTP_USERNAME` y `FTP_PASSWORD` |
| Nueva versión en pruebas | `test` | `ulitest.mausalinas.com` | `FTP_USERNAME_TEST` y `FTP_PASSWORD_TEST` |

Los dos usuarios FTP se conectan mediante `FTP_SERVER`, pero cada uno debe estar limitado
en Hostinger a su propio directorio raíz. Nunca se debe usar una credencial de producción
como respaldo automático de una credencial de pruebas.

La base `UliNRE` se administra actualmente desde el sitio de producción en hPanel, aunque
la API nueva está desplegada en `ulitest`. Antes de cargar datos reales o promover `test`
a `main`, decidir expresamente si se conservará esa base como producción. Para pruebas con
datos destructivos o no publicados se debe crear una base y un usuario MySQL exclusivos.

## Orden obligatorio

1. Crear una copia de seguridad de la base de datos y de `public_html` desde Hostinger.
2. Crear `nre-private.php` inmediatamente arriba de `public_html`, usando
   `nre-private.example.php` como plantilla. El archivo real nunca debe vivir dentro del
   repositorio ni del directorio público.
3. Rotar la contraseña del usuario MySQL y actualizar el mismo valor en `nre-private.php`
   dentro de la misma ventana de mantenimiento.
4. Rotar la contraseña administrativa. Guardar únicamente un hash generado con
   `password_hash(..., PASSWORD_DEFAULT)` en `admin_users.password_hash`.
5. Aplicar las migraciones versionadas de `database/migrations/`.
6. Publicar el build de la rama correspondiente. Los flujos FTP conservan
   `api/posts.json`, `api/destinations.json` y sus archivos de bloqueo.
7. Ejecutar las comprobaciones posteriores de este documento.

## Configuración privada esperada

`nre-private.php` debe devolver un arreglo PHP con `db_host`, `db_name`, `db_user`,
`db_password` y `admin_username`. Permisos recomendados: `0600` o el equivalente más
restrictivo disponible en Hostinger. El usuario MySQL debe tener permisos únicamente
sobre la base de datos de esta aplicación.

## Comprobaciones posteriores

- `GET /api/auth.php` responde JSON sin datos de conexión.
- Una petición anónima `POST /api/posts.php` devuelve `401`.
- Una petición anónima `POST /api/destinations.php` devuelve `401`.
- Una sesión válida sin `X-CSRF-Token` devuelve `403` en escrituras.
- `GET /api/config.php`, `/api/db.php` y `/api/security.php` devuelve `403`.
- `GET /api/posts.json` y `/api/destinations.json` devuelve `403`.
- El inicio de sesión válido funciona y uno inválido no revela si la cuenta existe.
- Crear, editar y borrar un artículo funciona; un contenido con etiquetas `script` se
  almacena y devuelve sin esas etiquetas.
- La consola y las respuestas HTTP no muestran host, usuario, nombre o contraseña de DB.

## Recuperación

Si el acceso a la base falla tras la rotación, restaurar temporalmente la contraseña
anterior únicamente durante la ventana de mantenimiento o corregir `nre-private.php`.
No reintroducir credenciales en `public/api/config.php`. La API pública conserva el
contenido JSON como modo degradado, pero el acceso administrativo falla de forma cerrada
si la base de datos no está disponible.

## Pendiente fuera del código

- Revocar las credenciales que estuvieron expuestas en el historial Git.
- Revisar y restringir el acceso remoto de MySQL.
- Activar 2FA en Hostinger y GitHub y revisar sesiones/dispositivos activos.
- Reescribir el historial público sólo después de una copia de seguridad y una ventana
  coordinada; rotar secretos es obligatorio aunque el historial se limpie.
- Configurar en GitHub los entornos `production` y `test`; limitar `production` a `main` y,
  si el plan lo permite, exigir aprobación manual antes de cada despliegue productivo.
