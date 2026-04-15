# 🏦 Banco Avanzado — Sistema de Gestión Bancaria
Backend: Node.js + Express + Sequelize + MySQL
Frontend: Ionic 7 + Angular 17 Standalone

## ──────────────────────────────────────────────
## ✅ PASO 1 — Requisitos previos
## ──────────────────────────────────────────────
- Node.js 18+ instalado: https://nodejs.org
- MySQL corriendo con la BD `banco_avanzado` importada
- Ionic CLI: npm install -g @ionic/cli @angular/cli

## ──────────────────────────────────────────────
## ✅ PASO 2 — Configurar el Backend
## ──────────────────────────────────────────────
cd banco-backend

# Copiar y editar variables de entorno
cp .env.example .env
# Edita .env con tu usuario/contraseña de MySQL

# Instalar dependencias
npm install

# Arrancar en modo desarrollo
npm run dev
# Servidor en: http://localhost:3000

## ──────────────────────────────────────────────
## ✅ PASO 3 — Configurar el Frontend
## ──────────────────────────────────────────────
cd banco-frontend

# Instalar dependencias
npm install

# Arrancar la app
ionic serve
# App en: http://localhost:4200

## ──────────────────────────────────────────────
## 🔑 Credenciales demo
## ──────────────────────────────────────────────
Email: admin@banco.com
Pass:  password  (hash bcrypt incluido en el SQL)

## ──────────────────────────────────────────────
## 🚀 DESPLIEGUE — Backend en Render
## ──────────────────────────────────────────────
1. Crea cuenta en https://render.com
2. New > Web Service > conecta tu repositorio
3. Root Directory: banco-backend
4. Build Command: npm install
5. Start Command: node server.js
6. Add Environment Variables: (las del .env)
7. Copia la URL generada (ej: https://banco-api.onrender.com)

## 🚀 DESPLIEGUE — Frontend en Vercel
## ──────────────────────────────────────────────
# Edita src/environments/environment.prod.ts con la URL de Render
# Luego:
npm install -g vercel
cd banco-frontend
ionic build --prod
vercel --prod
# Selecciona www como directorio de salida
