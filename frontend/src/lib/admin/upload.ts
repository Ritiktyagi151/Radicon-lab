import { apiRequest } from './api'

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export function validateImageFile(file: File) {
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WEBP image.')
  }
}

export async function uploadAdminImage(file: File) {
  validateImageFile(file)

  const formData = new FormData()
  formData.append('file', file)

  const response = await apiRequest<{ url: string }>('/uploads/images', {
    method: 'POST',
    body: formData,
  })

  return response.url
}
