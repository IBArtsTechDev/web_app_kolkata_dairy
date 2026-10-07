import { useRef, useEffect } from 'react'
import { Camera, X, Upload } from 'lucide-react'

interface AvatarPickerProps {
  file: File | null
  previewUrl: string | null
  onChange: (file: File | null, previewUrl: string | null) => void
  disabled?: boolean
}

export function AvatarPicker({
  file,
  previewUrl,
  onChange,
  disabled = false,
}: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        alert('Image must be under 5MB')
        return
      }
      const nextUrl = URL.createObjectURL(selected)
      onChange(selected, nextUrl)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onChange(null, null)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 mb-2">
      <div className="relative group">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          aria-label="Upload profile picture"
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#FF2E4D] ${
            previewUrl
              ? 'border-[#FF2E4D]/80 shadow-md ring-2 ring-[#FF2E4D]/20'
              : 'border-neutral-700 bg-neutral-900/80 hover:border-neutral-500 hover:bg-neutral-800/80'
          }`}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-neutral-400 group-hover:text-neutral-200 transition-colors p-2 text-center">
              <Camera size={22} className="mb-1 text-neutral-500 group-hover:text-neutral-300" />
              <span className="text-[10px] font-medium leading-tight">Add Photo</span>
            </div>
          )}

          {/* Hover overlay if preview exists */}
          {previewUrl && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium">
              <Upload size={16} className="mb-0.5" />
              Change
            </div>
          )}
        </button>

        {/* Remove button */}
        {file && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleRemove}
            aria-label="Remove profile picture"
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="text-[11px] text-neutral-400">
        {file ? file.name : 'Upload profile picture (optional, max 5MB)'}
      </span>
    </div>
  )
}
