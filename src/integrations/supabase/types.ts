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
      analytics: {
        Row: {
          event_source: string
          event_type: string
          id: number
          metadata: Json | null
          source_id: number
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          event_source: string
          event_type: string
          id?: number
          metadata?: Json | null
          source_id: number
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          event_source?: string
          event_type?: string
          id?: number
          metadata?: Json | null
          source_id?: number
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: number
          message: string
          name: string
          phone: string | null
          responded: boolean | null
          response_notes: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          message: string
          name: string
          phone?: string | null
          responded?: boolean | null
          response_notes?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          message?: string
          name?: string
          phone?: string | null
          responded?: boolean | null
          response_notes?: string | null
          subject?: string
        }
        Relationships: []
      }
      deal_purchases: {
        Row: {
          customer_email: string
          deal_id: string
          id: number
          payment_id: string | null
          purchase_date: string | null
          redeemed_at: string | null
          redemption_code: string | null
          status: string
        }
        Insert: {
          customer_email: string
          deal_id: string
          id?: number
          payment_id?: string | null
          purchase_date?: string | null
          redeemed_at?: string | null
          redemption_code?: string | null
          status?: string
        }
        Update: {
          customer_email?: string
          deal_id?: string
          id?: number
          payment_id?: string | null
          purchase_date?: string | null
          redeemed_at?: string | null
          redemption_code?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_purchases_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          category: string
          city: string | null
          created_at: string | null
          description: string
          discount: string
          expiration_date: string
          featured: boolean | null
          id: number
          image_url: string | null
          latitude: number | null
          longitude: number | null
          merchant_id: string
          merchant_name: string
          purchase_count: number | null
          shares: number | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category: string
          city?: string | null
          created_at?: string | null
          description: string
          discount: string
          expiration_date: string
          featured?: boolean | null
          id?: number
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          merchant_id: string
          merchant_name: string
          purchase_count?: number | null
          shares?: number | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string | null
          description?: string
          discount?: string
          expiration_date?: string
          featured?: boolean | null
          id?: number
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          merchant_id?: string
          merchant_name?: string
          purchase_count?: number | null
          shares?: number | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tickets: {
        Row: {
          checked_in_at: string | null
          customer_email: string
          event_id: string
          id: number
          payment_id: string | null
          purchase_date: string | null
          status: string
          ticket_code: string
        }
        Insert: {
          checked_in_at?: string | null
          customer_email: string
          event_id: string
          id?: number
          payment_id?: string | null
          purchase_date?: string | null
          status?: string
          ticket_code: string
        }
        Update: {
          checked_in_at?: string | null
          customer_email?: string
          event_id?: string
          id?: number
          payment_id?: string | null
          purchase_date?: string | null
          status?: string
          ticket_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          available_tickets: number | null
          category: string
          city: string | null
          created_at: string | null
          date: string
          description: string
          featured: boolean | null
          id: number
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          merchant_id: string
          merchant_name: string
          price: string | null
          shares: number | null
          ticket_count: number | null
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          available_tickets?: number | null
          category: string
          city?: string | null
          created_at?: string | null
          date: string
          description: string
          featured?: boolean | null
          id?: number
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          merchant_id: string
          merchant_name: string
          price?: string | null
          shares?: number | null
          ticket_count?: number | null
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          available_tickets?: number | null
          category?: string
          city?: string | null
          created_at?: string | null
          date?: string
          description?: string
          featured?: boolean | null
          id?: number
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          merchant_id?: string
          merchant_name?: string
          price?: string | null
          shares?: number | null
          ticket_count?: number | null
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string
          created_at: string | null
          event_date: string | null
          expires_at: string | null
          id: number
          latitude: number | null
          longitude: number | null
          merchant_id: string
          paid: boolean | null
          payment_id: string | null
          status: string | null
          tier: string
          title: string
          type: string
          views: number | null
        }
        Insert: {
          address: string
          created_at?: string | null
          event_date?: string | null
          expires_at?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          merchant_id: string
          paid?: boolean | null
          payment_id?: string | null
          status?: string | null
          tier: string
          title: string
          type: string
          views?: number | null
        }
        Update: {
          address?: string
          created_at?: string | null
          event_date?: string | null
          expires_at?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          merchant_id?: string
          paid?: boolean | null
          payment_id?: string | null
          status?: string | null
          tier?: string
          title?: string
          type?: string
          views?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          email: string
          id: string
          item_description: string | null
          item_name: string
          payment_type: string
          reference_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          email: string
          id: string
          item_description?: string | null
          item_name: string
          payment_type: string
          reference_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          email?: string
          id?: string
          item_description?: string | null
          item_name?: string
          payment_type?: string
          reference_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string | null
          id: number
          item_id: number
          item_type: string
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_id: number
          item_type: string
          reaction_type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          item_id?: number
          item_type?: string
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          merchant_id: string | null
          merchant_name: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          merchant_id?: string | null
          merchant_name?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          merchant_id?: string | null
          merchant_name?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      video_ads: {
        Row: {
          action_text: string
          action_url: string
          clicks: number | null
          created_at: string | null
          deal_id: number | null
          description: string
          expiry_date: string | null
          id: number
          is_active: boolean | null
          last_clicked_at: string | null
          last_viewed_at: string | null
          merchant_id: string | null
          page_location: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
          views: number | null
        }
        Insert: {
          action_text: string
          action_url: string
          clicks?: number | null
          created_at?: string | null
          deal_id?: number | null
          description: string
          expiry_date?: string | null
          id?: number
          is_active?: boolean | null
          last_clicked_at?: string | null
          last_viewed_at?: string | null
          merchant_id?: string | null
          page_location: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
          views?: number | null
        }
        Update: {
          action_text?: string
          action_url?: string
          clicks?: number | null
          created_at?: string | null
          deal_id?: number | null
          description?: string
          expiry_date?: string | null
          id?: number
          is_active?: boolean | null
          last_clicked_at?: string | null
          last_viewed_at?: string | null
          merchant_id?: string | null
          page_location?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_ads_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_ads_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_column_if_not_exists: {
        Args: {
          table_name: string
          column_name: string
          column_type: string
          column_default?: string
        }
        Returns: undefined
      }
      get_reaction_count: {
        Args: { p_item_id: number; p_item_type: string }
        Returns: number
      }
      get_users_with_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          role: string
          created_at: string
          last_sign_in_at: string
          merchant_name: string
          business_type: string
        }[]
      }
      has_user_reacted: {
        Args: { p_user_id: string; p_item_id: number; p_item_type: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_merchant: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_user_role: {
        Args: { user_id: string; role: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
