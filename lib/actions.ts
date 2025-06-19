"use server"

import { supabaseServer } from "./supabase-server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Create authenticated Supabase client for server actions
async function createAuthenticatedClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function getChurchContent() {
  try {
    const { data, error } = await supabaseServer.from("church_content").select("*").order("content_type")

    if (error) {
      console.error("Error fetching content:", error)
      return null
    }

    // Transform the data into the expected format
    const contentData: any = {}
    data?.forEach((item) => {
      const key =
        item.content_type === "event_details"
          ? "eventDetails"
          : item.content_type === "bus_schedule"
            ? "busSchedule"
            : item.content_type
      contentData[key] = item.data
    })

    return contentData
  } catch (error) {
    console.error("Error in getChurchContent:", error)
    return null
  }
}

export async function updateChurchContent(contentType: string, data: any) {
  try {
    // Create authenticated client to check user session
    const supabase = await createAuthenticatedClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Authentication required" }
    }

    // Convert camelCase to snake_case for database
    const dbContentType =
      contentType === "eventDetails" ? "event_details" : contentType === "busSchedule" ? "bus_schedule" : contentType

    const { error } = await supabaseServer.from("church_content").upsert(
      {
        content_type: dbContentType,
        data: data,
      },
      {
        onConflict: "content_type",
      },
    )

    if (error) {
      console.error("Error updating content:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error in updateChurchContent:", error)
    return { success: false, error: "Failed to update content" }
  }
}

export async function checkAuthStatus() {
  try {
    const supabase = await createAuthenticatedClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return { authenticated: false, user: null }
    }

    return { authenticated: true, user }
  } catch (error) {
    return { authenticated: false, user: null }
  }
}
