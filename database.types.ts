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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_members: {
        Row: {
          account_id: string
          created_at: string
          profile_id: string
          role: Database["public"]["Enums"]["account_roles"]
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          profile_id: string
          role: Database["public"]["Enums"]["account_roles"]
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["account_roles"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_members_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_budget_list_view"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_members_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      accounts: {
        Row: {
          account_id: string
          created_at: string
          created_by: string
          currency: string
          name: string
          total_expense: number
          total_income: number
          total_savings: number
          updated_at: string
        }
        Insert: {
          account_id?: string
          created_at?: string
          created_by: string
          currency?: string
          name: string
          total_expense?: number
          total_income?: number
          total_savings?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          created_by?: string
          currency?: string
          name?: string
          total_expense?: number
          total_income?: number
          total_savings?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_created_by_profiles_profile_id_fk"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      budget_expenses: {
        Row: {
          amount: number
          budget_expense_id: number
          budget_id: number | null
          created_at: string
          note: string
          occurred_at: string
          updated_at: string
        }
        Insert: {
          amount: number
          budget_expense_id?: never
          budget_id?: number | null
          created_at?: string
          note: string
          occurred_at?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          budget_expense_id?: never
          budget_id?: number | null
          created_at?: string
          note?: string
          occurred_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_expenses_budget_id_budgets_budget_id_fk"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["budget_id"]
          },
        ]
      }
      budgets: {
        Row: {
          account_id: string | null
          budget_amount: number
          budget_id: number
          created_at: string
          current_amount: number
          name: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          budget_amount: number
          budget_id?: never
          created_at?: string
          current_amount?: number
          name: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          budget_amount?: number
          budget_id?: never
          created_at?: string
          current_amount?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_budget_list_view"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "budgets_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      goals: {
        Row: {
          account_id: string | null
          created_at: string
          current_amount: number
          goal_amount: number
          goal_date: string | null
          goal_id: number
          name: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          current_amount?: number
          goal_amount: number
          goal_date?: string | null
          goal_id?: never
          name: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          current_amount?: number
          goal_amount?: number
          goal_date?: string | null
          goal_id?: never
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_budget_list_view"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "goals_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
      invitation_accepts: {
        Row: {
          accepted_at: string
          invitation_accept_id: number
          invitation_id: number | null
          profile_id: string | null
        }
        Insert: {
          accepted_at?: string
          invitation_accept_id?: never
          invitation_id?: number | null
          profile_id?: string | null
        }
        Update: {
          accepted_at?: string
          invitation_accept_id?: never
          invitation_id?: number | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_accepts_invitation_id_invitations_invitation_id_fk"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["invitation_id"]
          },
          {
            foreignKeyName: "invitation_accepts_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      invitations: {
        Row: {
          account_id: string | null
          created_at: string
          expires_at: string
          invitation_id: number
          inviter_id: string | null
          max_uses: number
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
          used_count: number
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          expires_at?: string
          invitation_id?: never
          inviter_id?: string | null
          max_uses?: number
          status?: Database["public"]["Enums"]["invitation_status"]
          token: string
          used_count?: number
        }
        Update: {
          account_id?: string | null
          created_at?: string
          expires_at?: string
          invitation_id?: never
          inviter_id?: string | null
          max_uses?: number
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "invitations_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_budget_list_view"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "invitations_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "invitations_inviter_id_profiles_profile_id_fk"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          note: string
          occurred_at: string
          transaction_id: number
          type: Database["public"]["Enums"]["transaction_types"]
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          note: string
          occurred_at?: string
          transaction_id?: never
          type: Database["public"]["Enums"]["transaction_types"]
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          note?: string
          occurred_at?: string
          transaction_id?: never
          type?: Database["public"]["Enums"]["transaction_types"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_budget_list_view"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "transactions_account_id_accounts_account_id_fk"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
        ]
      }
    }
    Views: {
      account_budget_list_view: {
        Row: {
          account_id: string | null
          budget_amount: number | null
          currency: string | null
          current_budget: number | null
          name: string | null
          total_expense: number | null
          total_income: number | null
          total_savings: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_roles: "owner" | "member"
      invitation_status: "pending" | "consumed" | "expired"
      transaction_types: "income" | "expense"
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
      account_roles: ["owner", "member"],
      invitation_status: ["pending", "consumed", "expired"],
      transaction_types: ["income", "expense"],
    },
  },
} as const
