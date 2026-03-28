# 🖥️ Tickets Management Web

Aplicación web para la gestión y visualización de tickets, proveedores, productos y ubicaciones.

---

## 🚀 Tecnologías

* React
* Vite
* Axios
* TailwindCSS

---

## 📋 Requisitos

* Node.js >= 18
* npm o yarn

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jp1593/tickets-management-web.git
cd tickets-management-web
```

### 2. Instalar dependencias

```bash
npm install
```

---

## 🔐 Configuración

El frontend se conecta al backend mediante Axios.

Por defecto, la URL base está configurada en:

```js
http://localhost:3000/api
```

📌 Asegúrate de que el backend esté corriendo en ese puerto o ajusta la URL en:

```
src/api/ticketService.js
```

---

## ▶️ Ejecución del proyecto

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

---

## 🧩 Funcionalidades principales

### 🎫 Tickets

* Listado de tickets con paginación
* Búsqueda por:

  * Código
  * Proveedor
  * Ubicación
* Visualización de detalle de ticket
* Eliminación de tickets

### 📊 Dashboard

* Métricas generales
* Resumen por semana

### 💳 Pagos

* Resumen de pagos semanales

### ➕ Creación

* Creación de nuevos tickets

---

## 🧠 Flujo de uso

1. Levantar backend (`tickets-management-api`)
2. Ejecutar frontend
3. Navegar a la sección de tickets
4. Visualizar, crear o eliminar tickets

---

## ⚠️ Notas importantes

* El frontend depende completamente del backend para datos.
* Si el backend no está corriendo, verás errores de red en consola.

---

## Documentación

Existe una carpeta denominada docs, la cual contiene lo siguiente: 
- Documento pdf con resumen técnico de lo realizado y analisís de datos
- Vídeo demostrativo del sistema
- Diagrama entidad/relacion

---


## 👨‍💻 Autor

Juan Pablo Estrada Lucero

Proyecto desarrollado como prueba técnica.

