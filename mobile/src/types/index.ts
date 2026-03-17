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
}

export interface AttemptRequest {
  drill_id: string;
  chosen_option: number;
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
  explanation?: string;
  created_at: string;
}

export interface PatternStats {
  pattern: string;
  total: number;
}

export interface StatsResponse {
  patterns: PatternStats[];
  total_attempts: number;
  streak: number;
}
