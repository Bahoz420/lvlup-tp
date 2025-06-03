import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreateAdminPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Use the following credentials to log in as an admin user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="font-medium text-sm">Email</div>
            <div className="p-2 bg-gray-100 rounded-md font-mono text-sm">admin@lvlup.io</div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-sm">Password</div>
            <div className="p-2 bg-gray-100 rounded-md font-mono text-sm">admin123</div>
          </div>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/login?redirectTo=/admin">Go to Login</Link>
            </Button>
          </div>

          <div className="text-xs text-gray-500 pt-2">
            <p>Note: In a production environment, you would use a secure method to create admin users.</p>
            <p>This is a simplified approach for development purposes only.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
