# Admin authentication

The admin area supports password sign-in and Google sign-in for active accounts in the Administrators list. Both methods issue the same signed, HTTP-only admin session cookie.

## Required variables

- `ADMIN_SESSION_SECRET`: random value of at least 32 characters.
- `ADMIN_USERNAME` and `ADMIN_PASSWORD`: credentials for password sign-in.
- `ADMIN_EMAIL`: email address that receives password-reset links. Defaults to `ADMIN_USERNAME` when the username is an email address.
- `RESEND_API_KEY` and `PASSWORD_RESET_EMAIL_FROM`: Resend credentials and verified sender for reset email delivery. `EVENT_EMAIL_FROM` is used as a fallback sender.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: OAuth 2.0 web client credentials from Google Cloud.
- `BACKEND_API_URL` and `MEMBERSHIP_ADMIN_TOKEN`: connect the Google callback to the backend Administrators list. The token must match the backend and contain at least 32 characters.
- `GOOGLE_OWNER_EMAILS`: optional comma-separated administrator addresses that receive owner access. The primary administrator (database ID 1) is always an owner.
- `GOOGLE_REDIRECT_URI`: optional explicit callback URL. Recommended in production, for example `https://example.com/api/admin/google/callback`.

Register the exact callback URL as an authorized redirect URI in the Google Cloud OAuth client. Production callbacks must use HTTPS. The OAuth consent screen's audience controls who can attempt authorization, while the active Administrators list controls who can enter the admin area. Only `openid`, `email`, and `profile` are requested; no Gmail mailbox access is requested.

Password sessions last eight hours, or 30 days when “Keep me signed in” is selected. Google sessions last eight hours.

Changing the session format or owner configuration requires administrators to sign in again. Administrator-management routes are enforced by the signed owner role in both the page and API proxy; hiding the sidebar item is only a usability aid.

On first password login or reset request, the backend creates the database-backed administrator credential from `ADMIN_USERNAME` and `ADMIN_PASSWORD`. Later password changes are stored as BCrypt hashes in the database and are not overwritten by the environment value. Reset links expire after 30 minutes and can be used once.
