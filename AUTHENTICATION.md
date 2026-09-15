# Admin authentication

The admin area supports password sign-in and allowlisted Google accounts. Both methods issue the same signed, HTTP-only admin session cookie.

## Required variables

- `ADMIN_SESSION_SECRET`: random value of at least 32 characters.
- `ADMIN_USERNAME` and `ADMIN_PASSWORD`: credentials for password sign-in.
- `ADMIN_EMAIL`: email address that receives password-reset links. Defaults to `ADMIN_USERNAME` when the username is an email address.
- `RESEND_API_KEY` and `PASSWORD_RESET_EMAIL_FROM`: Resend credentials and verified sender for reset email delivery. `EVENT_EMAIL_FROM` is used as a fallback sender.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: OAuth 2.0 web client credentials from Google Cloud.
- `GOOGLE_ADMIN_EMAILS`: comma-separated email addresses permitted to administer the site.
- `GOOGLE_REDIRECT_URI`: optional explicit callback URL. Recommended in production, for example `https://example.com/api/admin/google/callback`.

Register the exact callback URL as an authorized redirect URI in the Google Cloud OAuth client. Production callbacks must use HTTPS. Only `openid`, `email`, and `profile` are requested; no Gmail mailbox access is requested.

Password sessions last eight hours, or 30 days when “Keep me signed in” is selected. Google sessions last eight hours.

On first password login or reset request, the backend creates the database-backed administrator credential from `ADMIN_USERNAME` and `ADMIN_PASSWORD`. Later password changes are stored as BCrypt hashes in the database and are not overwritten by the environment value. Reset links expire after 30 minutes and can be used once.
