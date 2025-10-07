# Sistema de Gestión de Archivos

Sistema completo de gestión de archivos (blobs) para Portfolio Tree.

## Características

### Almacenamiento
- **Vercel Blob Storage** (producción) - CDN global cuando `BLOB_READ_WRITE_TOKEN` está configurado
- **Almacenamiento local** (desarrollo) - Archivos en `/public/uploads`

### Tipos de Archivo Soportados
- **Imágenes**: JPEG, PNG, GIF, WebP
- **Documentos**: PDF, TXT, ZIP
- **Límite**: 10MB por archivo

### Categorías
- `avatar` - Fotos de perfil
- `project-image` - Imágenes de proyectos
- `document` - Documentos generales
- Categorías personalizadas

## Páginas Principales

### /dashboard/blobs - Gestor de Archivos
- Subir archivos con drag & drop
- Vista en cuadrícula con preview
- Filtrar por categoría
- Eliminar archivos
- Paginación automática

### /dashboard/profile - Edición de Perfil
- Cambiar avatar con preview
- Editar información personal
- Cambiar username
- Vista previa del perfil público

## API Endpoints

### GET /api/blobs
Lista todos los blobs del usuario con paginación.

**Query params:**
```
page    - Número de página (default: 1)
limit   - Items por página (default: 20)
category - Filtrar por categoría (opcional)
```

**Respuesta:**
```json
{
  "blobs": [
    {
      "id": "...",
      "url": "https://...",
      "filename": "imagen.jpg",
      "size": 123456,
      "mimeType": "image/jpeg",
      "category": "avatar",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### POST /api/blobs
Sube un nuevo archivo.

**Body:** `multipart/form-data`
```
file     - Archivo a subir (required)
category - Categoría (optional)
```

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

### DELETE /api/blobs/[id]
Elimina un archivo específico.

### GET /api/blobs/[id]
Obtiene información de un archivo.

### GET /api/profile
Obtiene el perfil del usuario actual.

### PATCH /api/profile
Actualiza el perfil del usuario.

**Body:**
```json
{
  "name": "Nombre Completo",
  "username": "usuario",
  "bio": "Mi biografía",
  "website": "https://ejemplo.com",
  "location": "Ciudad, País",
  "image": "https://..."
}
```

## Modelo de Base de Datos

### Tabla Blob
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
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Configuración

### Variables de Entorno

**Producción con Vercel Blob:**
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

Sin esta variable, se usa almacenamiento local.

### Migración

```bash
npx prisma migrate dev --name add_blob_model
```

## Uso en Código

### Subir Avatar desde Perfil
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
  
  // Actualizar perfil
  await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: blob.url }),
  });
};
```

### Componente FileUploader
```tsx
import FileUploader from '@/components/dashboard/file-uploader';

<FileUploader
  onUpload={handleUpload}
  accept="image/*"
  maxSize={10 * 1024 * 1024}
  category="project-image"
/>
```

## Componentes

### FileUploader
Componente de subida con drag & drop, preview y validación.

**Props:**
```typescript
interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>
  accept?: string        // Tipos MIME aceptados
  maxSize?: number       // Tamaño máximo en bytes
  category?: string      // Categoría del archivo
  disabled?: boolean
}
```

### ImageGallery
Componente para mostrar y gestionar múltiples imágenes.

**Props:**
```typescript
interface ImageGalleryProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}
```

## Seguridad

- Autenticación requerida para todas las operaciones
- Validación de tipos de archivo
- Límite de tamaño
- Verificación de propiedad antes de eliminar
- URLs únicas por archivo
- Sanitización de nombres de archivo

## Próximas Características

- [ ] Integrar selector de imágenes en editor de nodos
- [ ] Optimización automática de imágenes
- [ ] Soporte para más tipos de archivos
- [ ] Generación de thumbnails
- [ ] Búsqueda de archivos
- [ ] Etiquetas para archivos
- [ ] Compartir archivos públicamente
- [ ] Estadísticas de uso de almacenamiento

## Notas Técnicas

- Archivos en desarrollo: `/public/uploads`
- Producción con Vercel Blob: CDN global
- Rutas absolutas para SSR
- Eliminación en storage y BD
- Fallback a almacenamiento local si falla Vercel Blob
