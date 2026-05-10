package email

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
	"strings"
)

// Send delivers an email via SMTP. Falls back to logging when SMTP is not configured.
func Send(to, subject, body string) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	from := os.Getenv("SMTP_FROM")

	if host == "" || from == "" {
		log.Printf("[email] SMTP not configured — would send to=%s subject=%q", to, subject)
		return nil
	}
	if port == "" {
		port = "587"
	}

	msg := strings.Join([]string{
		"From: " + from,
		"To: " + to,
		"Subject: " + subject,
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=UTF-8",
		"",
		body,
	}, "\r\n")

	addr := fmt.Sprintf("%s:%s", host, port)

	var auth smtp.Auth
	if user != "" {
		auth = smtp.PlainAuth("", user, pass, host)
	}

	return smtp.SendMail(addr, auth, from, []string{to}, []byte(msg))
}

// SendPasswordReset sends a password-reset email containing a link with the token.
func SendPasswordReset(toEmail, token string) error {
	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "https://acedsa.app"
	}
	link := fmt.Sprintf("%s/reset-password?token=%s", appURL, token)

	body := fmt.Sprintf(`<h2>Ace DSA — Password Reset</h2>
<p>You requested a password reset. Click the link below (valid for 1 hour):</p>
<p><a href="%s">Reset my password</a></p>
<p>If you didn't request this, ignore this email.</p>`, link)

	return Send(toEmail, "Reset your Ace DSA password", body)
}

// SendEmailVerification sends an email-verification link.
func SendEmailVerification(toEmail, token string) error {
	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "https://acedsa.app"
	}
	link := fmt.Sprintf("%s/verify-email?token=%s", appURL, token)

	body := fmt.Sprintf(`<h2>Welcome to Ace DSA!</h2>
<p>Please verify your email by clicking the link below:</p>
<p><a href="%s">Verify my email</a></p>`, link)

	return Send(toEmail, "Verify your Ace DSA email", body)
}
