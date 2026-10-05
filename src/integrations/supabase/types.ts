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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      funding_programs: {
        Row: {
          created_at: string
          hs_code: string | null
          id: string
          max_amount_cad: number | null
          max_pct: number | null
          name: string
          notes: string | null
          program_type: string | null
          provider: string | null
          sector: string | null
          source: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          hs_code?: string | null
          id?: string
          max_amount_cad?: number | null
          max_pct?: number | null
          name: string
          notes?: string | null
          program_type?: string | null
          provider?: string | null
          sector?: string | null
          source?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          hs_code?: string | null
          id?: string
          max_amount_cad?: number | null
          max_pct?: number | null
          name?: string
          notes?: string | null
          program_type?: string | null
          provider?: string | null
          sector?: string | null
          source?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funding_programs_hs_code_fkey"
            columns: ["hs_code"]
            isOneToOne: false
            referencedRelation: "tariff_items"
            referencedColumns: ["hs_code"]
          },
        ]
      }
      market_data: {
        Row: {
          data_year: number | null
          hs_code: string
          source: string | null
          total_import_value_cad: number | null
          updated_at: string
          us_import_value_cad: number | null
        }
        Insert: {
          data_year?: number | null
          hs_code: string
          source?: string | null
          total_import_value_cad?: number | null
          updated_at?: string
          us_import_value_cad?: number | null
        }
        Update: {
          data_year?: number | null
          hs_code?: string
          source?: string | null
          total_import_value_cad?: number | null
          updated_at?: string
          us_import_value_cad?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_data_hs_code_fkey"
            columns: ["hs_code"]
            isOneToOne: true
            referencedRelation: "tariff_items"
            referencedColumns: ["hs_code"]
          },
        ]
      }
      suppliers: {
        Row: {
          city: string | null
          created_at: string
          hs_code: string
          id: string
          name: string
          notes: string | null
          province: string | null
          source: string | null
          supplier_type: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          hs_code: string
          id?: string
          name: string
          notes?: string | null
          province?: string | null
          source?: string | null
          supplier_type?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          hs_code?: string
          id?: string
          name?: string
          notes?: string | null
          province?: string | null
          source?: string | null
          supplier_type?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_hs_code_fkey"
            columns: ["hs_code"]
            isOneToOne: false
            referencedRelation: "tariff_items"
            referencedColumns: ["hs_code"]
          },
        ]
      }
      tariff_items: {
        Row: {
          created_at: string
          description: string
          heading: string
          hs_code: string
          sector: string
          surtax_rate: number
        }
        Insert: {
          created_at?: string
          description?: string
          heading: string
          hs_code: string
          sector?: string
          surtax_rate: number
        }
        Update: {
          created_at?: string
          description?: string
          heading?: string
          hs_code?: string
          sector?: string
          surtax_rate?: number
        }
        Relationships: []
      }
      unit_economics: {
        Row: {
          feasibility_score: number | null
          gross_margin_pct: number | null
          hs_code: string
          notes: string | null
          retool_capex_cad: number | null
          source: string | null
          updated_at: string
        }
        Insert: {
          feasibility_score?: number | null
          gross_margin_pct?: number | null
          hs_code: string
          notes?: string | null
          retool_capex_cad?: number | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          feasibility_score?: number | null
          gross_margin_pct?: number | null
          hs_code?: string
          notes?: string | null
          retool_capex_cad?: number | null
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_economics_hs_code_fkey"
            columns: ["hs_code"]
            isOneToOne: true
            referencedRelation: "tariff_items"
            referencedColumns: ["hs_code"]
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
