import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, Edit3, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Skeleton } from '@/components/common/Skeleton'
import { ConfirmDialog } from './ConfirmDialog'
import { useAdminBanners, useCreateBanner, useDeleteBanner, useUpdateBanner } from '@/hooks'
import { useAppContext } from '@/context'
import { resolveAssetUrl } from '@/api/client'
import type { Banner } from '@/types'

interface FormValues {
  title: string
  link: string
  sortOrder: string
  isActive: boolean
}

const emptyValues: FormValues = { title: '', link: '', sortOrder: '0', isActive: true }

export function BannersPanel() {
  const { addToast } = useAppContext()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [deleting, setDeleting] = useState<Banner | null>(null)
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [image, setImage] = useState<File | null>(null)

  const { data, isLoading, isError, error, refetch } = useAdminBanners()
  const createMutation = useCreateBanner()
  const updateMutation = useUpdateBanner()
  const deleteMutation = useDeleteBanner()

  const banners = data || []
  const saving = createMutation.isPending || updateMutation.isPending

  const openCreate = () => {
    setValues(emptyValues)
    setImage(null)
    setCreating(true)
  }

  const openEdit = (banner: Banner) => {
    setValues({
      title: banner.title,
      link: banner.link || '',
      sortOrder: String(banner.sortOrder ?? 0),
      isActive: banner.isActive,
    })
    setImage(null)
    setEditing(banner)
  }

  const closeForm = () => {
    if (saving) return
    setCreating(false)
    setEditing(null)
  }

  const setField = (field: keyof FormValues, value: string | boolean) =>
    setValues((current) => ({ ...current, [field]: value }))

  const handleSubmit = () => {
    const title = values.title.trim()
    if (title.length < 2) {
      addToast({ message: 'Banner title must be at least 2 characters.', type: 'error' })
      return
    }

    const payload = {
      title,
      link: values.link.trim() || null,
      sortOrder: Number(values.sortOrder) || 0,
      isActive: values.isActive,
    }

    if (editing) {
      updateMutation.mutate(
        { bannerId: editing.bannerId, payload, image: image ?? undefined },
        {
          onSuccess: () => {
            addToast({ message: 'Banner updated', type: 'success' })
            setEditing(null)
          },
          onError: (err) => addToast({ message: err.message || 'Failed to update banner', type: 'error' }),
        },
      )
      return
    }

    if (!image) {
      addToast({ message: 'Choose an image for the banner.', type: 'error' })
      return
    }

    createMutation.mutate(
      { payload, image },
      {
        onSuccess: () => {
          addToast({ message: 'Banner created', type: 'success' })
          setCreating(false)
        },
        onError: (err) => addToast({ message: err.message || 'Failed to create banner', type: 'error' }),
      },
    )
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteMutation.mutate(deleting.bannerId, {
      onSuccess: () => {
        addToast({ message: 'Banner deleted', type: 'success' })
        setDeleting(null)
      },
      onError: (err) => addToast({ message: err.message || 'Failed to delete banner', type: 'error' }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-400">{banners.length} banners</p>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          New Banner
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" className="w-full h-28" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-error/30 bg-error/10">
          <AlertTriangle size={18} className="text-error" />
          <p className="flex-1 text-sm text-neutral-200">
            {error?.message || 'Could not load banners.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && banners.length === 0 && (
        <div className="p-8 text-center rounded-xl border border-dashed border-neutral-800">
          <p className="text-sm text-neutral-400">No banners yet.</p>
        </div>
      )}

      {banners.length > 0 && (
        <ul className="space-y-3">
          {banners.map((banner) => (
            <motion.li
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-3 rounded-xl border border-neutral-800 bg-[#141414]"
            >
              <img
                src={resolveAssetUrl(banner.image) || undefined}
                alt={banner.title}
                className="w-28 h-16 rounded-lg object-cover border border-neutral-800 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white truncate">{banner.title}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      banner.isActive ? 'bg-success/15 text-success' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-800 text-neutral-400">
                    #{banner.sortOrder}
                  </span>
                </div>
                {banner.link && (
                  <p className="text-xs text-neutral-500 mt-1 truncate flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    {banner.link}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit banner"
                  onClick={() => openEdit(banner)}
                >
                  <Edit3 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete banner"
                  onClick={() => setDeleting(banner)}
                >
                  <Trash2 size={16} className="text-error" />
                </Button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={creating || !!editing}
        onClose={closeForm}
        title={editing ? 'Edit Banner' : 'Create Banner'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Durga Puja Specials"
            value={values.title}
            onChange={(event) => setField('title', event.target.value)}
          />

          <Input
            label="Link (optional)"
            placeholder="https://example.com"
            value={values.link}
            onChange={(event) => setField('link', event.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sort Order"
              type="number"
              value={values.sortOrder}
              onChange={(event) => setField('sortOrder', event.target.value)}
            />
            <div className="flex items-end">
              <label className="flex items-center gap-3 w-full h-11 px-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] cursor-pointer">
                <span className="text-sm text-neutral-300 flex-1">Visible</span>
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(event) => setField('isActive', event.target.checked)}
                  className="w-5 h-5 rounded border-neutral-700 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              Image {editing ? '(leave unchanged to keep the current one)' : ''}
            </label>
            <div className="flex items-center gap-3">
              {editing?.image && !image && (
                <img
                  src={resolveAssetUrl(editing.image) || undefined}
                  alt=""
                  className="w-24 h-14 rounded-lg object-cover border border-neutral-700"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-700 bg-[#1a1a1e] text-sm text-neutral-300 hover:border-neutral-500 cursor-pointer transition-colors">
                <ImagePlus size={16} />
                {image ? image.name : 'Choose image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) setImage(file)
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-[#FF2E4D] hover:bg-[#e02441] text-white"
            >
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Banner'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete banner"
        description={`"${deleting?.title}" will be removed from the homepage.`}
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
