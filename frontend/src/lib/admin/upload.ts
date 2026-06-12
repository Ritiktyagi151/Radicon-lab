import { apiRequest } from './api'
import { stripUploadUrl } from '@/lib/uploadUrls'

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
export type AdminImageUploadType = 'products' | 'blogs'

export function validateImageFile(file: File) {
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WEBP image.')
  }
}

export async function uploadAdminImage(file: File, type: AdminImageUploadType = 'products') {
  validateImageFile(file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const response = await apiRequest<{ url: string; path: string }>('/uploads/images', {
    method: 'POST',
    body: formData,
  })

  return stripUploadUrl(response.path || response.url)
}
