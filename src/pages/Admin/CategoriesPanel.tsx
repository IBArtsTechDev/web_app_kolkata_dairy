import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Edit3, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Skeleton } from '@/components/common/Skeleton'
import { ConfirmDialog } from './ConfirmDialog'
import { useAdminCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks'
import { useAppContext } from '@/context'
import { resolveAssetUrl } from '@/api/client'
import type { Category } from '@/types'

interface FormValues {
  categoryName: string
  categorySlug: string
  description: string
  isActive: boolean
}

const emptyValues: FormValues = {
  categoryName: '',
  categorySlug: '',
  description: '',
  isActive: true,
}

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const inputClass =
  'w-full h-11 px-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all'

export function CategoriesPanel() {
  const { addToast } = useAppContext()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [icon, setIcon] = useState<File | null>(null)

  const { data, isLoading, isError, error, refetch } = useAdminCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const categories = data || []
  const saving = createMutation.isPending || updateMutation.isPending

  const openCreate = () => {
    setValues(emptyValues)
    setIcon(null)
    setCreating(true)
  }

  const openEdit = (category: Category) => {
    setValues({
      categoryName: category.name,
      categorySlug: category.slug,
      description: category.description || '',
      isActive: category.isActive,
    })
    setIcon(null)
    setEditing(category)
  }

  const closeForm = () => {
    if (saving) return
    setCreating(false)
    setEditing(null)
  }

  const setField = (field: keyof FormValues, value: string | boolean) =>
    setValues((current) => ({ ...current, [field]: value }))

  const handleSubmit = () => {
    const categoryName = values.categoryName.trim()
    const categorySlug = toSlug(values.categorySlug || categoryName)

    if (!editing && categoryName.length < 2) {
      addToast({ message: 'Category name must be at least 2 characters.', type: 'error' })
      return
    }
    if (categorySlug.length < 2) {
      addToast({ message: 'Category slug must be at least 2 characters.', type: 'error' })
      return
    }

    const payload = {
      ...(editing ? {} : { categoryName }),
      categorySlug,
      description: values.description.trim() || null,
      isActive: values.isActive,
    }

    if (editing) {
      updateMutation.mutate(
        { categoryId: editing.categoryId, payload, icon: icon ?? undefined },
        {
          onSuccess: () => {
            addToast({ message: 'Category updated', type: 'success' })
            setEditing(null)
          },
          onError: (err) =>
            addToast({ message: err.message || 'Failed to update category', type: 'error' }),
        },
      )
      return
    }

    createMutation.mutate(
      { payload: { ...payload, categoryName }, icon: icon ?? undefined },
      {
        onSuccess: () => {
          addToast({ message: 'Category created', type: 'success' })
          setCreating(false)
        },
        onError: (err) =>
          addToast({ message: err.message || 'Failed to create category', type: 'error' }),
      },
    )
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteMutation.mutate(deleting.categoryId, {
      onSuccess: () => {
        addToast({ message: 'Category deleted', type: 'success' })
        setDeleting(null)
      },
      onError: (err) =>
        addToast({ message: err.message || 'Failed to delete category', type: 'error' }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-400">{categories.length} categories</p>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          New Category
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" className="w-full h-16" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-error/30 bg-error/10">
          <AlertTriangle size={18} className="text-error" />
          <p className="flex-1 text-sm text-neutral-200">
            {error?.message || 'Could not load categories.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <div className="p-8 text-center rounded-xl border border-dashed border-neutral-800">
          <p className="text-sm text-neutral-400">No categories yet.</p>
        </div>
      )}

      {categories.length > 0 && (
        <ul className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-[#141414] overflow-hidden">
          {categories.map((category) => (
            <motion.li
              key={category.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-4"
            >
              <span className="w-10 h-10 shrink-0 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden">
                {category.icon ? (
                  <img
                    src={resolveAssetUrl(category.icon) || undefined}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-neutral-500">
                    {category.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white truncate">{category.name}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      category.isActive ? 'bg-success/15 text-success' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">/{category.slug}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit category"
                  onClick={() => openEdit(category)}
                >
                  <Edit3 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete category"
                  onClick={() => setDeleting(category)}
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
        title={editing ? 'Edit Category' : 'Create Category'}
        size="md"
      >
        <div className="space-y-4">
          {!editing && (
            <Input
              label="Category Name"
              placeholder="Music"
              value={values.categoryName}
              onChange={(event) => setField('categoryName', event.target.value)}
            />
          )}

          <Input
            label="Slug"
            placeholder="music"
            value={values.categorySlug}
            onChange={(event) => setField('categorySlug', event.target.value)}
            hint={editing ? undefined : 'Leave blank to generate from the name'}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              className={`${inputClass} h-auto py-3`}
              placeholder="Short description"
              value={values.description}
              onChange={(event) => setField('description', event.target.value)}
            />
          </div>

          <label className="flex items-center gap-3 p-4 rounded-xl border border-neutral-700 bg-[#1a1a1e] cursor-pointer">
            <div className="flex-1">
              <span className="text-sm font-medium text-white">Visible on the site</span>
              <p className="text-xs text-neutral-400">Hidden categories are not listed publicly</p>
            </div>
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(event) => setField('isActive', event.target.checked)}
              className="w-5 h-5 rounded border-neutral-700 text-primary-600 focus:ring-primary-500"
            />
          </label>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              Icon {editing ? '(optional)' : ''}
            </label>
            <div className="flex items-center gap-3">
              {editing?.icon && !icon && (
                <img
                  src={resolveAssetUrl(editing.icon) || undefined}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-700"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-700 bg-[#1a1a1e] text-sm text-neutral-300 hover:border-neutral-500 cursor-pointer transition-colors">
                <ImagePlus size={16} />
                {icon ? icon.name : 'Choose icon'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) setIcon(file)
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving} className="bg-[#FF2E4D] hover:bg-[#e02441] text-white">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete category"
        description={`"${deleting?.name}" will be removed.`}
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
