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
MONGO_URL=mongodb://localhost:27017/backend2
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


