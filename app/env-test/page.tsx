import { env, validateEnvironment } from "@/lib/env"

export default function EnvTestPage() {
  // Test environment validation
  try {
    validateEnvironment()
  } catch (error) {
    console.error("Environment validation failed:", error)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Environment Status</h2>
          <p>Mode: {env.NODE_ENV}</p>
          <p>Is Production: {env.isProduction ? "Yes" : "No"}</p>
          <p>Is Development: {env.isDevelopment ? "Yes" : "No"}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Supabase Configuration</h2>
          <p>URL: {env.SUPABASE_URL ? "✅ Set" : "❌ Missing"}</p>
          <p>Anon Key: {env.SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</p>
          <p>Service Role Key: {env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing"}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Payment Configuration</h2>
          <p>Stripe Secret: {env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing"}</p>
          <p>Stripe Public: {env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"}</p>
          <p>PayPal Client ID: {env.PAYPAL_CLIENT_ID ? "✅ Set" : "❌ Missing"}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Database Configuration</h2>
          <p>Database URL: {env.DATABASE_URL ? "✅ Set" : "❌ Missing"}</p>
        </div>
      </div>
    </div>
  )
}
