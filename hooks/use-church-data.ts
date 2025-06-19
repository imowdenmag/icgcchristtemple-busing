"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { getChurchContent, updateChurchContent } from "@/lib/actions"

export function useChurchData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseClient()

  useEffect(() => {
    loadData()

    // Set up real-time subscription
    const subscription = supabase
      .channel("church_content_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "church_content",
        },
        (payload) => {
          console.log("Real-time update received:", payload)
          loadData() // Reload data when changes occur
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const content = await getChurchContent()
      if (content) {
        setData(content)
        setError(null)
      } else {
        setError("Failed to load content")
      }
    } catch (err) {
      setError("Error loading data")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateData = async (section: string, updates: any) => {
    try {
      const result = await updateChurchContent(section, updates)
      if (result.success) {
        // Update local state immediately for better UX
        setData((prevData: any) => ({
          ...prevData,
          [section]: updates,
        }))
        return { success: true }
      } else {
        setError(result.error || "Failed to update content")
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = "Error updating data"
      setError(errorMessage)
      console.error("Error updating data:", err)
      return { success: false, error: errorMessage }
    }
  }

  return {
    data,
    loading,
    error,
    updateData,
    refetch: loadData,
  }
}
