export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["category_type"]
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          phone: string | null
          rating: number | null
          total_reviews: number | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          category: Database["public"]["Enums"]["category_type"]
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["category_type"]
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          total_reviews?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      deal_redemptions: {
        Row: {
          deal_id: string | null
          id: string
          redeemed_at: string | null
          redemption_code: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          deal_id?: string | null
          id?: string
          redeemed_at?: string | null
          redemption_code?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          deal_id?: string | null
          id?: string
          redeemed_at?: string | null
          redemption_code?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_redemptions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          business_id: string | null
          category: Database["public"]["Enums"]["category_type"]
          created_at: string | null
          current_redemptions: number | null
          description: string | null
          discount_percentage: number | null
          discount_text: string | null
          discounted_price: number | null
          expires_at: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          max_redemptions: number | null
          original_price: number | null
          status: Database["public"]["Enums"]["deal_status"] | null
          terms_conditions: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          category: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          current_redemptions?: number | null
          description?: string | null
          discount_percentage?: number | null
          discount_text?: string | null
          discounted_price?: number | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          max_redemptions?: number | null
          original_price?: number | null
          status?: Database["public"]["Enums"]["deal_status"] | null
          terms_conditions?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          category?: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          current_redemptions?: number | null
          description?: string | null
          discount_percentage?: number | null
          discount_text?: string | null
          discounted_price?: number | null
          expires_at?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          max_redemptions?: number | null
          original_price?: number | null
          status?: Database["public"]["Enums"]["deal_status"] | null
          terms_conditions?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          attended: boolean | null
          event_id: string | null
          id: string
          registration_date: string | null
          user_id: string | null
        }
        Insert: {
          attended?: boolean | null
          event_id?: string | null
          id?: string
          registration_date?: string | null
          user_id?: string | null
        }
        Update: {
          attended?: boolean | null
          event_id?: string | null
          id?: string
          registration_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          business_id: string | null
          category: Database["public"]["Enums"]["category_type"]
          created_at: string | null
          current_attendees: number | null
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          image_url: string | null
          max_attendees: number | null
          organizer_id: string | null
          premium: boolean | null
          price: number | null
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          address?: string | null
          business_id?: string | null
          category: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          max_attendees?: number | null
          organizer_id?: string | null
          premium?: boolean | null
          price?: number | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string | null
          category?: Database["public"]["Enums"]["category_type"]
          created_at?: string | null
          current_attendees?: number | null
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          max_attendees?: number | null
          organizer_id?: string | null
          premium?: boolean | null
          price?: number | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string | null
          deal_id: string | null
          event_id: string | null
          id: string
          reaction_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          event_id?: string | null
          id?: string
          reaction_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          event_id?: string | null
          id?: string
          reaction_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          deal_id: string | null
          event_id: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          deal_id?: string | null
          event_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          deal_id?: string | null
          event_id?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          deal_id: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deal_id?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deal_id?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      category_type:
        | "food_drink"
        | "retail"
        | "beauty"
        | "entertainment"
        | "health_fitness"
        | "travel"
        | "music"
        | "arts_culture"
        | "sports"
        | "business"
        | "education"
      deal_status: "active" | "expired" | "pending" | "suspended"
      event_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      user_role: "user" | "business" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      category_type: [
        "food_drink",
        "retail",
        "beauty",
        "entertainment",
        "health_fitness",
        "travel",
        "music",
        "arts_culture",
        "sports",
        "business",
        "education",
      ],
      deal_status: ["active", "expired", "pending", "suspended"],
      event_status: ["upcoming", "ongoing", "completed", "cancelled"],
      user_role: ["user", "business", "admin"],
    },
  },
} as const
