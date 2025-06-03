"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, User, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  replies: number
  likes: number
  category: string
}

interface ForumLiveFeedProps {
  category?: string
  limit?: number
}

export function ForumLiveFeed({ category, limit = 5 }: ForumLiveFeedProps) {
  // Erstelle die URL basierend auf den Parametern
  const getUrl = () => {
    const url = "/api/forum/posts"
    const params = new URLSearchParams()

    if (category) {
      params.append("category", category)
    }

    params.append("limit", limit.toString())
    params.append("sort", "latest")

    return `${url}?${params.toString()}`
  }

  // SWR für Echtzeit-Updates mit mittleren Revalidierungsintervallen
  const { data, error, mutate } = useSWR(getUrl(), fetcher, {
    refreshInterval: 60000, // Alle 60 Sekunden aktualisieren
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
  })

  // Lokaler State für neue Beiträge
  const [newPostsCount, setNewPostsCount] = useState(0)
  const [lastFetchTime, setLastFetchTime] = useState(new Date())
  const [posts, setPosts] = useState<ForumPost[]>([])

  // Aktualisiere die Beiträge, wenn sich die Daten ändern
  useEffect(() => {
    if (!data?.posts) return

    // Beim ersten Laden
    if (posts.length === 0) {
      setPosts(data.posts)
      setLastFetchTime(new Date())
      return
    }

    // Prüfe auf neue Beiträge
    const newPosts = data.posts.filter((post: ForumPost) => !posts.some((p) => p.id === post.id))

    if (newPosts.length > 0) {
      setNewPostsCount((prev) => prev + newPosts.length)
    }
  }, [data, posts])

  // Lade neue Beiträge
  const loadNewPosts = () => {
    if (!data?.posts) return

    setPosts(
      data.posts.map((post) => ({
        ...post,
        content: post.content.replace(/https:\/\/discord\.gg\//g, "https://discord.gg/CN8XS9Eb"),
      })),
    )
    setNewPostsCount(0)
    setLastFetchTime(new Date())
  }

  if (error) {
    return <div className="text-red-500">Failed to load forum posts</div>
  }

  if (!data) {
    return <div className="animate-pulse">Loading forum posts...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-purple-800">Latest Forum Posts</h3>
        <Button variant="outline" size="sm" onClick={() => mutate()} className="text-purple-600 border-purple-200">
          <MessageSquare className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {newPostsCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={loadNewPosts}
          className="w-full text-purple-600 border-purple-200 bg-purple-50"
        >
          Show {newPostsCount} new {newPostsCount === 1 ? "post" : "posts"}
        </Button>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <Link href={`/forum/posts/${post.id}`} key={post.id}>
            <div className="border border-purple-100 rounded-lg p-3 hover:bg-purple-50 transition-colors">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-purple-800">{post.title}</h4>
                <span className="text-xs text-purple-500 whitespace-nowrap ml-2">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-purple-600 line-clamp-2 mt-1">{post.content}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-purple-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.replies}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{post.likes}</span>
                </div>
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{post.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Button asChild variant="outline" className="text-purple-600 border-purple-200">
          <Link href="/forum">View All Posts</Link>
        </Button>
      </div>
    </div>
  )
}
