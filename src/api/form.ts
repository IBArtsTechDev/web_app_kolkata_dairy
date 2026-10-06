/** Serialises a plain object into FormData, skipping empty/undefined values. */
export function toFormData(payload: Record<string, unknown>): FormData {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value)
      return
    }

    if (Array.isArray(value)) {
      formData.append(key, value.join(','))
      return
    }

    formData.append(key, String(value))
  })

  return formData
}
