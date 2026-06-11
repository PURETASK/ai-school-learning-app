// Generated from the live Supabase schema (project: AI_SCHOOL) via MCP introspection.
// Regenerate with: npx supabase gen types typescript --project-id hqsydwjcpcammmfftyqi > src/types/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type StudentOwnedRelationship<TName extends string> = {
  foreignKeyName: TName
  columns: ["student_id"]
  isOneToOne: false
  referencedRelation: "student_profiles"
  referencedColumns: ["id"]
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { created_at: string; display_name: string | null; id: string; role: string; updated_at: string }
        Insert: { created_at?: string; display_name?: string | null; id: string; role?: string; updated_at?: string }
        Update: { created_at?: string; display_name?: string | null; id?: string; role?: string; updated_at?: string }
        Relationships: []
      }
      student_profiles: {
        Row: { academy: string; created_at: string; display_name: string; grade_level: string; id: string; updated_at: string; user_id: string | null }
        Insert: { academy: string; created_at?: string; display_name: string; grade_level: string; id?: string; updated_at?: string; user_id?: string | null }
        Update: { academy?: string; created_at?: string; display_name?: string; grade_level?: string; id?: string; updated_at?: string; user_id?: string | null }
        Relationships: []
      }
      guardian_student_links: {
        Row: { created_at: string; guardian_user_id: string; id: string; relationship_label: string | null; student_id: string }
        Insert: { created_at?: string; guardian_user_id: string; id?: string; relationship_label?: string | null; student_id: string }
        Update: { created_at?: string; guardian_user_id?: string; id?: string; relationship_label?: string | null; student_id?: string }
        Relationships: []
      }
      student_learning_state_snapshots: {
        Row: { created_at: string; schema_version: number; state: Json; student_id: string; updated_at: string }
        Insert: { created_at?: string; schema_version?: number; state: Json; student_id: string; updated_at?: string }
        Update: { created_at?: string; schema_version?: number; state?: Json; student_id?: string; updated_at?: string }
        Relationships: []
      }
      lesson_progress: {
        Row: { academy: string; completed_at: string | null; completed_section_ids: string[]; current_section_id: string | null; grade_level: string; id: string; lesson_id: string; started_at: string | null; status: string; student_id: string; subject: string; updated_at: string }
        Insert: { academy: string; completed_at?: string | null; completed_section_ids?: string[]; current_section_id?: string | null; grade_level: string; id?: string; lesson_id: string; started_at?: string | null; status: string; student_id: string; subject: string; updated_at?: string }
        Update: { academy?: string; completed_at?: string | null; completed_section_ids?: string[]; current_section_id?: string | null; grade_level?: string; id?: string; lesson_id?: string; started_at?: string | null; status?: string; student_id?: string; subject?: string; updated_at?: string }
        Relationships: []
      }
      quiz_attempts: {
        Row: { auto_scored: boolean; id: string; lesson_id: string; mastery_band: string; points_earned: number; points_possible: number; score_percent: number; student_id: string; submitted_at: string }
        Insert: { auto_scored?: boolean; id?: string; lesson_id: string; mastery_band: string; points_earned?: number; points_possible?: number; score_percent: number; student_id: string; submitted_at?: string }
        Update: { auto_scored?: boolean; id?: string; lesson_id?: string; mastery_band?: string; points_earned?: number; points_possible?: number; score_percent?: number; student_id?: string; submitted_at?: string }
        Relationships: []
      }
      quiz_answers: {
        Row: { correct_answer: Json | null; created_at: string; explanation: string | null; id: string; is_correct: boolean | null; mistake_type: string | null; points_earned: number; points_possible: number; question_id: string; question_type: string; quiz_attempt_id: string; skill_tags: string[]; student_answer: Json }
        Insert: { correct_answer?: Json | null; created_at?: string; explanation?: string | null; id?: string; is_correct?: boolean | null; mistake_type?: string | null; points_earned?: number; points_possible?: number; question_id: string; question_type: string; quiz_attempt_id: string; skill_tags?: string[]; student_answer: Json }
        Update: { correct_answer?: Json | null; created_at?: string; explanation?: string | null; id?: string; is_correct?: boolean | null; mistake_type?: string | null; points_earned?: number; points_possible?: number; question_id?: string; question_type?: string; quiz_attempt_id?: string; skill_tags?: string[]; student_answer?: Json }
        Relationships: []
      }
      mastery_records: {
        Row: { evidence_source: string; id: string; last_evidence_id: string | null; lesson_id: string | null; mastery_band: string; score_percent: number; skill_tag: string; student_id: string; subject: string; updated_at: string }
        Insert: { evidence_source: string; id?: string; last_evidence_id?: string | null; lesson_id?: string | null; mastery_band: string; score_percent: number; skill_tag: string; student_id: string; subject: string; updated_at?: string }
        Update: { evidence_source?: string; id?: string; last_evidence_id?: string | null; lesson_id?: string | null; mastery_band?: string; score_percent?: number; skill_tag?: string; student_id?: string; subject?: string; updated_at?: string }
        Relationships: []
      }
      memory_vault_items: {
        Row: { accuracy_history: number[]; confidence_history: number[]; created_at: string; due_at: string; expected_answer: string | null; id: string; last_reviewed_at: string | null; lesson_id: string; prompt: string; prompt_type: string; retention_strength: string; review_interval_days: number; review_stage: string; skill_id: string; status: string; student_id: string; updated_at: string }
        Insert: { accuracy_history?: number[]; confidence_history?: number[]; created_at?: string; due_at: string; expected_answer?: string | null; id?: string; last_reviewed_at?: string | null; lesson_id: string; prompt: string; prompt_type: string; retention_strength?: string; review_interval_days: number; review_stage: string; skill_id: string; status?: string; student_id: string; updated_at?: string }
        Update: { accuracy_history?: number[]; confidence_history?: number[]; created_at?: string; due_at?: string; expected_answer?: string | null; id?: string; last_reviewed_at?: string | null; lesson_id?: string; prompt?: string; prompt_type?: string; retention_strength?: string; review_interval_days?: number; review_stage?: string; skill_id?: string; status?: string; student_id?: string; updated_at?: string }
        Relationships: []
      }
      memory_vault_review_sessions: {
        Row: { average_confidence: number | null; completed_at: string | null; correct_count: number; id: string; items_reviewed: number; started_at: string; student_id: string }
        Insert: { average_confidence?: number | null; completed_at?: string | null; correct_count?: number; id?: string; items_reviewed?: number; started_at?: string; student_id: string }
        Update: { average_confidence?: number | null; completed_at?: string | null; correct_count?: number; id?: string; items_reviewed?: number; started_at?: string; student_id?: string }
        Relationships: []
      }
      memory_vault_review_answers: {
        Row: { confidence: number | null; created_at: string; expected_answer: string | null; feedback: string | null; id: string; is_correct: boolean; memory_vault_item_id: string; next_due_at: string | null; session_id: string; student_answer: string | null }
        Insert: { confidence?: number | null; created_at?: string; expected_answer?: string | null; feedback?: string | null; id?: string; is_correct: boolean; memory_vault_item_id: string; next_due_at?: string | null; session_id: string; student_answer?: string | null }
        Update: { confidence?: number | null; created_at?: string; expected_answer?: string | null; feedback?: string | null; id?: string; is_correct?: boolean; memory_vault_item_id?: string; next_due_at?: string | null; session_id?: string; student_answer?: string | null }
        Relationships: []
      }
      mistake_journal_entries: {
        Row: { created_at: string; id: string; lesson_id: string | null; mistake_type: string; question_id: string | null; quiz_attempt_id: string | null; repair_action: string | null; severity: string; skill_tags: string[]; student_friendly_message: string; student_id: string }
        Insert: { created_at?: string; id?: string; lesson_id?: string | null; mistake_type: string; question_id?: string | null; quiz_attempt_id?: string | null; repair_action?: string | null; severity?: string; skill_tags?: string[]; student_friendly_message: string; student_id: string }
        Update: { created_at?: string; id?: string; lesson_id?: string | null; mistake_type?: string; question_id?: string | null; quiz_attempt_id?: string | null; repair_action?: string | null; severity?: string; skill_tags?: string[]; student_friendly_message?: string; student_id?: string }
        Relationships: []
      }
      reteach_plans: {
        Row: { assigned_at: string; completed_at: string | null; id: string; lesson_id: string; reason: string; reteach_type: string; source_quiz_attempt_id: string | null; status: string; student_id: string }
        Insert: { assigned_at?: string; completed_at?: string | null; id?: string; lesson_id: string; reason: string; reteach_type: string; source_quiz_attempt_id?: string | null; status?: string; student_id: string }
        Update: { assigned_at?: string; completed_at?: string | null; id?: string; lesson_id?: string; reason?: string; reteach_type?: string; source_quiz_attempt_id?: string | null; status?: string; student_id?: string }
        Relationships: []
      }
      challenge_plans: {
        Row: { assigned_at: string; challenge_type: string; completed_at: string | null; id: string; lesson_id: string; prompt: string; source_quiz_attempt_id: string | null; status: string; student_id: string }
        Insert: { assigned_at?: string; challenge_type: string; completed_at?: string | null; id?: string; lesson_id: string; prompt: string; source_quiz_attempt_id?: string | null; status?: string; student_id: string }
        Update: { assigned_at?: string; challenge_type?: string; completed_at?: string | null; id?: string; lesson_id?: string; prompt?: string; source_quiz_attempt_id?: string | null; status?: string; student_id?: string }
        Relationships: []
      }
      problem_solving_lab_entries: {
        Row: { answer_check: string | null; created_at: string; id: string; known_facts: string[]; lesson_id: string | null; problem_prompt: string; reflection: string | null; smaller_parts: string[]; solution_steps: string[]; strategy: string | null; student_id: string; unknowns: string[] }
        Insert: { answer_check?: string | null; created_at?: string; id?: string; known_facts?: string[]; lesson_id?: string | null; problem_prompt: string; reflection?: string | null; smaller_parts?: string[]; solution_steps?: string[]; strategy?: string | null; student_id: string; unknowns?: string[] }
        Update: { answer_check?: string | null; created_at?: string; id?: string; known_facts?: string[]; lesson_id?: string | null; problem_prompt?: string; reflection?: string | null; smaller_parts?: string[]; solution_steps?: string[]; strategy?: string | null; student_id?: string; unknowns?: string[] }
        Relationships: []
      }
      evidence_room_entries: {
        Row: { claim: string; created_at: string; evidence_sort: Json; id: string; lesson_id: string | null; reasoning: string | null; revision: string | null; selected_evidence: Json; student_id: string }
        Insert: { claim: string; created_at?: string; evidence_sort?: Json; id?: string; lesson_id?: string | null; reasoning?: string | null; revision?: string | null; selected_evidence?: Json; student_id: string }
        Update: { claim?: string; created_at?: string; evidence_sort?: Json; id?: string; lesson_id?: string | null; reasoning?: string | null; revision?: string | null; selected_evidence?: Json; student_id?: string }
        Relationships: []
      }
      interpretation_lens_entries: {
        Row: { created_at: string; evidence: string | null; id: string; interpretation: string | null; lens_type: string; lesson_id: string | null; observation: string | null; source_prompt: string; student_id: string }
        Insert: { created_at?: string; evidence?: string | null; id?: string; interpretation?: string | null; lens_type: string; lesson_id?: string | null; observation?: string | null; source_prompt: string; student_id: string }
        Update: { created_at?: string; evidence?: string | null; id?: string; interpretation?: string | null; lens_type?: string; lesson_id?: string | null; observation?: string | null; source_prompt?: string; student_id?: string }
        Relationships: []
      }
      discussion_arena_entries: {
        Row: { created_at: string; id: string; lesson_id: string | null; prompt: string; response: string; safety_status: string; sentence_frame: string; student_id: string }
        Insert: { created_at?: string; id?: string; lesson_id?: string | null; prompt: string; response: string; safety_status?: string; sentence_frame: string; student_id: string }
        Update: { created_at?: string; id?: string; lesson_id?: string | null; prompt?: string; response?: string; safety_status?: string; sentence_frame?: string; student_id?: string }
        Relationships: []
      }
      learning_planner_entries: {
        Row: { created_at: string; done_definition: string | null; first_step: string | null; id: string; lesson_id: string | null; next_time_change: string | null; obstacle: string | null; strategy: string | null; student_id: string; task_goal: string }
        Insert: { created_at?: string; done_definition?: string | null; first_step?: string | null; id?: string; lesson_id?: string | null; next_time_change?: string | null; obstacle?: string | null; strategy?: string | null; student_id: string; task_goal: string }
        Update: { created_at?: string; done_definition?: string | null; first_step?: string | null; id?: string; lesson_id?: string | null; next_time_change?: string | null; obstacle?: string | null; strategy?: string | null; student_id?: string; task_goal?: string }
        Relationships: []
      }
      systems_mapper_entries: {
        Row: { cause_effect_notes: string | null; connections: Json; created_at: string; id: string; lesson_id: string | null; parts: Json; student_id: string; system_name: string }
        Insert: { cause_effect_notes?: string | null; connections?: Json; created_at?: string; id?: string; lesson_id?: string | null; parts?: Json; student_id: string; system_name: string }
        Update: { cause_effect_notes?: string | null; connections?: Json; created_at?: string; id?: string; lesson_id?: string | null; parts?: Json; student_id?: string; system_name?: string }
        Relationships: []
      }
      portfolio_evidence_items: {
        Row: { content: Json; created_at: string; evidence_type: string; id: string; lesson_id: string | null; reflection: string | null; student_id: string; title: string; updated_at: string }
        Insert: { content?: Json; created_at?: string; evidence_type: string; id?: string; lesson_id?: string | null; reflection?: string | null; student_id: string; title: string; updated_at?: string }
        Update: { content?: Json; created_at?: string; evidence_type?: string; id?: string; lesson_id?: string | null; reflection?: string | null; student_id?: string; title?: string; updated_at?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      can_read_student: { Args: { target_student_id: string }; Returns: boolean }
      can_write_student: { Args: { target_student_id: string }; Returns: boolean }
      is_linked_guardian: { Args: { target_student_id: string }; Returns: boolean }
      is_student_owner: { Args: { target_student_id: string }; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
