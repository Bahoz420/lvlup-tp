import { CacheTagManager } from "@/components/admin/cache-tag-manager"

export default function CacheTagsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Cache Tag Management</h1>
      <p className="text-gray-600 mb-8">
        Use this interface to manage and revalidate cache tags for precise control over cached content.
      </p>

      <CacheTagManager />
    </div>
  )
}
