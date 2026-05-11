package email

import (
	"fmt"
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

// Send delivers an email via SendGrid. Falls back to logging when not configured.
func Send(to, subject, body string) error {
	apiKey := os.Getenv("SENDGRID_API_KEY")
	fromAddr := os.Getenv("SENDGRID_FROM")

	if apiKey == "" || fromAddr == "" {
		log.Printf("[email] SendGrid not configured — would send to=%s subject=%q", to, subject)
		return nil
	}

	from := mail.NewEmail("Ace DSA", fromAddr)
	toEmail := mail.NewEmail("", to)
	content := mail.NewContent("text/html", body)
	m := mail.NewV3MailInit(from, subject, toEmail, content)

	client := sendgrid.NewSendClient(apiKey)
	response, err := client.Send(m)
	if err != nil {
		return err
	}
	if response.StatusCode >= 400 {
		return fmt.Errorf("sendgrid: %d — %s", response.StatusCode, response.Body)
	}

	log.Printf("[email] sent to=%s subject=%q status=%d", to, subject, response.StatusCode)
	return nil
}

// SendPasswordReset sends a password-reset email containing the reset token.
func SendPasswordReset(toEmail, token string) error {
	body := fmt.Sprintf(`<h2>Ace DSA — Password Reset</h2>
<p>You requested a password reset. Use the code below in the app (valid for 1 hour):</p>
<p style="font-size:22px;font-weight:bold;letter-spacing:2px;background:#f4f4f4;padding:12px 20px;border-radius:8px;display:inline-block;">%s</p>
<p>Open the Ace DSA app, tap "Forgot Password", and paste this code when prompted.</p>
<p>If you didn't request this, ignore this email.</p>`, token)

	return Send(toEmail, "Reset your Ace DSA password", body)
}

// SendEmailVerification sends an email-verification token.
func SendEmailVerification(toEmail, token string) error {
	body := fmt.Sprintf(`<h2>Welcome to Ace DSA!</h2>
<p>Use the code below to verify your email:</p>
<p style="font-size:22px;font-weight:bold;letter-spacing:2px;background:#f4f4f4;padding:12px 20px;border-radius:8px;display:inline-block;">%s</p>
<p>Open the Ace DSA app and enter this code when prompted.</p>`, token)

	return Send(toEmail, "Verify your Ace DSA email", body)
}
