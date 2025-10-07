# Sistema de Gestión de Blobs

Sistema completo de gestión de archivos para Portfolio Tree.

## 📋 Características

### ✅ Almacenamiento
- **Vercel Blob Storage** (producción) - Automático cuando `BLOB_READ_WRITE_TOKEN` está configurado
- **Almacenamiento local** (desarrollo) - Archivos guardados en `/public/uploads`

### 📁 Tipos de archivo soportados
- **Imágenes**: JPEG, PNG, GIF, WebP
- **Documentos**: PDF, TXT, ZIP
- **Límite de tamaño**: 10MB por archivo

### 🏷️ Categorías
- `avatar` - Fotos de perfil
- `project-image` - Imágenes de proyectos
- `document` - Documentos generales
- O categorías personalizadas

## 🚀 Nuevas Páginas

### 1. `/dashboard/blobs` - Gestor de Archivos
- Subir archivos drag & drop
- Vista en cuadrícula con preview
- Filtrar por categoría
- Eliminar archivos
- Paginación

### 2. `/dashboard/profile` - Edición de Perfil
- Cambiar avatar
- Editar nombre, bio, website, ubicación
- Cambiar username
- Vista previa del perfil público

## 📡 API Endpoints

### `GET /api/blobs`
Lista todos los blobs del usuario con paginación.

**Query params:**
- `page` - Número de página (default: 1)
- `limit` - Items por página (default: 20)
- `category` - Filtrar por categoría

**Respuesta:**
```json
{
  "blobs": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### `POST /api/blobs`
Sube un nuevo archivo.

**Body:** `multipart/form-data`
- `file` - El archivo a subir (required)
- `category` - Categoría del archivo (optional)

**Respuesta:**
```json
{
  "id": "...",
  "url": "https://...",
  "filename": "imagen.jpg",
  "size": 123456,
  "mimeType": "image/jpeg",
  "category": "avatar"
}
```

### `DELETE /api/blobs/[id]`
Elimina un archivo.

### `GET /api/blobs/[id]`
Obtiene información de un archivo específico.

### `GET /api/profile`
Obtiene el perfil del usuario actual.

### `PATCH /api/profile`
Actualiza el perfil del usuario.

**Body:**
```json
{
  "name": "Nombre",
  "username": "usuario",
  "bio": "Mi bio",
  "website": "https://...",
  "location": "Ciudad, País",
  "image": "https://..."
}
```

## 🗄️ Modelo de Base de Datos

### Tabla `Blob`
```prisma
model Blob {
  id        String   @id @default(cuid())
  userId    String
  key       String   @unique
  url       String
  filename  String
  size      Int
  mimeType  String
  category  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(...)
}
```

## 🔧 Configuración

### Variables de Entorno

Para usar Vercel Blob en producción:
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

Sin esta variable, se usará almacenamiento local.

### Migraciones

Ya ejecutada:
```bash
npx prisma migrate dev --name add_blob_model
```

## 💡 Uso

### Subir un avatar desde el perfil
```typescript
const handleAvatarUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', 'avatar');

  const response = await fetch('/api/blobs', {
    method: 'POST',
    body: formData,
  });

  const blob = await response.json();
  
  // Actualizar perfil con nueva imagen
  await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: blob.url }),
  });
};
```

### Componente FileUploader
```tsx
<FileUploader
  onUpload={handleUpload}
  accept="image/*"
  maxSize={10 * 1024 * 1024}
  category="project-image"
/>
```

## 🎨 Componentes

### `<FileUploader />`
Componente de subida con drag & drop, preview y validación.

**Props:**
- `onUpload: (file: File) => Promise<void>`
- `accept?: string` - Tipos MIME aceptados
- `maxSize?: number` - Tamaño máximo en bytes
- `category?: string` - Categoría del archivo
- `disabled?: boolean`

## 📱 Navegación del Dashboard

Actualizado con nuevos enlaces:
- ✨ Nuevo Elemento
- 👤 Editar Perfil → `/dashboard/profile`
- 📁 Archivos → `/dashboard/blobs`
- 👁️ Ver Portfolio → `/user/[username]`
- 🔍 Explorar → `/explore`

## 🔐 Seguridad

- ✅ Autenticación requerida para todas las operaciones
- ✅ Validación de tipos de archivo
- ✅ Límite de tamaño de archivo
- ✅ Verificación de propiedad antes de eliminar
- ✅ URLs únicas por archivo

## 🚦 Próximos Pasos

- [ ] Integrar selector de imágenes en editor de nodos
- [ ] Optimización de imágenes automática
- [ ] Soporte para más tipos de archivos
- [ ] Generación de thumbnails
- [ ] Búsqueda de archivos
- [ ] Etiquetas para archivos
- [ ] Compartir archivos públicamente

## 📝 Notas

- Los archivos en desarrollo se guardan en `/public/uploads`
- En producción con Vercel Blob, los archivos se almacenan en CDN
- Las rutas son absolutas para funcionar con SSR
- Los archivos eliminados se borran tanto de storage como de DB
