# Solinntec Web

Este repositorio contiene el código fuente de la página web de Solinntec.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js instalado.

### Instalación
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## ☁️ Despliegue (Deployment)

El proyecto está configurado para desplegarse fácilmente en **Vercel**, la plataforma líder para frontend frameworks. Es gratuita, rápida y ofrece HTTPS automático.

### 1. Primera Publicación (Setup)
Para publicar la página por primera vez, ejecuta:

```bash
npm run deploy
```

La consola te guiará interactuando contigo (solo la primera vez):
1. Te pedirá loguearte (se abrirá el navegador).
2. `Set up and deploy?` -> Escribe `y` (Yes).
3. `Which scope?` -> Selecciona tu usuario.
4. `Link to existing project?` -> `n` (No).
5. `Project name?` -> Presiona Enter (usa el nombre por defecto) o escribe `solinntec-web`.
6. `In which directory?` -> Presiona Enter (directorio actual `./`).
7. `Want to modify these settings?` -> `n` (No).

¡Listo! Tu página estará online en una URL `*.vercel.app`.

### 2. Actualizaciones (Deployments posteriores)
Para subir cambios a la versión de "Preview" (borrador para mostrar a equipo):
```bash
npm run deploy
```

Para subir cambios a **Producción** (versión final pública):
```bash
npm run deploy:prod
```

---

## 🛠 Comandos Disponibles

- `npm run dev`: Inicia el servidor local.
- `npm run build`: Construye la aplicación para producción.
- `npm run preview`: Vista previa local de la versión construida.
- `npm run deploy`: Despliega a Vercel (Preview).
- `npm run deploy:prod`: Despliega a Vercel (Producción).
