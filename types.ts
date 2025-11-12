export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          activities_image_url: string | null
          altitude: string | null
          best_time: string
          best_time_details: Json | null
          category: string
          created_at: string | null
          description: string
          difficulty: string
          duration: string
          faqs: Json | null
          featured: boolean | null
          highlights: string[]
          how_to_reach: Json | null
          id: string
          image_url: string | null
          itinerary: Json | null
          itinerary_image_url: string | null
          name: string
          overview: string | null
          overview_image_url: string | null
          places_image_url: string | null
          places_to_visit: Json | null
          slug: string | null
          things_to_do: Json | null
          travel_tips: string[] | null
          updated_at: string | null
          where_to_stay: Json | null
        }
        Insert: {
          activities_image_url?: string | null
          altitude?: string | null
          best_time: string
          best_time_details?: Json | null
          category: string
          created_at?: string | null
          description: string
          difficulty: string
          duration: string
          faqs?: Json | null
          featured?: boolean | null
          highlights?: string[]
          how_to_reach?: Json | null
          id?: string
          image_url?: string | null
          itinerary?: Json | null
          itinerary_image_url?: string | null
          name: string
          overview?: string | null
          overview_image_url?: string | null
          places_image_url?: string | null
          places_to_visit?: Json | null
          slug?: string | null
          things_to_do?: Json | null
          travel_tips?: string[] | null
          updated_at?: string | null
          where_to_stay?: Json | null
        }
        Update: {
          activities_image_url?: string | null
          altitude?: string | null
          best_time?: string
          best_time_details?: Json | null
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          duration?: string
          faqs?: Json | null
          featured?: boolean | null
          highlights?: string[]
          how_to_reach?: Json | null
          id?: string
          image_url?: string | null
          itinerary?: Json | null
          itinerary_image_url?: string | null
          name?: string
          overview?: string | null
          overview_image_url?: string | null
          places_image_url?: string | null
          places_to_visit?: Json | null
          slug?: string | null
          things_to_do?: Json | null
          travel_tips?: string[] | null
          updated_at?: string | null
          where_to_stay?: Json | null
        }
        Relationships: []
      }
      dining_schedule: {
        Row: {
          created_at: string
          description: string
          id: string
          meal_type: string
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          meal_type: string
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          meal_type?: string
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          journey_id: string | null
          journey_title: string
          message: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          journey_id?: string | null
          journey_title: string
          message?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          journey_id?: string | null
          journey_title?: string
          message?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration: string
          featured: boolean | null
          group_size: string
          highlights: string[]
          id: string
          image_url: string | null
          price: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration: string
          featured?: boolean | null
          group_size: string
          highlights?: string[]
          id?: string
          image_url?: string | null
          price: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration?: string
          featured?: boolean | null
          group_size?: string
          highlights?: string[]
          id?: string
          image_url?: string | null
          price?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      journey_days: {
        Row: {
          created_at: string | null
          day_number: number
          description: string | null
          id: string
          image_url: string | null
          journey_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_number: number
          description?: string | null
          id?: string
          image_url?: string | null
          journey_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_number?: number
          description?: string | null
          id?: string
          image_url?: string | null
          journey_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journey_days_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          activities: string[]
          category: string
          created_at: string | null
          description: string
          difficulty: string
          duration: string
          featured: boolean | null
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          activities?: string[]
          category: string
          created_at?: string | null
          description: string
          difficulty: string
          duration: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          activities?: string[]
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          duration?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          badge: string
          breakfast: string[]
          created_at: string
          description: string
          dinner: string[]
          id: string
          lunch: string[]
          name: string
          price: string
          updated_at: string
        }
        Insert: {
          badge: string
          breakfast?: string[]
          created_at?: string
          description: string
          dinner?: string[]
          id?: string
          lunch?: string[]
          name: string
          price: string
          updated_at?: string
        }
        Update: {
          badge?: string
          breakfast?: string[]
          created_at?: string
          description?: string
          dinner?: string[]
          id?: string
          lunch?: string[]
          name?: string
          price?: string
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          author: string
          author_avatar: string | null
          author_bio: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string
          featured: boolean | null
          id: string
          image_url: string | null
          published_date: string | null
          read_time: string | null
          tags: string[]
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author: string
          author_avatar?: string | null
          author_bio?: string | null
          category: string
          content: string
          created_at?: string | null
          excerpt: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published_date?: string | null
          read_time?: string | null
          tags?: string[]
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author?: string
          author_avatar?: string | null
          author_bio?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string
          featured?: boolean | null
          id?: string
          image_url?: string | null
          published_date?: string | null
          read_time?: string | null
          tags?: string[]
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      resort_activities: {
        Row: {
          created_at: string
          description: string
          full_description: string
          icon: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          full_description: string
          icon?: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          full_description?: string
          icon?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resort_gallery: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resort_packages: {
        Row: {
          badge: string
          created_at: string
          description: string
          duration: string
          features: string[]
          id: string
          image_url: string | null
          includes: string[]
          name: string
          original_price: string
          price: string
          updated_at: string
        }
        Insert: {
          badge: string
          created_at?: string
          description: string
          duration: string
          features?: string[]
          id?: string
          image_url?: string | null
          includes?: string[]
          name: string
          original_price: string
          price: string
          updated_at?: string
        }
        Update: {
          badge?: string
          created_at?: string
          description?: string
          duration?: string
          features?: string[]
          id?: string
          image_url?: string | null
          includes?: string[]
          name?: string
          original_price?: string
          price?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          approved: boolean | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: { Args: { name_text: string }; Returns: string }
      get_admin_users_with_emails: {
        Args: never
        Returns: {
          approved: boolean
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      get_pending_admin_requests: {
        Args: never
        Returns: {
          approved: boolean
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_created_at: string
          user_id: string
        }[]
      }
      get_user_id_by_email: { Args: { _email: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "main_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "main_admin"],
    },
  },
} as const
