import { ImageDebugHelper } from "@/app/dashboard/image-debug-helper"

export default function ImageTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">🖼️ Image Testing Dashboard</h1>
        <p className="text-purple-600">Comprehensive image validation for CS2, Valorant, and other assets</p>
      </div>

      <ImageDebugHelper />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">CS2 Image Test</h3>
          <img
            src="/cs2.png"
            alt="CS2"
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=CS2+Missing"
            }}
          />
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Valorant Image Test</h3>
          <img
            src="/valorant.png"
            alt="Valorant"
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=Valorant+Missing"
            }}
          />
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Fortnite Image Test</h3>
          <img
            src="/fortnite.png"
            alt="Fortnite"
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=200&width=300&text=Fortnite+Missing"
            }}
          />
        </div>
      </div>
    </div>
  )
}
