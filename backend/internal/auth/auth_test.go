package auth

import (
	"testing"
)

func TestValidatePassword(t *testing.T) {
	tests := []struct {
		name string
		pw   string
		want string
	}{
		{"too short", "Ab1!", ""},
		{"no uppercase", "abcdefg1!", "password must contain at least one uppercase letter"},
		{"no lowercase", "ABCDEFG1!", "password must contain at least one lowercase letter"},
		{"no digit", "Abcdefgh!", "password must contain at least one digit"},
		{"no special", "Abcdefg1", "password must contain at least one special character"},
		{"valid", "Abcdefg1!", ""},
		{"valid complex", "MyP@ssw0rd!", ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := validatePassword(tt.pw)
			if tt.name == "too short" {
				if got == "" {
					t.Error("expected error for short password")
				}
				return
			}
			if got != tt.want {
				t.Errorf("validatePassword(%q) = %q, want %q", tt.pw, got, tt.want)
			}
		})
	}
}

func TestEmailRegex(t *testing.T) {
	valid := []string{"user@example.com", "test.user+tag@domain.co", "a@b.cd"}
	invalid := []string{"", "noatsign", "@missing.local", "user@", "user@.com"}

	for _, e := range valid {
		if !emailRegex.MatchString(e) {
			t.Errorf("expected %q to be valid email", e)
		}
	}
	for _, e := range invalid {
		if emailRegex.MatchString(e) {
			t.Errorf("expected %q to be invalid email", e)
		}
	}
}

func TestUsernameRegex(t *testing.T) {
	valid := []string{"abc", "user_123", "a_b_c_d_e_f_g_h_i_j_k_l_m_n_o"}
	invalid := []string{"", "ab", "has space", "has-dash", "way_too_long_username_that_exceeds_thirty_chars"}

	for _, u := range valid {
		if !usernameRegex.MatchString(u) {
			t.Errorf("expected %q to be valid username", u)
		}
	}
	for _, u := range invalid {
		if usernameRegex.MatchString(u) {
			t.Errorf("expected %q to be invalid username", u)
		}
	}
}
