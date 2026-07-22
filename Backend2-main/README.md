# Backend2 — Registro y autenticación con Passport.js

## Requisitos

- Node.js v18+
- MongoDB (local o Atlas)

## Instalación

```bash
git clone https://github.com/AlessiaPrecedo/Backend2.git
cd Backend2
npm install
```

## Variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

```dotenv
PORT=8080
MONGO_URL=mongodb://localhost:27017/backend2
JWT_SECRET=unaclavesecretamuylargarandom123
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

## Correr el proyecto

```bash
# Desarrollo (recarga automática)
npm run dev

# Producción
npm start
```

## Tests automatizados

```bash
npm test
```

Corre con el test runner nativo de Node (`node:test`, sin dependencias extra) y cubre: hash de contraseñas, generación/verificación de JWT (incluye token manipulado y expirado), el middleware `validateLoginFields`, y el middleware `auth` (que internamente usa la estrategia `current` de Passport). No incluye tests de integración contra una base de datos real.

## Arquitectura en capas

| Capa                  | Responsabilidad                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Route**             | Define el endpoint y aplica middlewares                                                                                         |
| **Controller**        | Recibe el request HTTP, dispara la estrategia de Passport correspondiente, y genera el JWT / setea la cookie cuando corresponde |
| **Passport strategy** | Contiene la lógica de autenticación (validaciones, hash, reglas de negocio de login/registro)                                   |
| **Repository**        | Único punto de contacto con la base de datos                                                                                    |
| **Utils**             | Helpers reutilizables (bcrypt, JWT, errores)                                                                                    |

## Autenticación con Passport.js

Toda la autenticación pasa por **estrategias de Passport**, centralizadas en `src/config/passport.js`. `app.js` solo llama a `initializePassport()` y a `passport.initialize()`; no define ninguna estrategia ahí.

| Estrategia | Tipo                                               | Qué hace                                                                                                                                                                   |
| ---------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `register` | `passport-local` (con `passReqToCallback`)         | Valida los campos, normaliza el email, verifica que no exista otro usuario con ese email, hashea la contraseña con bcrypt y crea el usuario con `role: "user"` por defecto |
| `login`    | `passport-local`                                   | Busca el usuario por email y compara la contraseña con bcrypt. Si algo no coincide, devuelve `done(null, false)` sin indicar cuál fue el problema                          |
| `current`  | `passport-jwt` (con extractor custom desde cookie) | Lee el JWT de la cookie `currentUser`, lo verifica, y deja el payload decodificado en `req.user`                                                                           |

Puntos importantes:

- El **JWT se genera en el controller** (`controllers/session.controller.js`), nunca dentro de una estrategia. La estrategia `login` solo confirma la identidad del usuario.
- La cookie `currentUser` se setea con `httpOnly: true`, `sameSite: "lax"`, `maxAge: 3600000` y `secure` solo si `NODE_ENV=production`.
- `POST /api/sessions/logout` no pasa por Passport: solo borra la cookie.

### Preparado para providers externos (Google, GitHub, etc.)

`passport.js` está pensado para crecer sin tocar `app.js` ni las rutas: agregar un login social es sumar un nuevo `passport.use("google", new GoogleStrategy(...))` dentro de `initializePassport()`, y una ruta nueva que apunte a esa estrategia. El resto de la app (cookie, JWT, middleware `auth`) no cambia.

## Endpoints

### Sesiones

| Método | Ruta                     | Descripción                                             |
| ------ | ------------------------ | ------------------------------------------------------- |
| POST   | `/api/sessions/register` | Registro de usuario                                     |
| POST   | `/api/sessions/login`    | Login de usuario, setea cookie `currentUser` con el JWT |
| GET    | `/api/sessions/current`  | Devuelve el usuario autenticado a partir de la cookie   |
| POST   | `/api/sessions/logout`   | Elimina la cookie `currentUser`                         |

### Usuarios

| Método | Ruta         | Descripción                |
| ------ | ------------ | -------------------------- |
| GET    | `/users`     | Obtener todos los usuarios |
| GET    | `/users/:id` | Obtener usuario por ID     |
| POST   | `/users`     | Crear usuario              |
| PUT    | `/users/:id` | Actualizar usuario         |
| DELETE | `/users/:id` | Eliminar usuario           |

### Eventos

| Método | Ruta          | Descripción               |
| ------ | ------------- | ------------------------- |
| GET    | `/events`     | Obtener todos los eventos |
| GET    | `/events/:id` | Obtener evento por ID     |
| POST   | `/events`     | Crear evento              |
| PUT    | `/events/:id` | Actualizar evento         |
| DELETE | `/events/:id` | Eliminar evento           |

### Tickets

| Método | Ruta           | Descripción               |
| ------ | -------------- | ------------------------- |
| GET    | `/tickets`     | Obtener todos los tickets |
| GET    | `/tickets/:id` | Obtener ticket por ID     |
| POST   | `/tickets`     | Crear ticket              |
| PUT    | `/tickets/:id` | Actualizar ticket         |
| DELETE | `/tickets/:id` | Eliminar ticket           |

## Endpoint: Registro de usuario

**POST** `/api/sessions/register`

Delega en la estrategia `register` de Passport.

### Body (JSON)

```json
{
  "first_name": "Kenny",
  "last_name": "Test",
  "email": "kenny@test.com",
  "password": "abc12345"
}
```

### Respuesta exitosa `201`

```json
{
  "status": "success",
  "payload": {
    "_id": "664f...",
    "first_name": "Kenny",
    "last_name": "Test",
    "email": "kenny@test.com",
    "role": "user"
  }
}
```

> La contraseña no se devuelve en la respuesta, ni en texto plano ni hasheada.

### Casos de prueba

| Caso                | Body                          | Respuesta esperada                                |
| ------------------- | ----------------------------- | ------------------------------------------------- |
| Registro exitoso    | Todos los campos válidos      | `201` con datos del usuario                       |
| Campo faltante      | Sin `first_name`, por ejemplo | `400` All fields are required                     |
| Email inválido      | `email: "kenny"`              | `400` Invalid email format                        |
| Contraseña corta    | `password: "abc"`             | `400` Password must be at least 8 characters long |
| Email ya registrado | Mismo email dos veces         | `400` User already exists                         |

## Endpoint: Login

**POST** `/api/sessions/login`

Valida presencia de campos con `validateLoginFields`, y delega en la estrategia `login` de Passport. El JWT lo genera el controller una vez que Passport confirma la identidad.

### Body (JSON)

```json
{
  "email": "kenny@test.com",
  "password": "abc12345"
}
```

### Respuesta exitosa `200`

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Además de la respuesta, se setea una cookie `currentUser` (`httpOnly`, `sameSite: lax`, `maxAge: 1h`, `secure` solo en producción) con el JWT firmado, cuyo payload es `{ id, email, role }`.

### Respuesta de error `400` (campos faltantes)

```json
{ "status": "error", "message": "Email y password son requeridos" }
```

### Respuesta de error `401` (email inexistente o password incorrecta — mismo mensaje en ambos casos)

```json
{ "status": "error", "message": "Invalid credentials" }
```

## Endpoint: Usuario actual

**GET** `/api/sessions/current`

Protegida por el middleware `auth`, que usa la estrategia `current` de Passport para leer y validar el JWT desde la cookie `currentUser` (se envía automáticamente por el navegador tras el login).

### Respuesta exitosa `200`

```json
{
  "status": "success",
  "payload": {
    "id": "664f...",
    "email": "kenny@test.com",
    "role": "user"
  }
}
```

### Respuesta de error `401` (sin cookie)

```json
{ "status": "error", "message": "No autenticado" }
```

### Respuesta de error `401` (token inválido o expirado)

```json
{ "status": "error", "message": "Token inválido o expirado" }
```

## Endpoint: Logout

**POST** `/api/sessions/logout`

Elimina la cookie `currentUser`. No pasa por Passport.

### Respuesta exitosa `200`

```json
{ "status": "success", "message": "Logout exitoso" }
```

## Casos de prueba — Sesión

| Caso                                                | Request                      | Respuesta esperada                                     |
| --------------------------------------------------- | ---------------------------- | ------------------------------------------------------ |
| Registro → login → `/current` → logout → `/current` | Flujo completo               | `201` → `200` + cookie → `200` payload → `200` → `401` |
| Registro con email duplicado                        | Mismo email dos veces        | `400` "User already exists"                            |
| Login con email inexistente                         | Email que no existe          | `401` "Invalid credentials"                            |
| Login con password incorrecta                       | Email correcto, password mal | `401` "Invalid credentials"                            |
| `/current` sin cookie                               | Sin header `Cookie`          | `401` "No autenticado"                                 |
| `/current` con token manipulado/expirado            | Cookie alterada o vencida    | `401` "Token inválido o expirado"                      |
## Roles y autorización

### Roles

`role` vive en el modelo `User`, con 3 valores posibles: `user` (default), `organizer`, `admin`. El registro público (`POST /api/sessions/register`) **siempre** asigna `role: "user"`, sin importar qué venga en el body — así nadie puede autoasignarse `admin` u `organizer`.

### Matriz de permisos

| Acción                             | user | organizer | admin |
| ----------------------------------- | :--: | :-------: | :---: |
| Consultar eventos publicados         |  ✅  |    ✅     |  ✅   |
| Crear eventos                        |  ❌  |    ✅     |  ✅   |
| Modificar/cancelar eventos propios   |  ❌  |    ✅     |  ✅   |
| Modificar cualquier evento            |  ❌  |    ❌     |  ✅   |
| Ver todos los usuarios               |  ❌  |    ❌     |  ✅   |

### 401 vs 403

- **401 (No autenticado)**: no hay cookie, o el JWT es inválido/expiró. No sabemos quién sos. Lo maneja el middleware `auth`.
- **403 (Prohibido)**: sabemos quién sos (JWT válido), pero tu `role` no tiene permiso para esa acción. Lo maneja el middleware `authorize`.

### Middlewares

| Middleware | Archivo | Qué hace |
| ---------- | ------- | -------- |
| `auth` | `middlewares/auth.middleware.js` | Valida el JWT de la cookie `currentUser` (vía la estrategia `current` de Passport). Responde 401 si no hay sesión válida y deja el usuario en `req.user` |
| `authorize(...roles)` | `middlewares/authorize.middleware.js` | Recibe los roles permitidos como parámetro y los compara contra `req.user.role`. Responde 403 si no coincide |

Siempre se usan en ese orden: `auth` primero (saber quién sos), `authorize` después (ver si te corresponde).

### Rutas protegidas

| Método | Ruta               | Protección                              |
| ------ | ------------------ | ------------------------------------------ |
| GET    | `/api/sessions/current` | `auth` (cualquier usuario autenticado) |
| POST   | `/events`          | `auth` + `authorize("organizer","admin")` |
| PUT    | `/events/:id`      | `auth` + `authorize("organizer","admin")` + dueño del evento (o admin) |
| DELETE | `/events/:id`      | `auth` + `authorize("organizer","admin")` + dueño del evento (o admin) |
| GET    | `/users`           | `auth` + `authorize("admin")` |

### Propiedad de recursos

Al crear un evento, el `organizer` se toma de `req.user.id` (nunca del body). Al modificar o borrar un evento, si `req.user.role !== "admin"`, se valida que `event.organizer` coincida con `req.user.id`; si no, `403`.

## Seguridad

- La contraseña se hashea con `bcrypt` antes de guardarse en MongoDB
- El `role` no puede manipularse desde el body; siempre se asigna `user` por defecto
- El email se normaliza (trim + lowercase) antes de guardarse
- El JWT nunca incluye la contraseña en su payload
- La cookie del JWT es `httpOnly`, por lo que no es accesible desde JavaScript del navegador