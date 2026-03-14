import type { AuthError } from "@supabase/supabase-js";

export function formatAuthErrorMessage(error: Pick<AuthError, "code" | "message">) {
  switch (error.code) {
    case "over_email_send_rate_limit":
      return "Auth email sending is temporarily rate limited. Try again later. For production use, configure custom SMTP in Supabase.";
    case "email_address_not_authorized":
      return "This project cannot send auth emails to that address yet. Configure custom SMTP in Supabase or add the address to your Supabase team.";
    default:
      return error.message;
  }
}

export function getAuthRedirectUrl(path: string) {
  if (typeof window === "undefined") {
    return undefined;
  }

  return new URL(path, window.location.origin).toString();
}
