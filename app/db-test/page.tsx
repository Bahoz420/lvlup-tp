import { db } from "@/lib/supabase-database-fixed"
import { testSupabaseConnection, testSupabaseServerConnection } from "@/lib/supabase-client-factory"

export default async function DatabaseTestPage() {
  // Test the new database layer
  const connectionTest = await db.testConnection()
  const clientTest = await testSupabaseConnection()
  const serverTest = await testSupabaseServerConnection()

  // Test getting products
  const productsTest = await db.getAllProducts()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

      <div className="space-y-6">
        {/* Connection Tests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connection Tests</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${connectionTest.error ? "bg-red-500" : "bg-green-500"}`}></span>
              <span className="font-medium">Database Layer Test:</span>
              <span className={connectionTest.error ? "text-red-600" : "text-green-600"}>
                {connectionTest.error || "Success"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${clientTest.success ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="font-medium">Client Connection:</span>
              <span className={clientTest.success ? "text-green-600" : "text-red-600"}>
                {clientTest.success ? clientTest.message : clientTest.error}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${serverTest.success ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="font-medium">Server Connection:</span>
              <span className={serverTest.success ? "text-green-600" : "text-red-600"}>
                {serverTest.success ? serverTest.message : serverTest.error}
              </span>
            </div>
          </div>
        </div>

        {/* Products Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Products Query Test</h2>

          <div className="flex items-center gap-3 mb-4">
            <span className={`w-3 h-3 rounded-full ${productsTest.error ? "bg-red-500" : "bg-green-500"}`}></span>
            <span className="font-medium">Products Query:</span>
            <span className={productsTest.error ? "text-red-600" : "text-green-600"}>
              {productsTest.error || `Found ${productsTest.data?.length || 0} products`}
            </span>
          </div>

          {productsTest.error && (
            <div className="bg-red-50 p-4 rounded border border-red-200">
              <p className="text-red-800 text-sm">Error: {productsTest.error}</p>
            </div>
          )}

          {productsTest.data && productsTest.data.length > 0 && (
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-green-800 text-sm">
                Successfully connected to database. Found {productsTest.data.length} products.
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-green-700 hover:text-green-900">View products data</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                  {JSON.stringify(productsTest.data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {productsTest.data && productsTest.data.length === 0 && (
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                Database connection successful, but no products found. This is expected if you haven't seeded the
                database yet.
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Next Steps</h2>
          <ul className="text-blue-800 space-y-2">
            <li>✅ Environment variables configured</li>
            <li>✅ Supabase client factory created</li>
            <li>✅ Database layer with error handling</li>
            <li>🔄 Testing database connections...</li>
            <li>⏳ Ready for Step 3: Fix async client components</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
