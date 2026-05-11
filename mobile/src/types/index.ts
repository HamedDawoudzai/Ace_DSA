export interface SignupRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface Drill {
  id: string;
  pattern_category: string;
  prompt: string;
  choices: string[];
  correct_option: number;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
  time_complexity: string;
  space_complexity: string;
  complexity_choices: string[];
  correct_complexity_option: number;
  complexity_hint: string;
  problem_number: number;
  explanation: string;
  example_input: string;
  example_output: string;
  example_explanation: string;
}

export interface DrillCategory {
  name: string;
  total: number;
  completed: number;
}

export interface AttemptRequest {
  drill_id: string;
  chosen_option: number;
  is_correct: boolean;
  complexity_chosen?: number;
  complexity_correct?: boolean;
  completed: boolean;
  explanation?: string;
}

export interface AttemptResponse {
  status: string;
  is_correct: boolean;
}

export interface Attempt {
  id: string;
  user_id: string;
  drill_id: string;
  chosen_option: number;
  is_correct: boolean;
  complexity_chosen?: number;
  complexity_correct?: boolean;
  completed: boolean;
  explanation?: string;
  created_at: string;
}

export interface UserProgress {
  drill_id: string;
  approach_correct: boolean;
  complexity_correct: boolean;
  completed_at: string | null;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  created_at: string;
}

export interface CategoryStats {
  name: string;
  total: number;
  completed: number;
}

export interface StatsResponse {
  categories: CategoryStats[];
  total_completed: number;
  total_problems: number;
  total_attempts: number;
  correct_first_try: number;
  streak: number;
}

export interface PatternStats {
  pattern: string;
  total: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  username?: string;
}
