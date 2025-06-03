import Link from "next/link"
import Image from "next/image"
import { ChevronRight, MessageSquare, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Beispiel-Daten für die Themen-Seite
const topicData = {
  announcement: {
    id: "announcement",
    title: "[ANNOUNCEMENT] Wichtige Updates und Neuigkeiten",
    author: "Admin",
    createdAt: new Date().toISOString(),
    content:
      "Willkommen im offiziellen Ankündigungs-Thread! Hier werden alle wichtigen Updates und Neuigkeiten zu unseren Produkten und Services veröffentlicht. Bitte beachten Sie, dass nur Administratoren in diesem Thread posten können.",
    category: "Announcement",
    replies: [],
  },
  help: {
    id: "help",
    title: "[HELP] Fragen und Support für neue Benutzer",
    author: "Support Team",
    createdAt: new Date().toISOString(),
    content:
      "Dieser Thread ist für alle neuen Benutzer gedacht, die Fragen zu unseren Produkten haben oder Hilfe bei der Nutzung benötigen. Unser Support-Team wird Ihre Fragen so schnell wie möglich beantworten.",
    category: "Help",
    replies: [],
  },
}

export default function TopicPage({ params }: { params: { id: string } }) {
  const { id } = params
  const topic = topicData[id as keyof typeof topicData]

  if (!topic) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-purple-800 mb-4">Thread nicht gefunden</h1>
          <p className="text-purple-600 mb-6">Der gesuchte Thread existiert nicht oder wurde entfernt.</p>
          <Button asChild>
            <Link href="/community">Zurück zur Community</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="lvlup Logo" width={180} height={50} className="h-14 w-auto" />
          </Link>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-purple-600">
          <Link href="/" className="hover:text-purple-800">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/community" className="hover:text-purple-800">
            Community
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/forum" className="hover:text-purple-800">
            Forum
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-purple-800">{topic.title}</span>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-purple-100">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-purple-800">{topic.title}</h1>
              <Badge
                className={
                  topic.category === "Announcement"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              >
                {topic.category}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-purple-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{topic.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Pinned</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Official</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none text-purple-700">
              <p>{topic.content}</p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 flex justify-between items-center">
            <span className="text-sm text-purple-600">Dieser Thread ist für alle Benutzer sichtbar.</span>
            <Button
              size="sm"
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
            >
              Antworten
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" className="border-purple-200 text-purple-700">
            <Link href="/community">Zurück zur Community</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
