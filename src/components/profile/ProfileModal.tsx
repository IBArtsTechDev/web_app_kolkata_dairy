import { useState, useRef, useEffect } from 'react'
import {
  User as UserIcon,
  Mail,
  Phone,
  Camera,
  Trash2,
  Lock,
  AlertTriangle,
  Loader2,
  Globe,
} from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { useUpdateProfile } from '@/hooks/useProfile'
import { useAppContext } from '@/context'
import { resolveAssetUrl } from '@/api'
import { getInitials } from '@/utils'

export function ProfileModal() {
  const isProfileModalOpen = useAppStore((state) => state.isProfileModalOpen)
  const closeProfileModal = useAppStore((state) => state.closeProfileModal)
  const user = useAppStore((state) => state.user)
  const { addToast } = useAppContext()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [name, setName] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')

  // Avatar states
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false)

  // Validation / API errors
  const [formError, setFormError] = useState<string | null>(null)

  const updateProfileMutation = useUpdateProfile()

  // Reset/populate form when modal opens or user changes
  useEffect(() => {
    if (isProfileModalOpen && user) {
      setName(user.name || '')
      setCountryCode(user.countryCode || '+91')
      setPhoneNumber(user.phoneNumber || '')
      setAvatarFile(null)
      setIsAvatarRemoved(false)
      setFormError(null)

      if (user.profilePicture) {
        setAvatarPreview(resolveAssetUrl(user.profilePicture) || null)
      } else {
        setAvatarPreview(null)
      }
    }
  }, [isProfileModalOpen, user])

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handleClose = () => {
    setFormError(null)
    closeProfileModal()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 5MB limit validation
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Profile photo must be under 5MB')
      return
    }

    // Supported formats check
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setFormError('Invalid file type. Only JPEG, PNG, WEBP, or SVG are allowed.')
      return
    }

    setFormError(null)
    setAvatarFile(file)
    setIsAvatarRemoved(false)
    const preview = URL.createObjectURL(file)
    setAvatarPreview(preview)
  }

  const handleRemoveAvatar = () => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setAvatarFile(null)
    setAvatarPreview(null)
    setIsAvatarRemoved(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const trimmedName = name.trim()
    const trimmedPhone = phoneNumber.trim()
    const trimmedCountryCode = countryCode.trim()

    // Client-side validations
    if (!trimmedName || trimmedName.length < 2) {
      setFormError('Full name must be at least 2 characters.')
      return
    }
    if (trimmedName.length > 100) {
      setFormError('Full name must be at most 100 characters.')
      return
    }
    if (trimmedPhone && (trimmedPhone.length < 5 || trimmedPhone.length > 20)) {
      setFormError('Phone number must be between 5 and 20 digits.')
      return
    }
    if (trimmedCountryCode && trimmedCountryCode.length > 10) {
      setFormError('Country code must be at most 10 characters.')
      return
    }

    // Determine changes
    const nameChanged = trimmedName !== (user?.name || '')
    const phoneChanged = trimmedPhone !== (user?.phoneNumber || '')
    const countryCodeChanged = trimmedCountryCode !== (user?.countryCode || '+91')
    const avatarChanged = avatarFile !== null || isAvatarRemoved

    if (!nameChanged && !phoneChanged && !countryCodeChanged && !avatarChanged) {
      setFormError('No changes detected to update.')
      return
    }

    // Build payload
    const payload: {
      name?: string
      phoneNumber?: string | null
      countryCode?: string | null
      profilePicture?: File | null
    } = {}

    // Name is always safe to send if replacing
    payload.name = trimmedName

    // Phone number handling (null clears)
    if (phoneChanged || trimmedPhone) {
      payload.phoneNumber = trimmedPhone ? trimmedPhone : null
    }

    // Country code handling (null clears)
    if (countryCodeChanged || trimmedCountryCode) {
      payload.countryCode = trimmedCountryCode ? trimmedCountryCode : null
    }

    // Avatar handling
    if (avatarFile) {
      payload.profilePicture = avatarFile
    } else if (isAvatarRemoved) {
      payload.profilePicture = null
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        addToast({
          message: 'Profile updated successfully!',
          type: 'success',
        })
        handleClose()
      },
      onError: (err) => {
        setFormError(err.message || 'Failed to update profile. Please try again.')
      },
    })
  }

  if (!user) return null

  const isSubmitting = updateProfileMutation.isPending
  const currentAvatarUrl = !isAvatarRemoved ? avatarPreview : null

  return (
    <Modal
      isOpen={isProfileModalOpen}
      onClose={handleClose}
      title="Edit Profile"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Error notification */}
        {formError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs animate-in fade-in duration-150">
            <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{formError}</p>
          </div>
        )}

        {/* Profile Avatar Header */}
        <div className="flex flex-col items-center justify-center pt-1 pb-3">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center shadow-lg relative">
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white uppercase">
                  {getInitials(name || user.name || 'U')}
                </span>
              )}

              {/* Upload Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium cursor-pointer"
                aria-label="Upload profile picture"
              >
                <Camera size={20} className="mb-1" />
                Change
              </button>
            </div>

            {/* Quick Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="absolute bottom-0 right-0 p-2 bg-[#FF2E4D] hover:bg-[#e02441] text-white rounded-full shadow-md border-2 border-[#141414] transition-transform hover:scale-110"
              title="Upload new photo"
              aria-label="Change photo"
            >
              <Camera size={14} />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="text-xs text-[#FF2E4D] hover:underline font-medium"
            >
              {currentAvatarUrl ? 'Change Photo' : 'Upload Photo'}
            </button>

            {currentAvatarUrl && (
              <>
                <span className="text-neutral-600 text-xs">•</span>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isSubmitting}
                  className="text-xs text-neutral-400 hover:text-red-400 font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </>
            )}
          </div>

          <p className="text-[11px] text-neutral-500 mt-1">
            JPEG, PNG, WEBP or SVG up to 5MB
          </p>
        </div>

        {/* Public ID and Username preview */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-900/80 rounded-xl border border-neutral-800 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">ID:</span>
            <span className="font-mono text-neutral-300 font-medium">{user.publicId}</span>
          </div>
          {user.username && (
            <span className="text-neutral-400">@{user.username}</span>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <Input
            label="Full Name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon size={16} />}
            required
            disabled={isSubmitting}
          />

          {/* Email (Read-Only) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-neutral-300">
                Email Address
              </label>
              <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                <Lock size={10} /> Cannot be changed
              </span>
            </div>
            <div className="relative">
              <Input
                type="email"
                value={user.email}
                leftIcon={<Mail size={16} className="text-neutral-500" />}
                disabled
                className="bg-neutral-900/60 text-neutral-400 cursor-not-allowed border-neutral-800/80"
              />
            </div>
          </div>

          {/* Phone Number with Country Code */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-300">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-24 shrink-0">
                <Input
                  type="text"
                  placeholder="+91"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  leftIcon={<Globe size={14} />}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="tel"
                  placeholder="9830012345"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  leftIcon={<Phone size={16} />}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              Optional. Used for booking updates and account alerts.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-neutral-700 text-neutral-300 hover:text-white"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#FF2E4D] hover:bg-[#e02441] text-white px-5 min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
