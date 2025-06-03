"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, MessageSquare } from "lucide-react"

interface Thread {
  id: string
  title: string
  author: string
  createdAt: string
  replies: number
  category: string
  isPublic: boolean
}

export function ForumThreads() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchThreads() {
      try {
        setLoading(true)
        const response = await fetch("/api/forum/threads")

        if (!response.ok) {
          throw new Error("Failed to fetch threads")
        }

        const data = await response.json()
        setThreads(data.threads)
      } catch (err) {
        setError("Error loading forum threads. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchThreads()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden mb-6">
      <div className="p-6 border-b border-purple-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-purple-800">Forum Threads</h3>
          <Link href="/forum">
            <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-100">
              View All
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-purple-600">Loading forum threads...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : (
        <div className="divide-y divide-purple-100">
          {threads.map((thread) => (
            <div key={thread.id} className="p-4 hover:bg-purple-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/forum/topic/${thread.id}`}
                    className="text-lg font-bold text-purple-800 hover:text-purple-600"
                  >
                    {thread.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-1 text-sm text-purple-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{thread.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Pinned</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.replies} replies</span>
                    </div>
                  </div>
                </div>
                <Badge
                  className={
                    thread.category === "Announcement"
                      ? "bg-green-500 hover:bg-green-600"
                      : thread.category === "Help"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : thread.category === "Fortnite"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : thread.category === "Valorant"
                            ? "bg-purple-500 hover:bg-purple-600"
                            : "bg-gray-500 hover:bg-gray-600"
                  }
                >
                  {thread.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-purple-50 flex justify-between items-center">
        <span className="text-sm text-purple-600">
          Showing {threads.length} {threads.length === 1 ? "topic" : "topics"}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
          >
            New Topic
          </Button>
          <Link href="/forum">
            <Button size="sm" variant="outline" className="border-purple-200">
              Browse Forum
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
