import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, Tag, CreditCard } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">
        Willkommen im Admin-Bereich. Hier können Sie alle Aspekte Ihrer Website verwalten.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Benutzer</span>
            </CardTitle>
            <CardDescription>Benutzerverwaltung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">Registrierte Benutzer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-green-500" />
              <span>Bestellungen</span>
            </CardTitle>
            <CardDescription>Bestellungsverwaltung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">Offene Bestellungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-amber-500" />
              <span>Produkte</span>
            </CardTitle>
            <CardDescription>Produktverwaltung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">Aktive Produkte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
              <span>Rabattcodes</span>
            </CardTitle>
            <CardDescription>Rabattcode-Verwaltung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-500">Aktive Rabattcodes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Erste Schritte</CardTitle>
          <CardDescription>Folgen Sie diesen Schritten, um Ihren Admin-Bereich einzurichten</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                ✓
              </div>
              <span>Admin-Benutzer erstellen</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm">
                2
              </div>
              <span>Produkte hinzufügen oder bearbeiten</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm">
                3
              </div>
              <span>Rabattcodes erstellen</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm">
                4
              </div>
              <span>Bestellungen verwalten</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
