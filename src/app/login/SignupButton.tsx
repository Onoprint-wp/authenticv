"use client";

import { signup } from "./actions";
import { trackEvent } from "@/lib/analytics";

export function SignupButton() {
  return (
    <button
      id="signup-btn"
      formAction={signup}
      onClick={() => {
        trackEvent("signup_started", { source: "login_page" });
      }}
      className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl text-sm transition-all duration-200 active:scale-[0.98]"
    >
      Créer un compte
    </button>
  );
}
