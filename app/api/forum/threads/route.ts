export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// Beispiel-Threads für die Community-Seite
const allThreads = [
  {
    id: "announcement",
    title: "[ANNOUNCEMENT] Wichtige Updates und Neuigkeiten",
    author: "Admin",
    createdAt: new Date().toISOString(),
    replies: 0,
    category: "Announcement",
    isPublic: true, // Öffentlich sichtbar
  },
  {
    id: "help",
    title: "[HELP] Fragen und Support für neue Benutzer",
    author: "Support Team",
    createdAt: new Date().toISOString(),
    replies: 0,
    category: "Help",
    isPublic: true, // Öffentlich sichtbar
  },
  {
    id: "fortnite-discussion",
    title: "Fortnite cheat not working after latest update",
    author: "GamerPro123",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 Stunden zuvor
    replies: 12,
    category: "Fortnite",
    isPublic: false, // Nur für registrierte Benutzer
  },
  {
    id: "valorant-settings",
    title: "Best settings for Valorant ESP?",
    author: "ValMaster",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 Stunden zuvor
    replies: 8,
    category: "Valorant",
    isPublic: false, // Nur für registrierte Benutzer
  },
  {
    id: "apex-release",
    title: "New Apex Legends cheat released!",
    author: "Admin",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 Tag zuvor
    replies: 24,
    category: "Announcement",
    isPublic: false, // Nur für registrierte Benutzer
  },
]

export async function GET(request: Request) {
  // Supabase-Client initialisieren
  const supabase = getSupabaseServerClient()

  try {
    // Überprüfen, ob der Benutzer angemeldet ist
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const isAuthenticated = !!session

    // Threads basierend auf Authentifizierungsstatus filtern
    const visibleThreads = isAuthenticated
      ? allThreads // Alle Threads für angemeldete Benutzer
      : allThreads.filter((thread) => thread.isPublic) // Nur öffentliche Threads für nicht angemeldete Benutzer

    return NextResponse.json({ threads: visibleThreads }, { status: 200 })
  } catch (error) {
    console.error("Error fetching threads:", error)
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
  }
}
