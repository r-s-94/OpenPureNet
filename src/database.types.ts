export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          comment: string
          id: number
          postId: number
          timestamp: string
          userId: string
        }
        Insert: {
          comment: string
          id?: number
          postId: number
          timestamp: string
          userId: string
        }
        Update: {
          comment?: string
          id?: number
          postId?: number
          timestamp?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "public-user"
            referencedColumns: ["userId"]
          },
        ]
      }
      follow: {
        Row: {
          follow: boolean | null
          followRequest: boolean | null
          followRequestTimestamp: string
          followTimestamp: string
          FollowUserId: string
          id: number
          is_seen: boolean
          userId: string
        }
        Insert: {
          follow?: boolean | null
          followRequest?: boolean | null
          followRequestTimestamp?: string
          followTimestamp?: string
          FollowUserId: string
          id?: number
          is_seen?: boolean
          userId: string
        }
        Update: {
          follow?: boolean | null
          followRequest?: boolean | null
          followRequestTimestamp?: string
          followTimestamp?: string
          FollowUserId?: string
          id?: number
          is_seen?: boolean
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_userId_fkey1"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "public-user"
            referencedColumns: ["userId"]
          },
        ]
      }
      "like-dislike-comments": {
        Row: {
          commentId: number
          id: number
          timestampe: string
          type: string
          userId: string
        }
        Insert: {
          commentId: number
          id?: number
          timestampe: string
          type: string
          userId: string
        }
        Update: {
          commentId?: number
          id?: number
          timestampe?: string
          type?: string
          userId?: string
        }
        Relationships: []
      }
      "like-dislike-posts": {
        Row: {
          id: number
          postId: number
          timestampe: string
          type: string
          userId: string
        }
        Insert: {
          id?: number
          postId: number
          timestampe: string
          type: string
          userId: string
        }
        Update: {
          id?: number
          postId?: number
          timestampe?: string
          type?: string
          userId?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: number
          medium: string
          text: string
          timestamp: string
          userId: string
        }
        Insert: {
          id?: number
          medium?: string
          text: string
          timestamp: string
          userId: string
        }
        Update: {
          id?: number
          medium?: string
          text?: string
          timestamp?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "public-user"
            referencedColumns: ["userId"]
          },
        ]
      }
      "private-user": {
        Row: {
          city: string
          country: string
          houseNumber: number
          id: number
          PLZ: string
          street: string
          userId: string
        }
        Insert: {
          city: string
          country: string
          houseNumber: number
          id?: number
          PLZ: string
          street: string
          userId: string
        }
        Update: {
          city?: string
          country?: string
          houseNumber?: number
          id?: number
          PLZ?: string
          street?: string
          userId?: string
        }
        Relationships: []
      }
      "public-user": {
        Row: {
          AGBConsent: boolean
          dataProtectionConsent: boolean
          id: number
          Profilname: string
          profilPicture: string
          Statustext: string
          userDataConsent: boolean
          userId: string
        }
        Insert: {
          AGBConsent?: boolean
          dataProtectionConsent?: boolean
          id?: number
          Profilname: string
          profilPicture?: string
          Statustext?: string
          userDataConsent: boolean
          userId: string
        }
        Update: {
          AGBConsent?: boolean
          dataProtectionConsent?: boolean
          id?: number
          Profilname?: string
          profilPicture?: string
          Statustext?: string
          userDataConsent?: boolean
          userId?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
