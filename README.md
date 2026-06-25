# Backend2 — API REST con Express y MongoDB

API REST construida con Node.js, Express y MongoDB, organizada en arquitectura de 3 capas.

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- dotenv

## Instalación

```bash
git clone https://github.com/AlessiaPrecedo/Backend2.git
cd Backend2
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```
PORT=8080
NODE_ENV =
MONGO_URL=mongodb://localhost:27017/backend2
JWT_SECRET =

```

Iniciar el servidor:

```bash
# Producción
npm start

# Desarrollo (recarga automática)
npm run dev

## Arquitectura de 3 capas

| Capa | Responsabilidad |
|------|----------------|
| **Controller** | Recibe el request HTTP, llama al service, devuelve la response |
| **Service** | Contiene la lógica del negocio (validaciones, reglas) |
| **Repository** | Único punto de contacto con la base de datos |

## Endpoints

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
| GET | `/tickes` | Obtener todos los tickets |
| GET | `/tickets/:id` | Obtener ticket por ID |
| POST | `/tickets` | Crear ticket |
| PUT | `/tickets/:id` | Actualizar ticket |
| DELETE | `/tickets/:id` | Eliminar ticket |

