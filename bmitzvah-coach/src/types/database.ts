export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_prompts: {
        Row: {
          description: string
          id: string
          kind: Database["public"]["Enums"]["activity_kind"]
          position: number
          template: Database["public"]["Enums"]["journey_template"]
          title: string
        }
        Insert: {
          description?: string
          id: string
          kind: Database["public"]["Enums"]["activity_kind"]
          position: number
          template: Database["public"]["Enums"]["journey_template"]
          title: string
        }
        Update: {
          description?: string
          id?: string
          kind?: Database["public"]["Enums"]["activity_kind"]
          position?: number
          template?: Database["public"]["Enums"]["journey_template"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_prompts_template_fkey"
            columns: ["template"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["key"]
          },
        ]
      }
      celebration_plans: {
        Row: {
          journey_id: string
          updated_at: string
          what: string
          where_at: string
          who_with: string
        }
        Insert: {
          journey_id: string
          updated_at?: string
          what?: string
          where_at?: string
          who_with?: string
        }
        Update: {
          journey_id?: string
          updated_at?: string
          what?: string
          where_at?: string
          who_with?: string
        }
        Relationships: [
          {
            foreignKeyName: "celebration_plans_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: true
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      comfort_options: {
        Row: {
          helper: string
          key: string
          label: string
          position: number
        }
        Insert: {
          helper: string
          key: string
          label: string
          position: number
        }
        Update: {
          helper?: string
          key?: string
          label?: string
          position?: number
        }
        Relationships: []
      }
      journey_activities: {
        Row: {
          created_at: string
          description: string
          id: string
          journey_id: string
          prompt_id: string | null
          status: Database["public"]["Enums"]["activity_status"]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          journey_id: string
          prompt_id?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          journey_id?: string
          prompt_id?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_activities_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_activities_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "activity_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          child_id: string
          comfort_level: string
          created_at: string
          id: string
          name: string
          quiz_answers: Json
          quiz_scores: Json
          share_slug: string | null
          template: Database["public"]["Enums"]["journey_template"]
          timeline: string
        }
        Insert: {
          child_id: string
          comfort_level?: string
          created_at?: string
          id?: string
          name: string
          quiz_answers?: Json
          quiz_scores?: Json
          share_slug?: string | null
          template: Database["public"]["Enums"]["journey_template"]
          timeline?: string
        }
        Update: {
          child_id?: string
          comfort_level?: string
          created_at?: string
          id?: string
          name?: string
          quiz_answers?: Json
          quiz_scores?: Json
          share_slug?: string | null
          template?: Database["public"]["Enums"]["journey_template"]
          timeline?: string
        }
        Relationships: [
          {
            foreignKeyName: "journeys_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journeys_template_fkey"
            columns: ["template"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["key"]
          },
        ]
      }
      milestones: {
        Row: {
          description: string
          id: string
          journey_id: string
          position: number
          status: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Insert: {
          description?: string
          id?: string
          journey_id: string
          position: number
          status?: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Update: {
          description?: string
          id?: string
          journey_id?: string
          position?: number
          status?: Database["public"]["Enums"]["milestone_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          parent_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
          parent_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          parent_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_favorite: {
        Row: {
          child_id: string
          created_at: string
          provider_key: string
        }
        Insert: {
          child_id: string
          created_at?: string
          provider_key: string
        }
        Update: {
          child_id?: string
          created_at?: string
          provider_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_favorite_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_favorite_provider_key_fkey"
            columns: ["provider_key"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["key"]
          },
        ]
      }
      provider_interest: {
        Row: {
          created_at: string
          created_by: string
          email: string
          id: string
          name: string
          note: string
          provider_key: string
        }
        Insert: {
          created_at?: string
          created_by: string
          email: string
          id?: string
          name: string
          note?: string
          provider_key: string
        }
        Update: {
          created_at?: string
          created_by?: string
          email?: string
          id?: string
          name?: string
          note?: string
          provider_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_interest_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_interest_provider_key_fkey"
            columns: ["provider_key"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["key"]
          },
        ]
      }
      provider_templates: {
        Row: {
          position: number
          provider_key: string
          template: Database["public"]["Enums"]["journey_template"]
        }
        Insert: {
          position?: number
          provider_key: string
          template: Database["public"]["Enums"]["journey_template"]
        }
        Update: {
          position?: number
          provider_key?: string
          template?: Database["public"]["Enums"]["journey_template"]
        }
        Relationships: [
          {
            foreignKeyName: "provider_templates_provider_key_fkey"
            columns: ["provider_key"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "provider_templates_template_fkey"
            columns: ["template"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["key"]
          },
        ]
      }
      provider_testimonials: {
        Row: {
          attribution: string
          position: number
          provider_key: string
          quote: string
        }
        Insert: {
          attribution: string
          position: number
          provider_key: string
          quote: string
        }
        Update: {
          attribution?: string
          position?: number
          provider_key?: string
          quote?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_testimonials_provider_key_fkey"
            columns: ["provider_key"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["key"]
          },
        ]
      }
      providers: {
        Row: {
          approach: string
          format: Database["public"]["Enums"]["provider_format"]
          key: string
          location: string
          name: string
          org_type: Database["public"]["Enums"]["org_type"]
          overview: string
          position: number
          price_range: string
          tagline: string
          verified: boolean
        }
        Insert: {
          approach: string
          format: Database["public"]["Enums"]["provider_format"]
          key: string
          location: string
          name: string
          org_type: Database["public"]["Enums"]["org_type"]
          overview: string
          position: number
          price_range: string
          tagline: string
          verified?: boolean
        }
        Update: {
          approach?: string
          format?: Database["public"]["Enums"]["provider_format"]
          key?: string
          location?: string
          name?: string
          org_type?: Database["public"]["Enums"]["org_type"]
          overview?: string
          position?: number
          price_range?: string
          tagline?: string
          verified?: boolean
        }
        Relationships: []
      }
      quiz_options: {
        Row: {
          emoji: string
          id: string
          label: string
          position: number
          question_id: string
          weights: Json
        }
        Insert: {
          emoji: string
          id: string
          label: string
          position: number
          question_id: string
          weights?: Json
        }
        Update: {
          emoji?: string
          id?: string
          label?: string
          position?: number
          question_id?: string
          weights?: Json
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          helper: string | null
          id: string
          kind: Database["public"]["Enums"]["quiz_question_kind"]
          pick_exactly: number | null
          position: number
          prompt: string
        }
        Insert: {
          helper?: string | null
          id: string
          kind: Database["public"]["Enums"]["quiz_question_kind"]
          pick_exactly?: number | null
          position: number
          prompt: string
        }
        Update: {
          helper?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["quiz_question_kind"]
          pick_exactly?: number | null
          position?: number
          prompt?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          age: number
          celebration: string
          child_name: string
          journey_name: string
          position: number
          quote: string
          slug: string
          story: string
          template: Database["public"]["Enums"]["journey_template"]
        }
        Insert: {
          age: number
          celebration: string
          child_name: string
          journey_name: string
          position: number
          quote: string
          slug: string
          story: string
          template: Database["public"]["Enums"]["journey_template"]
        }
        Update: {
          age?: number
          celebration?: string
          child_name?: string
          journey_name?: string
          position?: number
          quote?: string
          slug?: string
          story?: string
          template?: Database["public"]["Enums"]["journey_template"]
        }
        Relationships: [
          {
            foreignKeyName: "stories_template_fkey"
            columns: ["template"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["key"]
          },
        ]
      }
      template_milestones: {
        Row: {
          description: string
          position: number
          template: Database["public"]["Enums"]["journey_template"]
          title: string
        }
        Insert: {
          description?: string
          position: number
          template: Database["public"]["Enums"]["journey_template"]
          title: string
        }
        Update: {
          description?: string
          position?: number
          template?: Database["public"]["Enums"]["journey_template"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_milestones_template_fkey"
            columns: ["template"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["key"]
          },
        ]
      }
      templates: {
        Row: {
          celebration_ideas: string[]
          description: string
          emoji: string
          getting_started: string[]
          jewish_lens: string
          key: Database["public"]["Enums"]["journey_template"]
          name: string
          position: number
          provider_types: string[]
          tagline: string
          themes: string[]
        }
        Insert: {
          celebration_ideas?: string[]
          description: string
          emoji: string
          getting_started?: string[]
          jewish_lens: string
          key: Database["public"]["Enums"]["journey_template"]
          name: string
          position: number
          provider_types?: string[]
          tagline: string
          themes?: string[]
        }
        Update: {
          celebration_ideas?: string[]
          description?: string
          emoji?: string
          getting_started?: string[]
          jewish_lens?: string
          key?: Database["public"]["Enums"]["journey_template"]
          name?: string
          position?: number
          provider_types?: string[]
          tagline?: string
          themes?: string[]
        }
        Relationships: []
      }
      timeline_options: {
        Row: {
          helper: string
          key: string
          label: string
          position: number
        }
        Insert: {
          helper: string
          key: string
          label: string
          position: number
        }
        Update: {
          helper?: string
          key?: string
          label?: string
          position?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_journey: { Args: { jid: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_child: { Args: never; Returns: boolean }
      is_parent: { Args: never; Returns: boolean }
      is_parent_of: { Args: { child: string }; Returns: boolean }
      owns_journey: { Args: { jid: string }; Returns: boolean }
    }
    Enums: {
      activity_kind: "do" | "create" | "learn" | "give"
      activity_status: "planned" | "done"
      app_role: "parent" | "child" | "admin"
      journey_template:
        | "into-the-wild"
        | "make-something-real"
        | "make-a-difference"
        | "mind-and-meaning"
        | "roots-and-rituals"
        | "my-own-path"
      milestone_status: "todo" | "in_progress" | "done"
      org_type: "organization" | "independent"
      provider_format: "in-person" | "virtual" | "hybrid"
      quiz_question_kind: "single" | "words"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_kind: ["do", "create", "learn", "give"],
      activity_status: ["planned", "done"],
      app_role: ["parent", "child", "admin"],
      journey_template: [
        "into-the-wild",
        "make-something-real",
        "make-a-difference",
        "mind-and-meaning",
        "roots-and-rituals",
        "my-own-path",
      ],
      milestone_status: ["todo", "in_progress", "done"],
      org_type: ["organization", "independent"],
      provider_format: ["in-person", "virtual", "hybrid"],
      quiz_question_kind: ["single", "words"],
    },
  },
} as const

