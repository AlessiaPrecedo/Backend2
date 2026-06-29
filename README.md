# Backend2 — Registro seguro de usuarios

## Requisitos

- Node.js v18+
- MongoDB (local o Atlas)

## Instalación

```bash
git clone <tu-repo>
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
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/backend2
JWT_SECRET=unaclavesecretamuylargarandom123
SALT_ROUNDS=10
```

## Correr el proyecto

```bash
# Desarrollo (recarga automática)
npm run dev

# Producción
npm start
```

## Arquitectura en capas

| Capa | Responsabilidad |
|------|----------------|
| **Route** | Define el endpoint y aplica middlewares |
| **Controller** | Recibe el request HTTP, llama al service, devuelve la response |
| **Service** | Contiene la lógica de negocio (validaciones, hash, reglas) |
| **Repository** | Único punto de contacto con la base de datos |
| **Utils** | Helpers reutilizables (bcrypt, etc.) |

## Endpoints

### Sesiones

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/sessions/register` | Registro de usuario |
| POST | `/api/sessions/login` | Login de usuario |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Obtener todos los usuarios |
| GET | `/users/:id` | Obtener usuario por ID |
| POST | `/users` | Crear usuario |
| PUT | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Eliminar usuario |

### Eventos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/events` | Obtener todos los eventos |
| GET | `/events/:id` | Obtener evento por ID |
| POST | `/events` | Crear evento |
| PUT | `/events/:id` | Actualizar evento |
| DELETE | `/events/:id` | Eliminar evento |

### Tickets

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tickets` | Obtener todos los tickets |
| GET | `/tickets/:id` | Obtener ticket por ID |
| POST | `/tickets` | Crear ticket |
| PUT | `/tickets/:id` | Actualizar ticket |
| DELETE | `/tickets/:id` | Eliminar ticket |

## Endpoint: Registro de usuario

**POST** `/api/sessions/register`

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
  "user": {
    "_id": "664f...",
    "first_name": "Kenny",
    "last_name": "Test",
    "email": "kenny@test.com",
    "role": "user"
  }
}
```

> La contraseña no se devuelve en la respuesta, ni en texto plano ni hasheada.

## Casos de prueba

| Caso | Body | Respuesta esperada |
|---|---|---|
| Registro exitoso | Todos los campos válidos | `201` con datos del usuario |
| Campo faltante | Sin `first_name`, por ejemplo | `400` All fields are required |
| Email inválido | `email: "kenny"` | `400` Invalid email format |
| Contraseña corta | `password: "abc"` | `400` Password must be at least 8 characters long |
| Email ya registrado | Mismo email dos veces | `400` User already exists |

## Seguridad

- La contraseña se hashea con `bcrypt` antes de guardarse en MongoDB
- El `role` no puede manipularse desde el body; siempre se asigna `user` por defecto
- El email se normaliza (trim + lowercase) antes de guardarse

