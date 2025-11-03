# 🛍️ Fashion’t Park

**Fashion’t Park** es una tienda online moderna desarrollada con **TypeScript**, **Node.js**, **Express**, **PostgreSQL** y **TailwindCSS**.  
El objetivo del proyecto es ofrecer una base sólida y escalable para un e-commerce profesional, aplicando buenas prácticas de arquitectura, seguridad y despliegue en AWS.

Aunque el frontend aún requiere mejoras visuales y de experiencia de usuario, el enfoque principal de este proyecto es evidenciar mi dominio en la construcción de arquitecturas 
backend completas, el consumo e integración de APIs REST, la gestión de servidores y la implementación de buenas prácticas de seguridad y desarrollo dentro de un entorno profesional

---

## 🚀 Tecnologías principales

### 🔧 Backend
- **Node.js + Express** (API REST)
- **TypeScript** (tipado fuerte)
- **PostgreSQL (AWS RDS)** con conexión SSL
- **Zod** para validación de datos
- **JWT** en cookies **HTTP-Only** (autenticación segura)
- **dotenv** para variables de entorno
- Arquitectura **MVC** (Model–View–Controller)

### 🎨 Frontend
- **TypeScript + HTML**
- **TailwindCSS** (estilos profesionales y responsive)
- **Fetch API** para consumo del backend
- Código modular con interfaces (`Product`, etc.)


---

## ⚙️ Funcionalidades

| Rol | Acción | Descripción |
|-----|--------|-------------|
| Usuario | Ver productos | Consulta los productos desde `/api/products` |
| Admin | Crear productos | Envía nuevos productos mediante `POST /api/products` |
| Sistema | Validación y seguridad | Zod valida datos, JWT protege rutas sensibles |
| Base de datos | Persistencia | PostgreSQL en AWS RDS con conexión SSL segura |

---

## 🔐 Seguridad

- Conexión **SSL** con certificado `us-east-2-bundle.pem`
- Tokens **JWT** guardados en **cookies HTTP-Only**
- Variables de entorno protegidas (`.env`)
- Validaciones fuertes con **Zod**
- Roles: **admin** y **usuario**

---

## ☁️ Despliegue en AWS

- **Backend** alojado en **AWS Lightsail (Ubuntu)**
- **Base de datos** en **AWS RDS (PostgreSQL)**
- **Certificado SSL** con Let’s Encrypt
- **Dominio personalizado**: `fashiontpark.store`

---

## 📦 Instalación local

1. Clona el repositorio  
   ```bash
   git clone https://github.com/Envigite/fashion-t-park.git

## Instala depencencias en cada carpeta

```bash
cd ./backend && npm install
```

```bash
cd ./frontend && npm install
```

---

## Ejecuta backend y frontend
npm run dev



